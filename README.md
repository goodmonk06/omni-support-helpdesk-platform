# Omni-Channel Support Helpdesk Platform

A comprehensive omni-channel support/helpdesk platform that collects and manages support requests from multiple channels (email, contact forms, chat widgets) with AI-powered reply suggestions.

## Overview

This platform provides a complete solution for managing customer support tickets across multiple channels. It features intelligent AI-powered reply suggestions using OpenAI, real-time queue processing with Redis/BullMQ, and a modern React-based frontend for agents to manage tickets efficiently.

**Current Status: Phase 2 - Production Ready**
- ✅ Complete vertical slice implementation (Ticket CRUD)
- ✅ Full-stack integration (Backend API ↔ Frontend UI)
- ✅ Docker support for local and production deployment
- ✅ Database seeding with realistic demo data
- ✅ Comprehensive test coverage
- ✅ Standardized DX with npm scripts

## Tech Stack

### Backend
- **Framework**: NestJS 10 with TypeScript
- **Database**: PostgreSQL 15 with Prisma ORM
- **Queue**: Redis 7 with BullMQ for async email processing
- **AI**: OpenAI GPT-4 for intelligent reply suggestions
- **Validation**: class-validator, class-transformer
- **Testing**: Jest with comprehensive unit tests

### Frontend
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS 3
- **HTTP Client**: Axios with centralized API client
- **Date Handling**: date-fns
- **UI Components**: Custom responsive components

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload, TypeScript strict mode
- **Production**: Multi-stage builds, optimized images

## Domain Model

### Core Entities

```
Tenant (Multi-tenancy support)
  ├── InboxChannels (email, web_form, widget)
  ├── Tickets (support requests)
  │   ├── Messages (conversation thread)
  │   └── SuggestedReplies (AI-generated)
  └── AgentUsers (support team members)
```

**Key Relationships:**
- Each **Ticket** belongs to one **Tenant** and one **InboxChannel**
- Each **Ticket** contains multiple **Messages** (user ↔ agent conversation)
- Each **Ticket** can have multiple **SuggestedReplies** from AI
- **Tickets** can be assigned to **AgentUsers**
- **AgentUsers** have roles (admin, agent) with different permissions

### Status Flow

```
open → pending → closed
```

- **open**: New ticket, awaiting agent response
- **pending**: Agent responded, awaiting customer
- **closed**: Issue resolved

### Priority Levels

- **urgent**: Critical issues requiring immediate attention
- **high**: Important issues, SLA < 4 hours
- **medium**: Standard requests, SLA < 24 hours
- **low**: Feature requests, general inquiries

## Getting Started

### Requirements

- **Node.js**: 18+ and npm 9+
- **Docker**: 20+ and Docker Compose 2+
- **PostgreSQL**: 15+ (or use Docker)
- **Redis**: 7+ (or use Docker)
- **OpenAI API Key**: For AI reply suggestions

### Quick Start (Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd omni-support-helpdesk-platform
```

2. **Set up environment variables**
```bash
# Root directory
cp .env.example .env
# Add your OpenAI API key to .env

# Backend
cp backend/.env.example backend/.env
# Update DATABASE_URL if needed

# Frontend
cp frontend/.env.example frontend/.env
```

3. **Start infrastructure with Docker**
```bash
npm run docker:dev
```
This starts PostgreSQL and Redis in containers.

4. **Install dependencies**
```bash
npm install
```

5. **Set up database**
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with demo data
npm run db:seed
```

6. **Start development servers**
```bash
npm run dev
```

This starts both backend (port 3001) and frontend (port 3000) in watch mode.

7. **Access the application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: `npm run db:studio`

### Production Deployment with Docker

1. **Set environment variables**
```bash
# Copy and configure
cp .env.example .env
# Add production values (especially OPENAI_API_KEY)
```

2. **Build and start all services**
```bash
npm run docker:build
npm run docker:prod
```

This starts PostgreSQL, Redis, Backend, and Frontend in production mode.

3. **Run database migrations** (one-time)
```bash
docker exec helpdesk-backend npx prisma migrate deploy
docker exec helpdesk-backend npm run db:seed
```

4. **Access the application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Development Without Docker

If you prefer running services natively:

