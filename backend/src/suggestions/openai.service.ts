import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface Message {
  fromRole: string;
  body: string;
  createdAt: Date;
}

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey });
  }

  async generateReply(ticket: any, messages: Message[], model: string = 'gpt-4-turbo-preview') {
    // Build conversation context
    const conversationHistory = messages
      .map((msg) => {
        const role = msg.fromRole === 'user' ? 'Customer' : 'Agent';
        return `${role}: ${msg.body}`;
      })
      .join('\n\n');

    const systemPrompt = `You are a helpful customer support assistant. Based on the conversation history, generate a professional and helpful response to the customer's inquiry.

Ticket Subject: ${ticket.subject}
Priority: ${ticket.priority}

Keep your response:
- Professional and empathetic
- Clear and concise
- Focused on solving the customer's issue
- Appropriate for the ticket priority level`;

    const userPrompt = `Here is the conversation history:

${conversationHistory}

Please generate a suggested reply to help the customer.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}
