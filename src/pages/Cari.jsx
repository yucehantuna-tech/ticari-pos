import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function Cari() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [balance, setBalance] = useState(0);
  const [pay, setPay] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const c = await invoke("customer_list");
    setList(c);
  }
  useEffect(()=>{ load(); }, []);

  async function pick(c) {
    setSelected(c);
    const b = await invoke("customer_balance", { customer_id: c.id });
    setBalance(b);
  }

  async function addCustomer() {
    setMsg("");
    if (!name.trim()) return setMsg("Müşteri adı boş olamaz.");
    await invoke("customer_add", { name: name.trim(), phone: phone.trim() ? phone.trim() : null });
    setName(""); setPhone("");
    load();
    setMsg("Eklendi ✔");
  }

  async function tahsilat() {
    setMsg("");
    if (!selected) return setMsg("Müşteri seç.");
    const a = parseFloat(pay || "0") || 0;
    if (a <= 0) return setMsg("Tutar gir.");
    await invoke("credit_payment", { customer_id: selected.id, amount: a, note: null });
    setPay("");
    pick(selected);
    setMsg("Tahsilat işlendi ✔");
  }

  return (
    <div>
      <h2>Cari / Müşteri</h2>

      <div className="card">
        <div className="row">
          <input className="input" placeholder="Ad Soyad / Ünvan" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Telefon" value={phone} onChange={e=>setPhone(e.target.value)} />
          <button className="btn" onClick={addCustomer}>Ekle</button>
        </div>
        {msg && <div className="muted" style={{ marginTop: 10 }}>{msg}</div>}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 12, gap: 12 }}>
        <div className="card">
          <div className="muted" style={{ marginBottom: 8 }}>Müşteriler</div>
          {list.length === 0 ? <div className="muted">Kayıt yok</div> : list.map(c => (
            <button key={c.id} className="btn secondary" style={{ width: "100%", justifyContent: "space-between", display:"flex", marginBottom: 8 }}
              onClick={()=>pick(c)}>
              <span>{c.name}</span>
              <span className="muted">{c.phone || ""}</span>
            </button>
          ))}
        </div>

        <div className="card">
          <div className="muted">Seçili Müşteri</div>
          {!selected ? (
            <div className="tRow muted">Seçim yap</div>
          ) : (
            <>
              <h3 style={{ marginTop: 8 }}>{selected.name}</h3>
              <div className="muted">{selected.phone || "-"}</div>

              <div style={{ marginTop: 10 }}>
                <div className="muted">Veresiye Bakiye</div>
                <div className="big">₺ {Number(balance).toFixed(2)}</div>
              </div>

              <div className="row" style={{ marginTop: 10 }}>
                <input className="input" placeholder="Tahsilat ₺" value={pay} onChange={e=>setPay(e.target.value)} />
                <button className="btn" onClick={tahsilat}>Tahsil Et</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
