# Changelog

All notable changes to the Omni-Channel Helpdesk Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - Phase 3 (Deep Expansion) - 2024

### Added

#### Domain Model Expansion
- **Tags System**: Full tag management with color coding, search, and filtering
  - Create, update, delete tags
  - Apply tags to tickets
  - Search tickets by tags
  - Tag-based ticket organization
- **Canned Responses**: Reusable reply templates with variable substitution
  - Create response templates with {{variables}}
  - Category organization
  - Keyboard shortcuts
  - Usage tracking
- **Ticket Notes**: Internal agent-only notes on tickets
- **Ticket History**: Complete audit trail of all ticket changes
- **Enhanced Ticket Fields**: `metadata`, `firstResponseAt`, `resolvedAt`, `customerEmail/Name`
- **Enhanced Agent Fields**: `signature`, `avatar`, `maxActiveTickets`
- **Enhanced Message Fields**: `sentiment`, `isInternal`
- **Automation Rules Model**: Foundation for future automation (schema only)
- **SLA Policies Model**: Service level agreement tracking (schema only)

#### Extensibility Infrastructure
- **Logger**: Structured logging with context (`lib/logger.ts`)
  - Multiple log levels (DEBUG, INFO, WARN, ERROR)
  - Contextual logging (requestId, userId, tenantId)
  - JSON output for production
- **Metrics**: Application metrics tracking (`lib/metrics.ts`)
  - Counters, gauges, histograms
  - Prometheus-compatible format
  - Performance timing utilities
- **Event System**: Domain event bus (`domain/events.ts`)
  - Event types: ticket.created, ticket.assigned, ticket.tagged, etc.
  - Event handlers with parallel execution
  - Extensible for webhooks and integrations
- **Adapter Interfaces**:
  - `IAIAdapter` - AI provider abstraction (OpenAI, Anthropic, local models)
  - `INotificationAdapter` - Notification delivery (email, SMS, push, webhook)
  - `IAnalyticsAdapter` - Analytics tracking (Segment, console)

#### New Vertical Slices
- **Canned Responses Management** (Full CRUD + Use)
  - API endpoints: GET, POST, PATCH, DELETE `/canned-responses`
  - Variable substitution: `{{customerName}}`, `{{issue}}`, etc.
  - Category filtering
  - Shortcut support
- **Tag Management** (Full CRUD + Apply to Tickets)
  - API endpoints: GET, POST, PATCH, DELETE `/tags`
  - Apply/remove tags: POST `/tags/apply`, DELETE `/tags/remove/:ticketId/:tagId`
  - Search tickets by tags: GET `/tags/search`
  - Ticket filtering by multiple tags

#### Enhanced Features
- **Comprehensive Seed Data**:
  - 4 agents (1 admin + 3 agents with signatures)
  - 3 channels (email, web_form, widget)
  - 5 tags (bug, feature-request, billing, urgent, vip)
  - 4 canned responses with variable templates
  - 4 tickets with rich metadata, tags, notes, and history
  - Sentiment analysis on messages
  - Realistic timestamps (3-10 days ago)
- **Metrics Tracking**:
  - `tickets_created`, `tickets_tagged`, `canned_responses_used`
  - Track by tenant, status, priority
- **Event Emission**:
  - Tickets emit domain events on state changes
  - Event handlers for logging and metrics

#### Developer Experience
- **Additional npm Scripts**:
  - `npm run typecheck` - TypeScript compilation check
  - `npm run db:reset` - Reset database completely
- **Architecture Documentation**: `docs/ARCHITECTURE.md`
  - System design overview
  - Layer structure explanation
  - Data flow diagrams
  - Integration points
  - Scalability considerations
- **Phase 3 Overview**: `docs/PHASE3_OVERVIEW.md`
  - Purpose statement
  - Current state analysis
  - Phase 3 implementation plan
  - Success criteria

#### Testing
- **Test Coverage**: Expanded unit test suite
  - TicketsService comprehensive tests
  - OpenAIService integration tests
  - Test factories for data generation

### Changed

#### Database Schema (Breaking)
- **Tenant**: Added `businessHours`, `timezone`, `settings` JSON fields
- **InboxChannel**: Added `autoAssignEnabled` boolean
- **Ticket**: Added `metadata` (JSON), `firstResponseAt`, `resolvedAt`, `customerEmail`, `customerName`
- **Message**: Added `sentiment`, `isInternal`
- **AgentUser**: Added `signature`, `avatar`, `maxActiveTickets`
- **SuggestedReply**: Added `used` boolean to track usage

#### Module Updates
- **app.module.ts**: Added CannedResponsesModule and TagsModule
- **Seed Script**: Completely rewritten with Phase 3 comprehensive data

### Improved
- **Error Handling**: Global exception filter with consistent response format
- **Logging**: All services now use structured logger
- **Metrics**: Key operations tracked with metrics
- **Type Safety**: Enhanced TypeScript types across all new modules

### Migration Notes

**⚠️ Breaking Changes**: The database schema has significant changes. Run migrations:

```bash
npm run db:reset   # WARNING: Destroys all data
npm run db:migrate # Or migrate incrementally
npm run db:seed    # Load Phase 3 demo data
```

**New Environment Variables**: None required (all features work with existing config)

**API Changes**: No breaking changes to existing endpoints. New endpoints added:
- `/canned-responses/*` - Canned response management
- `/tags/*` - Tag management

---

## [0.2.0] - Phase 2 (Production Ready) - 2024

### Added
- Global error handler with consistent API responses
- Comprehensive seed script with demo data
- Unit tests for core services (~80% coverage)
- Docker support (Dockerfile + docker-compose.yml)
- Standardized DX scripts (dev, build, test, lint, db:*)
- Production deployment documentation

### Changed
- README updated with Phase 2 status and comprehensive documentation
- Package.json scripts standardized across workspace

---

## [0.1.0] - Phase 1 (Initial Scaffold) - 2024

### Added
- Initial NestJS backend with TypeScript
- Prisma schema (Tenant, InboxChannel, Ticket, Message, AgentUser, SuggestedReply)
- Next.js frontend with Tailwind CSS
- Basic CRUD for tickets
- OpenAI integration for AI suggestions
- Redis/BullMQ for email queue processing
- Docker Compose for PostgreSQL and Redis
- Basic seed data (4 tickets, 3 agents)

---

[Unreleased]: https://github.com/org/omni-support-helpdesk-platform/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/org/omni-support-helpdesk-platform/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/org/omni-support-helpdesk-platform/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/org/omni-support-helpdesk-platform/releases/tag/v0.1.0
