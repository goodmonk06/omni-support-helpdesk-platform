import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCannedResponseDto, UpdateCannedResponseDto, UseCannedResponseDto } from './dto';
import { createLogger } from '../lib/logger';
import { incrementCounter } from '../lib/metrics';

@Injectable()
export class CannedResponsesService {
  private logger = createLogger('CannedResponsesService');

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCannedResponseDto) {
    this.logger.info('Creating canned response', { name: createDto.name });

    const response = await this.prisma.cannedResponse.create({
      data: createDto,
    });

    incrementCounter('canned_responses_created', { tenantId: createDto.tenantId });
    return response;
  }

  async findAll(tenantId: string, category?: string) {
    const where: any = { tenantId, isActive: true };
    if (category) {
      where.category = category;
    }

    return this.prisma.cannedResponse.findMany({
      where,
      orderBy: [{ category: 'asc' }, { title: 'asc' }],
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.cannedResponse.findFirst({
      where: { id, tenantId },
    });
  }

  async update(id: string, tenantId: string, updateDto: UpdateCannedResponseDto) {
    return this.prisma.cannedResponse.update({
      where: { id },
      data: updateDto,
    });
  }

  async delete(id: string, tenantId: string) {
    // Soft delete by marking as inactive
    return this.prisma.cannedResponse.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Use a canned response - substitute variables and increment usage count
   */
  async use(useDto: UseCannedResponseDto): Promise<string> {
    const response = await this.prisma.cannedResponse.findUnique({
      where: { id: useDto.responseId },
    });

    if (!response) {
      throw new Error('Canned response not found');
    }

    // Increment usage counter
    await this.prisma.cannedResponse.update({
      where: { id: response.id },
      data: { usageCount: { increment: 1 } },
    });

    incrementCounter('canned_responses_used', {
      tenantId: response.tenantId,
      responseId: response.id
    });

    // Substitute variables
    let content = response.content;
    if (useDto.variables) {
      Object.entries(useDto.variables).forEach(([key, value]) => {
        const pattern = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(pattern, value);
      });
    }

    this.logger.info('Canned response used', {
      responseId: response.id,
      name: response.name,
    });

    return content;
  }

  async getByShortcut(tenantId: string, shortcut: string) {
    return this.prisma.cannedResponse.findFirst({
      where: {
        tenantId,
        isActive: true,
        shortcuts: {
          has: shortcut,
        },
      },
    });
  }

  async getCategories(tenantId: string): Promise<string[]> {
    const responses = await this.prisma.cannedResponse.findMany({
      where: { tenantId, isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    return responses
      .map((r) => r.category)
      .filter((c): c is string => c !== null)
      .sort();
  }
}
