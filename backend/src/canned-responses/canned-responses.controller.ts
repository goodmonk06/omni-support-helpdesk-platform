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
import { CannedResponsesService } from './canned-responses.service';
import { CreateCannedResponseDto, UpdateCannedResponseDto, UseCannedResponseDto } from './dto';

@Controller('canned-responses')
export class CannedResponsesController {
  constructor(private readonly service: CannedResponsesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateCannedResponseDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll(@Query('tenantId') tenantId: string, @Query('category') category?: string) {
    return this.service.findAll(tenantId, category);
  }

  @Get('categories')
  getCategories(@Query('tenantId') tenantId: string) {
    return this.service.getCategories(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.service.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() updateDto: UpdateCannedResponseDto,
  ) {
    return this.service.update(id, tenantId, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.service.delete(id, tenantId);
  }

  @Post('use')
  @HttpCode(HttpStatus.OK)
  async use(@Body() useDto: UseCannedResponseDto) {
    const content = await this.service.use(useDto);
    return { content };
  }
}
