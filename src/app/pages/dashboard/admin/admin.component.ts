import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleAuthService } from '../../../services/google-auth.service';
import { AllowedUsersService, BOOTSTRAP_OWNER_EMAIL, Role } from '../../../services/allowed-users.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  private googleAuth = inject(GoogleAuthService);
  private allowedUsers = inject(AllowedUsersService);

  users = this.allowedUsers.users;
  bootstrapOwnerEmail = BOOTSTRAP_OWNER_EMAIL;

  newEmail = '';
  newRole: Role = 'member';
  isSubmitting = false;
  removingEmail: string | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    document.title = 'Manage Access | Niclas Schæffer Portfolio';
  }

  async addUser(): Promise<void> {
    const email = this.newEmail.trim();
    if (!email || !this.isValidEmail(email)) {
      this.errorMessage = 'Enter a valid email address.';
      return;
    }

    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    try {
      await this.allowedUsers.addOrUpdateUser(email, this.newRole, accessToken);
      this.newEmail = '';
      this.newRole = 'member';
    } catch (error) {
      console.error('[Admin] Failed to add user:', error);
      this.errorMessage = 'Failed to add — check the console, or try logging out and back in.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async removeUser(email: string): Promise<void> {
    if (this.isBootstrapOwner(email)) {
      return;
    }

    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    this.removingEmail = email;
    this.errorMessage = null;

    try {
      await this.allowedUsers.removeUser(email, accessToken);
    } catch (error) {
      console.error('[Admin] Failed to remove user:', error);
      this.errorMessage = 'Failed to remove — check the console, or try logging out and back in.';
    } finally {
      this.removingEmail = null;
    }
  }

  async changeRole(email: string, role: Role): Promise<void> {
    const accessToken = this.googleAuth.getAccessToken();
    if (!accessToken) {
      this.errorMessage = 'Your session looks expired — try logging out and back in.';
      return;
    }

    try {
      await this.allowedUsers.addOrUpdateUser(email, role, accessToken);
    } catch (error) {
      console.error('[Admin] Failed to change role:', error);
      this.errorMessage = 'Failed to change role — check the console, or try logging out and back in.';
    }
  }

  isBootstrapOwner(email: string): boolean {
    return email.toLowerCase() === this.bootstrapOwnerEmail.toLowerCase();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
