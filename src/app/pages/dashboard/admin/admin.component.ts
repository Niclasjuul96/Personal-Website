import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, combineLatest, filter, take } from 'rxjs';
import { GoogleAuthService } from '../../../services/google-auth.service';
import { AllowedUsersService, BOOTSTRAP_OWNER_EMAIL, Role } from '../../../services/allowed-users.service';
import { ProjectVisibilityService, ProjectVisibilityState } from '../../../services/project-visibility.service';
import { ProjectsService, ProjectRecord, ProjectInput } from '../../../services/projects.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, OnDestroy {
  private googleAuth = inject(GoogleAuthService);
  private allowedUsers = inject(AllowedUsersService);
  private projectVisibility = inject(ProjectVisibilityService);
  private projectsService = inject(ProjectsService);

  users = this.allowedUsers.users;
  bootstrapOwnerEmail = BOOTSTRAP_OWNER_EMAIL;

  newEmail = '';
  newRole: Role = 'member';
  isSubmitting = false;
  removingEmail: string | null = null;
  errorMessage: string | null = null;

  projects: ProjectRecord[] = [];
  visibilityStates = this.projectVisibility.states;
  projectOrder = this.projectVisibility.order;
  savingProjectId: string | null = null;
  savingOrder = false;
  draggedProjectId: string | null = null;

  editingProjectId: string | null = null;
  projectForm: ProjectInput = this.emptyProjectForm();
  projectTechInput = '';
  isSubmittingProject = false;
  uploadingImage = false;
  deletingProjectId: string | null = null;
  migratingImageProjectId: string | null = null;

  /**
   * Live, in-progress reordering while a drag is happening — recomputed on
   * every dragover so the rows visually shift out of the way, and only
   * persisted to Firestore once, on drop. Null whenever nothing is being
   * dragged, in which case orderedProjects() falls back to the persisted
   * order.
   */
  private previewOrder: string[] | null = null;

  private subscriptions = new Subscription();

  ngOnInit(): void {
    document.title = 'Manage Access | Niclas Schæffer Portfolio';

    this.subscriptions.add(this.projectsService.projects.subscribe((list) => (this.projects = list)));

    // Only fires once both collections have genuinely been confirmed loaded
    // by a real read — ensureSeeded() itself also guards emptiness, this
    // just avoids calling any of these before there's a valid access token
    // / real data to work from.
    this.subscriptions.add(
      combineLatest([this.projectsService.loaded, this.projectVisibility.loaded])
        .pipe(
          filter(([projectsLoaded, visibilityLoaded]) => projectsLoaded && visibilityLoaded),
          take(1)
        )
        .subscribe(() => {
          const accessToken = this.googleAuth.getAccessToken();
          if (!accessToken) {
            return;
          }

          this.projectsService.ensureSeeded(accessToken).catch((error) => {
            console.error('[Admin] Failed to seed initial projects:', error);
          });
          this.projectsService.renameLegacyIds(accessToken).catch((error) => {
            console.error('[Admin] Failed to rename legacy project ids:', error);
          });
          this.projectVisibility
            .renameOrderIds(this.projects.map((p) => p.id), accessToken)
            .catch((error) => {
              console.error('[Admin] Failed to rename legacy order ids:', error);
            });
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async addUser(): Promise<void> {
    const email = this.newEmail.trim();
    if (!email || !this.isValidEmail(email)) {
      this.errorMessage = 'Enter a valid email address.';
      return;
    }

    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    try {
      await this.allowedUsers.addOrUpdateUser(email, this.newRole, accessToken);
      this.newEmail = '';
      this.newRole = 'member';
    } catch (error) {
      console.error('[Admin] Failed to add user:', error);
      this.errorMessage = 'Failed to add — check the console, or try logging out and back in.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async removeUser(email: string): Promise<void> {
    if (this.isBootstrapOwner(email)) {
      return;
    }

    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    this.removingEmail = email;
    this.errorMessage = null;

    try {
      await this.allowedUsers.removeUser(email, accessToken);
    } catch (error) {
      console.error('[Admin] Failed to remove user:', error);
      this.errorMessage = 'Failed to remove — check the console, or try logging out and back in.';
    } finally {
      this.removingEmail = null;
    }
  }

  async changeRole(email: string, role: Role): Promise<void> {
    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    try {
      await this.allowedUsers.addOrUpdateUser(email, role, accessToken);
    } catch (error) {
      console.error('[Admin] Failed to change role:', error);
      this.errorMessage = 'Failed to change role — check the console, or try logging out and back in.';
    }
  }

  isBootstrapOwner(email: string): boolean {
    return email.toLowerCase() === this.bootstrapOwnerEmail.toLowerCase();
  }

  // ---- Project content (title/description/image/links) ----

  startEditProject(project: ProjectRecord): void {
    this.editingProjectId = project.id;
    this.projectForm = {
      title: project.title,
      imgURL: project.imgURL,
      detail: project.detail,
      githuburl: project.githuburl,
      livepreviewurl: project.livepreviewurl ?? '',
      tech: [...project.tech],
      accounts: project.accounts ? [...project.accounts] : undefined,
      embeddable: project.embeddable ?? false
    };
    this.projectTechInput = project.tech.join(', ');
    this.errorMessage = null;
  }

  cancelEditProject(): void {
    this.editingProjectId = null;
    this.projectForm = this.emptyProjectForm();
    this.projectTechInput = '';
  }

  async onProjectImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    this.uploadingImage = true;
    this.errorMessage = null;

    try {
      this.projectForm.imgURL = await this.projectsService.uploadImage(file, file.name, accessToken);
    } catch (error) {
      console.error('[Admin] Failed to upload project image:', error);
      this.errorMessage = 'Failed to upload image — check the console, or try logging out and back in.';
    } finally {
      this.uploadingImage = false;
      input.value = '';
    }
  }

  /** True once a project's image already lives in Storage, so the "move to Storage" action can hide/disable itself instead of re-uploading a Storage URL back into Storage. */
  isImageInStorage(imgURL: string): boolean {
    return imgURL.includes('firebasestorage');
  }

  async migrateImageToStorage(project: ProjectRecord): Promise<void> {
    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    this.migratingImageProjectId = project.id;
    this.errorMessage = null;

    try {
      const newImgURL = await this.projectsService.migrateImageToStorage(project.imgURL, accessToken);
      const { id, ...input } = project;
      await this.projectsService.updateProject(id, { ...input, imgURL: newImgURL }, accessToken);
    } catch (error) {
      console.error('[Admin] Failed to migrate image to Storage:', error);
      this.errorMessage = 'Failed to migrate image — check the console, or try logging out and back in.';
    } finally {
      this.migratingImageProjectId = null;
    }
  }

  async saveProject(): Promise<void> {
    const title = this.projectForm.title.trim();
    if (!title) {
      this.errorMessage = 'Enter a project title.';
      return;
    }

    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    const input: ProjectInput = {
      ...this.projectForm,
      title,
      tech: this.projectTechInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    };

    this.isSubmittingProject = true;
    this.errorMessage = null;

    try {
      if (this.editingProjectId) {
        await this.projectsService.updateProject(this.editingProjectId, input, accessToken);
      } else {
        await this.projectsService.addProject(input, accessToken);
      }
      this.cancelEditProject();
    } catch (error) {
      console.error('[Admin] Failed to save project:', error);
      this.errorMessage = 'Failed to save project — check the console, or try logging out and back in.';
    } finally {
      this.isSubmittingProject = false;
    }
  }

  async deleteProject(id: string): Promise<void> {
    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    this.deletingProjectId = id;
    this.errorMessage = null;

    try {
      await this.projectsService.deleteProject(id, accessToken);
      if (this.editingProjectId === id) {
        this.cancelEditProject();
      }
    } catch (error) {
      console.error('[Admin] Failed to delete project:', error);
      this.errorMessage = 'Failed to delete project — check the console, or try logging out and back in.';
    } finally {
      this.deletingProjectId = null;
    }
  }

  private emptyProjectForm(): ProjectInput {
    return { title: '', imgURL: '', detail: '', githuburl: '', livepreviewurl: '', tech: [], embeddable: false };
  }

  // ---- Project visibility (Live / Coming soon / Hidden) ----

  /** Reads through to the service's live in-memory state — always current, the `visibilityStates` subscription in the template just drives change detection. */
  getProjectState(projectId: string): ProjectVisibilityState {
    return this.projectVisibility.getState(projectId);
  }

  async setLive(projectId: string, title: string, live: boolean): Promise<void> {
    // Live and Coming soon are mutually exclusive — Coming soon only ever
    // means anything while the project is off, so flip it off here rather
    // than just disabling it in the UI while leaving a stale `true` stored.
    const current = this.getProjectState(projectId);
    await this.saveProjectVisibility(projectId, title, { live, comingSoon: live ? false : current.comingSoon });
  }

  async setComingSoon(projectId: string, title: string, comingSoon: boolean): Promise<void> {
    const current = this.getProjectState(projectId);
    await this.saveProjectVisibility(projectId, title, { live: current.live, comingSoon });
  }

  private async saveProjectVisibility(projectId: string, title: string, state: ProjectVisibilityState): Promise<void> {
    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    this.savingProjectId = projectId;
    this.errorMessage = null;

    try {
      await this.projectVisibility.setState(projectId, title, state, accessToken);
    } catch (error) {
      console.error('[Admin] Failed to update project visibility:', error);
      this.errorMessage = 'Failed to update visibility — check the console, or try logging out and back in.';
    } finally {
      this.savingProjectId = null;
    }
  }

  // ---- Project ordering (drag-and-drop) ----

  /** Reads through to the service's live in-memory order — the `projectOrder` subscription in the template drives change detection, same trick as getProjectState. While a drag is in progress, previewOrder takes over so rows visibly shift before anything is actually saved. */
  orderedProjects(): ProjectRecord[] {
    const ids = this.previewOrder ?? this.projectVisibility.sortProjectIds(this.projects.map((p) => p.id));
    return ids
      .map((id) => this.projects.find((p) => p.id === id))
      .filter((p): p is ProjectRecord => p !== undefined);
  }

  onDragStart(projectId: string, event: DragEvent): void {
    this.draggedProjectId = projectId;
    this.previewOrder = this.projectVisibility.sortProjectIds(this.projects.map((p) => p.id));
    // Firefox aborts the whole drag if dataTransfer.setData() is never
    // called in dragstart — Chrome/Edge tolerate skipping it, Firefox
    // doesn't, so this is required for cross-browser drag-and-drop, not
    // just nice-to-have. The actual value is unused; state is tracked via
    // draggedProjectId instead since that survives across the drag.
    event.dataTransfer?.setData('text/plain', projectId);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd(): void {
    // Only reached without onDrop having already cleared this when the
    // drag was cancelled (dropped outside a valid target, or Esc) — in
    // that case discard the in-progress preview instead of leaving the
    // rows visually reordered without ever having saved it.
    this.draggedProjectId = null;
    this.previewOrder = null;
  }

  /**
   * Fires continuously while dragging over a row — required just to call
   * preventDefault() for (drop) to fire at all, but also doubles as the
   * "shift rows out of the way" live preview: every time the dragged
   * project moves over a new target, previewOrder is recomputed with the
   * dragged id spliced into the target's position.
   */
  onDragOver(targetProjectId: string, event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    if (this.draggedProjectId === null || this.draggedProjectId === targetProjectId || !this.previewOrder) {
      return;
    }

    const fromIndex = this.previewOrder.indexOf(this.draggedProjectId);
    const toIndex = this.previewOrder.indexOf(targetProjectId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      return;
    }

    const next = [...this.previewOrder];
    next.splice(fromIndex, 1);
    next.splice(toIndex, 0, this.draggedProjectId);
    this.previewOrder = next;
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    const finalOrder = this.previewOrder;
    const draggedId = this.draggedProjectId;
    this.draggedProjectId = null;
    this.previewOrder = null;

    if (!finalOrder || draggedId === null) {
      return;
    }

    const persistedOrder = this.projectVisibility.sortProjectIds(this.projects.map((p) => p.id));
    if (finalOrder.join(',') === persistedOrder.join(',')) {
      return; // Dropped back where it started — nothing actually changed.
    }

    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    this.savingOrder = true;
    this.errorMessage = null;

    try {
      await this.projectVisibility.setOrder(finalOrder, accessToken);
    } catch (error) {
      console.error('[Admin] Failed to update project order:', error);
      this.errorMessage = 'Failed to update order — check the console, or try logging out and back in.';
    } finally {
      this.savingOrder = false;
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
