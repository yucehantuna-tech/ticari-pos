export default function Cari() {
  return (
    <div>
      <h2>Cari / Müşteri</h2>
      <div className="card">
        <div className="row">
          <input className="input" placeholder="Ad Soyad / Ünvan" />
          <input className="input" placeholder="Telefon" />
          <button className="btn">Ekle</button>
        </div>
        <div className="muted" style={{ marginTop: 10 }}>
          Veresiye ve tahsilat burada tutulacak.
        </div>
      </div>
    </div>
  );
}
