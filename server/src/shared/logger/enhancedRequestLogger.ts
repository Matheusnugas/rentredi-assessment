import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UAParser } from 'ua-parser-js';
import logger from './index';

interface ClientInfo {
  ip: string;
  userAgent: string;
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  device: {
    type: string;
    model: string;
    vendor: string;
  };
  engine: {
    name: string;
    version: string;
  };
  language: string;
  referer: string;
  origin: string;
  acceptEncoding: string;
  acceptLanguage: string;
}

interface RequestMetadata {
  method: string;
  url: string;
  path: string;
  query: Record<string, any>;
  params: Record<string, any>;
  bodySize: number;
  responseTime: number;
  statusCode: number;
  contentLength: number;
  correlationId: string;
  timestamp: string;
}

function getClientIP(req: Request): string {
  const ip = req.headers['x-forwarded-for'] ||
             req.headers['x-real-ip'] ||
             req.headers['x-client-ip'] ||
             req.headers['cf-connecting-ip'] ||
             req.connection?.remoteAddress ||
             req.socket?.remoteAddress ||
             req.ip ||
             'unknown';

  if (typeof ip === 'string' && ip.includes(',')) {
    return ip.split(',')[0].trim();
  }

  return typeof ip === 'string' ? ip : 'unknown';
}

function extractClientInfo(req: Request): ClientInfo {
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const result = UAParser(userAgent);

  return {
    ip: getClientIP(req),
    userAgent,
    browser: {
      name: result.browser.name || 'Unknown',
      version: result.browser.version || 'Unknown',
    },
    os: {
      name: result.os.name || 'Unknown',
      version: result.os.version || 'Unknown',
    },
    device: {
      type: result.device.type || 'desktop',
      model: result.device.model || 'Unknown',
      vendor: result.device.vendor || 'Unknown',
    },
    engine: {
      name: result.engine.name || 'Unknown',
      version: result.engine.version || 'Unknown',
    },
    language: req.headers['accept-language'] || 'Unknown',
    referer: req.headers.referer || 'Direct',
    origin: req.headers.origin || 'Unknown',
    acceptEncoding: req.headers['accept-encoding'] || 'Unknown',
    acceptLanguage: req.headers['accept-language'] || 'Unknown',
  };
}

function extractRequestMetadata(req: Request, res: Response, startTime: number): RequestMetadata {
  const endTime = Date.now();
  const responseTime = endTime - startTime;

  return {
    method: req.method,
    url: req.originalUrl || req.url,
    path: req.path,
    query: req.query,
    params: req.params,
    bodySize: req.headers['content-length'] ? parseInt(req.headers['content-length']) : 0,
    responseTime,
    statusCode: res.statusCode,
    contentLength: parseInt(res.get('content-length') || '0'),
    correlationId: req.headers['x-correlation-id'] as string || uuidv4(),
    timestamp: new Date().toISOString(),
  };
}

export const enhancedRequestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);

  const originalEnd = res.end;
  const originalJson = res.json;

  res.end = function(chunk?: any, encoding?: any): Response {
    const clientInfo = extractClientInfo(req);
    const metadata = extractRequestMetadata(req, res, startTime);

    logger.info({
      correlationId,
      client: clientInfo,
      request: metadata,
      security: {
        hasHttps: req.secure,
        hasCors: !!req.headers.origin,
        userAgent: clientInfo.userAgent,
        forwardedFor: req.headers['x-forwarded-for'],
        realIp: req.headers['x-real-ip'],
        clientIp: req.headers['x-client-ip'],
      },
      performance: {
        responseTime: metadata.responseTime,
        contentLength: metadata.contentLength,
        bodySize: metadata.bodySize,
      },
    }, `Request processed: ${req.method} ${req.path} - ${res.statusCode} (${metadata.responseTime}ms)`);

    return originalEnd.call(this, chunk, encoding);
  };

  res.json = function(body: any) {
    const clientInfo = extractClientInfo(req);
    const metadata = extractRequestMetadata(req, res, startTime);

    logger.info({
      correlationId,
      client: clientInfo,
      request: metadata,
      security: {
        hasHttps: req.secure,
        hasCors: !!req.headers.origin,
        userAgent: clientInfo.userAgent,
        forwardedFor: req.headers['x-forwarded-for'],
        realIp: req.headers['x-real-ip'],
        clientIp: req.headers['x-client-ip'],
      },
      performance: {
        responseTime: metadata.responseTime,
        contentLength: metadata.contentLength,
        bodySize: metadata.bodySize,
      },
    }, `Request processed: ${req.method} ${req.path} - ${res.statusCode} (${metadata.responseTime}ms)`);

    return originalJson.call(this, body);
  };

  next();
};

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  const clientInfo = extractClientInfo(req);
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();

  logger.error({
    correlationId,
    client: clientInfo,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    request: {
      method: req.method,
      url: req.originalUrl || req.url,
      path: req.path,
      headers: {
        'user-agent': req.headers['user-agent'],
        'referer': req.headers.referer,
        'origin': req.headers.origin,
      },
    },
  }, `Request error: ${error.message}`);

  next(error);
};
