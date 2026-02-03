import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function Raporlar() {
  const [days, setDays] = useState("30");
  const [byDay, setByDay] = useState([]);
  const [top, setTop] = useState([]);
  const [credit, setCredit] = useState([]);

  async function load() {
    setByDay(await invoke("report_sales_by_day", { days: Number(days) }));
    setTop(await invoke("report_top_products", { limit: 10 }));
    setCredit(await invoke("report_credit_by_customer", { limit: 10 }));
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Raporlar</h2>

      <div className="card">
        <div className="row">
          <input className="input" style={{ maxWidth: 160 }} value={days} onChange={e=>setDays(e.target.value)} placeholder="Kaç gün" />
          <button className="btn" onClick={load}>Yenile</button>
        </div>
        <div className="muted" style={{ marginTop: 8 }}>Son {days} gün</div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 12, gap: 12 }}>
        <div className="card">
          <div className="muted" style={{ marginBottom: 8 }}>Günlük Satış</div>
          <div className="table">
            <div className="tHead" style={{ gridTemplateColumns: "1fr .8fr .6fr .6fr .6fr .4fr" }}>
              <div>Tarih</div><div>Toplam</div><div>Nakit</div><div>Kart</div><div>Veresiye</div><div>Adet</div>
            </div>
            {byDay.length === 0 ? <div className="tRow muted">Veri yok</div> : byDay.map((d,i)=>(
              <div key={i} className="tHead" style={{ gridTemplateColumns: "1fr .8fr .6fr .6fr .6fr .4fr", background:"transparent", borderTop:"1px solid var(--line)" }}>
                <div>{d.day}</div>
                <div>₺ {Number(d.total).toFixed(2)}</div>
                <div>₺ {Number(d.cash).toFixed(2)}</div>
                <div>₺ {Number(d.card).toFixed(2)}</div>
                <div>₺ {Number(d.credit).toFixed(2)}</div>
                <div>{d.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="muted" style={{ marginBottom: 8 }}>En Çok Satanlar</div>
          <div className="table">
            <div className="tHead" style={{ gridTemplateColumns: "1.4fr .6fr .8fr" }}>
              <div>Ürün</div><div>Adet</div><div>Tutar</div>
            </div>
            {top.length === 0 ? <div className="tRow muted">Veri yok</div> : top.map((x,i)=>(
              <div key={i} className="tHead" style={{ gridTemplateColumns: "1.4fr .6fr .8fr", background:"transparent", borderTop:"1px solid var(--line)" }}>
                <div>{x.name}</div>
                <div>{Number(x.qty).toFixed(2)}</div>
                <div>₺ {Number(x.total).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="muted" style={{ margin: "14px 0 8px" }}>En Çok Veresiye</div>
          <div className="table">
            <div className="tHead" style={{ gridTemplateColumns: "1.4fr .8fr" }}>
              <div>Müşteri</div><div>Bakiye</div>
            </div>
            {credit.length === 0 ? <div className="tRow muted">Veri yok</div> : credit.map((x,i)=>(
              <div key={i} className="tHead" style={{ gridTemplateColumns: "1.4fr .8fr", background:"transparent", borderTop:"1px solid var(--line)" }}>
                <div>{x.customer_name}</div>
                <div>₺ {Number(x.balance).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