1. **Start PostgreSQL and Redis** (native or Docker)
```bash
# Option 1: Use Docker for infra only
npm run docker:dev

# Option 2: Install and run natively
# PostgreSQL on port 5432
# Redis on port 6379
```

2. **Follow steps 4-7 from Quick Start above**

## Available Scripts

### Root Level (Monorepo)

```bash
# Development
npm run dev              # Start both backend and frontend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only

# Build
npm run build            # Build both apps
npm run build:backend    # Build backend only
npm run build:frontend   # Build frontend only

# Production
npm run start            # Start both in production mode

# Testing
npm run test             # Run backend tests
npm run lint             # Lint both apps

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run migrations (with name prompt)
npm run db:push          # Push schema changes (dev only)
npm run db:seed          # Seed demo data
npm run db:studio        # Open Prisma Studio

# Docker
npm run docker:dev       # Start dev infrastructure (PG + Redis)
npm run docker:dev:down  # Stop dev infrastructure
npm run docker:prod      # Start full stack (all services)
npm run docker:prod:down # Stop all services
npm run docker:build     # Build Docker images
```

### Backend

```bash
cd backend

npm run dev              # Development with hot reload
npm run build            # Build for production
npm run start:prod       # Start production server
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Run tests with coverage
npm run lint             # Lint and fix
```

### Frontend

```bash
cd frontend

npm run dev              # Development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint Next.js app
```

## Example Flow: Complete Vertical Slice

Here's a complete end-to-end flow demonstrating the platform's capabilities:

### 1. **Ticket Creation** (API or UI)

**Via API (Web Form Integration):**
```bash
curl -X POST http://localhost:3001/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "demo-tenant",
    "inboxId": "webform-channel-1",
    "subject": "Cannot access my dashboard",
    "fromEmail": "user@example.com",
    "fromName": "Jane Doe",
    "body": "I have been trying to log in but keep getting error 403",
    "priority": "high"
  }'
```

**Via Email Webhook:**
```bash
curl -X POST http://localhost:3001/channels/email-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "from": "customer@example.com",
    "to": "support@democompany.com",
    "subject": "Billing question",
    "body": "I need clarification on my invoice"
  }'
```

### 2. **View Tickets List** (Frontend)

Navigate to http://localhost:3000/tickets

- See all tickets with status badges
- Filter by status (open, pending, closed)
- Filter by priority (urgent, high, medium, low)
- View ticket stats dashboard (total, open, pending, closed)

### 3. **Ticket Detail & Reply** (Frontend)

Click on any ticket to view:
- Complete message thread (customer ↔ agent)
- Ticket metadata (status, priority, assigned agent)
- Reply interface with AI suggestions

**AI-Powered Reply:**
1. Click "✨ Suggest Reply" button
2. AI analyzes conversation context
3. Generates professional, empathetic response
4. Click "Use this" to populate reply box
5. Edit if needed, then "Send Reply"

### 4. **Admin Panel** (Frontend)

Navigate to http://localhost:3000/admin

**Manage Agents:**
- Add new support agents
- Assign roles (admin, agent)
- Activate/deactivate users

**Manage Channels:**
- Configure email addresses
- Set up web form integrations
- Enable/disable channels

### 5. **Assignment & Status Updates**

From ticket detail page:
- Assign ticket to agent (dropdown)
- Update priority (low → urgent)
- Change status (open → pending → closed)
- All changes reflected in real-time

## Demo Data

After running `npm run db:seed`, you'll have:

### Tenant
- **ID**: `demo-tenant`
- **Name**: Demo Company

### Channels
1. **Support Email**: support@democompany.com
2. **Website Contact Form**: Web form integration

### Agents
1. **Sarah Admin** (admin@democompany.com) - Admin role
2. **John Support** (john@democompany.com) - Agent role
3. **Mary Helper** (mary@democompany.com) - Agent role

### Sample Tickets

1. **"Cannot login to my account"** (High priority, Open)
   - 3 messages in conversation
   - Assigned to John Support

2. **"Billing question about recent invoice"** (Medium priority, Pending)
   - 2 messages
   - Assigned to Mary Helper

3. **"Feature request: Dark mode"** (Low priority, Open)
   - 1 message, unassigned
   - Has AI suggestion ready

