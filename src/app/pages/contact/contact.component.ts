import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {
  sendEmail,
  validateContactForm,
  type ContactFormData,
} from '../../services/email.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, NgIf],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {

  name = '';
  private _message = '';
  email = '';
  errors: Record<string, string> = {};
  isSubmitting = false;
  submitted = false;
  submitStatus: 'idle' | 'success' | 'error' = 'idle';
  submitMessage = '';

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    if (value.length > 250) {
      this._message = value.slice(0, 250);
    } else {
      this._message = value;
    }
  }

  ngOnInit(): void {
    document.title = 'Contact | Niclas Sch&aelig;ffer Portfolio';
  }

  clearError(fieldName: string): void {
    this.errors[fieldName] = '';
  }

  async onSubmit(form: HTMLFormElement, event: Event): Promise<void> {
    event.preventDefault();
    
    const formData: ContactFormData = {
      name: this.name,
      email: this.email,
      message: this.message,
    };

    const validation = validateContactForm(formData);

    if (!validation.isValid) {
      this.errors = validation.errors;
      return;
    }

    this.isSubmitting = true;

    try {
      const response = await sendEmail(formData, form);

      if (response.success) {
        this.name = '';
        this.email = '';
        this.message = '';
        this.errors = {};
        this.submitStatus = 'success';
        this.submitMessage = 'Message sent successfully!';

        setTimeout(() => {
          this.submitStatus = 'idle';
          this.submitMessage = '';
        }, 5000);
      } else {
        this.submitStatus = 'error';
        this.submitMessage =
          response.error || 'Failed to send message. Please try again later.';
      }
    } catch (error) {
      this.submitStatus = 'error';
      this.submitMessage =
        error instanceof Error ? error.message : 'An error occurred';
    } finally {
      this.isSubmitting = false;
    }
  }
}
