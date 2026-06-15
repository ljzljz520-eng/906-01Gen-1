import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { users } from '../db/mockData.ts';
import { signToken, AuthPayload } from '../middleware/auth.ts';

export const login = (req: Request, res: Response): void => {
  const { employeeId, password } = req.body || {};
  if (!employeeId || !password) {
    res.status(400).json({ error: '工号和密码均为必填项' });
    return;
  }
  const user = users.find((u) => u.employeeId === employeeId.trim().toUpperCase());
  if (!user) {
    res.status(401).json({ error: '工号或密码错误' });
    return;
  }
  const ok = bcrypt.compareSync(String(password), user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: '工号或密码错误' });
    return;
  }
  const payload: AuthPayload = {
    userId: user.id,
    employeeId: user.employeeId,
    name: user.name,
    department: user.department,
    role: user.role,
  };
  const token = signToken(payload);
  res.json({
    token,
    user: {
      id: user.id,
      employeeId: user.employeeId,
      name: user.name,
      department: user.department,
      role: user.role,
    },
  });
};

export const me = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: '未登录' });
    return;
  }
  res.json({ user: req.user });
};
