export default function Urunler() {
  return (
    <div>
      <h2>Ürünler</h2>
      <div className="card">
        <div className="row">
          <input className="input" placeholder="Ürün adı" />
          <input className="input" placeholder="Barkod" />
          <input className="input" placeholder="Satış ₺" />
          <button className="btn">Kaydet</button>
        </div>
        <div className="muted" style={{ marginTop: 10 }}>
          Sonraki adım: SQLite’a kaydedeceğiz, stok ve alış fiyatı ekleyeceğiz.
        </div>
      </div>
    </div>
  );
}
