/**
 * Authentication Configuration with Supabase
 * 
 * Note: We're using Supabase Auth directly instead of NextAuth.js
 * for better integration with Supabase features.
 * 
 * Supabase handles:
 * - User authentication (email/password, OAuth, magic links)
 * - Password hashing
 * - Email verification
 * - Password reset
 * - Session management
 * 
 * Use the Supabase client from lib/supabase.ts for authentication.
 * 
 * Example usage:
 * ```typescript
 * import { supabase } from '@/lib/supabase'
 * 
 * // Sign up
 * const { data, error } = await supabase.auth.signUp({
 *   email: 'user@example.com',
 *   password: 'password'
 * })
 * 
 * // Sign in
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password'
 * })
 * 
 * // Get current user
 * const { data: { user } } = await supabase.auth.getUser()
 * ```
 */

// This file is kept for reference but Supabase Auth is used directly
// See lib/supabase.ts for the Supabase client
