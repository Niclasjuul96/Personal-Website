import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import techstack, { Technology } from '../../data/techstack';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  techstack: Technology[] = techstack;

  ngOnInit(): void {
    document.title = 'About | Niclas Schæffer Portfolio';
  }
}
