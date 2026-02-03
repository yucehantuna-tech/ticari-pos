export default function Satis() {
  return (
    <div>
      <h2>Satış</h2>
      <div className="card">
        <div className="row">
          <input className="input" placeholder="Barkod / Ürün ara..." />
          <button className="btn">Ekle</button>
        </div>

        <div className="table">
          <div className="tHead">
            <div>Ürün</div><div>Adet</div><div>Fiyat</div><div>Tutar</div>
          </div>
          <div className="tRow muted">Sepet boş</div>
        </div>

        <div className="row between">
          <div className="total">
            <div className="muted">Toplam</div>
            <div className="big">₺ 0</div>
          </div>
          <div className="row">
            <button className="btn secondary">Nakit</button>
            <button className="btn secondary">Kart</button>
            <button className="btn danger">Veresiye</button>
            <button className="btn">Satışı Bitir</button>
          </div>
        </div>
      </div>
    </div>
  );
}
