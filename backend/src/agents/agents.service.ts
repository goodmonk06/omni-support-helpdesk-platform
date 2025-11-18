import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto, UpdateAgentDto } from './dto';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAgentDto: CreateAgentDto) {
    return this.prisma.agentUser.create({
      data: createAgentDto,
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.agentUser.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.agentUser.findFirst({
      where: { id, tenantId },
      include: {
        assignedTickets: {
          where: {
            status: { not: 'closed' },
          },
          take: 10,
        },
      },
    });
  }

  async update(id: string, tenantId: string, updateAgentDto: UpdateAgentDto) {
    return this.prisma.agentUser.update({
      where: { id },
      data: updateAgentDto,
    });
  }

  async delete(id: string, tenantId: string) {
    return this.prisma.agentUser.delete({
      where: { id },
    });
  }
}
