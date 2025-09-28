import { NextResponse } from 'next/server';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public field: string;

  constructor(field: string, message: string) {
    super(message, 400);
    this.field = field;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
  }
}

/**
 * Global error handler for API routes
 */
export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        ...(error instanceof ValidationError && { field: error.field }),
      },
      { status: error.statusCode }
    );
  }

  // Handle Stripe errors
  if (error && typeof error === 'object' && 'type' in error) {
    const stripeError = error as any;
    if (stripeError.type === 'StripeCardError') {
      return NextResponse.json(
        { error: 'Card was declined' },
        { status: 400 }
      );
    }
    if (stripeError.type === 'StripeRateLimitError') {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
  }

  // Handle database errors
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as any;
    if (dbError.code === 'PGRST301') {
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 503 }
      );
    }
  }

  // Generic error
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

/**
 * Safe async route handler wrapper
 */
export function withErrorHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: Record<string, any>) {
  const errorInfo = {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
  };

  console.error('Application Error:', JSON.stringify(errorInfo, null, 2));

  // In production, send to error monitoring service
  // Example: Sentry, LogRocket, etc.
}

/**
 * Validate environment variables
 */
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const required = [
    'NEXT_PUBLIC_URL',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
  ];

  const optional = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'FARCASTER_APP_FID',
    'FARCASTER_APP_MNEMONIC',
  ];

  const errors: string[] = [];

  required.forEach(key => {
    if (!process.env[key]) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  });

  // Validate URLs
  if (process.env.NEXT_PUBLIC_URL && !isValidUrl(process.env.NEXT_PUBLIC_URL)) {
    errors.push('NEXT_PUBLIC_URL must be a valid URL');
  }

  // Validate Redis URL
  if (process.env.UPSTASH_REDIS_REST_URL &&
      !process.env.UPSTASH_REDIS_REST_URL.includes('upstash.io')) {
    errors.push('UPSTASH_REDIS_REST_URL must be a valid Upstash Redis URL');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if string is a valid URL
 */
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Health check function
 */
export async function healthCheck(): Promise<{
  status: 'healthy' | 'unhealthy';
  checks: Record<string, boolean>;
  errors: string[];
}> {
  const checks: Record<string, boolean> = {};
  const errors: string[] = [];

  // Environment check
  const envCheck = validateEnvironment();
  checks.environment = envCheck.valid;
  if (!envCheck.valid) {
    errors.push(...envCheck.errors);
  }

  // Database check (Redis)
  try {
    // Would implement actual Redis ping
    checks.database = true;
  } catch (error) {
    checks.database = false;
    errors.push('Database connection failed');
  }

  // External services check
  try {
    // Would check Stripe, Farcaster, etc.
    checks.external_services = true;
  } catch (error) {
    checks.external_services = false;
    errors.push('External services check failed');
  }

  return {
    status: errors.length === 0 ? 'healthy' : 'unhealthy',
    checks,
    errors,
  };
}

