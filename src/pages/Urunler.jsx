import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

export default function Urunler() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [price, setPrice] = useState("");
  const [list, setList] = useState([]);

  async function load() {
    const data = await invoke("product_list");
    setList(data);
  }

  async function save() {
    if (!name) return;
    await invoke("product_add", {
      name,
      barcode: barcode || null,
      price: parseFloat(price || "0")
    });
    setName(""); setBarcode(""); setPrice("");
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Ürünler</h2>

      <div className="card">
        <div className="row">
          <input className="input" placeholder="Ürün adı" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Barkod" value={barcode} onChange={e=>setBarcode(e.target.value)} />
          <input className="input" placeholder="Fiyat ₺" value={price} onChange={e=>setPrice(e.target.value)} />
          <button className="btn" onClick={save}>Kaydet</button>
        </div>
      </div>

      <div className="card" style={{marginTop:12}}>
        {list.length === 0 ? (
          <div className="muted">Kayıt yok</div>
        ) : list.map(p => (
          <div key={p.id} className="row between" style={{ alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800 }}>{p.name}</div>
              <div className="muted">{p.barcode || "barkod yok"}</div>
            </div>
            <div className="row">
              <div style={{ minWidth: 120, textAlign: "right" }}>₺ {Number(p.price).toFixed(2)}</div>
              <button className="btn secondary" onClick={() => nav(`/etiket/${p.id}`)}>Etiket</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
