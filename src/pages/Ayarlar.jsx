import { useEffect, useState } from "react";

export default function Ayarlar() {
  const [width, setWidth] = useState(localStorage.getItem("print_width") || "58");

  useEffect(() => {
    localStorage.setItem("print_width", width);
  }, [width]);

  return (
    <div>
      <h2>Ayarlar</h2>

      <div className="card">
        <div className="muted">Fiş Genişliği</div>
        <div className="row" style={{gap:10, marginTop:10}}>
          <button className={"btn " + (width==="58" ? "" : "secondary")} onClick={()=>setWidth("58")}>58mm</button>
          <button className={"btn " + (width==="80" ? "" : "secondary")} onClick={()=>setWidth("80")}>80mm</button>
        </div>
        <div className="muted" style={{marginTop:10}}>
          Seçim fiş sayfalarında otomatik uygulanır.
        </div>
      </div>
    </div>
  );
}
