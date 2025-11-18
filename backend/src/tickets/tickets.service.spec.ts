import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TicketsService', () => {
  let service: TicketsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    ticket: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ticket with initial message', async () => {
      const createDto = {
        tenantId: 'tenant-1',
        inboxId: 'inbox-1',
        subject: 'Test ticket',
        fromEmail: 'test@example.com',
        fromName: 'Test User',
        body: 'This is a test message',
        priority: 'medium' as const,
      };

      const expectedTicket = {
        id: 'ticket-1',
        ...createDto,
        status: 'open',
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [
          {
            id: 'msg-1',
            ticketId: 'ticket-1',
            fromRole: 'user',
            fromEmail: createDto.fromEmail,
            fromName: createDto.fromName,
            body: createDto.body,
            createdAt: new Date(),
          },
        ],
        inboxChannel: { id: 'inbox-1', name: 'Test Channel' },
        assignedAgent: null,
      };

      mockPrismaService.ticket.create.mockResolvedValue(expectedTicket);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedTicket);
      expect(mockPrismaService.ticket.create).toHaveBeenCalledWith({
        data: {
          tenantId: createDto.tenantId,
          inboxId: createDto.inboxId,
          subject: createDto.subject,
          priority: createDto.priority,
          status: 'open',
          messages: {
            create: {
              fromRole: 'user',
              fromEmail: createDto.fromEmail,
              fromName: createDto.fromName,
              body: createDto.body,
            },
          },
        },
        include: {
          messages: true,
          inboxChannel: true,
          assignedAgent: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all tickets for a tenant', async () => {
      const tenantId = 'tenant-1';
      const expectedTickets = [
        {
          id: 'ticket-1',
          tenantId,
          subject: 'First ticket',
          status: 'open',
          priority: 'high',
        },
        {
          id: 'ticket-2',
          tenantId,
          subject: 'Second ticket',
          status: 'pending',
          priority: 'medium',
        },
      ];

      mockPrismaService.ticket.findMany.mockResolvedValue(expectedTickets);

      const result = await service.findAll(tenantId);

      expect(result).toEqual(expectedTickets);
      expect(mockPrismaService.ticket.findMany).toHaveBeenCalledWith({
        where: { tenantId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 1,
          },
          inboxChannel: true,
          assignedAgent: true,
        },
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('should filter tickets by status', async () => {
      const tenantId = 'tenant-1';
      const filters = { status: 'open' as const };

      mockPrismaService.ticket.findMany.mockResolvedValue([]);

      await service.findAll(tenantId, filters);

      expect(mockPrismaService.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { tenantId, status: 'open' },
        })
      );
    });

    it('should filter tickets by priority', async () => {
      const tenantId = 'tenant-1';
      const filters = { priority: 'urgent' as const };

      mockPrismaService.ticket.findMany.mockResolvedValue([]);

      await service.findAll(tenantId, filters);

      expect(mockPrismaService.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { tenantId, priority: 'urgent' },
        })
      );
    });
  });

  describe('findOne', () => {
    it('should return a single ticket with messages', async () => {
      const ticketId = 'ticket-1';
      const tenantId = 'tenant-1';
      const expectedTicket = {
        id: ticketId,
        tenantId,
        subject: 'Test ticket',
        messages: [
          { id: 'msg-1', body: 'First message' },
          { id: 'msg-2', body: 'Second message' },
        ],
      };

      mockPrismaService.ticket.findFirst.mockResolvedValue(expectedTicket);

      const result = await service.findOne(ticketId, tenantId);

      expect(result).toEqual(expectedTicket);
      expect(mockPrismaService.ticket.findFirst).toHaveBeenCalledWith({
        where: { id: ticketId, tenantId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          inboxChannel: true,
          assignedAgent: true,
          suggestedReplies: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      });
    });
  });

  describe('update', () => {
    it('should update ticket status', async () => {
      const ticketId = 'ticket-1';
      const tenantId = 'tenant-1';
      const updateDto = { status: 'closed' as const };
      const expectedTicket = {
        id: ticketId,
        tenantId,
        status: 'closed',
      };

      mockPrismaService.ticket.update.mockResolvedValue(expectedTicket);

      const result = await service.update(ticketId, tenantId, updateDto);

      expect(result).toEqual(expectedTicket);
      expect(mockPrismaService.ticket.update).toHaveBeenCalledWith({
        where: { id: ticketId },
        data: updateDto,
        include: {
          messages: true,
          inboxChannel: true,
          assignedAgent: true,
        },
      });
    });
  });

  describe('getStats', () => {
    it('should return ticket statistics', async () => {
      const tenantId = 'tenant-1';
      mockPrismaService.ticket.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(3)  // open
        .mockResolvedValueOnce(5)  // pending
        .mockResolvedValueOnce(2); // closed

      const result = await service.getStats(tenantId);

      expect(result).toEqual({
        total: 10,
        open: 3,
        pending: 5,
        closed: 2,
      });
      expect(mockPrismaService.ticket.count).toHaveBeenCalledTimes(4);
    });
  });
});
