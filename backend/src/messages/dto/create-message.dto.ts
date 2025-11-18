import { IsString, IsNotEmpty, IsEnum, IsOptional, IsEmail } from 'class-validator';
import { MessageRole } from '@prisma/client';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @IsEnum(MessageRole)
  @IsNotEmpty()
  fromRole: MessageRole;

  @IsEmail()
  @IsOptional()
  fromEmail?: string;

  @IsString()
  @IsOptional()
  fromName?: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
