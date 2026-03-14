import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { storage } from './storage';
import { signToken } from './jwt';
import { requireAuth, requireRole } from './authMiddleware';

const router = Router();

function stripUser(raw: { passwordHash?: unknown; supabaseId?: unknown; [k: string]: unknown }) {
  const { passwordHash: _, supabaseId: __, ...rest } = raw;
  return rest;
}

// Register: email, password, name, role
router.post('/register', async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      name: z.string().min(1, 'Name is required'),
      role: z.enum(['volunteer', 'oah']),
    });
    const { email, password, name, role } = schema.parse(req.body);

    const existing = await storage.getUserByEmail(email);
    if (existing) {
      res.status(400).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const approved = role === 'volunteer';
    const user = await storage.createUser({
      email,
      name,
      role,
      passwordHash,
      approved,
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.status(201).json({ user: stripUser(user), token });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors?.[0]?.message || 'Validation failed' });
      return;
    }
    res.status(500).json({ error: error.message });
  }
});

// Login: email, password
router.post('/login', async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });
    const { email, password } = schema.parse(req.body);

    const user = await storage.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.json({ user: stripUser(user), token });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    res.status(500).json({ error: error.message });
  }
});

// Current user (requires Bearer token)
router.get('/me', requireAuth, (req, res) => {
  const user = (res as any).locals.user;
  res.json(user);
});

export default router;
