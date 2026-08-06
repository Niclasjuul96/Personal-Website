import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GoogleAuthService } from '../services/google-auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private googleAuth = inject(GoogleAuthService);

  isMenuOpen = false;

  isAuthenticated = this.googleAuth.isAuthenticated;
  userName = this.googleAuth.userName;
  userPicture = this.googleAuth.userPicture;
  isAllowed = this.googleAuth.isAllowed;

  handleMenuClick(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  handleNavLinkClick(): void {
    this.isMenuOpen = false;
  }

  handleLogoClick(): void {
    window.location.href = './';
  }

  handleLoginClick(): void {
    this.googleAuth.login();
  }

  handleLogoutClick(): void {
    this.googleAuth.logout();
  }
}
