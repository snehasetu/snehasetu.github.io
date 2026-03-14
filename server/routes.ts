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

  // --- OAH Homes (public listing + public profile by id) ---
  app.get('/api/homes', async (req, res) => {
    try {
      const profiles = await storage.listOAHProfiles();
      const withCount = await Promise.all(
        profiles.map(async (p) => ({
          ...p,
          activeNeedsCount: await storage.countActiveNeedsByOahId(p.id),
        }))
      );
      res.json(withCount);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/homes/me', requireAuth, requireRole('oah'), async (req, res) => {
    try {
      const user = (res as any).locals.user;
      const profile = await storage.getOAHProfileByUserId(user.id);
      if (!profile) return res.status(404).json({ error: 'OAH profile not found' });
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/homes/me', requireAuth, requireRole('oah'), async (req, res) => {
    try {
      const user = (res as any).locals.user;
      const profile = await storage.getOAHProfileByUserId(user.id);
      if (!profile) return res.status(404).json({ error: 'OAH profile not found' });
      const allowed = ['name', 'description', 'location', 'contactPerson', 'contactEmail', 'contactPhone', 'streetAddress', 'city', 'state', 'yearsEstablished', 'imageUrl'];
      const updates: Record<string, unknown> = {};
      for (const k of allowed) {
        if (req.body[k] !== undefined) updates[k] = req.body[k];
      }
      const updated = await storage.updateOAHProfile(profile.id, updates);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/homes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await storage.getOAHProfileById(id);
      if (!profile) return res.status(404).json({ error: 'Home not found' });
      const activeNeedsCount = await storage.countActiveNeedsByOahId(profile.id);
      res.json({ ...profile, activeNeedsCount });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Needs ---
  app.get('/api/needs', async (req, res) => {
    try {
      const oahId = req.query.oahId as string | undefined;
      const status = req.query.status as string | undefined;
      const list = await storage.listNeeds(oahId ? { oahId, ...(status && { status }) } : status ? { status } : undefined);
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/needs/:id', async (req, res) => {
    try {
      const need = await storage.getNeedById(req.params.id);
      if (!need) return res.status(404).json({ error: 'Need not found' });
      res.json(need);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/needs', requireAuth, requireRole('oah'), async (req, res) => {
    try {
      const user = (res as any).locals.user;
      const profile = await storage.getOAHProfileByUserId(user.id);
      if (!profile) return res.status(400).json({ error: 'Complete your home profile first' });
      const { type, title, description, quantity, targetAmount, eventDate, location } = req.body;
      if (!type || !title || !description) {
        return res.status(400).json({ error: 'Type, title and description are required' });
      }
      const need = await storage.createNeed({
        oahId: profile.id,
        type,
        title,
        description,
        quantity: quantity || null,
        targetAmount: targetAmount ? Number(targetAmount) : null,
        eventDate: eventDate || null,
        location: location || null,
      });
      res.status(201).json(need);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/needs/:id', requireAuth, requireRole('oah'), async (req, res) => {
    try {
      const user = (res as any).locals.user;
      const profile = await storage.getOAHProfileByUserId(user.id);
      if (!profile) return res.status(404).json({ error: 'OAH profile not found' });
      const need = await storage.getNeedById(req.params.id);
      if (!need || need.oahId !== profile.id) return res.status(404).json({ error: 'Need not found' });
      const { status } = req.body;
      const updated = await storage.updateNeed(need.id, status ? { status } : req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
