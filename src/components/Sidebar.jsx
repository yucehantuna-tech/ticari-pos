import { NavLink } from "react-router-dom";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => "navItem " + (isActive ? "active" : "")}
  >
    {children}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandTitle">Ticari POS</div>
        <div className="brandSub">Masaüstü</div>
      </div>

      <nav className="nav">
        <Item to="/dashboard">Dashboard</Item>
        <Item to="/satis">Satış</Item>
        <Item to="/urunler">Ürünler</Item>
        <Item to="/cari">Cari</Item>
        <Item to="/kasa">Kasa</Item>
              <Item to="/ayarlar">Ayarlar</Item>`n      </nav>

      <div className="sidebarFooter">
        <div className="pill">v0.1</div>
      </div>
    </aside>
  );
}

