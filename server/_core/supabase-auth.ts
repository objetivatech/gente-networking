/**
 * Supabase Authentication Module
 * Handles authentication using Supabase Auth instead of Manus OAuth
 */

import { Request, Response } from 'express';
import { supabase } from '../supabase.js';
import { User } from '../db.js';

/**
 * Extract user from Supabase session
 * Checks for session cookie or Authorization header
 */
export async function getUserFromRequest(req: Request): Promise<User | null> {
  // Use the singleton supabase client
  
  // Try to get session from cookie
  const accessToken = req.cookies?.['sb-access-token'];
  const refreshToken = req.cookies?.['sb-refresh-token'];
  
  if (!accessToken) {
    // Try Authorization header as fallback
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return null;
      }
      
      return await getUserFromSupabaseUser(user.id);
    }
    
    return null;
  }
  
  // Set session
  const { data: { session }, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  
  if (error || !session) {
    return null;
  }
  
  // Get user from our database
  return await getUserFromSupabaseUser(session.user.id);
}

/**
 * Get user from our database using Supabase user ID
 */
async function getUserFromSupabaseUser(supabaseUserId: string): Promise<User | null> {
  // Use the singleton supabase client
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('open_id', supabaseUserId)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return {
    id: data.id,
    open_id: data.open_id,
    name: data.name,
    email: data.email,
    login_method: data.login_method,
    role: data.role,
    created_at: data.created_at,
    updated_at: data.updated_at,
    last_signed_in: data.last_signed_in,
  };
}

/**
 * Set auth cookies after successful login
 */
export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
  
  res.cookie('sb-access-token', accessToken, cookieOptions);
  res.cookie('sb-refresh-token', refreshToken, cookieOptions);
}

/**
 * Clear auth cookies on logout
 */
export function clearAuthCookies(res: Response) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: -1,
    path: '/',
  };
  
  res.clearCookie('sb-access-token', cookieOptions);
  res.clearCookie('sb-refresh-token', cookieOptions);
}
