import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { AgentRole } from '@prisma/client';

export class UpdateAgentDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(AgentRole)
  @IsOptional()
  role?: AgentRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
