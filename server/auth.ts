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

    const { role, name, email } = schema.parse(req.body);

    // For OAH users, set approved to false (needs manual approval)
    // For volunteers, set approved to true (auto-approved)
    const approved = role === 'volunteer';

    // Store the registration intent in our database
    // Actual Supabase auth will happen via Google OAuth on frontend
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
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ user: null });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.json({ user: null });
    }

    // Get user from our database
    const response = await fetch(`${process.env.DATABASE_URL || 'http://localhost:5000'}/api/users/${user.id}`);
    const appUser = await response.json();

    res.json({ user: appUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      await supabase.auth.admin.signOut(token);
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Approve OAH user
router.post('/approve-oah/:userId', async (req, res) => {
  try {
    // TODO: Add admin authentication check
    const { userId } = req.params;
    
    // Update user approved status
    // This would be done through your database API
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
