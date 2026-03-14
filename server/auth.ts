import { Router } from 'express';
import { supabase, supabaseAdmin } from './supabase';
import { z } from 'zod';

const router = Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const schema = z.object({
      role: z.enum(['volunteer', 'oah']),
      name: z.string().min(1),
      email: z.string().email(),
    });

    const { role } = schema.parse(req.body);

    // For OAH users, set approved to false (needs manual approval)
    // For volunteers, set approved to true (auto-approved)
    const approved = role === 'volunteer';

    res.json({
      success: true,
      message: role === 'oah'
        ? 'Please complete registration with Google. Your account will be reviewed within 3-5 business days.'
        : 'Please complete registration with Google.',
      role,
      approved,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user session
router.get('/session', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ user: null });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ user: null });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.json({ user: null });
    }

    const base = process.env.API_URL || `http://localhost:${process.env.PORT || '5000'}`;
    const response = await fetch(`${base}/api/users/by-supabase/${user.id}`);
    if (!response.ok) return res.json({ user: null });
    const appUser = await response.json();
    res.json({ user: appUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    if (supabaseAdmin && req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      await supabaseAdmin.auth.admin.signOut(token);
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Approve OAH user
router.post('/approve-oah/:userId', async (_req, res) => {
  try {
    // TODO: Add admin authentication check and call PATCH /api/users/:userId/approve
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
