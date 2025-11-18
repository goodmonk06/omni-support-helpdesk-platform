import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto, TicketFilterDto } from './dto';
import { TicketStatus, TicketPriority } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    const { tenantId, inboxId, subject, fromEmail, fromName, body, priority } = createTicketDto;

    return this.prisma.ticket.create({
      data: {
        tenantId,
        inboxId,
        subject,
        priority: priority || 'medium',
        status: 'open',
        messages: {
          create: {
            fromRole: 'user',
            fromEmail,
            fromName,
            body,
          },
        },
      },
      include: {
        messages: true,
        inboxChannel: true,
        assignedAgent: true,
      },
    });
  }

  async findAll(tenantId: string, filters?: TicketFilterDto) {
    const where: any = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.assignedTo) {
      where.assignedTo = filters.assignedTo;
    }

    if (filters?.inboxId) {
      where.inboxId = filters.inboxId;
    }

    return this.prisma.ticket.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1, // Just get the first message for preview
        },
        inboxChannel: true,
        assignedAgent: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.ticket.findFirst({
      where: { id, tenantId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        inboxChannel: true,
        assignedAgent: true,
        suggestedReplies: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    });
  }

  async update(id: string, tenantId: string, updateTicketDto: UpdateTicketDto) {
    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...updateTicketDto,
      },
      include: {
        messages: true,
        inboxChannel: true,
        assignedAgent: true,
      },
    });
  }

  async delete(id: string, tenantId: string) {
    return this.prisma.ticket.delete({
      where: { id },
    });
  }

  async getStats(tenantId: string) {
    const [total, open, pending, closed] = await Promise.all([
      this.prisma.ticket.count({ where: { tenantId } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'open' } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'pending' } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'closed' } }),
    ]);

    return { total, open, pending, closed };
  }
}
