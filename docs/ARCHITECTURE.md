# Architecture Overview

## System Design

The Omni-Channel Helpdesk Platform is built as a modern, scalable multi-tenant SaaS application using a layered architecture pattern with clear separation of concerns.

### High-Level Architecture

```
┌─────────────────┐
│   Next.js UI    │  Frontend (React, Tailwind CSS)
└────────┬────────┘
         │ HTTP/REST
┌────────▼────────┐
│  NestJS API     │  Backend (TypeScript, Express)
├─────────────────┤
│ Domain Layer    │  Business Logic
├─────────────────┤
│ Adapter Layer   │  External Services
└────────┬────────┘
         │
    ┌────▼────┐    ┌─────────┐
    │ Prisma  │    │  Redis  │
    └────┬────┘    └─────────┘
         │
    ┌────▼────┐
    │ Postgres│
    └─────────┘
```

## Backend Architecture

### Layer Structure

The backend follows a **vertical slice architecture** with clear layer boundaries:

```
backend/src/
├── adapters/          # External service adapters (AI, notifications, analytics)
├── domain/            # Domain events and business logic
├── lib/              # Shared utilities (logger, metrics)
├── common/           # Common filters and interfaces
├── prisma/           # Database service
├── tickets/          # Ticket management module
├── messages/         # Message handling module
├── agents/           # Agent management module
├── channels/         # Channel configuration module
├── suggestions/      # AI suggestion module
├── canned-responses/ # Canned response templates
├── tags/             # Tag management module
└── email-queue/      # Email processing queue
```

### Module Pattern

Each module follows the **NestJS module pattern**:

```
module/
├── module.ts          # Module definition
├── controller.ts      # HTTP endpoints
├── service.ts         # Business logic
├── dto/              # Data transfer objects (validation)
└── *.spec.ts         # Tests
```

### Request Flow

```
1. HTTP Request
   ↓
2. Controller (validation via DTOs)
   ↓
3. Service (business logic)
   ↓
4. Prisma Client (database operations)
   ↓
5. Event Emission (optional)
   ↓
6. Response
```

## Domain Model

### Core Entities

```
Tenant ────┬──── InboxChannel
           ├──── Ticket ────┬──── Message
           │                 ├──── SuggestedReply
           │                 ├──── TicketTag → Tag
           │                 ├──── TicketNote
           │                 └──── TicketHistory
           ├──── AgentUser
           ├──── Tag
           ├──── CannedResponse
           ├──── AutomationRule
           └──── SLAPolicy
```

### Entity Descriptions

- **Tenant**: Multi-tenant isolation (companies/organizations)
- **InboxChannel**: Support channels (email, web_form, widget)
- **Ticket**: Core support request entity
- **Message**: Conversation messages (user ↔ agent)
- **SuggestedReply**: AI-generated reply suggestions
- **AgentUser**: Support team members
- **Tag**: Categorization labels (bug, billing, etc.)
- **CannedResponse**: Reusable reply templates
- **TicketNote**: Internal agent notes
- **TicketHistory**: Audit trail of changes
- **AutomationRule**: Conditional automation logic
- **SLAPolicy**: Service level agreements

## Extensibility Layer

### Adapter Pattern

The system uses **adapter interfaces** to decouple from external services:

```typescript
// AI Provider Abstraction
interface IAIAdapter {
  generate(options: AIGenerateOptions): Promise<AIGenerateResponse>;
  getSupportedModels(): string[];
}

// Implementations: OpenAIAdapter, AnthropicAdapter, LocalModelAdapter
```

**Available Adapters:**
- `IAIAdapter` - AI providers (OpenAI, Anthropic, local models)
- `INotificationAdapter` - Notifications (email, SMS, push, webhooks)
- `IAnalyticsAdapter` - Analytics tracking (Segment, Mixpanel)

### Event System

Domain events enable loose coupling and extensibility:

```typescript
// Event Types
- ticket.created
- ticket.assigned
- ticket.status_changed
- ticket.closed
- message.received
- message.sent
- ticket.tagged
```

**Event Flow:**
```
Business Logic
  ↓
eventBus.emit(event)
  ↓
Event Handlers (parallel execution)
  ↓
Side Effects (webhooks, notifications, analytics)
```

## Data Flow Patterns

### Ticket Creation Flow

```
1. POST /tickets (CreateTicketDto)
   ↓
2. Validation (class-validator)
   ↓
3. TicketsService.create()
   ↓
4. Prisma transaction:
   - Create ticket
   - Create initial message
   - Extract customer info
   ↓
5. Event: ticket.created
   ↓
6. Handlers:
   - Log metrics
   - Send notifications
   - Trigger automation rules
   ↓
7. Return ticket + first message
```

### AI Suggestion Flow

```
1. POST /suggestions/generate
   ↓
2. Fetch ticket + messages
   ↓
3. Build conversation context
   ↓
4. IAIAdapter.generate()
   ↓
5. Save SuggestedReply
   ↓
6. Increment usage metrics
   ↓
7. Return suggestion
```

### Tag Application Flow

```
1. POST /tags/apply
   ↓
2. Check existing TicketTag
   ↓
3. Create TicketTag relation
   ↓
4. Event: ticket.tagged
   ↓
5. Trigger tag-based automation
```

