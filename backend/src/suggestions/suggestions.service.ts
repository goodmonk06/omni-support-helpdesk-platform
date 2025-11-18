import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAIService } from './openai.service';
import { GenerateSuggestionDto } from './dto';

@Injectable()
export class SuggestionsService {
  constructor(
    private prisma: PrismaService,
    private openaiService: OpenAIService,
  ) {}

  async generateSuggestion(generateSuggestionDto: GenerateSuggestionDto) {
    const { ticketId, model = 'gpt-4-turbo-preview' } = generateSuggestionDto;

    // Get ticket with messages
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Generate reply using OpenAI
    const suggestionText = await this.openaiService.generateReply(
      ticket,
      ticket.messages,
      model,
    );

    // Save suggestion
    const suggestion = await this.prisma.suggestedReply.create({
      data: {
        ticketId,
        messageId: ticket.messages[ticket.messages.length - 1]?.id,
        model,
        suggestionText,
      },
    });

    return suggestion;
  }

  async findByTicket(ticketId: string) {
    return this.prisma.suggestedReply.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  }

  async findOne(id: string) {
    return this.prisma.suggestedReply.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    return this.prisma.suggestedReply.delete({
      where: { id },
    });
  }
}
