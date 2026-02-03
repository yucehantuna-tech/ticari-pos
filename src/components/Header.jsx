export default function Header() {
  return (
    <header className="header">
      <div className="headerLeft">
        <div className="headerTitle">Ticari POS</div>
        <div className="headerHint">Satış • Ürün • Cari • Kasa</div>
      </div>
      <div className="headerRight">
        <span className="chip">Nakit</span>
        <span className="chip">Kart</span>
        <span className="chip">Veresiye</span>
      </div>
    </header>
  );
}
