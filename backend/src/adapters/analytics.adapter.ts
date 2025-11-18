/**
 * Analytics adapter for tracking user events and metrics
 */

export interface AnalyticsEvent {
  name: string;
  userId?: string;
  tenantId?: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export interface IAnalyticsAdapter {
  track(event: AnalyticsEvent): Promise<void>;
  identify(userId: string, traits?: Record<string, any>): Promise<void>;
  page(userId: string, pageName: string, properties?: Record<string, any>): Promise<void>;
}

/**
 * Console analytics adapter (for development)
 */
export class ConsoleAnalyticsAdapter implements IAnalyticsAdapter {
  async track(event: AnalyticsEvent): Promise<void> {
    console.log('[ANALYTICS] Track:', event);
  }

  async identify(userId: string, traits?: Record<string, any>): Promise<void> {
    console.log('[ANALYTICS] Identify:', { userId, traits });
  }

  async page(userId: string, pageName: string, properties?: Record<string, any>): Promise<void> {
    console.log('[ANALYTICS] Page:', { userId, pageName, properties });
  }
}

/**
 * Segment/Mixpanel adapter (stub)
 */
export class SegmentAnalyticsAdapter implements IAnalyticsAdapter {
  constructor(private writeKey: string) {}

  async track(event: AnalyticsEvent): Promise<void> {
    // Would integrate with Segment API
    console.log('[SEGMENT] Tracking event:', event.name);
  }

  async identify(userId: string, traits?: Record<string, any>): Promise<void> {
    console.log('[SEGMENT] Identifying user:', userId);
  }

  async page(userId: string, pageName: string, properties?: Record<string, any>): Promise<void> {
    console.log('[SEGMENT] Page view:', pageName);
  }
}
