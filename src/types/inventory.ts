export type Product = {
  id: string;
  user_id: string;
  name: string;
  sku?: string;
  category: string;
  brand?: string;
  image_url?: string;
  created_at: string;
};

export type Stock = {
  product_id: string;
  quantity: number;
};

export type StockLog = {
  id: string;
  product_id: string;
  type: "IN" | "OUT";
  qty: number;
  source: string;
  created_at: string;
};

export type LowStockRule = {
  product_id: string;
  min_qty: number;
};
