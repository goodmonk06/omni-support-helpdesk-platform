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
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto, ApplyTagDto } from './dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly service: TagsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateTagDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll(@Query('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Get('search')
  search(
    @Query('tenantId') tenantId: string,
    @Query('q') query?: string,
    @Query('tagIds') tagIds?: string,
    @Query('status') status?: string,
  ) {
    const tagIdArray = tagIds ? tagIds.split(',') : undefined;
    return this.service.searchTickets(tenantId, query, tagIdArray, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.service.findOne(id, tenantId);
  }

  @Get(':id/tickets')
  getTickets(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.service.getTicketsByTag(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() updateDto: UpdateTagDto,
  ) {
    return this.service.update(id, tenantId, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.service.delete(id, tenantId);
  }

  @Post('apply')
  @HttpCode(HttpStatus.OK)
  applyToTicket(@Body() applyDto: ApplyTagDto) {
    return this.service.applyToTicket(applyDto);
  }

  @Delete('remove/:ticketId/:tagId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFromTicket(@Param('ticketId') ticketId: string, @Param('tagId') tagId: string) {
    return this.service.removeFromTicket(ticketId, tagId);
  }
}
