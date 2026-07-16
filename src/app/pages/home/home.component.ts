import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import services, { Service } from '../../data/services';
import { workExperiences, otherExperiences, education, Experience, Education } from '../../data/data';

@Component({
  selector: 'app-home',
  imports: [NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  services: Service[] = services;
  workExperiences: Experience[] = workExperiences;
  otherExperiences: Experience[] = otherExperiences;
  education: Education[] = education;

  ngOnInit(): void {
    document.title = 'Home | Niclas Schæffer Portfolio';
  }

  getSubjects(details: string): string[] {
    return details.split(',').map(s => s.trim());
  }
}
