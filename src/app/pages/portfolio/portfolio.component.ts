import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import projects, { Project } from '../../data/projects';

@Component({
  selector: 'app-portfolio',
  imports: [NgFor, NgIf],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  projects: Project[] = projects;
  selectedProject: Project | null = null;
  isModalOpen = false;

  ngOnInit(): void {
    document.title = 'Portfolio | Niclas Sch&aelig;ffer Portfolio';
  }

  openModal(project: Project): void {
    this.selectedProject = project;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProject = null;
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
}
