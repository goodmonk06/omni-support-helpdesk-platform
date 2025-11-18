import { IsString, IsNotEmpty } from 'class-validator';

export class ApplyTagDto {
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @IsString()
  @IsNotEmpty()
  tagId: string;
}
