import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authRoutes from "./auth";
import { requireAuth, requireRole } from "./authMiddleware";

function stripUser(raw: Record<string, unknown>): Record<string, unknown> {
  const { passwordHash: _, ...rest } = raw;
  return rest;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use('/api/auth', authRoutes);

  // Current user (alias, same as GET /api/auth/me)
  app.get('/api/users/me', requireAuth, (req, res) => {
    res.json((res as any).locals.user);
  });

  // Get user by ID (for profile; no password)
  app.get('/api/users/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUserById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(stripUser(user as Record<string, unknown>));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Admin routes (admin only) ---
  app.get('/api/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const list = await storage.listUsers();
      res.json(list.map((u) => stripUser(u as Record<string, unknown>)));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/admin/users/:userId/approve', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { userId } = req.params;
      const { approved } = req.body;
      const user = await storage.updateUser(userId, { approved: Boolean(approved) });
      res.json(stripUser(user as Record<string, unknown>));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/admin/users/:userId/role', requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      if (!['volunteer', 'oah', 'admin'].includes(role)) {
        res.status(400).json({ error: 'Invalid role' });
        return;
      }
      const user = await storage.updateUser(userId, { role });
      res.json(stripUser(user as Record<string, unknown>));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
