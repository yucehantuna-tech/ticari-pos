import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function makeExpected(machineId) {
  try {
    const b64 = btoa(unescape(encodeURIComponent(machineId)));
    return "TP-" + b64.replace(/=/g, "");
  } catch {
    return "";
  }
}

export default function LicenseGate({ children }) {
  const [loading, setLoading] = useState(true);
  const [machineId, setMachineId] = useState("");
  const [savedKey, setSavedKey] = useState(null);
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState("");

  const expected = useMemo(() => makeExpected(machineId), [machineId]);
  const ok = useMemo(
    () => savedKey && expected && savedKey.trim() === expected.trim(),
    [savedKey, expected]
  );

  useEffect(() => {
    (async () => {
      const mid = await invoke("machine_id");
      setMachineId(mid);
      const k = await invoke("license_get");
      setSavedKey(k || null);
      setLoading(false);
    })();
  }, []);

  async function save() {
    setMsg("");
    if (!key) return setMsg("Lisans anahtarı boş olamaz.");
    await invoke("license_set", { key });
    const k = await invoke("license_get");
    setSavedKey(k || null);
    setKey("");
  }

  if (loading) {
    return <div style={{ padding: 16, color: "#9aa4b2" }}>Yükleniyor…</div>;
  }

  if (!ok) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617"
      }}>
        <div style={{
          maxWidth: 520,
          width: "100%",
          background: "#0f172a",
          border: "1px solid #1f2a44",
          borderRadius: 16,
          padding: 16
        }}>
          <div style={{ fontWeight: 900, fontSize: 22, color: "#e5e7eb" }}>
            Ticari POS Lisans
          </div>

          <div style={{ marginTop: 6, color: "#9aa4b2" }}>
            Bu cihaz için lisans gerekli.
          </div>

          <div style={{ marginTop: 12, color: "#9aa4b2" }}>
            Cihaz Kodu
          </div>

          <div style={{
            fontFamily: "monospace",
            marginTop: 6,
            padding: 10,
            border: "1px solid #1f2a44",
            borderRadius: 12,
            color: "#e5e7eb"
          }}>
            {machineId}
          </div>

          <input
            style={{
              marginTop: 12,
              width: "100%",
              padding: 10,
              borderRadius: 12,
              border: "1px solid #1f2a44",
              background: "#0b1220",
              color: "#e5e7eb"
            }}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="TP-..."
          />

          {msg && <div style={{ marginTop: 8, color: "#fbbf24" }}>{msg}</div>}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <button
              onClick={() => {
                setKey(expected);
                setMsg("Anahtar otomatik dolduruldu.");
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #1f2a44",
                background: "#020617",
                color: "#e5e7eb"
              }}
            >
              Otomatik Doldur
            </button>

            <button
              onClick={save}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #22c55e",
                background: "#22c55e",
                color: "#052e12",
                fontWeight: 800
              }}
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
