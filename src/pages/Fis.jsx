import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

export default function Fis() {
  const { id } = useParams();
  const saleId = Number(id);
  const [head, setHead] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      setHead(await invoke("sale_get", { sale_id: saleId }));
      setItems(await invoke("sale_items", { sale_id: saleId }));
    })();
  }, [saleId]);

  const sum = useMemo(() => items.reduce((a, x) => a + Number(x.line_total), 0), [items]);

  if (!head) return <div className="muted">Yükleniyor...</div>;

  return (
    <div className="printArea">
      <div className="printToolbar noPrint">
        <button className="btn" onClick={() => window.print()}>Yazdır / PDF</button>
      </div>

      <div className="receipt">
        <div className="rTitle">Ticari POS</div>
        <div className="muted">Fiş No: #{head.id}</div>
        <div className="muted">Tarih: {head.created_at}</div>
        <div className="muted">Müşteri: {head.customer_name || "-"}</div>

        <div className="rLine" />

        <div className="rTableHead">
          <div>Ürün</div><div>Adet</div><div>Fiyat</div><div>Tutar</div>
        </div>

        {items.map((x, i) => (
          <div key={i} className="rRow">
            <div>{x.name}</div>
            <div>{x.qty}</div>
            <div>₺ {Number(x.unit_price).toFixed(2)}</div>
            <div>₺ {Number(x.line_total).toFixed(2)}</div>
          </div>
        ))}

        <div className="rLine" />

        <div className="rTotals">
          <div><span className="muted">Toplam</span> <b>₺ {sum.toFixed(2)}</b></div>
          <div className="muted">Nakit: ₺ {Number(head.pay_cash).toFixed(2)}</div>
          <div className="muted">Kart: ₺ {Number(head.pay_card).toFixed(2)}</div>
          <div className="muted">Veresiye: ₺ {Number(head.pay_credit).toFixed(2)}</div>
        </div>

        <div className="rFooter muted">Teşekkür ederiz.</div>
      </div>
    </div>
  );
}
