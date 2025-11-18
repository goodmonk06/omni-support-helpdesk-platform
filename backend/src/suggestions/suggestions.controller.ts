import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { GenerateSuggestionDto } from './dto';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  generateSuggestion(@Body() generateSuggestionDto: GenerateSuggestionDto) {
    return this.suggestionsService.generateSuggestion(generateSuggestionDto);
  }

  @Get('ticket/:ticketId')
  findByTicket(@Param('ticketId') ticketId: string) {
    return this.suggestionsService.findByTicket(ticketId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suggestionsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.suggestionsService.delete(id);
  }
}
