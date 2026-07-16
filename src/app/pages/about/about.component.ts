import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import techstack, { Technology } from '../../data/techstack';

@Component({
  selector: 'app-about',
  imports: [NgFor],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  techstack: Technology[] = techstack;

  ngOnInit(): void {
    document.title = 'About | Niclas Sch&aelig;ffer Portfolio';
  }
}
