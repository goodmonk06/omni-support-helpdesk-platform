import { Module } from '@nestjs/common';
import { SuggestionsController } from './suggestions.controller';
import { SuggestionsService } from './suggestions.service';
import { OpenAIService } from './openai.service';

@Module({
  controllers: [SuggestionsController],
  providers: [SuggestionsService, OpenAIService],
  exports: [SuggestionsService],
})
export class SuggestionsModule {}
