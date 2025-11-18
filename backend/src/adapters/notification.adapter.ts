/**
 * Notification adapter interface for sending notifications
 * Implementations can be email, SMS, push, webhook, etc.
 */

export interface NotificationPayload {
  to: string | string[];
  subject?: string;
  body: string;
  template?: string;
  variables?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface INotificationAdapter {
  send(payload: NotificationPayload): Promise<void>;
  sendBatch(payloads: NotificationPayload[]): Promise<void>;
}

/**
 * Console logger implementation (for development)
 */
export class ConsoleNotificationAdapter implements INotificationAdapter {
  async send(payload: NotificationPayload): Promise<void> {
    console.log('[NOTIFICATION]', {
      type: 'email',
      to: payload.to,
      subject: payload.subject,
      body: payload.body.substring(0, 100) + '...',
    });
  }

  async sendBatch(payloads: NotificationPayload[]): Promise<void> {
    for (const payload of payloads) {
      await this.send(payload);
    }
  }
}

/**
 * Email notification adapter (stub)
 */
export class EmailNotificationAdapter implements INotificationAdapter {
  constructor(private apiKey: string) {}

  async send(payload: NotificationPayload): Promise<void> {
    // In production, this would use SendGrid, Mailgun, AWS SES, etc.
    console.log('[EMAIL]', `Would send email to ${payload.to}: ${payload.subject}`);
  }

  async sendBatch(payloads: NotificationPayload[]): Promise<void> {
    console.log(`[EMAIL] Would send ${payloads.length} emails in batch`);
  }
}

/**
 * Webhook notification adapter (for external integrations)
 */
export class WebhookNotificationAdapter implements INotificationAdapter {
  constructor(private webhookUrl: string) {}

  async send(payload: NotificationPayload): Promise<void> {
    // In production, this would POST to the webhook URL
    console.log('[WEBHOOK]', `Would POST to ${this.webhookUrl}`, payload);
  }

  async sendBatch(payloads: NotificationPayload[]): Promise<void> {
    for (const payload of payloads) {
      await this.send(payload);
    }
  }
}
