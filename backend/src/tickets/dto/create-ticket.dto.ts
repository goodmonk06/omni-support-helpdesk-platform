import { IsString, IsNotEmpty, IsEnum, IsOptional, IsEmail } from 'class-validator';
import { TicketPriority } from '@prisma/client';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  inboxId: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsEmail()
  @IsOptional()
  fromEmail?: string;

  @IsString()
  @IsOptional()
  fromName?: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;
}
