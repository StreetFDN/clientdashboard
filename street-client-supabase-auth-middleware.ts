/**
 * Supabase Auth Middleware for street-client backend
 * 
 * Copy this file to: street-client/src/middleware/supabaseAuth.ts
 * 
 * This middleware allows the backend to accept Supabase JWT tokens,
 * enabling unified authentication between frontend (Supabase) and backend.
 */

import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '../db';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase credentials not configured. Supabase auth will be disabled.');
}

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Middleware to authenticate using Supabase JWT tokens
 * Falls back to session auth if no token provided
 */
export async function supabaseAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Try to get Supabase JWT from Authorization header
  const authHeader = req.headers.authorization;
  let supabaseUser = null;

  if (supabase && authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      // Verify the JWT token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (!error && user) {
        supabaseUser = user;
      }
    } catch (error) {
      console.error('Error verifying Supabase token:', error);
    }
  }

  // If we have a Supabase user, try to find or create backend user
  if (supabaseUser) {
    try {
      // Try to find user by email
      let backendUser = await prisma.user.findFirst({
        where: {
          email: supabaseUser.email || undefined,
        },
      });

      // If not found, try to find by GitHub login (if user has GitHub provider)
      if (!backendUser && supabaseUser.app_metadata?.provider === 'github') {
        const githubLogin = supabaseUser.user_metadata?.user_name || 
                           supabaseUser.user_metadata?.preferred_username ||
                           supabaseUser.user_metadata?.preferred_username;
        
        if (githubLogin) {
          backendUser = await prisma.user.findFirst({
            where: {
              githubLogin: githubLogin,
            },
          });
        }
      }

      // If still not found, create a new user
      if (!backendUser) {
        const githubLogin = supabaseUser.user_metadata?.user_name || 
                           supabaseUser.user_metadata?.preferred_username ||
                           supabaseUser.email?.split('@')[0];

        backendUser = await prisma.user.create({
          data: {
            email: supabaseUser.email || undefined,
            name: supabaseUser.user_metadata?.full_name || 
                  supabaseUser.user_metadata?.name ||
                  supabaseUser.email?.split('@')[0] || 
                  'User',
            githubLogin: githubLogin || undefined,
            avatarUrl: supabaseUser.user_metadata?.avatar_url || undefined,
            // Link to Supabase user
            supabaseId: supabaseUser.id,
          },
        });
      } else if (!backendUser.supabaseId) {
        // Link existing user to Supabase
        backendUser = await prisma.user.update({
          where: { id: backendUser.id },
          data: { supabaseId: supabaseUser.id },
        });
      }

      // Set userId for the request (same as session auth)
      req.userId = backendUser.id;
      req.user = {
        id: backendUser.id,
        githubLogin: backendUser.githubLogin || '',
        name: backendUser.name || undefined,
        email: backendUser.email || undefined,
        avatarUrl: backendUser.avatarUrl || undefined,
      };

      return next();
    } catch (error) {
      console.error('Error linking Supabase user to backend user:', error);
      return res.status(500).json({ error: 'Failed to authenticate' });
    }
  }

  // Fall back to session auth if no Supabase token
  // This maintains backward compatibility
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }

  // No authentication found
  res.status(401).json({ error: 'Authentication required' });
}

/**
 * Combined middleware: tries Supabase auth first, then session auth
 * Use this instead of the original requireAuth middleware
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // First try Supabase auth (async)
  supabaseAuth(req, res, next).catch(() => {
    // If Supabase auth fails, try session auth
    if (req.session && req.session.userId) {
      req.userId = req.session.userId;
      return next();
    }
    res.status(401).json({ error: 'Authentication required' });
  });
}

