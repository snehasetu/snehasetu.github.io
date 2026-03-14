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

// OAH profile fields when role is oah
const oahProfileSchema = z.object({
  homeName: z.string().min(1, 'Home name is required'),
  description: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  contactEmail: z.string().email('Valid contact email required'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  yearsEstablished: z.coerce.number().int().min(0).optional(),
});

// Register: email, password, name, role; when role=oah, oahProfile required
router.post('/register', async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      name: z.string().min(1, 'Name is required'),
      role: z.enum(['volunteer', 'oah']),
      oahProfile: z.optional(oahProfileSchema),
    });
    const parsed = schema.parse(req.body);
    const { email, password, name, role, oahProfile } = parsed;

    if (role === 'oah' && !oahProfile) {
      res.status(400).json({ error: 'Old Age Home details are required' });
      return;
    }

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

    if (role === 'oah' && oahProfile) {
      await storage.createOAHProfile({
        userId: user.id,
        name: oahProfile.homeName,
        description: oahProfile.description ?? null,
        location: oahProfile.location,
        contactPerson: oahProfile.contactPerson,
        contactEmail: oahProfile.contactEmail,
        contactPhone: oahProfile.contactPhone,
        streetAddress: oahProfile.streetAddress,
        city: oahProfile.city,
        state: oahProfile.state,
        yearsEstablished: oahProfile.yearsEstablished ?? null,
      });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.status(201).json({ user: stripUser(user), token });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const msg = error.errors?.[0]?.message || 'Validation failed';
      res.status(400).json({ error: msg });
      return;
    }
    console.error('Register error:', error);
    res.status(500).json({ error: error?.message || 'Registration failed. Please try again.' });
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
    console.error('Login error:', error);
    res.status(500).json({ error: error?.message || 'Login failed. Please try again.' });
  }
});

// Current user (requires Bearer token)
router.get('/me', requireAuth, (req, res) => {
  const user = (res as any).locals.user;
  res.json(user);
});

export default router;
