import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailQueueService } from '../email-queue/email-queue.service';
import { CreateChannelDto, UpdateChannelDto, EmailWebhookDto } from './dto';

@Injectable()
export class ChannelsService {
  constructor(
    private prisma: PrismaService,
    private emailQueueService: EmailQueueService,
  ) {}

  async create(createChannelDto: CreateChannelDto) {
    return this.prisma.inboxChannel.create({
      data: createChannelDto,
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.inboxChannel.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.inboxChannel.findFirst({
      where: { id, tenantId },
    });
  }

  async update(id: string, tenantId: string, updateChannelDto: UpdateChannelDto) {
    return this.prisma.inboxChannel.update({
      where: { id },
      data: updateChannelDto,
    });
  }

  async delete(id: string, tenantId: string) {
    return this.prisma.inboxChannel.delete({
      where: { id },
    });
  }

  async handleEmailWebhook(emailWebhookDto: EmailWebhookDto) {
    // Find the channel by email address
    const channel = await this.prisma.inboxChannel.findFirst({
      where: {
        type: 'email',
        addressOrConfigJson: emailWebhookDto.to,
        isActive: true,
      },
    });

    if (!channel) {
      throw new Error(`No active email channel found for: ${emailWebhookDto.to}`);
    }

    // Add email to processing queue
    await this.emailQueueService.addEmailToQueue({
      from: emailWebhookDto.from,
      to: emailWebhookDto.to,
      subject: emailWebhookDto.subject,
      body: emailWebhookDto.body,
      channelId: channel.id,
      tenantId: channel.tenantId,
    });

    return { success: true, channelId: channel.id };
  }
}