## Infrastructure Components

### Logging

Structured logging with contextual information:

```typescript
logger.setContext({ requestId, userId, tenantId });
logger.info('Ticket created', { ticketId });
```

**Log Levels:** DEBUG, INFO, WARN, ERROR

**Production Format:** JSON (for log aggregation)

### Metrics

Prometheus-compatible metrics tracking:

```typescript
incrementCounter('tickets_created', { tenantId });
setGauge('active_tickets', count, { status: 'open' });
recordHistogram('ticket_resolution_time_ms', duration);
```

### Queue Processing

BullMQ for async operations:

```
Email Webhook
  ↓
emailQueue.add('process-email', payload)
  ↓
EmailProcessor.handleEmailProcessing()
  ↓
Create Ticket + Message
```

## Security Considerations

### Multi-Tenancy

- All queries filtered by `tenantId`
- Row-level isolation in database
- No cross-tenant data leakage

### Input Validation

- All DTOs use `class-validator`
- Whitelisting via `ValidationPipe`
- SQL injection prevented by Prisma ORM

### Error Handling

- Global exception filter
- Sensitive info excluded from responses
- Consistent error format

## Scalability Considerations

### Horizontal Scaling

- Stateless backend (can run multiple instances)
- Shared PostgreSQL database
- Shared Redis for queue coordination

### Database Optimization

- Indexes on:
  - `tenantId` + `status` (ticket queries)
  - `customerEmail` (search)
  - `createdAt`, `updatedAt` (sorting)
- Pagination for large result sets

### Caching Strategy (Future)

- Redis cache for:
  - Tenant settings
  - Agent availability
  - Canned responses
  - Tag lists

## Integration Points

### External System Integration

The platform integrates with other systems via:

1. **REST API**: All features exposed via HTTP endpoints
2. **Webhooks**: Inbound (email) and outbound (events)
3. **Adapters**: Pluggable external services
4. **Events**: Subscribe to domain events

### Ecosystem Integration

**With Auth System:**
```
Auth Provider → JWT → API (validate tenantId/userId)
```

**With Notification Hub:**
```
Domain Event → INotificationAdapter → Notification Hub
```

**With Chat Widget:**
```
Chat Widget → POST /tickets (type: widget) → Ticket Created
```

**With Analytics:**
```
User Action → IAnalyticsAdapter → Analytics Platform
```

## Testing Strategy

### Test Pyramid

```
    ┌─────────┐
    │   E2E   │  Full flow tests (Frontend + Backend)
    └─────────┘
   ┌───────────┐
   │Integration│  API endpoint tests with real DB
   └───────────┘
  ┌─────────────┐
  │    Unit     │  Service & utility tests
  └─────────────┘
```

### Test Types

1. **Unit Tests**: Business logic, utilities, helpers
2. **Integration Tests**: API endpoints with test database
3. **E2E Tests**: Full user flows via frontend

### Test Factories

Reusable test data generators:

```typescript
TicketFactory.create({ status: 'open', priority: 'high' });
AgentFactory.createMany(5);
```

## Deployment Architecture

### Development

```
docker-compose.dev.yml
├── PostgreSQL
└── Redis

npm run dev (local processes)
├── Backend (NestJS)
└── Frontend (Next.js)
```

### Production

```
docker-compose.yml
├── PostgreSQL
├── Redis
├── Backend (containerized)
└── Frontend (containerized)
```

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_HOST` / `REDIS_PORT` - Redis connection
- `OPENAI_API_KEY` - AI provider key
- `NODE_ENV` - Environment (development/production)

## Performance Characteristics

### Expected Throughput

- **Ticket Creation**: ~100 req/sec (single instance)
- **Ticket Queries**: ~500 req/sec (with indexes)
- **AI Suggestions**: Limited by OpenAI API (~50 req/min)

### Latency Targets

- **P50**: < 100ms (database queries)
- **P95**: < 500ms (with AI suggestions)
- **P99**: < 2s (complex queries)

## Future Enhancements

### Phase 4+

1. **Real-time Updates**: WebSocket support for live ticket updates
2. **Advanced Caching**: Redis-based query caching
3. **Search Engine**: Elasticsearch for full-text search
4. **File Storage**: S3/GCS adapter for attachments
5. **Rate Limiting**: Per-tenant API rate limits
6. **Monitoring**: Prometheus + Grafana dashboards
7. **Tracing**: OpenTelemetry distributed tracing

## Development Guidelines

### Adding a New Module

1. Create module directory under `src/`
2. Implement controller, service, DTOs
3. Add module to `app.module.ts`
4. Write unit tests
5. Update Prisma schema if needed
6. Add to seed data
7. Document in API reference

### Adding a New Adapter

1. Define interface in `src/adapters/`
2. Create stub implementation
3. Add to relevant services
4. Document integration recipe

### Best Practices

- Use dependency injection
- Keep business logic in services
- Validate all inputs
- Log meaningful events
- Emit domain events for side effects
- Write tests alongside features
- Document complex logic

---

**Last Updated**: 2024 (Phase 3)
**Maintained By**: Platform Team
