import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authRoutes from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.use('/api/auth', authRoutes);

  // User sync route - called after OAuth to create/update user
  app.post('/api/users/sync', async (req, res) => {
    try {
      const { supabaseId, email, name, avatarUrl, role } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserBySupabaseId(supabaseId);

      if (existingUser) {
        // Update existing user
        const updatedUser = await storage.updateUser(existingUser.id, {
          email,
          name,
          avatarUrl,
        });
        return res.json(updatedUser);
      }

      // Create new user
      const approved = role === 'volunteer'; // Volunteers auto-approved, OAH needs approval
      const newUser = await storage.createUser({
        supabaseId,
        email,
        name,
        avatarUrl,
        role,
        approved,
      });

      res.json(newUser);
    } catch (error: any) {
      console.error('User sync error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user by Supabase ID
  app.get('/api/users/by-supabase/:supabaseId', async (req, res) => {
    try {
      const { supabaseId } = req.params;
      const user = await storage.getUserBySupabaseId(supabaseId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user by ID
  app.get('/api/users/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUserById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user approval status (admin only - TODO: add auth middleware)
  app.patch('/api/users/:userId/approve', async (req, res) => {
    try {
      const { userId } = req.params;
      const { approved } = req.body;

      const user = await storage.updateUser(userId, { approved });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
