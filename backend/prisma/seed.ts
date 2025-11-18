import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'demo-tenant' },
    update: {},
    create: {
      id: 'demo-tenant',
      name: 'Demo Company',
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

  console.log('✓ Created channels:', emailChannel.name, webFormChannel.name);

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
      isActive: true,
    },
  });

  const supportAgent1 = await prisma.agentUser.upsert({
    where: { id: 'agent-john' },
    update: {},
    create: {
      id: 'agent-john',
      tenantId: tenant.id,
      email: 'john@democompany.com',
      name: 'John Support',
      role: 'agent',
      isActive: true,
    },
  });

  const supportAgent2 = await prisma.agentUser.upsert({
    where: { id: 'agent-mary' },
    update: {},
    create: {
      id: 'agent-mary',
      tenantId: tenant.id,
      email: 'mary@democompany.com',
      name: 'Mary Helper',
      role: 'agent',
      isActive: true,
    },
  });

  console.log('✓ Created agents:', adminAgent.name, supportAgent1.name, supportAgent2.name);

  // Create tickets with messages
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
      assignedTo: supportAgent1.id,
      messages: {
        create: [
          {
            fromRole: 'user',
            fromEmail: 'customer1@example.com',
            fromName: 'Alice Johnson',
            body: 'Hi, I have been trying to log into my account for the past hour but keep getting an error message saying "Invalid credentials". I am sure my password is correct. Can you help?',
          },
          {
            fromRole: 'agent',
            body: 'Hi Alice, thank you for reaching out. I would be happy to help you with this login issue. Let me check your account status. Could you please confirm the email address associated with your account?',
          },
          {
            fromRole: 'user',
            fromEmail: 'customer1@example.com',
            fromName: 'Alice Johnson',
            body: 'Yes, it is customer1@example.com',
          },
        ],
      },
    },
  });

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
      assignedTo: supportAgent2.id,
      messages: {
        create: [
          {
            fromRole: 'user',
            fromEmail: 'bob@company.com',
            fromName: 'Bob Smith',
            body: 'I received an invoice yesterday but I do not understand some of the charges. Can someone explain the "Service Fee" line item?',
          },
          {
            fromRole: 'agent',
            body: 'Hello Bob, thank you for contacting us. The Service Fee covers our platform maintenance and support services. I will send you a detailed breakdown via email within the next hour.',
          },
        ],
      },
    },
  });

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
      messages: {
        create: [
          {
            fromRole: 'user',
            fromEmail: 'charlie@startup.io',
            fromName: 'Charlie Dev',
            body: 'It would be great if your application had a dark mode option. I often work late at night and the bright interface is hard on my eyes.',
          },
        ],
      },
    },
  });

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
      messages: {
        create: [
          {
            fromRole: 'user',
            fromEmail: 'diana@enterprise.com',
            fromName: 'Diana Manager',
            body: 'URGENT: I need to export our data for a compliance audit tomorrow, but the export button is not responding. Please help immediately.',
          },
          {
            fromRole: 'agent',
            body: 'Hi Diana, I understand the urgency. I am looking into this right now. Could you let me know which browser you are using?',
          },
          {
            fromRole: 'user',
            fromEmail: 'diana@enterprise.com',
            fromName: 'Diana Manager',
            body: 'Chrome, latest version.',
          },
          {
            fromRole: 'agent',
            body: 'Thank you. I found the issue - there was a bug in our latest release. I have applied a hotfix and the export should work now. Please try again and let me know if you encounter any issues.',
          },
          {
            fromRole: 'user',
            fromEmail: 'diana@enterprise.com',
            fromName: 'Diana Manager',
            body: 'It works now! Thank you so much for the quick response!',
          },
          {
            fromRole: 'system',
            body: 'Ticket closed automatically after resolution confirmation.',
          },
        ],
      },
    },
  });

  console.log('✓ Created tickets:', ticket1.subject, ticket2.subject, ticket3.subject, ticket4.subject);

  // Create some AI suggested replies
  await prisma.suggestedReply.create({
    data: {
      ticketId: ticket3.id,
      model: 'gpt-4-turbo-preview',
      suggestionText: 'Thank you for your feature request! Dark mode is actually on our roadmap for Q2 2024. We recognize that many users work in low-light environments and would benefit from this feature. I will add your vote to this feature request. In the meantime, you might want to try using a browser extension that can apply dark mode to websites. Would you like me to recommend a few?',
    },
  });

  console.log('✓ Created sample AI suggestions');

  console.log('');
  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Tenant ID: demo-tenant');
  console.log('  Admin: admin@democompany.com (Sarah Admin)');
  console.log('  Agents: john@democompany.com, mary@democompany.com');
  console.log('');
  console.log('Demo tickets created:');
  console.log('  - 2 open tickets (high and low priority)');
  console.log('  - 1 pending ticket');
  console.log('  - 1 closed ticket');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
