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
import { AgentsService } from './agents.service';
import { CreateAgentDto, UpdateAgentDto } from './dto';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentsService.create(createAgentDto);
  }

  @Get()
  findAll(@Query('tenantId') tenantId: string) {
    return this.agentsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.agentsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    return this.agentsService.update(id, tenantId, updateAgentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.agentsService.delete(id, tenantId);
  }
}
