export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid">
        <div className="card">
          <div className="cardTitle">Bugün Satış</div>
          <div className="cardValue">₺ 0</div>
        </div>
        <div className="card">
          <div className="cardTitle">Kasa</div>
          <div className="cardValue">₺ 0</div>
        </div>
        <div className="card">
          <div className="cardTitle">Veresiye (Açık)</div>
          <div className="cardValue">₺ 0</div>
        </div>
        <div className="card">
          <div className="cardTitle">Stok (Ürün)</div>
          <div className="cardValue">0</div>
        </div>
      </div>
    </div>
  );
}
