# Omni-Channel Support Helpdesk Platform

A comprehensive omni-channel support/helpdesk platform that collects and manages support requests from multiple channels (email, contact forms, chat widgets) with AI-powered reply suggestions.

## Features

### Multi-Channel Support
- **Email**: Receive tickets via email through webhook integration
- **Web Forms**: Create tickets through API endpoints
- **Chat Widget**: Ready for integration (future)

### Ticket Management
- Full CRUD operations for tickets
- Status tracking (open, pending, closed)
- Priority levels (low, medium, high, urgent)
- Assignment to support agents
- Message threading and conversation history

### AI-Powered Suggestions
- OpenAI integration for intelligent reply suggestions
- Context-aware responses based on ticket history
- Customizable AI models (GPT-4, GPT-3.5-turbo)

### Admin Features
- Agent management (create, update, delete)
- Channel configuration
- Team assignment and collaboration

## Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: Redis with BullMQ for email processing
- **AI**: OpenAI API for reply suggestions
- **Validation**: class-validator, class-transformer

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## Architecture

```
omni-support-helpdesk-platform/
├── backend/                    # NestJS backend
│   ├── prisma/                # Database schema and migrations
│   │   └── schema.prisma
│   └── src/
│       ├── agents/            # Agent management module
│       ├── channels/          # Channel management module
│       ├── email-queue/       # Email processing queue
│       ├── messages/          # Message handling module
│       ├── prisma/            # Prisma service
│       ├── suggestions/       # AI suggestions module
│       └── tickets/           # Ticket management module
├── frontend/                  # Next.js frontend
│   └── src/
│       ├── app/               # Next.js app directory
│       │   ├── tickets/       # Ticket list and detail pages
│       │   └── admin/         # Admin panel
│       ├── components/        # Reusable components
│       ├── lib/              # API client and utilities
│       └── types/            # TypeScript type definitions
└── docker-compose.yml        # Docker services configuration
```

## Database Schema

### Core Models
- **Tenant**: Multi-tenancy support
- **InboxChannel**: Channel configurations (email, web_form, widget)
- **Ticket**: Support ticket with status, priority, assignment
- **Message**: Conversation messages with role tracking
- **AgentUser**: Support agents with roles
- **SuggestedReply**: AI-generated reply suggestions

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd omni-support-helpdesk-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Backend (.env in backend directory):
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/helpdesk?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Frontend (.env in frontend directory):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_TENANT_ID=default-tenant-id
```

4. **Set up the database**
```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

5. **Start the services**

Using Docker (recommended):
```bash
docker-compose up -d  # Starts PostgreSQL and Redis
```

Start backend:
```bash
cd backend
npm run start:dev
```

Start frontend (in another terminal):
```bash
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Prisma Studio: `cd backend && npm run prisma:studio`

## API Endpoints

### Tickets
- `GET /tickets` - List all tickets with filters
- `GET /tickets/:id` - Get ticket by ID
- `POST /tickets` - Create new ticket
- `PATCH /tickets/:id` - Update ticket
- `DELETE /tickets/:id` - Delete ticket
- `GET /tickets/stats` - Get ticket statistics

### Messages
- `POST /messages` - Create new message
- `GET /messages/ticket/:ticketId` - Get messages for ticket

### Suggestions
- `POST /suggestions/generate` - Generate AI reply suggestion
- `GET /suggestions/ticket/:ticketId` - Get suggestions for ticket

### Agents
- `GET /agents` - List all agents
- `POST /agents` - Create new agent
- `PATCH /agents/:id` - Update agent
- `DELETE /agents/:id` - Delete agent

### Channels
- `GET /channels` - List all channels
- `POST /channels` - Create new channel
- `PATCH /channels/:id` - Update channel
- `DELETE /channels/:id` - Delete channel
- `POST /channels/email-webhook` - Email webhook endpoint

## Usage

### Creating a Ticket via API

```bash
curl -X POST http://localhost:3001/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "default-tenant-id",
    "inboxId": "channel-id",
    "subject": "Need help with login",
    "fromEmail": "customer@example.com",
    "fromName": "John Doe",
    "body": "I cannot log into my account"
  }'
```

### Email Webhook Integration

Configure your email service (SendGrid, Mailgun, etc.) to forward incoming emails to:
```
POST http://your-domain.com/channels/email-webhook
```

Payload format:
```json
{
  "from": "customer@example.com",
  "to": "support@yourdomain.com",
  "subject": "Need help",
  "body": "Email body content"
}
```

### Generating AI Reply Suggestions

```bash
curl -X POST http://localhost:3001/suggestions/generate \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "ticket-id",
    "model": "gpt-4-turbo-preview"
  }'
```

## Future Integrations

This platform is designed to integrate with:

1. **embed-chat-widget-platform**: Add live chat widget support
   - Real-time messaging
   - Visitor tracking
   - Proactive chat triggers

2. **unified-notification-hub**: Multi-channel notifications
   - Email notifications to agents
   - SMS alerts for urgent tickets
   - Push notifications
   - Slack/Teams integration

## Development

### Database Migrations

```bash
cd backend
npm run prisma:migrate  # Create and apply migration
npm run prisma:generate # Generate Prisma Client
npm run prisma:studio   # Open Prisma Studio
```

### Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm run test
```

### Linting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Production Deployment

### Build the applications

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Environment Variables for Production

Ensure the following are properly configured:
- Database connection with SSL
- Redis connection with password
- OpenAI API key with rate limiting
- CORS settings for frontend domain
- Secure session secrets

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issue tracker.

## Roadmap

- [ ] Real-time updates with WebSockets
- [ ] Advanced analytics and reporting
- [ ] Knowledge base integration
- [ ] Canned responses library
- [ ] SLA management and tracking
- [ ] Customer satisfaction surveys
- [ ] Multi-language support
- [ ] Mobile apps (iOS/Android)
- [ ] Integration marketplace

## Authors

Built with ❤️ for better customer support
