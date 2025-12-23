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
    const body = await req.json();

    // Ambil user login
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validasi minimal
    if (!body.name || !body.category || !body.qty || body.qty < 1) {
      return NextResponse.json(
        { error: "Name, category & qty required" },
        { status: 400 }
      );
    }

    // Cek apakah produk sudah ada berdasarkan SKU
    const { data: existing, error: fetchErr } = await supabase
      .from("products")
      .select("*")
      .eq("sku", body.sku || "")
      .single();

    if (fetchErr && fetchErr.code !== "PGRST116") {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    let product_id = "";

    if (existing) {
      product_id = existing.id;

      // Ambil stok saat ini
      const { data: stockData, error: stockErr } = await supabase
        .from("stocks")
        .select("quantity")
        .eq("product_id", product_id)
        .single();

      if (stockErr)
        return NextResponse.json({ error: stockErr.message }, { status: 500 });

      let newQty =
        body.type === "IN"
          ? stockData.quantity + body.qty
          : stockData.quantity - body.qty;

      if (newQty < 0) newQty = 0;

      // Update stok
      const { error: updateErr } = await supabase
        .from("stocks")
        .update({ quantity: newQty })
        .eq("product_id", product_id);

      if (updateErr)
        return NextResponse.json({ error: updateErr.message }, { status: 500 });

      // Buat log
      await supabase.from("stock_logs").insert({
        product_id,
        type: body.type,
        qty: body.qty,
        source: "scan",
      });

      /* ========= TAMBAHAN ALERT EMAIL ========= */
      if (newQty <= LOW_STOCK_LIMIT) {
        await resend.emails.send({
          from: "Inventory <alert@resend.dev>",
          to: [user.email!],
          subject: "⚠️ Stok Produk Menipis",
          html: LowStockEmail({
            productName: existing.name,
            sku: existing.sku,
            quantity: newQty,
          }),
        });
      }
      /* ======================================== */

    } else {
      // Produk baru
      const { data: newProduct, error: insertErr } = await supabase
        .from("products")
        .insert({
          user_id: user.id,
          name: body.name,
          sku: body.sku || null,
          category: body.category,
          brand: body.brand || null,
        })
        .select()
        .single();

      if (insertErr)
        return NextResponse.json({ error: insertErr.message }, { status: 500 });

      product_id = newProduct.id;

      // Buat stok awal
      await supabase.from("stocks").insert({
        product_id,
        quantity: body.qty,
      });

      // Buat stock log
      await supabase.from("stock_logs").insert({
        product_id,
        type: "IN",
        qty: body.qty,
        source: "scan",
      });

      /* ========= TAMBAHAN ALERT EMAIL ========= */
      if (body.qty <= LOW_STOCK_LIMIT) {
        await resend.emails.send({
          from: "Inventory <alert@resend.dev>",
          to: [user.email!],
          subject: "⚠️ Stok Produk Menipis",
          html: LowStockEmail({
            productName: newProduct.name,
            sku: newProduct.sku,
            quantity: body.qty,
          }),
        });
      }
      /* ======================================== */
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("SAVE PRODUCT FAILED:", e);
    return NextResponse.json(
      { error: e.message || "Save failed" },
      { status: 500 }
    );
  }
}
