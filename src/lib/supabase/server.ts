import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // During build time, we don't need these. Only throw error at runtime when actually used.
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    throw new Error("Supabase ENV missing");
  }
}

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase ENV missing - URL or Key not configured");
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              async ({ name, value, options }) =>
                (await cookieStore).set(name, value, options)
            );
          } catch {
            // ignore
          }
        },
      },
    }
  );
};
