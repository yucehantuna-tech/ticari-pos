import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import bwipjs from "bwip-js";

function genCode128(text) {
  try {
    const canvas = document.createElement("canvas");
    bwipjs.toCanvas(canvas, {
      bcid: "code128",
      text,
      scale: 3,
      height: 12,
      includetext: true,
      textxalign: "center",
    });
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

export default function Etiket() {
  const { id } = useParams();
  const productId = Number(id);
  const [p, setP] = useState(null);

  useEffect(() => {
    (async () => setP(await invoke("product_get", { product_id: productId })))();
  }, [productId]);

  const barcode = p?.barcode || "";
  const img = useMemo(() => (barcode ? genCode128(barcode) : null), [barcode]);

  if (!p) return <div className="muted">Yükleniyor...</div>;

  return (
    <div className="printArea">
      <div className="printToolbar noPrint">
        <button className="btn" onClick={() => window.print()}>Etiketi Yazdır</button>
      </div>

      <div className="label">
        <div className="labelName">{p.name}</div>
        <div className="labelPrice">₺ {Number(p.price).toFixed(2)}</div>
        {barcode ? (
          img ? <img alt="barcode" src={img} style={{ width: "100%", marginTop: 8 }} /> : <div className="muted">Barkod çizilemedi</div>
        ) : (
          <div className="muted" style={{ marginTop: 8 }}>Bu üründe barkod yok.</div>
        )}
      </div>
    </div>
  );
}
