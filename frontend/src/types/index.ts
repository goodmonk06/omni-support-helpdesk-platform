export type TicketStatus = 'open' | 'pending' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type MessageRole = 'user' | 'agent' | 'system';
export type ChannelType = 'email' | 'web_form' | 'widget';
export type AgentRole = 'admin' | 'agent';

export interface Ticket {
  id: string;
  tenantId: string;
  inboxId: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  inboxChannel?: InboxChannel;
  assignedAgent?: AgentUser;
  suggestedReplies?: SuggestedReply[];
}

export interface Message {
  id: string;
  ticketId: string;
  fromRole: MessageRole;
  fromEmail?: string;
  fromName?: string;
  body: string;
  createdAt: string;
}

export interface SuggestedReply {
  id: string;
  ticketId: string;
  messageId?: string;
  model: string;
  suggestionText: string;
  createdAt: string;
}

export interface InboxChannel {
  id: string;
  tenantId: string;
  type: ChannelType;
  addressOrConfigJson: string;
  name?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgentUser {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: AgentRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TicketStats {
  total: number;
  open: number;
  pending: number;
  closed: number;
}
