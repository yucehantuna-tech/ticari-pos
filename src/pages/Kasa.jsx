import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function Kasa() {
  const [s, setS] = useState(null);

  async function load() {
    const x = await invoke("kasa_summary");
    setS(x);
  }

  useEffect(()=>{ load(); }, []);

  if (!s) return <div className="muted">Yükleniyor...</div>;

  return (
    <div>
      <h2>Kasa</h2>
      <div className="grid">
        <div className="card">
          <div className="cardTitle">Nakit Giriş</div>
          <div className="cardValue">₺ {Number(s.cash_in).toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="cardTitle">Nakit Çıkış</div>
          <div className="cardValue">₺ {Number(s.cash_out).toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="cardTitle">Kart Giriş</div>
          <div className="cardValue">₺ {Number(s.card_in).toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="cardTitle">Net Nakit</div>
          <div className="cardValue">₺ {Number(s.net_cash).toFixed(2)}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row between">
          <div>
            <div className="muted">Toplam Satış</div>
            <div className="big">₺ {Number(s.total_sales).toFixed(2)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="muted">Toplam Veresiye (Açık)</div>
            <div className="big">₺ {Number(s.total_credit).toFixed(2)}</div>
          </div>
        </div>
        <button className="btn secondary" style={{ marginTop: 10 }} onClick={load}>Yenile</button>
      </div>
    </div>
  );
}
