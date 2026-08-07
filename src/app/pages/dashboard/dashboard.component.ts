import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GoogleAuthService } from '../../services/google-auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private googleAuth = inject(GoogleAuthService);

  userName = this.googleAuth.userName;
  isOwner = this.googleAuth.isOwner;

  ngOnInit(): void {
    document.title = 'Dashboard | Niclas Schæffer Portfolio';
  }
}
