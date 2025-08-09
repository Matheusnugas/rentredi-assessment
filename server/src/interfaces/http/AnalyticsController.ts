import { Request, Response, NextFunction } from 'express';
import logger from '../../shared/logger';

interface AnalyticsEvent {
  sessionId: string;
  eventType: 'page_view' | 'page_load' | 'user_action' | 'error' | 'visibility_change';
  eventData?: Record<string, any>;
  timestamp: string;
  url: string;
  userAgent: string;
  client: {
    screen: { width: number; height: number; colorDepth: number; pixelRatio: number };
    viewport: { width: number; height: number };
    timezone: string;
    language: string;
    languages: string[];
    cookies: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    serviceWorker: boolean;
    pushNotifications: boolean;
    connection: { effectiveType: string; downlink: number; rtt: number } | null;
    performance: { navigationStart: number; loadEventEnd: number; domContentLoaded: number };
    session: { startTime: number; pageViews: number; interactions: number };
  };
}

export class AnalyticsController {
  /**
   * @swagger
   * /api/analytics:
   *   post:
   *     summary: Receive frontend analytics data
   *     description: Receives and logs frontend analytics events with correlation IDs
   *     tags: [Analytics]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               sessionId:
   *                 type: string
   *               eventType:
   *                 type: string
   *                 enum: [page_view, page_load, user_action, error, visibility_change]
   *               eventData:
   *                 type: object
   *               timestamp:
   *                 type: string
   *                 format: date-time
   *               url:
   *                 type: string
   *               userAgent:
   *                 type: string
   *               client:
   *                 type: object
   *     responses:
   *       200:
   *         description: Analytics data received successfully
   *         headers:
   *           x-correlation-id:
   *             description: Correlation ID for tracing
   *             schema:
   *               type: string
   *       400:
   *         description: Invalid analytics data
   */
  async receiveAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const correlationId = req.headers['x-correlation-id'] as string || 'no-correlation-id';
      const analyticsData: AnalyticsEvent = req.body;

      logger.info({
        correlationId,
        logType: 'frontend_analytics',
        sessionId: analyticsData.sessionId,
        eventType: analyticsData.eventType,
        url: analyticsData.url,
        timestamp: analyticsData.timestamp,
        eventData: analyticsData.eventData,
        client: {
          screen: analyticsData.client.screen,
          viewport: analyticsData.client.viewport,
          timezone: analyticsData.client.timezone,
          language: analyticsData.client.language,
          browserCapabilities: {
            cookies: analyticsData.client.cookies,
            localStorage: analyticsData.client.localStorage,
            sessionStorage: analyticsData.client.sessionStorage,
            indexedDB: analyticsData.client.indexedDB,
            serviceWorker: analyticsData.client.serviceWorker,
            pushNotifications: analyticsData.client.pushNotifications,
          },
          connection: analyticsData.client.connection,
          performance: analyticsData.client.performance,
          session: analyticsData.client.session,
        },
        userAgent: analyticsData.userAgent,
        clientIP: req.ip,
        requestHeaders: {
          'user-agent': req.headers['user-agent'],
          'accept-language': req.headers['accept-language'],
          referer: req.headers.referer,
          origin: req.headers.origin,
        },
      }, 'Frontend analytics event received');

      res.setHeader('x-correlation-id', correlationId);
      
      res.success(
        {
          received: true,
          correlationId,
          sessionId: analyticsData.sessionId,
          eventType: analyticsData.eventType,
        },
        'Analytics data received successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}
