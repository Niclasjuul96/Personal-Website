import emailjs from '@emailjs/browser';
import type { ContactFormData } from '../types/data';
import type { ApiResponse } from '../types/common';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_nlnp8ba';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_ry9n02f';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'g1Qb9RKaWwJ3MQdxL';

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
    console.error('Email send failed:', errorMessage);
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
    errors.name = 'Name is required';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Valid email is required';
  }

  if (!formData.message.trim() || formData.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  if (formData.message.length > 250) {
    errors.message = 'Message must not exceed 250 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
