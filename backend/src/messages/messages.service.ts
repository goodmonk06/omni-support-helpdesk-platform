import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = await this.prisma.message.create({
      data: createMessageDto,
    });

    // Update ticket's updatedAt timestamp
    await this.prisma.ticket.update({
      where: { id: createMessageDto.ticketId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async findByTicket(ticketId: string) {
    return this.prisma.message.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.message.findUnique({
      where: { id },
    });
  }
}
