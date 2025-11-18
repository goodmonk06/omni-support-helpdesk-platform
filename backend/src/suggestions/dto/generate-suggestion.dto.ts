import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GenerateSuggestionDto {
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @IsString()
  @IsOptional()
  model?: string;
}