4. **"Data export not working"** (Urgent, Closed)
   - 6 messages (complete resolution thread)
   - Assigned to Sarah Admin

**To explore:**
```bash
# Start the app
npm run dev

# Visit http://localhost:3000/tickets
# Click on any ticket to see the conversation
# Try generating AI suggestions
# Test filters and assignment
```

## Testing

### Run Tests
```bash
# All backend tests
npm run test

# Watch mode
cd backend && npm run test:watch

# Coverage report
cd backend && npm run test:cov
```

### Test Coverage

- **TicketsService**: Complete CRUD operations
  - Create ticket with message
  - List with filters (status, priority, assignment)
  - Get single ticket with relations
  - Update ticket fields
  - Statistics aggregation

- **OpenAIService**: AI integration
  - Context formatting
  - Error handling

**Current Coverage**: ~80% of core business logic

## API Reference

### Tickets
- `POST /tickets` - Create new ticket
- `GET /tickets` - List tickets (with filters)
- `GET /tickets/:id` - Get ticket details
- `PATCH /tickets/:id` - Update ticket
- `DELETE /tickets/:id` - Delete ticket
- `GET /tickets/stats` - Get statistics

### Messages
- `POST /messages` - Add message to ticket
- `GET /messages/ticket/:ticketId` - Get ticket messages

### AI Suggestions
- `POST /suggestions/generate` - Generate AI reply
  ```json
  {
    "ticketId": "ticket-id",
    "model": "gpt-4-turbo-preview"
  }
  ```
- `GET /suggestions/ticket/:ticketId` - Get suggestions

### Agents
- `GET /agents` - List agents
- `POST /agents` - Create agent
- `PATCH /agents/:id` - Update agent
- `DELETE /agents/:id` - Delete agent

### Channels
- `GET /channels` - List channels
- `POST /channels` - Create channel
- `PATCH /channels/:id` - Update channel
- `DELETE /channels/:id` - Delete channel
- `POST /channels/email-webhook` - Email webhook endpoint

**All endpoints require `tenantId` query parameter (except webhooks)**

## Error Handling

All API responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error:**
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/tickets",
  "method": "POST",
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Global exception filter handles:
- Validation errors (class-validator)
- HTTP exceptions
- Prisma errors
- Unexpected errors

## Future Extensions

### Short-term (Next Phase)
- [ ] Real-time updates with WebSockets (ticket assignments, new messages)
- [ ] Email notifications to agents on new tickets
- [ ] Canned responses library for common issues
- [ ] File attachments support
- [ ] Customer portal (self-service)

### Medium-term
- [ ] Advanced analytics and reporting dashboard
- [ ] SLA management and tracking
- [ ] Knowledge base integration
- [ ] Multi-language support (i18n)
- [ ] Custom fields per ticket type

### Long-term (Ecosystem Integration)
- [ ] **embed-chat-widget-platform** integration
  - Live chat widget
  - Visitor tracking
  - Proactive chat triggers

- [ ] **unified-notification-hub** integration
  - SMS alerts for urgent tickets
  - Push notifications
  - Slack/Teams integration
  - Multi-channel agent notifications

- [ ] Mobile apps (iOS/Android)
- [ ] Third-party integrations (Jira, Salesforce, Zendesk)
- [ ] Advanced AI features (sentiment analysis, auto-categorization)

## Architecture Notes

### Vertical Slice Architecture
Each feature module (tickets, messages, agents) is self-contained:
- Controller (HTTP layer)
- Service (business logic)
- DTOs (validation & types)
- Tests (unit & e2e)

### Type Safety
- End-to-end TypeScript
- Prisma generates types from schema
- Frontend shares types via API client
- No `any` types in production code

### Scalability Considerations
- BullMQ for async processing (email queue)
- Stateless backend (horizontal scaling ready)
- Redis for session/cache (future)
- Database indexes on common queries
- Docker compose for easy multi-instance deployment

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Support & Documentation

- **Issues**: Use GitHub issue tracker
- **API Docs**: Available at `/api/docs` (coming soon - Swagger)
- **Database Schema**: View with `npm run db:studio`

---

**Built with ❤️ for exceptional customer support experiences**
