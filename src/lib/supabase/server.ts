import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase ENV missing");
}

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
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
