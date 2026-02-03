import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useParams } from "react-router-dom";

export default function Z() {
  const { day } = useParams(); // YYYY-MM-DD
  const [z, setZ] = useState(null);

  useEffect(() => {
    (async () => setZ(await invoke("z_report", { day })))();
  }, [day]);

  if (!z) return <div className="muted">Yükleniyor...</div>;

  return (
    <div className="printArea">
      <div className="printToolbar noPrint">
        <button className="btn" onClick={() => window.print()}>Z Raporu Yazdır</button>
      </div>

      <div className="receipt">
        <div className="rTitle">Gün Sonu (Z) Raporu</div>
        <div className="muted">{z.day}</div>
        <div className="rLine" />
        <div className="rTotals">
          <div><span className="muted">Fiş Sayısı</span> <b>{z.count}</b></div>
          <div><span className="muted">Toplam Satış</span> <b>₺ {Number(z.total_sales).toFixed(2)}</b></div>
          <div className="muted">Nakit: ₺ {Number(z.cash).toFixed(2)}</div>
          <div className="muted">Kart: ₺ {Number(z.card).toFixed(2)}</div>
          <div className="muted">Veresiye: ₺ {Number(z.credit).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
