import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TicketStatus, TicketPriority } from '@prisma/client';

export class UpdateTicketDto {
  @IsString()
  @IsOptional()
  subject?: string;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @IsString()
  @IsOptional()
  assignedTo?: string;
}
