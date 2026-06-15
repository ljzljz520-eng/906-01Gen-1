import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from '../types/index.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'industrial-drawing-secret-2025';

export interface AuthPayload {
  userId: string;
  employeeId: string;
  name: string;
  department: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const signToken = (payload: AuthPayload, expiresIn: any = '24h'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: '未提供有效认证凭证' });
    return;
  }
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: '认证凭证已失效或无效' });
  }
};

export const roleMiddleware = (...roles: UserRole[]) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: '未登录' });
    return;
  }
  if (!roles.includes(req.user.role)) {
    res.status(403).json({ error: '权限不足' });
    return;
  }
  next();
};
