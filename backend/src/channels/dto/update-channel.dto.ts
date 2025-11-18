import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ChannelType } from '@prisma/client';

export class UpdateChannelDto {
  @IsEnum(ChannelType)
  @IsOptional()
  type?: ChannelType;

  @IsString()
  @IsOptional()
  addressOrConfigJson?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
