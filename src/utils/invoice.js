export const generateInvoicePDF = (order) => {
  if (!order) return;
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download or print the invoice PDF.");
    return;
  }

  const itemsHTML = (order.items || [])
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px; font-weight: 600;">${item.name}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 12px; text-align: right;">₹${Number(item.price || 0).toLocaleString()}</td>
        <td style="padding: 12px; text-align: right; font-weight: 700; color: #7A0E2E;">₹${(
          Number(item.price || 0) * (item.quantity || 1)
        ).toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  const orderDate = new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tax Invoice - ${order.id}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2A2623; margin: 0; padding: 20px; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #7A0E2E; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #7A0E2E; letter-spacing: 0.1em; text-transform: uppercase; }
          .badge { font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #C8A97A; font-weight: bold; margin-top: 4px; }
          .grid { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .card { background: #FDFAF5; border: 1px solid #E5E7EB; border-radius: 8px; padding: 15px; width: 46%; }
          .card h4 { margin: 0 0 8px 0; text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em; color: #7B6D63; }
          .card p { margin: 3px 0; font-size: 13px; color: #2A2623; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #7A0E2E; color: white; text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em; padding: 10px 12px; text-align: left; }
          th.right { text-align: right; }
          th.center { text-align: center; }
          .totals { margin-left: auto; width: 320px; font-size: 13px; }
          .row { display: flex; justify-content: space-between; padding: 6px 0; }
          .grand-total { font-size: 16px; font-weight: bold; color: #7A0E2E; border-top: 2px solid #7A0E2E; padding-top: 10px; margin-top: 10px; }
          .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #7B6D63; border-top: 1px solid #E5E7EB; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">Velouraz</div>
            <div class="badge">Official Luxury Tax Invoice</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: monospace; font-weight: bold; font-size: 14px;">INVOICE #${order.id.slice(0, 12).toUpperCase()}</div>
            <div style="font-size: 12px; color: #7B6D63; margin-top: 4px;">Date: ${orderDate}</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h4>Billed To (Customer)</h4>
            <p><strong>${order.shippingDetails?.name || "Valued Patron"}</strong></p>
            <p>${order.shippingDetails?.address || ""}</p>
            <p>${order.shippingDetails?.city || ""}, ${order.shippingDetails?.state || ""} ${order.shippingDetails?.pincode || ""}</p>
            <p>Phone: ${order.shippingDetails?.phone || ""}</p>
          </div>
          <div class="card">
            <h4>Merchant Details</h4>
            <p><strong>House of Velouraz Jewellery</strong></p>
            <p>GSTIN: 07AAAAA0000A1Z5</p>
            <p>Payment Method: ${order.paymentMethod || "Online Payment"}</p>
            <p>Payment ID: ${order.paymentId || "N/A"}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th class="center">Qty</th>
              <th class="right">Unit Price</th>
              <th class="right">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="totals">
          <div class="row">
            <span>Bag Subtotal:</span>
            <span>₹${Number(order.subtotal || order.total || 0).toLocaleString()}</span>
          </div>
          <div class="row">
            <span>Jewellery GST (3% Included):</span>
            <span>Inclusive</span>
          </div>
          <div class="row">
            <span>Shipping & Delivery:</span>
            <span>${Number(order.shippingFee || 0) === 0 ? "Complimentary Free" : `₹${order.shippingFee}`}</span>
          </div>
          <div class="row grand-total">
            <span>Total Amount Paid:</span>
            <span>₹${Number(order.total || 0).toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing Velouraz. For customer assistance, visit velouraz.in or contact support@velouraz.in</p>
          <p>© 2026 VELOURAZ. Artisans of Luxury.</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
};
