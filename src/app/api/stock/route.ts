/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/* ================= TAMBAHAN ================= */
import { Resend } from "resend";
import { LowStockEmail } from "@/components/email/LowStoctEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const LOW_STOCK_LIMIT = Number(process.env.LOW_STOCK_LIMIT || 5);
/* ============================================ */

export async function POST(req: Request) {
  try {
    const supabase = createClient(cookies());
    const { product_id, qty, type } = await req.json();

    if (!product_id || !qty || !["IN", "OUT"].includes(type)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Ambil stok
    const { data: stockData, error: stockErr } = await supabase
      .from("stocks")
      .select("*")
      .eq("product_id", product_id)
      .single();

    if (stockErr || !stockData) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    let newQty = stockData.quantity;
    if (type === "IN") newQty += qty;
    if (type === "OUT") newQty -= qty;
    if (newQty < 0) newQty = 0;

    // Update stok
    await supabase
      .from("stocks")
      .update({ quantity: newQty })
      .eq("product_id", product_id);

    // Insert log
    await supabase.from("stock_logs").insert({
      product_id,
      qty,
      type,
      source: "scan",
    });

    /* ========= TAMBAHAN AMBIL PRODUK ========= */
    const { data: product } = await supabase
      .from("products")
      .select("name, sku")
      .eq("id", product_id)
      .single();
    /* ======================================== */

    /* ========= TAMBAHAN ALERT EMAIL ========= */
    if (newQty <= LOW_STOCK_LIMIT) {
      await resend.emails.send({
        from: "Inventory <alert@resend.dev>",
        to: [process.env.ALERT_EMAIL!],
        subject: "⚠️ Stok Produk Menipis",
        html: LowStockEmail({
          productName: product?.name || "Unknown",
          sku: product?.sku,
          quantity: newQty,
        }),
      });
    }
    /* ======================================== */

    return NextResponse.json({ success: true, quantity: newQty });
  } catch (e: any) {
    console.error("STOCK ERROR:", e);
    return NextResponse.json(
      { error: e.message || "Stock update failed" },
      { status: 500 }
    );
  }
}
