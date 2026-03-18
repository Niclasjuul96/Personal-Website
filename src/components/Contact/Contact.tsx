import React, { useState, useRef } from 'react';
import './Contact.scss';
import type { ContactFormData, FormErrors } from '../../types/data';
import {
  sendEmail,
  validateContactForm,
} from '../../utils/emailService';

interface ContactState {
  formData: ContactFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  submitMessage: string;
  submitStatus: 'idle' | 'success' | 'error';
}

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<ContactState>({
    formData: { name: '', email: '', message: '' },
    errors: {},
    isSubmitting: false,
    submitMessage: '',
    submitStatus: 'idle',
  });

  React.useEffect(() => {
    document.title = 'Contact | Niclas Schæffer Portfolio';
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.currentTarget;

    if (name === 'message' && value.length > 250) {
      return;
    }

    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
      errors: {
        ...prev.errors,
        [name]: undefined,
      },
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const validation = validateContactForm(state.formData);

    if (!validation.isValid) {
      setState((prev) => ({
        ...prev,
        errors: validation.errors,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      if (!formRef.current) {
        throw new Error('Form reference not found');
      }

      const response = await sendEmail(state.formData, formRef.current);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          formData: { name: '', email: '', message: '' },
          errors: {},
          submitStatus: 'success',
          submitMessage: 'Message sent successfully!',
        }));

        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            submitStatus: 'idle',
            submitMessage: '',
          }));
        }, 5000);
      } else {
        setState((prev) => ({
          ...prev,
          submitStatus: 'error',
          submitMessage:
            response.error ||
            'Failed to send message. Please try again later.',
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({
        ...prev,
        submitStatus: 'error',
        submitMessage: `Error: ${errorMessage}`,
      }));
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const remainingChars = 250 - state.formData.message.length;

  return (
    <div className="Contact">
      <div className="heading">
        <h4>Contact</h4>
        <div className="underline"></div>
      </div>
      <div className="content">
        <div className="information">
          <div className="phone">
            <div className="icon">
              <i className="fa fa-mobile" aria-hidden="true"></i>
            </div>
            <div className="heading">+45 22207812</div>
            <div className="description">Available on workdays</div>
          </div>
          <div className="email">
            <div className="icon">
              <i className="fa fa-envelope" aria-hidden="true"></i>
            </div>
            <div className="heading">Niclasschaeffer96@gmail.com</div>
            <div className="description">Send me an email, and let&apos;s talk</div>
          </div>
          <div className="city">
            <div className="icon">
              <i className="fa fa-home" aria-hidden="true"></i>
            </div>
            <div className="heading">Roskilde, Denmark</div>
            <div className="description">Specifically in Trekroner</div>
          </div>
        </div>
        <div className="getting-in-touch">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="greeting">Get in touch</div>
            <div className="underline"></div>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className={`form-control ${
                  state.errors.name ? 'is-invalid' : ''
                }`}
                value={state.formData.name}
                onChange={handleInputChange}
                disabled={state.isSubmitting}
                aria-invalid={!!state.errors.name}
                aria-describedby={state.errors.name ? 'name-error' : undefined}
                required
              />
              {state.errors.name && (
                <span id="name-error" className="error-message">
                  {state.errors.name}
                </span>
              )}
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`form-control ${
                  state.errors.email ? 'is-invalid' : ''
                }`}
                value={state.formData.email}
                onChange={handleInputChange}
                disabled={state.isSubmitting}
                aria-invalid={!!state.errors.email}
                aria-describedby={state.errors.email ? 'email-error' : undefined}
                required
              />
              {state.errors.email && (
                <span id="email-error" className="error-message">
                  {state.errors.email}
                </span>
              )}
            </div>
            <div className="form-group-message">
              <textarea
                name="message"
                placeholder="Enter your message"
                className={`form-control ${
                  state.errors.message ? 'is-invalid' : ''
                }`}
                value={state.formData.message}
                onChange={handleInputChange}
                disabled={state.isSubmitting}
                maxLength={250}
                aria-invalid={!!state.errors.message}
                aria-describedby={
                  state.errors.message ? 'message-error' : 'message-count'
                }
                required
              />
              {state.errors.message && (
                <span id="message-error" className="error-message">
                  {state.errors.message}
                </span>
              )}
            </div>
            <div className="form-last">
              <div className="remaining" id="message-count">
                <p>{remainingChars} characters remaining</p>
              </div>
              <button
                type="submit"
                className="Send"
                disabled={state.isSubmitting}
              >
                {state.isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>

          {state.submitStatus === 'success' && (
            <div className="success-message">{state.submitMessage}</div>
          )}
          {state.submitStatus === 'error' && (
            <div className="error-message">{state.submitMessage}</div>
          )}

          <div className="MessageMe">
            <div className="heading">Message Me</div>
            <div className="underline"></div>
            <div className="content">
              Wanna get in touch or talk about a project? Feel free to contact me
              via email or drop a line in the form. I endeavour to respond to all
              enquiries within 1 working day. I look forward to hearing from you,
              whether it&apos;s for collaboration or project idea.
            </div>
            <div className="links">
              <ul className="icon-list-item">
                <li>
                  <a
                    href="https://www.linkedin.com/in/niclas-juul-schaeffer/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Niclasjuul96"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=1119953702"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Contact.displayName = 'Contact';

export default Contact;
