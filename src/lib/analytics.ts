/**
 * Simple analytics utility for cross-environment event tracking.
 * Provides isomorphic context fallback isolating Pino (Server) from Window.Console (Browser).
 */
import pino from 'pino';

const isServer = typeof window === 'undefined';
const logger = isServer ? pino() : console;

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, unknown>;
}

/**
 * Globally exportable tracker routing custom analytic payloads accurately without runtime hydration mismatches.
 */
export function trackEvent({ eventName, properties }: AnalyticsEvent): void {
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...properties,
  };

  if (isServer) {
     (logger as pino.Logger).info({ analytics: true, ...payload }, 'Analytics Event Triggered');
  } else {
     // Isolate warnings via eslint overrides to permit browser console executions safely
     // eslint-disable-next-line no-console
     console.info('[Analytics Event]', payload);
  }
}
