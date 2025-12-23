type Props = {
  productName: string;
  sku?: string | null;
  quantity: number;
};

export const LowStockEmail = ({ productName, sku, quantity }: Props) => {
  return `
    <div style="font-family:Arial,sans-serif">
      <h2 style="color:#dc2626">⚠️ Stok Menipis</h2>
      <p>Produk berikut hampir habis:</p>

      <table cellpadding="6" cellspacing="0" border="1">
        <tr>
          <td><b>Nama Produk</b></td>
          <td>${productName}</td>
        </tr>
        <tr>
          <td><b>SKU</b></td>
          <td>${sku || "-"}</td>
        </tr>
        <tr>
          <td><b>Sisa Stok</b></td>
          <td><b>${quantity}</b></td>
        </tr>
      </table>

      <p>Segera lakukan restock.</p>
    </div>
  `;
};
