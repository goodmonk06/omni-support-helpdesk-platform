/**
 * Domain events for the helpdesk system
 * These events can be used to trigger side effects, webhooks, integrations, etc.
 */

export interface DomainEvent {
  type: string;
  timestamp: Date;
  tenantId: string;
  metadata?: Record<string, any>;
}

export interface TicketCreatedEvent extends DomainEvent {
  type: 'ticket.created';
  ticketId: string;
  subject: string;
  priority: string;
  inboxId: string;
  customerEmail?: string;
}

export interface TicketAssignedEvent extends DomainEvent {
  type: 'ticket.assigned';
  ticketId: string;
  assignedTo: string;
  assignedBy?: string;
}

export interface TicketStatusChangedEvent extends DomainEvent {
  type: 'ticket.status_changed';
  ticketId: string;
  oldStatus: string;
  newStatus: string;
  changedBy?: string;
}

export interface TicketPriorityChangedEvent extends DomainEvent {
  type: 'ticket.priority_changed';
  ticketId: string;
  oldPriority: string;
  newPriority: string;
  changedBy?: string;
}

export interface TicketClosedEvent extends DomainEvent {
  type: 'ticket.closed';
  ticketId: string;
  closedBy?: string;
  resolutionTime?: number; // milliseconds from creation to close
}

export interface MessageReceivedEvent extends DomainEvent {
  type: 'message.received';
  ticketId: string;
  messageId: string;
  fromRole: string;
  isFirstMessage: boolean;
}

export interface MessageSentEvent extends DomainEvent {
  type: 'message.sent';
  ticketId: string;
  messageId: string;
  agentId: string;
  isFirstResponse: boolean;
}

export interface TicketTaggedEvent extends DomainEvent {
  type: 'ticket.tagged';
  ticketId: string;
  tagId: string;
  tagName: string;
}

export type HelpdeskEvent =
  | TicketCreatedEvent
  | TicketAssignedEvent
  | TicketStatusChangedEvent
  | TicketPriorityChangedEvent
  | TicketClosedEvent
  | MessageReceivedEvent
  | MessageSentEvent
  | TicketTaggedEvent;

/**
 * Event handler interface
 */
export interface EventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void> | void;
}

/**
 * Simple event bus for domain events
 */
class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  /**
   * Register an event handler
   */
  on<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler as EventHandler);
    this.handlers.set(eventType, handlers);
  }

  /**
   * Emit an event to all registered handlers
   */
  async emit(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];

    // Execute handlers in parallel
    await Promise.all(
      handlers.map(async (handler) => {
        try {
          await handler.handle(event);
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error);
        }
      }),
    );
  }

  /**
   * Remove all handlers for an event type
   */
  off(eventType: string): void {
    this.handlers.delete(eventType);
  }

  /**
   * Clear all event handlers
   */
  clear(): void {
    this.handlers.clear();
  }
}

// Singleton event bus
export const eventBus = new EventBus();
