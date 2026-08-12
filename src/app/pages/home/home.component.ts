import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import services, { Service } from '../../data/services';
import { workExperiences, otherExperiences, education, Experience, Education } from '../../data/data';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
