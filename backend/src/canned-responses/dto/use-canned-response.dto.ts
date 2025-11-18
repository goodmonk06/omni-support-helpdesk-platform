import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class UseCannedResponseDto {
  @IsString()
  @IsNotEmpty()
  responseId: string;

  @IsObject()
  @IsOptional()
  variables?: Record<string, string>;
}
