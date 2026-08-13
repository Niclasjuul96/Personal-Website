import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  imports: [],
  templateUrl: './portfolio.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private projectsService = inject(ProjectsService);
  private projectVisibility = inject(ProjectVisibilityService);
  private googleAuth = inject(GoogleAuthService);
  private sanitizer = inject(DomSanitizer);

  private allProjects: ProjectRecord[] = [];
  displayProjects: DisplayProject[] = [];
  selectedProject: ProjectRecord | null = null;
  isModalOpen = false;
  /** Trusted only because livepreviewurl is admin-entered (owner-only Firestore write), never visitor-supplied. */
  embedUrl: SafeResourceUrl | null = null;
  /** Null while loading, and also the failsafe: any fetch/parse failure just leaves this null so the UI simply omits the date instead of showing an error. */
  githubLastUpdated: string | null = null;

  private subscription?: Subscription;
  private githubLastUpdatedCache = new Map<string, string | null>();

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
    this.embedUrl =
      entry.project.embeddable && entry.project.livepreviewurl
        ? this.sanitizer.bypassSecurityTrustResourceUrl(entry.project.livepreviewurl)
        : null;
    this.githubLastUpdated = null;
    this.isModalOpen = true;
    // `.body`'s own stacking context (see cyberpunk-design.scss) otherwise
    // traps this fixed-position modal below the header, no matter how high
    // its own z-index is — a body-level class is the same escape hatch
    // this codebase already uses for CV print mode (see styles.scss).
    document.body.classList.add('modal-open');
    this.loadGithubLastUpdated(entry.project.githuburl);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProject = null;
    this.embedUrl = null;
    this.githubLastUpdated = null;
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

  /**
   * Unauthenticated GitHub API call (public repo data, no token needed) —
   * cached per repo so re-opening the same project's modal doesn't refetch.
   * Any failure (network, rate limit, non-GitHub URL, missing field) just
   * leaves githubLastUpdated null; the template omits the line entirely
   * rather than showing an error.
   */
  private async loadGithubLastUpdated(githuburl: string): Promise<void> {
    if (this.githubLastUpdatedCache.has(githuburl)) {
      this.githubLastUpdated = this.githubLastUpdatedCache.get(githuburl) ?? null;
      return;
    }

    const result = await this.fetchGithubLastUpdated(githuburl);
    this.githubLastUpdatedCache.set(githuburl, result);

    // The visitor may have closed the modal or opened a different project
    // before this resolved — only apply a now-stale result if it's still
    // the one currently open.
    if (this.selectedProject?.githuburl === githuburl) {
      this.githubLastUpdated = result;
    }
  }

  private async fetchGithubLastUpdated(githuburl: string): Promise<string | null> {
    const repoPath = this.parseGithubRepoPath(githuburl);
    if (!repoPath) {
      return null;
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${repoPath}`);
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (!data.pushed_at) {
        return null;
      }

      return new Date(data.pushed_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  }

  private parseGithubRepoPath(githuburl: string): string | null {
    try {
      const url = new URL(githuburl);
      if (url.hostname !== 'github.com') {
        return null;
      }

      const [owner, repo] = url.pathname.split('/').filter(Boolean);
      if (!owner || !repo) {
        return null;
      }

      return `${owner}/${repo.replace(/\.git$/, '')}`;
    } catch {
      return null;
    }
  }
}
