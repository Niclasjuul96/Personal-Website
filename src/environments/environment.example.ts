/**
 * Environment Configuration Template
 * 
 * Copy this file to environment.local.ts and fill in your own credentials.
 * This file is ignored by Git and should never be committed to version control.
 * 
 * For development, update src/environments/environment.ts with your credentials.
 * For production, update src/environments/environment.prod.ts with your credentials.
 */

export const environment = {
  production: false,
  emailjs: {
    serviceId: 'your_emailjs_service_id',
    templateId: 'your_emailjs_template_id',
    publicKey: 'your_emailjs_public_key',
  },
};
