import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database (Phase 3 - Comprehensive)...');

  // Create demo tenant with enhanced settings
  const tenant = await prisma.tenant.upsert({
    where: { id: 'demo-tenant' },
    update: {},
    create: {
      id: 'demo-tenant',
      name: 'Demo Company',
      timezone: 'America/New_York',
      businessHours: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
      },
      settings: {
        autoAssignment: true,
        aiSuggestionsEnabled: true,
        theme: 'light',
      },
    },
  });
  console.log('✓ Created tenant:', tenant.name);

  // Create inbox channels
  const emailChannel = await prisma.inboxChannel.upsert({
    where: { id: 'email-channel-1' },
    update: {},
    create: {
      id: 'email-channel-1',
      tenantId: tenant.id,
      type: 'email',
      addressOrConfigJson: 'support@democompany.com',
      name: 'Support Email',
      isActive: true,
      autoAssignEnabled: true,
    },
  });

  const webFormChannel = await prisma.inboxChannel.upsert({
    where: { id: 'webform-channel-1' },
    update: {},
    create: {
      id: 'webform-channel-1',
      tenantId: tenant.id,
      type: 'web_form',
      addressOrConfigJson: '{"formId": "contact-us"}',
      name: 'Website Contact Form',
      isActive: true,
    },
  });

  const widgetChannel = await prisma.inboxChannel.upsert({
    where: { id: 'widget-channel-1' },
    update: {},
    create: {
      id: 'widget-channel-1',
      tenantId: tenant.id,
      type: 'widget',
      addressOrConfigJson: '{"widgetId": "chat-widget-1"}',
      name: 'Live Chat Widget',
      isActive: true,
      autoAssignEnabled: true,
    },
  });

  console.log('✓ Created channels:', emailChannel.name, webFormChannel.name, widgetChannel.name);

  // Create agents
  const adminAgent = await prisma.agentUser.upsert({
    where: { id: 'agent-admin' },
    update: {},
    create: {
      id: 'agent-admin',
      tenantId: tenant.id,
      email: 'admin@democompany.com',
      name: 'Sarah Admin',
      role: 'admin',
      signature: 'Best regards,\nSarah\nSupport Team Lead',
      maxActiveTickets: 100,
      isActive: true,
    },
  });

  const agents = [];
  agents.push(
    await prisma.agentUser.upsert({
      where: { id: 'agent-john' },
      update: {},
      create: {
        id: 'agent-john',
        tenantId: tenant.id,
        email: 'john@democompany.com',
        name: 'John Support',
        role: 'agent',
        signature: 'Cheers,\nJohn',
        maxActiveTickets: 30,
        isActive: true,
      },
    }),
  );

  agents.push(
    await prisma.agentUser.upsert({
      where: { id: 'agent-mary' },
      update: {},
      create: {
        id: 'agent-mary',
        tenantId: tenant.id,
        email: 'mary@democompany.com',
        name: 'Mary Helper',
        role: 'agent',
        signature: 'Best,\nMary',
        maxActiveTickets: 25,
        isActive: true,
      },
    }),
  );

  agents.push(
    await prisma.agentUser.upsert({
      where: { id: 'agent-alex' },
      update: {},
      create: {
        id: 'agent-alex',
        tenantId: tenant.id,
        email: 'alex@democompany.com',
        name: 'Alex Technical',
        role: 'agent',
        signature: 'Kind regards,\nAlex\nTechnical Support',
        maxActiveTickets: 20,
        isActive: true,
      },
    }),
  );

  console.log('✓ Created agents:', adminAgent.name, ...agents.map(a => a.name));

  // Create tags
  const bugTag = await prisma.tag.upsert({
    where: { id: 'tag-bug' },
    update: {},
    create: {
      id: 'tag-bug',
      tenantId: tenant.id,
      name: 'bug',
      color: '#ef4444',
      description: 'Software bug or error',
    },
  });

  const featureTag = await prisma.tag.upsert({
    where: { id: 'tag-feature' },
    update: {},
    create: {
      id: 'tag-feature',
      tenantId: tenant.id,
      name: 'feature-request',
      color: '#3b82f6',
      description: 'New feature request',
    },
  });

  const billingTag = await prisma.tag.upsert({
    where: { id: 'tag-billing' },
    update: {},
    create: {
      id: 'tag-billing',
      tenantId: tenant.id,
      name: 'billing',
      color: '#f59e0b',
      description: 'Billing and payment related',
    },
  });

  const urgentTag = await prisma.tag.upsert({
    where: { id: 'tag-urgent' },
    update: {},
    create: {
      id: 'tag-urgent',
      tenantId: tenant.id,
      name: 'urgent',
      color: '#dc2626',
      description: 'Requires immediate attention',
    },
  });

  const vipTag = await prisma.tag.upsert({
    where: { id: 'tag-vip' },
    update: {},
    create: {
      id: 'tag-vip',
      tenantId: tenant.id,
      name: 'vip',
      color: '#8b5cf6',
      description: 'VIP customer',
    },
  });

  console.log('✓ Created tags:', bugTag.name, featureTag.name, billingTag.name, urgentTag.name, vipTag.name);

  // Create canned responses
  const cannedResponses = [];

  cannedResponses.push(
    await prisma.cannedResponse.upsert({
      where: { id: 'canned-greeting' },
      update: {},
      create: {
        id: 'canned-greeting',
        tenantId: tenant.id,
        name: 'greeting',
        title: 'Greeting',
        content: 'Hi {{customerName}},\n\nThank you for reaching out to us. I\'ll be happy to help you with {{issue}}.',
        shortcuts: ['greet', 'hello'],
        category: 'General',
        usageCount: 0,
      },
    }),
  );

  cannedResponses.push(
    await prisma.cannedResponse.upsert({
      where: { id: 'canned-password-reset' },
      update: {},
      create: {
        id: 'canned-password-reset',
        tenantId: tenant.id,
        name: 'password-reset',
        title: 'Password Reset Instructions',
        content: 'To reset your password:\n\n1. Go to the login page\n2. Click "Forgot Password"\n3. Enter your email address\n4. Check your inbox for reset link\n\nLet me know if you need further assistance!',
        shortcuts: ['pwd', 'password'],
        category: 'Account',
        usageCount: 12,
      },
    }),
  );

  cannedResponses.push(
    await prisma.cannedResponse.upsert({
      where: { id: 'canned-closing' },
      update: {},
      create: {
        id: 'canned-closing',
        tenantId: tenant.id,
        name: 'closing',
        title: 'Closing Message',
        content: 'I\'m glad I could help! Is there anything else you need assistance with?\n\nIf your issue is resolved, please feel free to close this ticket.',
        shortcuts: ['close', 'done'],
        category: 'General',
        usageCount: 45,
      },
    }),
  );

  cannedResponses.push(
    await prisma.cannedResponse.upsert({
      where: { id: 'canned-billing' },
      update: {},
      create: {
        id: 'canned-billing',
        tenantId: tenant.id,
        name: 'billing-inquiry',
        title: 'Billing Inquiry Response',
        content: 'Thank you for your billing inquiry. I\'ve reviewed your account and {{billingDetails}}. Your next billing date is {{nextBillingDate}}.\n\nIf you have any questions about the charges, I\'m here to help!',
        shortcuts: ['bill', 'billing'],
        category: 'Billing',
        usageCount: 28,
      },
    }),
  );

  console.log('✓ Created canned responses:', cannedResponses.length);

  // Create tickets with rich data
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

  // Ticket 1: Login issue (high priority, open)
  const ticket1 = await prisma.ticket.upsert({
    where: { id: 'ticket-1' },
    update: {},
    create: {
      id: 'ticket-1',
      tenantId: tenant.id,
      inboxId: emailChannel.id,
      subject: 'Cannot login to my account',
      status: 'open',
      priority: 'high',
      assignedTo: agents[0].id,
      customerEmail: 'alice@example.com',
      customerName: 'Alice Johnson',
      createdAt: threeDaysAgo,
      metadata: {
        source: 'email',
        userAgent: 'Mozilla/5.0',
        ipAddress: '192.168.1.100',
      },
      messages: {
        create: [
          {
            fromRole: 'user',
            fromEmail: 'alice@example.com',
            fromName: 'Alice Johnson',
            body: 'Hi, I have been trying to log into my account for the past hour but keep getting an error message saying "Invalid credentials". I am sure my password is correct. Can you help?',
            sentiment: 'negative',
            createdAt: threeDaysAgo,
          },
          {
            fromRole: 'agent',
            body: 'Hi Alice, thank you for reaching out. I would be happy to help you with this login issue. Let me check your account status. Could you please confirm the email address associated with your account?',
            createdAt: new Date(threeDaysAgo.getTime() + 30 * 60 * 1000),
          },
          {
            fromRole: 'user',
            fromEmail: 'alice@example.com',
            fromName: 'Alice Johnson',
            body: 'Yes, it is alice@example.com',
            sentiment: 'neutral',
            createdAt: new Date(threeDaysAgo.getTime() + 45 * 60 * 1000),
          },
        ],
      },
    },
  });

  // Add tags to ticket 1
  await prisma.ticketTag.create({
    data: { ticketId: ticket1.id, tagId: bugTag.id },
  });
  await prisma.ticketTag.create({
    data: { ticketId: ticket1.id, tagId: urgentTag.id },
  });

  // Add note to ticket 1
  await prisma.ticketNote.create({
    data: {
      ticketId: ticket1.id,
      agentId: agents[0].id,
      content: 'User account was locked due to multiple failed login attempts. Unlocked and sent password reset email.',
    },
  });

  // Ticket 2: Billing question (medium priority, pending)
  const ticket2 = await prisma.ticket.upsert({
    where: { id: 'ticket-2' },
    update: {},
    create: {
      id: 'ticket-2',
      tenantId: tenant.id,
      inboxId: webFormChannel.id,
      subject: 'Billing question about recent invoice',
      status: 'pending',
      priority: 'medium',
      assignedTo: agents[1].id,
      customerEmail: 'bob@company.com',
      customerName: 'Bob Smith',
      firstResponseAt: new Date(fiveDaysAgo.getTime() + 2 * 60 * 60 * 1000),
      createdAt: fiveDaysAgo,
      metadata: {
        source: 'web_form',
        referrer: 'https://example.com/pricing',
      },
      messages: {
        create: [
          {
            fromRole: 'user',
            fromEmail: 'bob@company.com',
            fromName: 'Bob Smith',
            body: 'I received an invoice yesterday but I do not understand some of the charges. Can someone explain the "Service Fee" line item?',
            sentiment: 'neutral',
            createdAt: fiveDaysAgo,
          },
          {
            fromRole: 'agent',
            body: 'Hello Bob, thank you for contacting us. The Service Fee covers our platform maintenance and support services. I will send you a detailed breakdown via email within the next hour.',
            createdAt: new Date(fiveDaysAgo.getTime() + 2 * 60 * 60 * 1000),
          },
        ],
      },
    },
  });

  await prisma.ticketTag.create({
    data: { ticketId: ticket2.id, tagId: billingTag.id },
  });

  // Ticket 3: Feature request (low priority, open)
  const ticket3 = await prisma.ticket.upsert({
    where: { id: 'ticket-3' },
    update: {},
    create: {
      id: 'ticket-3',
      tenantId: tenant.id,
      inboxId: emailChannel.id,
      subject: 'Feature request: Dark mode',
      status: 'open',
      priority: 'low',
      customerEmail: 'charlie@startup.io',
      customerName: 'Charlie Dev',
      createdAt: sevenDaysAgo,
      messages: {
        create: [
          {
            fromRole: 'user',
            fromEmail: 'charlie@startup.io',
            fromName: 'Charlie Dev',
            body: 'It would be great if your application had a dark mode option. I often work late at night and the bright interface is hard on my eyes.',
            sentiment: 'positive',
            createdAt: sevenDaysAgo,
          },
        ],
      },
    },
  });

  await prisma.ticketTag.create({
    data: { ticketId: ticket3.id, tagId: featureTag.id },
  });

  await prisma.suggestedReply.create({
    data: {
      ticketId: ticket3.id,
      model: 'gpt-4-turbo-preview',
      suggestionText: 'Thank you for your feature request! Dark mode is actually on our roadmap for Q2 2024. We recognize that many users work in low-light environments and would benefit from this feature. I will add your vote to this feature request. In the meantime, you might want to try using a browser extension that can apply dark mode to websites. Would you like me to recommend a few?',
    },
  });

  // Ticket 4: Data export (urgent, closed)
  const ticket4 = await prisma.ticket.upsert({
    where: { id: 'ticket-4' },
    update: {},
    create: {
      id: 'ticket-4',
      tenantId: tenant.id,
      inboxId: emailChannel.id,
      subject: 'Data export not working',
      status: 'closed',
      priority: 'urgent',
      assignedTo: adminAgent.id,
      customerEmail: 'diana@enterprise.com',
      customerName: 'Diana Manager',
      firstResponseAt: new Date(tenDaysAgo.getTime() + 15 * 60 * 1000),
      resolvedAt: new Date(tenDaysAgo.getTime() + 3 * 60 * 60 * 1000),
      createdAt: tenDaysAgo,
      metadata: {
        source: 'email',
        urgency: 'high',
        companySize: 'enterprise',
      },
      messages: {
        create: [
          {
            fromRole: 'user',
            fromEmail: 'diana@enterprise.com',
            fromName: 'Diana Manager',
            body: 'URGENT: I need to export our data for a compliance audit tomorrow, but the export button is not responding. Please help immediately.',
            sentiment: 'negative',
            createdAt: tenDaysAgo,
          },
          {
            fromRole: 'agent',
            body: 'Hi Diana, I understand the urgency. I am looking into this right now. Could you let me know which browser you are using?',
            createdAt: new Date(tenDaysAgo.getTime() + 15 * 60 * 1000),
          },
          {
            fromRole: 'user',
            fromEmail: 'diana@enterprise.com',
            fromName: 'Diana Manager',
            body: 'Chrome, latest version.',
            sentiment: 'neutral',
            createdAt: new Date(tenDaysAgo.getTime() + 25 * 60 * 1000),
          },
          {
            fromRole: 'agent',
            body: 'Thank you. I found the issue - there was a bug in our latest release. I have applied a hotfix and the export should work now. Please try again and let me know if you encounter any issues.',
            createdAt: new Date(tenDaysAgo.getTime() + 2 * 60 * 60 * 1000),
          },
          {
            fromRole: 'user',
            fromEmail: 'diana@enterprise.com',
            fromName: 'Diana Manager',
            body: 'It works now! Thank you so much for the quick response!',
            sentiment: 'positive',
            createdAt: new Date(tenDaysAgo.getTime() + 2.5 * 60 * 60 * 1000),
          },
          {
            fromRole: 'system',
            body: 'Ticket closed automatically after resolution confirmation.',
            createdAt: new Date(tenDaysAgo.getTime() + 3 * 60 * 60 * 1000),
          },
        ],
      },
    },
  });

  await prisma.ticketTag.create({
    data: { ticketId: ticket4.id, tagId: bugTag.id },
  });
  await prisma.ticketTag.create({
    data: { ticketId: ticket4.id, tagId: vipTag.id },
  });

  // Add history to ticket 4
  await prisma.ticketHistory.create({
    data: {
      ticketId: ticket4.id,
      agentId: adminAgent.id,
      action: 'priority_changed',
      fieldName: 'priority',
      oldValue: 'high',
      newValue: 'urgent',
      description: 'Priority escalated due to compliance deadline',
      createdAt: new Date(tenDaysAgo.getTime() + 10 * 60 * 1000),
    },
  });

  await prisma.ticketHistory.create({
    data: {
      ticketId: ticket4.id,
      agentId: adminAgent.id,
      action: 'status_changed',
      fieldName: 'status',
      oldValue: 'open',
      newValue: 'closed',
      description: 'Issue resolved - hotfix applied',
      createdAt: new Date(tenDaysAgo.getTime() + 3 * 60 * 60 * 1000),
    },
  });

  console.log('✓ Created tickets with tags, notes, and history');

  console.log('');
  console.log('✅ Phase 3 Seed completed successfully!');
  console.log('');
  console.log('📊 Data Summary:');
  console.log('  Tenant: demo-tenant (Demo Company)');
  console.log('  Channels: 3 (email, web_form, widget)');
  console.log('  Agents: 4 (1 admin, 3 agents)');
  console.log('  Tags: 5 (bug, feature-request, billing, urgent, vip)');
  console.log('  Canned Responses: 4 with variable substitution');
  console.log('  Tickets: 4 with full conversation threads');
  console.log('  - Tagged tickets with multiple tags');
  console.log('  - Internal notes on tickets');
  console.log('  - Audit history tracking');
  console.log('  - AI sentiment analysis');
  console.log('');
  console.log('🎯 Vertical Slices Available:');
  console.log('  1. Ticket Management (CRUD with tags)');
  console.log('  2. Canned Responses (create, use with variables)');
  console.log('  3. Tag Management (apply to tickets, search)');
  console.log('');
  console.log('Demo URLs:');
  console.log('  http://localhost:3000/tickets - View all tickets');
  console.log('  http://localhost:3000/tickets/ticket-1 - View ticket with tags');
  console.log('  http://localhost:3000/admin - Manage agents & channels');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
