import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './prisma/prisma.module';
import { TicketsModule } from './tickets/tickets.module';
import { MessagesModule } from './messages/messages.module';
import { AgentsModule } from './agents/agents.module';
import { ChannelsModule } from './channels/channels.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { EmailQueueModule } from './email-queue/email-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    PrismaModule,
    TicketsModule,
    MessagesModule,
    AgentsModule,
    ChannelsModule,
    SuggestionsModule,
    EmailQueueModule,
  ],
})
export class AppModule {}
