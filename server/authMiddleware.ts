import type { Request, Response, NextFunction } from 'express';
import { verifyToken, type JwtPayload } from './jwt';
import { storage } from './storage';

export interface AuthLocals {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    approved: boolean;
    avatarUrl: string | null;
    createdAt: Date;
  };
}

function stripPasswordHash<T extends { passwordHash?: unknown; supabaseId?: unknown }>(raw: T): Omit<T, 'passwordHash' | 'supabaseId'> {
  const { passwordHash: _, supabaseId: __, ...rest } = raw;
  return rest as Omit<T, 'passwordHash' | 'supabaseId'>;
}

/** Attach user to res.locals if valid Bearer token. Does not send 401. */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
  const user = await storage.getUserById(payload.userId);
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }
  (res as any).locals.user = stripPasswordHash(user);
  next();
}

/** Use after requireAuth. Restricts by role. */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (res as any).locals?.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!roles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
}
