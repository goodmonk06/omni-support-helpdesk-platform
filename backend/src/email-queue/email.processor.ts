import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { EmailJobData } from './email-queue.service';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Process('process-email')
  async handleEmailProcessing(job: Job<EmailJobData>) {
    this.logger.log(`Processing email job ${job.id}`);

    try {
      const { from, subject, body, channelId, tenantId } = job.data;

      // Create ticket from email
      const ticket = await this.prisma.ticket.create({
        data: {
          tenantId,
          inboxId: channelId,
          subject,
          status: 'open',
          priority: 'medium',
          messages: {
            create: {
              fromRole: 'user',
              fromEmail: from,
              body,
            },
          },
        },
        include: {
          messages: true,
        },
      });

      this.logger.log(`Created ticket ${ticket.id} from email`);
      return ticket;
    } catch (error) {
      this.logger.error(`Failed to process email: ${error.message}`, error.stack);
      throw error;
    }
  }
}
