import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { AgentRole } from '@prisma/client';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AgentRole)
  @IsOptional()
  role?: AgentRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
