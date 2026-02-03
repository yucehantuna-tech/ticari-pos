import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function Satis() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState("");
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [payCash, setPayCash] = useState("");
  const [payCard, setPayCard] = useState("");
  const [payCredit, setPayCredit] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const p = await invoke("product_list");
    const c = await invoke("customer_list");
    setProducts(p);
    setCustomers(c);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products.slice(0, 50);
    return products.filter(x =>
      x.name.toLowerCase().includes(s) ||
      (x.barcode || "").toLowerCase().includes(s)
    ).slice(0, 50);
  }, [q, products]);

  const total = useMemo(() => cart.reduce((a,i)=>a + i.qty*i.unit_price, 0), [cart]);

  function addToCart(p) {
    setMsg("");
    setCart(prev => {
      const idx = prev.findIndex(x => x.product_id === p.id);
      if (idx >= 0) {
        const cp = [...prev];
        cp[idx] = { ...cp[idx], qty: cp[idx].qty + 1 };
        return cp;
      }
      return [{ product_id: p.id, name: p.name, qty: 1, unit_price: p.price }, ...prev];
    });
  }

  function setQty(i, v) {
    const n = parseFloat(v || "0");
    setCart(prev => prev.map((x,idx)=> idx===i ? { ...x, qty: isNaN(n)?0:n } : x));
  }
  function setPrice(i, v) {
    const n = parseFloat(v || "0");
    setCart(prev => prev.map((x,idx)=> idx===i ? { ...x, unit_price: isNaN(n)?0:n } : x));
  }
  function remove(i) {
    setCart(prev => prev.filter((_,idx)=>idx!==i));
  }

  async function finish() {
    setMsg("");
    if (cart.length === 0) return setMsg("Sepet boş.");

    const pc = parseFloat(payCash || "0") || 0;
    const pk = parseFloat(payCard || "0") || 0;
    const pv = parseFloat(payCredit || "0") || 0;
    const sumPay = pc + pk + pv;

    if (Math.abs(sumPay - total) > 0.01) {
      return setMsg(`Ödeme toplamı (${sumPay.toFixed(2)}) satış toplamına (${total.toFixed(2)}) eşit olmalı.`);
    }
    if (pv > 0 && !customerId) return setMsg("Veresiye için müşteri seçmelisin.");

    const saleId = await invoke("sale_create", {
      payload: {
        customer_id: customerId ? Number(customerId) : null,
        items: cart,
        pay_cash: pc,
        pay_card: pk,
        pay_credit: pv,
        note: null
      }
    });

    setCart([]);
    setQ("");
    setCustomerId("");
    setPayCash("");
    setPayCard("");
    setPayCredit("");
    setMsg(`Satış tamam ✔ Fiş No: ${saleId}`);
  }

  return (
    <div>
      <h2>Satış</h2>

      <div className="card">
        <div className="row">
          <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Ürün ara (ad/barkod)..." />
          <select className="input" value={customerId} onChange={e=>setCustomerId(e.target.value)}>
            <option value="">Müşteri seç (opsiyonel)</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}{c.phone ? ` (${c.phone})` : ""}</option>)}
          </select>
        </div>

        <div className="table" style={{ marginTop: 10 }}>
          <div className="tHead" style={{ gridTemplateColumns: "1.5fr .6fr .6fr .6fr .4fr" }}>
            <div>Ürün</div><div>Adet</div><div>Fiyat</div><div>Tutar</div><div></div>
          </div>

          {cart.length === 0 ? (
            <div className="tRow muted">Sepet boş</div>
          ) : cart.map((x,i)=>(
            <div key={i} className="tHead" style={{ gridTemplateColumns: "1.5fr .6fr .6fr .6fr .4fr", background: "transparent", borderTop: "1px solid var(--line)" }}>
              <div>{x.name}</div>
              <div><input className="input" value={x.qty} onChange={e=>setQty(i,e.target.value)} /></div>
              <div><input className="input" value={x.unit_price} onChange={e=>setPrice(i,e.target.value)} /></div>
              <div>₺ {(x.qty*x.unit_price).toFixed(2)}</div>
              <div><button className="btn danger" onClick={()=>remove(i)}>Sil</button></div>
            </div>
          ))}
        </div>

        <div className="row between" style={{ marginTop: 12 }}>
          <div className="total">
            <div className="muted">Toplam</div>
            <div className="big">₺ {total.toFixed(2)}</div>
          </div>
          <div className="row">
            <input className="input" style={{ width: 140 }} placeholder="Nakit" value={payCash} onChange={e=>setPayCash(e.target.value)} />
            <input className="input" style={{ width: 140 }} placeholder="Kart" value={payCard} onChange={e=>setPayCard(e.target.value)} />
            <input className="input" style={{ width: 140 }} placeholder="Veresiye" value={payCredit} onChange={e=>setPayCredit(e.target.value)} />
            <button className="btn" onClick={finish}>Satışı Bitir</button>
          </div>
        </div>

        {msg && <div className="muted" style={{ marginTop: 10 }}>{msg}</div>}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="muted" style={{ marginBottom: 8 }}>Hızlı ekle</div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(4,minmax(0,1fr))" }}>
          {filtered.map(p => (
            <button key={p.id} className="btn secondary" onClick={()=>addToCart(p)}>
              {p.name}<br/><span className="muted">₺ {Number(p.price).toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
