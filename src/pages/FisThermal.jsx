import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

export default function FisThermal() {
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

    const w = (localStorage.getItem("print_width") || "58");`n  return (
    <div className="printArea">
      <div className="printToolbar noPrint">
        <button className="btn" onClick={() => window.print()}>Termal Yazdır</button>
      </div>

      <div className={"receipt thermal " + (w==="80" ? "w80" : "w58")}>
        <div className="rTitle">Ticari POS</div>
        <div className="muted">Fiş #{head.id}</div>
        <div className="muted">{head.created_at}</div>
        <div className="muted">{head.customer_name || ""}</div>

        <div className="rLine" />

        {items.map((x, i) => (
          <div key={i} className="tRowT">
            <div className="tName">{x.name}</div>
            <div className="tMeta">{x.qty} x {Number(x.unit_price).toFixed(2)} = {Number(x.line_total).toFixed(2)}</div>
          </div>
        ))}

        <div className="rLine" />

        <div className="tTotals">
          <div className="tTot"><span>TOPLAM</span><b>₺ {sum.toFixed(2)}</b></div>
          <div className="muted">Nakit: ₺ {Number(head.pay_cash).toFixed(2)}</div>
          <div className="muted">Kart: ₺ {Number(head.pay_card).toFixed(2)}</div>
          <div className="muted">Veresiye: ₺ {Number(head.pay_credit).toFixed(2)}</div>
        </div>

        <div className="rFooter muted">Teşekkür ederiz.</div>
      </div>
    </div>
  );
}

