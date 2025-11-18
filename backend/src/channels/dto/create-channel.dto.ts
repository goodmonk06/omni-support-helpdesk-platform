import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ChannelType } from '@prisma/client';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsEnum(ChannelType)
  @IsNotEmpty()
  type: ChannelType;

  @IsString()
  @IsNotEmpty()
  addressOrConfigJson: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
