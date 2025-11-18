import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class EmailWebhookDto {
  @IsEmail()
  @IsNotEmpty()
  from: string;

  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
