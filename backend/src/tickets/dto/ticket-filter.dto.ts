import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketStatus, TicketPriority } from '@prisma/client';

export class TicketFilterDto {
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsString()
  @IsOptional()
  inboxId?: string;
}
