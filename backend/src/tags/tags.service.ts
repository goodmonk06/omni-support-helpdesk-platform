import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto, UpdateTagDto, ApplyTagDto } from './dto';
import { createLogger } from '../lib/logger';
import { incrementCounter } from '../lib/metrics';
import { eventBus } from '../domain/events';

@Injectable()
export class TagsService {
  private logger = createLogger('TagsService');

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateTagDto) {
    this.logger.info('Creating tag', { name: createDto.name });

    const tag = await this.prisma.tag.create({
      data: createDto,
    });

    incrementCounter('tags_created', { tenantId: createDto.tenantId });
    return tag;
  }

  async findAll(tenantId: string) {
    return this.prisma.tag.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.tag.findFirst({
      where: { id, tenantId },
      include: {
        tickets: {
          include: {
            ticket: {
              select: {
                id: true,
                subject: true,
                status: true,
                priority: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, tenantId: string, updateDto: UpdateTagDto) {
    return this.prisma.tag.update({
      where: { id },
      data: updateDto,
    });
  }

  async delete(id: string, tenantId: string) {
    // Delete tag and all ticket associations
    return this.prisma.tag.delete({
      where: { id },
    });
  }

  /**
   * Apply a tag to a ticket
   */
  async applyToTicket(applyDto: ApplyTagDto) {
    const { ticketId, tagId } = applyDto;

    // Check if already tagged
    const existing = await this.prisma.ticketTag.findUnique({
      where: {
        ticketId_tagId: { ticketId, tagId },
      },
    });

    if (existing) {
      return existing;
    }

    const ticketTag = await this.prisma.ticketTag.create({
      data: { ticketId, tagId },
      include: {
        tag: true,
        ticket: true,
      },
    });

    // Emit event
    await eventBus.emit({
      type: 'ticket.tagged',
      timestamp: new Date(),
      tenantId: ticketTag.ticket.tenantId,
      ticketId,
      tagId,
      tagName: ticketTag.tag.name,
    });

    this.logger.info('Tag applied to ticket', { ticketId, tagId });
    incrementCounter('tickets_tagged', {
      tenantId: ticketTag.ticket.tenantId,
      tagId,
    });

    return ticketTag;
  }

  /**
   * Remove a tag from a ticket
   */
  async removeFromTicket(ticketId: string, tagId: string) {
    return this.prisma.ticketTag.delete({
      where: {
        ticketId_tagId: { ticketId, tagId },
      },
    });
  }

  /**
   * Get all tickets with a specific tag
   */
  async getTicketsByTag(tagId: string, tenantId: string) {
    const tag = await this.prisma.tag.findFirst({
      where: { id: tagId, tenantId },
      include: {
        tickets: {
          include: {
            ticket: {
              include: {
                inboxChannel: true,
                assignedAgent: true,
                messages: {
                  take: 1,
                  orderBy: { createdAt: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    return tag?.tickets.map((tt) => tt.ticket) || [];
  }

  /**
   * Search tickets by text and tags
   */
  async searchTickets(
    tenantId: string,
    query?: string,
    tagIds?: string[],
    status?: string,
  ) {
    const where: any = { tenantId };

    if (query) {
      where.OR = [
        { subject: { contains: query, mode: 'insensitive' } },
        { customerEmail: { contains: query, mode: 'insensitive' } },
        { customerName: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (tagIds && tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: tagIds },
        },
      };
    }

    return this.prisma.ticket.findMany({
      where,
      include: {
        tags: {
          include: { tag: true },
        },
        inboxChannel: true,
        assignedAgent: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }
}
