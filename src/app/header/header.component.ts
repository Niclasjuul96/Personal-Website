import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = false;

  handleMenuClick(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  handleNavLinkClick(): void {
    this.isMenuOpen = false;
  }

  handleLogoClick(): void {
    window.location.href = './';
  }
}
