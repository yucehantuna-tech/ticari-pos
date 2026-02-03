import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function AdminGate({ open, onClose, onOk }) {
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => { if (open) { setPin(""); setMsg(""); } }, [open]);

  if (!open) return null;

  async function check() {
    const ok = await invoke("auth_check", { pin });
    if (!ok) return setMsg("PIN yanlış.");
    onOk();
    onClose();
  }

  return (
    <div className="modalBack">
      <div className="modal">
        <div style={{fontWeight:900, fontSize:18}}>Admin PIN</div>
        <div className="muted" style={{marginTop:6}}>Varsayılan: 1234 (sonra değiştir)</div>
        <input className="input" style={{marginTop:12}} value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN" />
        {msg && <div className="muted" style={{marginTop:8}}>{msg}</div>}
        <div className="row" style={{justifyContent:"flex-end", marginTop:12, gap:8}}>
          <button className="btn secondary" onClick={onClose}>Kapat</button>
          <button className="btn" onClick={check}>Giriş</button>
        </div>
      </div>
    </div>
  );
}
