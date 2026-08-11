import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Subscription, combineLatest } from 'rxjs';
import { ProjectsService, ProjectRecord } from '../../services/projects.service';
import { ProjectVisibilityService } from '../../services/project-visibility.service';
import { GoogleAuthService } from '../../services/google-auth.service';

interface DisplayProject {
  project: ProjectRecord;
  /** Coming soon: shown publicly as a teaser, not clickable. */
  isTeaser: boolean;
  /** 'coming-soon' badge is public; 'hidden-owner-only' only ever renders for the owner, since everyone else never receives a hidden project in the first place. */
  badge: 'coming-soon' | 'hidden-owner-only' | null;
}

@Component({
  selector: 'app-portfolio',
  imports: [NgFor, NgIf],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private projectsService = inject(ProjectsService);
  private projectVisibility = inject(ProjectVisibilityService);
  private googleAuth = inject(GoogleAuthService);

  private allProjects: ProjectRecord[] = [];
  displayProjects: DisplayProject[] = [];
  selectedProject: ProjectRecord | null = null;
  isModalOpen = false;

  private subscription?: Subscription;

  ngOnInit(): void {
    document.title = 'Portfolio | Niclas Schæffer Portfolio';

    // Recompute whenever the project list, visibility settings, or ordering
    // change (owner editing them in another tab) or the login/owner state
    // changes (e.g. right after logging in), not just once on load.
    this.subscription = combineLatest([
      this.projectsService.projects,
      this.projectVisibility.states,
      this.projectVisibility.order,
      this.googleAuth.isOwner
    ]).subscribe(([projects, , , isOwner]) => {
      this.allProjects = projects;
      this.displayProjects = this.buildDisplayProjects(isOwner);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    // Covers navigating away while the modal is still open — otherwise
    // this class would leak onto whatever page loads next.
    document.body.classList.remove('modal-open');
  }

  openModal(entry: DisplayProject): void {
    if (entry.isTeaser) {
      return;
    }
    this.selectedProject = entry.project;
    this.isModalOpen = true;
    // `.body`'s own stacking context (see cyberpunk-design.scss) otherwise
    // traps this fixed-position modal below the header, no matter how high
    // its own z-index is — a body-level class is the same escape hatch
    // this codebase already uses for CV print mode (see styles.scss).
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProject = null;
    document.body.classList.remove('modal-open');
  }

  openLivePreview(): void {
    if (this.selectedProject?.livepreviewurl) {
      window.open(this.selectedProject.livepreviewurl, '_blank');
    }
  }

  openGithub(): void {
    if (this.selectedProject?.githuburl) {
      window.open(this.selectedProject.githuburl, '_blank');
    }
  }

  private buildDisplayProjects(isOwner: boolean): DisplayProject[] {
    const entries: DisplayProject[] = [];
    const orderedIds = this.projectVisibility.sortProjectIds(this.allProjects.map((p) => p.id));
    const orderedProjects = orderedIds
      .map((id) => this.allProjects.find((p) => p.id === id))
      .filter((p): p is ProjectRecord => p !== undefined);

    for (const project of orderedProjects) {
      const state = this.projectVisibility.getState(project.id);
      const isTeaser = !state.live && state.comingSoon;
      const isHidden = !state.live && !state.comingSoon;

      // The owner can always see and access every project themselves (for
      // testing); the visibility state only changes what other visitors see.
      if (isHidden && !isOwner) {
        continue;
      }

      entries.push({
        project,
        isTeaser,
        badge: isTeaser ? 'coming-soon' : isHidden ? 'hidden-owner-only' : null
      });
    }

    return entries;
  }
}
