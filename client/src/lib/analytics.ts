import { UAParser } from 'ua-parser-js';
import { config } from './config';

interface ClientAnalytics {
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelRatio: number;
  };
  viewport: {
    width: number;
    height: number;
  };
  timezone: string;
  language: string;
  languages: string[];
  cookies: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  serviceWorker: boolean;
  pushNotifications: boolean;
  connection: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  } | null;
  performance: {
    navigationStart: number;
    loadEventEnd: number;
    domContentLoaded: number;
  };
  session: {
    startTime: number;
    pageViews: number;
    interactions: number;
  };
}

interface AnalyticsEvent {
  sessionId: string;
  eventType: 'page_view' | 'page_load' | 'user_action' | 'error' | 'visibility_change';
  eventData?: Record<string, any>;
  timestamp: string;
  url: string;
  userAgent: string;
  client: ClientAnalytics;
}

class Analytics {
  private sessionId: string;
  private sessionStartTime: number;
  private pageViews: number = 0;
  private interactions: number = 0;
  private correlationId: string | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.trackPageView();
    this.setupEventListeners();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getClientAnalytics(): ClientAnalytics {
    const userAgent = navigator.userAgent;
    const parser = new UAParser(userAgent);
    parser.getResult();

    return {
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio || 1,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      languages: Array.from(navigator.languages || [navigator.language]),
      cookies: navigator.cookieEnabled,
      localStorage: this.testLocalStorage(),
      sessionStorage: this.testSessionStorage(),
      indexedDB: this.testIndexedDB(),
      serviceWorker: 'serviceWorker' in navigator,
      pushNotifications: 'Notification' in window,
      connection: this.getConnectionInfo(),
      performance: this.getPerformanceInfo(),
      session: {
        startTime: this.sessionStartTime,
        pageViews: this.pageViews,
        interactions: this.interactions,
      },
    };
  }

  private testLocalStorage(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private testSessionStorage(): boolean {
    try {
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private testIndexedDB(): boolean {
    return 'indexedDB' in window;
  }

  private getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      return {
        effectiveType: conn.effectiveType || 'unknown',
        downlink: conn.downlink || 0,
        rtt: conn.rtt || 0,
      };
    }
    return null;
  }

  private getPerformanceInfo() {
    if ('performance' in window && 'timing' in performance) {
      const timing = (performance as any).timing;
      return {
        navigationStart: timing.navigationStart || 0,
        loadEventEnd: timing.loadEventEnd || 0,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart || 0,
      };
    }
    return {
      navigationStart: 0,
      loadEventEnd: 0,
      domContentLoaded: 0,
    };
  }

  private setupEventListeners(): void {
    window.addEventListener('popstate', () => this.trackPageView());
    document.addEventListener('click', () => this.trackInteraction());
    document.addEventListener('keydown', () => this.trackInteraction());
    document.addEventListener('scroll', this.debounce(() => this.trackInteraction(), 1000) as EventListener);
    window.addEventListener('load', () => this.trackPageLoad());
    document.addEventListener('visibilitychange', () => this.trackVisibilityChange());
  }

  private debounce(func: Function, wait: number): Function {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  private trackPageView(): void {
    this.pageViews++;
    this.sendAnalytics('page_view', {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
    });
  }

  private trackInteraction(): void {
    this.interactions++;
  }

  private trackPageLoad(): void {
    this.sendAnalytics('page_load', {
      loadTime: Date.now() - this.sessionStartTime,
    });
  }

  private trackVisibilityChange(): void {
    this.sendAnalytics('visibility_change', {
      hidden: document.hidden,
    });
  }

  public trackEvent(eventName: string, data: any = {}): void {
    this.sendAnalytics(eventName as any, data);
  }

  public trackError(error: Error, context?: any): void {
    this.sendAnalytics('error', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
    });
  }

  public trackUserAction(action: string, data: any = {}): void {
    this.sendAnalytics('user_action', {
      action,
      ...data,
    });
  }

  public setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
  }

  private async sendAnalytics(eventType: AnalyticsEvent['eventType'], eventData: any = {}): Promise<void> {
    try {
      const analytics = this.getClientAnalytics();
      const payload: AnalyticsEvent = {
        sessionId: this.sessionId,
        eventType,
        eventData,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        client: analytics,
      };
      const response = await fetch(`${config.apiBaseUrl}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-correlation-id': this.correlationId || '',
        },
        body: JSON.stringify(payload),
      });
      const responseCorrelationId = response.headers.get('x-correlation-id');
      if (responseCorrelationId && !this.correlationId) {
        this.correlationId = responseCorrelationId;
      }
      if (!response.ok) {
        console.warn('Analytics request failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.warn('Analytics error:', error);
    }
  }

  public getSessionInfo() {
    return {
      sessionId: this.sessionId,
      correlationId: this.correlationId,
      pageViews: this.pageViews,
      interactions: this.interactions,
      sessionDuration: Date.now() - this.sessionStartTime,
    };
  }
}

export const analytics = new Analytics();

export default analytics;
