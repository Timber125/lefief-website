import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

import { environment } from '../../environments/environment';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    formData = {
        name: '',
        email: '',
        message: '',
        honey: '' // Honeypot field
    };

    status: 'idle' | 'sending' | 'success' | 'error' = 'idle';
    errorMessage = '';

    async sendEmail(event: Event) {
        event.preventDefault();

        // 1. Bot check (Honeypot)
        if (this.formData.honey) {
            console.log('Bot detected. Submission ignored.');
            return;
        }

        this.status = 'sending';
        this.errorMessage = '';

        try {
            const { serviceId, templateId, publicKey } = environment.emailJs;

            // If keys are missing (placeholder values), simulate success for demo purposes
            if (serviceId === 'YOUR_SERVICE_ID' || serviceId === 'YOUR_DEV_SERVICE_ID') {
                console.warn('EmailJS keys not set. Simulating success.');
                await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
                this.status = 'success';
                this.resetForm();
                return;
            }

            await emailjs.send(
                serviceId,
                templateId,
                {
                    from_name: this.formData.name,
                    reply_to: this.formData.email,
                    message: this.formData.message,
                },
                publicKey
            );

            this.status = 'success';
            this.resetForm();

        } catch (error) {
            this.status = 'error';
            this.errorMessage = 'Something went wrong. Please try again later.';
            console.error('EmailJS Error:', error);

            // Type guard for error object if needed
            if (error && typeof error === 'object' && 'text' in error) {
                this.errorMessage += ` (${(error as any).text})`;
            }
        }
    }

    resetForm() {
        this.formData = {
            name: '',
            email: '',
            message: '',
            honey: ''
        };

        // Reset status after a delay so user can send another if they want
        setTimeout(() => {
            if (this.status === 'success') {
                this.status = 'idle';
            }
        }, 5000);
    }
}
