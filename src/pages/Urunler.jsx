import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function Urunler() {
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  async function refresh() {
    const list = await invoke("product_list");
    setItems(list);
  }

  useEffect(() => { refresh(); }, []);

  async function add() {
    setMsg("");
    const p = parseFloat(price || "0");
    if (!name.trim()) return setMsg("Ürün adı boş olamaz.");
    await invoke("product_add", {
      name: name.trim(),
      barcode: barcode.trim() ? barcode.trim() : null,
      price: isNaN(p) ? 0 : p
    });
    setName(""); setBarcode(""); setPrice("");
    setMsg("Kaydedildi ✔");
    refresh();
  }

  return (
    <div>
      <h2>Ürünler</h2>

      <div className="card">
        <div className="row">
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Ürün adı" />
          <input className="input" value={barcode} onChange={e=>setBarcode(e.target.value)} placeholder="Barkod" />
          <input className="input" value={price} onChange={e=>setPrice(e.target.value)} placeholder="Satış ₺" />
          <button className="btn" onClick={add}>Kaydet</button>
        </div>
        {msg && <div className="muted" style={{ marginTop: 10 }}>{msg}</div>}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="muted" style={{ marginBottom: 8 }}>Kayıtlı Ürünler</div>

        <div className="table">
          <div className="tHead" style={{ gridTemplateColumns: "1fr 1fr .6fr" }}>
            <div>Ürün</div><div>Barkod</div><div>Fiyat</div>
          </div>

          {items.length === 0 ? (
            <div className="tRow muted">Henüz ürün yok</div>
          ) : items.map(x => (
            <div key={x.id} className="tHead" style={{ gridTemplateColumns: "1fr 1fr .6fr", background: "transparent", borderTop: "1px solid var(--line)" }}>
              <div>{x.name}</div>
              <div className="muted">{x.barcode || "-"}</div>
              <div>₺ {Number(x.price).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
