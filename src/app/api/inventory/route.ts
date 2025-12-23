//src/app/api/inventory/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = createClient(cookies());
    const { data, error } = await supabase.from("products").select("*");

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("FETCH INVENTORY FAILED:", e);
    return NextResponse.json({ error: e.message || "Fetch failed" }, { status: 500 });
  }
}



