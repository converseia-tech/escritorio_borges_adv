// Middleware to ensure environment variables are loaded in Vercel
export const config = {
  runtime: 'nodejs',
};

// Log environment variables for debugging (only keys, not values)
console.log('[Vercel] Environment check:', {
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  hasSupabaseUrl: !!process.env.SUPABASE_URL,
  hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  nodeEnv: process.env.NODE_ENV,
});
