import { Injectable, Scope } from '@nestjs/common';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  tenantId?: string;
  ticketId?: string;
  [key: string]: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class Logger {
  private context: LogContext = {};
  private serviceName: string = 'app';

  constructor(serviceName?: string) {
    if (serviceName) {
      this.serviceName = serviceName;
    }
  }

  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service: this.serviceName,
      message,
      ...this.context,
      ...(meta && { meta }),
    };

    // In production, this would send to a logging service (Winston, Pino, etc.)
    // For now, we'll use structured console output
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry));
    } else {
      const color = this.getColor(level);
      console.log(
        `${color}[${timestamp}] [${level.toUpperCase()}] [${this.serviceName}]${this.reset} ${message}`,
        meta ? meta : '',
      );
    }
  }

  private getColor(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // cyan
      [LogLevel.INFO]: '\x1b[32m', // green
      [LogLevel.WARN]: '\x1b[33m', // yellow
      [LogLevel.ERROR]: '\x1b[31m', // red
    };
    return colors[level] || '';
  }

  private reset = '\x1b[0m';

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, error?: Error | any): void {
    const meta = error instanceof Error ? {
      error: error.message,
      stack: error.stack,
    } : error;
    this.log(LogLevel.ERROR, message, meta);
  }
}

// Factory function for easy logger creation
export function createLogger(serviceName: string): Logger {
  return new Logger(serviceName);
}
