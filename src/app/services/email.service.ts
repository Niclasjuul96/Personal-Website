import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const SERVICE_ID = environment.emailjs.serviceId;
const TEMPLATE_ID = environment.emailjs.templateId;
const PUBLIC_KEY = environment.emailjs.publicKey;

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

export const sendEmail = async (
  formData: ContactFormData,
  formElement: HTMLFormElement
): Promise<ApiResponse<{ messageId: string }>> => {
  try {
    const response = await emailjs.sendForm(
      SERVICE_ID,
      TEMPLATE_ID,
      formElement
    );

    return {
      success: true,
      data: { messageId: response.status.toString() },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: { messageId: '' },
      error: errorMessage,
    };
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateContactForm = (
  formData: ContactFormData
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!formData.name.trim()) {
    errors['name'] = 'Name is required';
  }

  if (!validateEmail(formData.email)) {
    errors['email'] = 'Valid email is required';
  }

  if (!formData.message.trim() || formData.message.length < 10) {
    errors['message'] = 'Message must be at least 10 characters';
  }

  if (formData.message.length > 250) {
    errors['message'] = 'Message must not exceed 250 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
