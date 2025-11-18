import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface EmailJobData {
  from: string;
  to: string;
  subject: string;
  body: string;
  channelId: string;
  tenantId: string;
}

@Injectable()
export class EmailQueueService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async addEmailToQueue(emailData: EmailJobData) {
    return this.emailQueue.add('process-email', emailData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async getQueueStats() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.emailQueue.getWaitingCount(),
      this.emailQueue.getActiveCount(),
      this.emailQueue.getCompletedCount(),
      this.emailQueue.getFailedCount(),
    ]);

    return { waiting, active, completed, failed };
  }
}
