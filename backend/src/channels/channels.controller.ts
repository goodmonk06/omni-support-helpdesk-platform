import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto, UpdateChannelDto, EmailWebhookDto } from './dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(createChannelDto);
  }

  @Post('email-webhook')
  @HttpCode(HttpStatus.OK)
  emailWebhook(@Body() emailWebhookDto: EmailWebhookDto) {
    return this.channelsService.handleEmailWebhook(emailWebhookDto);
  }

  @Get()
  findAll(@Query('tenantId') tenantId: string) {
    return this.channelsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.channelsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelsService.update(id, tenantId, updateChannelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.channelsService.delete(id, tenantId);
  }
}
