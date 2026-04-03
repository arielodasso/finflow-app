import { useState, useEffect, useCallback, useRef } from "react";
import {
  ShoppingCart, PiggyBank, Plus, X,
  ChevronRight, Settings, Trash2, CheckCircle,
  BarChart3, Clock, Zap, Database,
} from "lucide-react";

/* ─── PWA Head ──────────────────────────────────────────────────────────────── */
function PWAHead() {
  useEffect(() => {
    document.title = "FinFlow 50-30-20";
    [
      ["theme-color", "#000000"],
      ["apple-mobile-web-app-capable", "yes"],
      ["apple-mobile-web-app-status-bar-style", "black-translucent"],
      ["apple-mobile-web-app-title", "FinFlow"],
      ["viewport", "width=device-width, initial-scale=1, viewport-fit=cover"],
      ["mobile-web-app-capable", "yes"],
    ].forEach(([name, content]) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
      el.content = content;
    });
  }, []);
  return null;
}

/* ─── Seed data (Excel: ene–abr 2026, solo "Impacta = Si") ─────────────────── */
const SEED_INCOME = 944284;

const SEED_TXS = [
  {id:1767484800000,amount:4500,name:"Palmeritas para merienda",catId:"wants",subcat:"Restaurantes",date:"2026-01-04T00:00:00"},
  {id:1767571200001,amount:257352.34,name:"Pago tarjeta de crédito",catId:"wants",subcat:"Otro",date:"2026-01-05T00:00:00"},
  {id:1767657600002,amount:76315,name:"Internet",catId:"needs",subcat:"Servicios",date:"2026-01-06T00:00:00"},
  {id:1767744000003,amount:32999,name:"Regalo Luciano",catId:"wants",subcat:"Otro",date:"2026-01-07T00:00:00"},
  {id:1767744000004,amount:15891,name:"Oralsone",catId:"needs",subcat:"Salud",date:"2026-01-07T00:00:00"},
  {id:1767571200005,amount:614.4,name:"IVA AFIP APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-01-05T00:00:00"},
  {id:1767571200006,amount:309.77,name:"IVA AFIP APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-01-05T00:00:00"},
  {id:1767571200007,amount:58.7,name:"PERC. IIBB SS DIGITALES",catId:"needs",subcat:"Servicios",date:"2026-01-05T00:00:00"},
  {id:1767571200008,amount:29.5,name:"PERC. IIBB SS DIGITALES",catId:"needs",subcat:"Servicios",date:"2026-01-05T00:00:00"},
  {id:1767830400009,amount:11000,name:"Coseguro psicóloga",catId:"needs",subcat:"Salud",date:"2026-01-08T00:00:00"},
  {id:1768435200010,amount:60006,name:"Nafta",catId:"needs",subcat:"Transporte",date:"2026-01-15T00:00:00"},
  {id:1768521600011,amount:200000,name:"Presto plata a mi viejo",catId:"wants",subcat:"Otro",date:"2026-01-16T00:00:00"},
  {id:1768521600012,amount:5500,name:"Carga celular",catId:"needs",subcat:"Servicios",date:"2026-01-16T00:00:00"},
  {id:1768521600013,amount:22300,name:"Cena con Agus",catId:"wants",subcat:"Restaurantes",date:"2026-01-16T00:00:00"},
  {id:1768608000014,amount:4300,name:"Bebida cumple Fran",catId:"wants",subcat:"Restaurantes",date:"2026-01-17T00:00:00"},
  {id:1768867200015,amount:4000,name:"Fútbol 5",catId:"wants",subcat:"Entretenimiento",date:"2026-01-20T00:00:00"},
  {id:1769040000016,amount:15000,name:"Peluquería",catId:"wants",subcat:"Entretenimiento",date:"2026-01-22T00:00:00"},
  {id:1769040000017,amount:40000,name:"Cámara",catId:"wants",subcat:"Otro",date:"2026-01-22T00:00:00"},
  {id:1769040000018,amount:12000,name:"Coseguro psicóloga",catId:"needs",subcat:"Salud",date:"2026-01-22T00:00:00"},
  {id:1769126400019,amount:36100,name:"Bidón, agua y refrigerante",catId:"needs",subcat:"Transporte",date:"2026-01-23T00:00:00"},
  {id:1769126400020,amount:9000,name:"Focos auto",catId:"needs",subcat:"Transporte",date:"2026-01-23T00:00:00"},
  {id:1769385600021,amount:20000,name:"Pago envío cámara",catId:"wants",subcat:"Otro",date:"2026-01-26T00:00:00"},
  {id:1769385600022,amount:2716.49,name:"Pago Spotify",catId:"wants",subcat:"Suscripciones",date:"2026-01-26T00:00:00"},
  {id:1769472000023,amount:6000,name:"Carga celular",catId:"needs",subcat:"Servicios",date:"2026-01-27T00:00:00"},
  {id:1769472000024,amount:2000,name:"Compra estampita semáforo",catId:"wants",subcat:"Otro",date:"2026-01-27T00:00:00"},
  {id:1769472000025,amount:1000,name:"Limpiavidrios",catId:"wants",subcat:"Otro",date:"2026-01-27T00:00:00"},
  {id:1769472000026,amount:18800,name:"Cena con Agus",catId:"wants",subcat:"Restaurantes",date:"2026-01-27T00:00:00"},
  {id:1769558400027,amount:18000,name:"Salida con Agus",catId:"wants",subcat:"Entretenimiento",date:"2026-01-28T00:00:00"},
  {id:1769558400028,amount:20000,name:"Presto plata a mi viejo",catId:"wants",subcat:"Otro",date:"2026-01-28T00:00:00"},
  {id:1769644800029,amount:30350.62,name:"Pago patente",catId:"needs",subcat:"Transporte",date:"2026-01-29T00:00:00"},
  {id:1769731200030,amount:34500,name:"Entradas Konzept",catId:"wants",subcat:"Entretenimiento",date:"2026-01-30T00:00:00"},
  {id:1769904000031,amount:63031.5,name:"Nafta",catId:"needs",subcat:"Transporte",date:"2026-02-01T00:00:00"},
  {id:1769990400032,amount:43152.25,name:"Pago tarjeta de crédito",catId:"needs",subcat:"Otro",date:"2026-02-02T00:00:00"},
  {id:1769990400033,amount:32.5,name:"Pago tarjeta de crédito",catId:"needs",subcat:"Otro",date:"2026-02-02T00:00:00"},
  {id:1769990400034,amount:97057.65,name:"Pago VTV",catId:"needs",subcat:"Transporte",date:"2026-02-02T00:00:00"},
  {id:1770076800035,amount:76315,name:"Internet",catId:"needs",subcat:"Servicios",date:"2026-02-03T00:00:00"},
  {id:1770076800036,amount:0.99,name:"APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-02-03T00:00:00"},
  {id:1770076800037,amount:1.99,name:"APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-02-03T00:00:00"},
  {id:1770249600038,amount:81125.31,name:"Obra social",catId:"needs",subcat:"Salud",date:"2026-02-05T00:00:00"},
  {id:1770681600039,amount:30,name:"Créditos Lovable",catId:"needs",subcat:"Servicios",date:"2026-02-10T00:00:00"},
  {id:1770681600040,amount:20000,name:"Presto plata a Agustina",catId:"wants",subcat:"Otro",date:"2026-02-10T00:00:00"},
  {id:1770681600041,amount:15000,name:"Presto plata a Luciano",catId:"wants",subcat:"Otro",date:"2026-02-10T00:00:00"},
  {id:1770681600042,amount:44000,name:"Presto plata a Luciano",catId:"wants",subcat:"Otro",date:"2026-02-10T00:00:00"},
  {id:1770854400043,amount:35000,name:"Lavado del auto",catId:"wants",subcat:"Otro",date:"2026-02-12T00:00:00"},
  {id:1770854400044,amount:25000,name:"Masajes",catId:"needs",subcat:"Salud",date:"2026-02-12T00:00:00"},
  {id:1770854400045,amount:46015,name:"Nafta y aceite",catId:"needs",subcat:"Transporte",date:"2026-02-12T00:00:00"},
  {id:1770854400046,amount:5000,name:"Carga celular",catId:"needs",subcat:"Servicios",date:"2026-02-12T00:00:00"},
  {id:1770940800047,amount:3600,name:"Estacionamiento Necochea",catId:"wants",subcat:"Viajes",date:"2026-02-13T00:00:00"},
  {id:1770940800048,amount:1300,name:"Peaje ida",catId:"wants",subcat:"Viajes",date:"2026-02-13T00:00:00"},
  {id:1770940800049,amount:1300,name:"Peaje vuelta",catId:"wants",subcat:"Viajes",date:"2026-02-13T00:00:00"},
  {id:1770940800050,amount:20000,name:"Churros mate Necochea",catId:"wants",subcat:"Restaurantes",date:"2026-02-13T00:00:00"},
  {id:1770940800051,amount:150000,name:"Presto plata a mi viejo",catId:"wants",subcat:"Otro",date:"2026-02-13T00:00:00"},
  {id:1770940800052,amount:20,name:"Chat GPT",catId:"needs",subcat:"Servicios",date:"2026-02-13T00:00:00"},
  {id:1771027200053,amount:40000,name:"Cena con Agus - San Valentín",catId:"wants",subcat:"Restaurantes",date:"2026-02-14T00:00:00"},
  {id:1771027200054,amount:7000,name:"Tortas fritas",catId:"wants",subcat:"Restaurantes",date:"2026-02-14T00:00:00"},
  {id:1771200000055,amount:3000,name:"Pochoclos",catId:"wants",subcat:"Restaurantes",date:"2026-02-16T00:00:00"},
  {id:1771286400056,amount:65000,name:"Nafta",catId:"needs",subcat:"Transporte",date:"2026-02-17T00:00:00"},
  {id:1771286400057,amount:21399,name:"Servidor VPS Mensual",catId:"needs",subcat:"Servicios",date:"2026-02-17T00:00:00"},
  {id:1771459200058,amount:35000,name:"Psicóloga",catId:"needs",subcat:"Salud",date:"2026-02-19T00:00:00"},
  {id:1771459200059,amount:2200,name:"Pan",catId:"needs",subcat:"Supermercado",date:"2026-02-19T00:00:00"},
  {id:1771545600060,amount:52231.74,name:"Monotributo",catId:"needs",subcat:"Otro",date:"2026-02-20T00:00:00"},
  {id:1771372800061,amount:20,name:"Chat GPT",catId:"needs",subcat:"Servicios",date:"2026-02-18T00:00:00"},
  {id:1771632000062,amount:5,name:"Créditos Claude",catId:"needs",subcat:"Servicios",date:"2026-02-21T00:00:00"},
  {id:1771632000063,amount:4600,name:"Coca cola",catId:"wants",subcat:"Restaurantes",date:"2026-02-21T00:00:00"},
  {id:1771891200064,amount:62,name:"Créditos Claude (varios)",catId:"needs",subcat:"Servicios",date:"2026-02-24T00:00:00"},
  {id:1771891200065,amount:29,name:"Apify",catId:"needs",subcat:"Servicios",date:"2026-02-24T00:00:00"},
  {id:1771891200066,amount:8100,name:"Compra chino",catId:"needs",subcat:"Supermercado",date:"2026-02-24T00:00:00"},
  {id:1771891200067,amount:8000,name:"Fútbol 5",catId:"wants",subcat:"Entretenimiento",date:"2026-02-24T00:00:00"},
  {id:1772064000068,amount:58500,name:"Gimnasio",catId:"needs",subcat:"Salud",date:"2026-02-26T00:00:00"},
  {id:1772064000069,amount:2716.49,name:"Pago Spotify",catId:"wants",subcat:"Suscripciones",date:"2026-02-26T00:00:00"},
  {id:1772064000070,amount:42.5,name:"Lovable",catId:"needs",subcat:"Servicios",date:"2026-02-26T00:00:00"},
  {id:1772150400071,amount:7000,name:"Panadería",catId:"wants",subcat:"Restaurantes",date:"2026-02-27T00:00:00"},
  {id:1772236800072,amount:5000,name:"Carga celular",catId:"needs",subcat:"Servicios",date:"2026-02-28T00:00:00"},
  {id:1772236800073,amount:15000,name:"Antares",catId:"wants",subcat:"Restaurantes",date:"2026-02-28T00:00:00"},
  {id:1772236800074,amount:10000,name:"Glow",catId:"wants",subcat:"Entretenimiento",date:"2026-02-28T00:00:00"},
  {id:1772323200075,amount:17000,name:"Cancha",catId:"wants",subcat:"Entretenimiento",date:"2026-03-01T00:00:00"},
  {id:1772323200076,amount:2200,name:"Pan",catId:"wants",subcat:"Restaurantes",date:"2026-03-01T00:00:00"},
  {id:1772323200077,amount:21940,name:"Picada",catId:"wants",subcat:"Restaurantes",date:"2026-03-01T00:00:00"},
  {id:1772323200078,amount:1000,name:"Limpiavidrios",catId:"wants",subcat:"Otro",date:"2026-03-01T00:00:00"},
  {id:1772323200079,amount:54428.06,name:"Pago tarjeta de crédito",catId:"needs",subcat:"Otro",date:"2026-03-01T00:00:00"},
  {id:1772409600080,amount:91,name:"Pago tarjeta de crédito",catId:"needs",subcat:"Otro",date:"2026-03-02T00:00:00"},
  {id:1772409600081,amount:34899,name:"Servidor VPS Mensual",catId:"needs",subcat:"Servicios",date:"2026-03-02T00:00:00"},
  {id:1772409600082,amount:21109.26,name:"Dominio Sigma Tecnologías",catId:"needs",subcat:"Servicios",date:"2026-03-02T00:00:00"},
  {id:1772668800083,amount:63007.47,name:"Nafta",catId:"needs",subcat:"Transporte",date:"2026-03-05T00:00:00"},
  {id:1772668800084,amount:80269.03,name:"Obra social",catId:"needs",subcat:"Salud",date:"2026-03-05T00:00:00"},
  {id:1772668800085,amount:35000,name:"Psicóloga",catId:"needs",subcat:"Salud",date:"2026-03-05T00:00:00"},
  {id:1772755200086,amount:16000,name:"Peluquería",catId:"wants",subcat:"Entretenimiento",date:"2026-03-06T00:00:00"},
  {id:1772928000087,amount:21100,name:"Gastos chino",catId:"wants",subcat:"Restaurantes",date:"2026-03-08T00:00:00"},
  {id:1773014400088,amount:27583.72,name:"Pago seguro auto",catId:"needs",subcat:"Transporte",date:"2026-03-09T00:00:00"},
  {id:1773014400089,amount:2600,name:"Kiosco",catId:"wants",subcat:"Restaurantes",date:"2026-03-09T00:00:00"},
  {id:1773878400090,amount:5000,name:"Carga celular",catId:"needs",subcat:"Servicios",date:"2026-03-19T00:00:00"},
  {id:1773878400091,amount:35000,name:"Psicóloga",catId:"needs",subcat:"Salud",date:"2026-03-19T00:00:00"},
  {id:1774137600092,amount:52231.74,name:"Monotributo",catId:"needs",subcat:"Otro",date:"2026-03-22T00:00:00"},
  {id:1774137600093,amount:10000,name:"Antares",catId:"wants",subcat:"Restaurantes",date:"2026-03-22T00:00:00"},
  {id:1774224000094,amount:12500,name:"San Patricio",catId:"wants",subcat:"Restaurantes",date:"2026-03-23T00:00:00"},
  {id:1774310400095,amount:40.79,name:"Apify",catId:"needs",subcat:"Servicios",date:"2026-03-24T00:00:00"},
  {id:1774569600096,amount:29402,name:"Compra chino",catId:"wants",subcat:"Restaurantes",date:"2026-03-27T00:00:00"},
  {id:1774656000097,amount:5000,name:"Carga celular",catId:"needs",subcat:"Servicios",date:"2026-03-28T00:00:00"},
  {id:1774656000098,amount:74007,name:"Nafta",catId:"needs",subcat:"Transporte",date:"2026-03-28T00:00:00"},
  {id:1774656000099,amount:4500,name:"Coca cola",catId:"wants",subcat:"Restaurantes",date:"2026-03-28T00:00:00"},
  {id:1774656000100,amount:8500,name:"Asado",catId:"wants",subcat:"Restaurantes",date:"2026-03-28T00:00:00"},
  {id:1774656000101,amount:2700,name:"Fernet",catId:"wants",subcat:"Restaurantes",date:"2026-03-28T00:00:00"},
  {id:1774915200102,amount:27587,name:"Pago seguro auto",catId:"needs",subcat:"Transporte",date:"2026-03-31T00:00:00"},
  {id:1774915200103,amount:62640.24,name:"Pago tarjeta de crédito",catId:"needs",subcat:"Otro",date:"2026-03-31T00:00:00"},
  {id:1775001600104,amount:22800,name:"Cargador portátil",catId:"needs",subcat:"Otro",date:"2026-04-01T00:00:00"},
];

/* ─── First-run seed ────────────────────────────────────────────────────────── */
(function seedOnce() {
  try {
    if (!localStorage.getItem("ff_income")) localStorage.setItem("ff_income", JSON.stringify(SEED_INCOME));
    if (!localStorage.getItem("ff_txs"))    localStorage.setItem("ff_txs",    JSON.stringify(SEED_TXS));
  } catch (_) {}
})();

/* ─── Constants ─────────────────────────────────────────────────────────────── */
const CATS = [
  { id: "needs",   label: "Necesidades", pct: 0.5, color: "#CCFF00", Icon: ShoppingCart },
  { id: "wants",   label: "Deseos",      pct: 0.3, color: "#00D4FF", Icon: Zap           },
  { id: "savings", label: "Ahorro",      pct: 0.2, color: "#FF6B35", Icon: PiggyBank     },
];

const SUBCATS = {
  needs:   ["Alquiler/Hipoteca", "Supermercado", "Servicios", "Transporte", "Salud", "Otro"],
  wants:   ["Entretenimiento", "Ropa", "Restaurantes", "Viajes", "Suscripciones", "Otro"],
  savings: ["Inversión", "Fondo emergencias", "Retiro", "Metas", "Otro"],
};

/* ─── localStorage hook ─────────────────────────────────────────────────────── */
function useLS(key, fallback) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; }
    catch (_) { return fallback; }
  });
  const save = useCallback((v) => {
    setVal((prev) => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch (_) {}
      return next;
    });
  }, [key]);
  return [val, save];
}

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const ars = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

/* ─── Ring ──────────────────────────────────────────────────────────────────── */
function Ring({ pct, color, size = 110, sw = 9, children }) {
  const r    = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const over = pct > 1;
  const fill = circ * Math.min(pct, 1);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={over ? "#FF3B30" : color} strokeWidth={sw}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray .6s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── BudgetCard ────────────────────────────────────────────────────────────── */
function BudgetCard({ cat, budget, spent }) {
  const pct  = budget > 0 ? spent / budget : 0;
  const over = pct > 1;
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${over ? "rgba(255,59,48,.3)" : "rgba(255,255,255,.07)"}`, borderRadius: 20, padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <Ring pct={pct} color={cat.color}>
        <cat.Icon size={18} color={cat.color} />
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, marginTop: 2 }}>{Math.round(pct * 100)}%</span>
      </Ring>
      <div style={{ textAlign: "center", width: "100%" }}>
        <p style={{ color: cat.color, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>{cat.label}</p>
        <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "4px 0 2px" }}>{ars(spent)}</p>
        <p style={{ color: "rgba(255,255,255,.35)", fontSize: 11, margin: 0 }}>/ {ars(budget)}</p>
      </div>
      <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,.06)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(pct * 100, 100)}%`, background: over ? "#FF3B30" : cat.color, borderRadius: 99, transition: "width .6s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <span style={{ color: "rgba(255,255,255,.4)", fontSize: 10 }}>Restante</span>
        <span style={{ color: over ? "#FF3B30" : "rgba(255,255,255,.7)", fontSize: 10, fontWeight: 600 }}>
          {over ? `−${ars(spent - budget)}` : ars(budget - spent)}
        </span>
      </div>
    </div>
  );
}

/* ─── TxItem ────────────────────────────────────────────────────────────────── */
function TxItem({ tx, onDelete }) {
  const cat  = CATS.find((c) => c.id === tx.catId) ?? CATS[0];
  const date = new Date(tx.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
      <div style={{ width: 42, height: 42, borderRadius: 13, background: `${cat.color}18`, border: `1px solid ${cat.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <cat.Icon size={17} color={cat.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.name}</p>
        <p style={{ color: "rgba(255,255,255,.4)", fontSize: 11, margin: "2px 0 0" }}>{tx.subcat} · {date}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>{ars(tx.amount)}</span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(tx.id); }}
          style={{ background: "rgba(255,59,48,.1)", border: "1px solid rgba(255,59,48,.25)", borderRadius: 9, padding: 7, cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <Trash2 size={13} color="#FF3B30" />
        </button>
      </div>
    </div>
  );
}

/* ─── IncomeModal ───────────────────────────────────────────────────────────── */
function IncomeModal({ current, onSave, onClose }) {
  const [val, setVal] = useState(current > 0 ? String(current) : "");
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => ref.current?.focus(), 80); return () => clearTimeout(t); }, []);

  const handleSave = () => {
    const n = parseFloat(String(val).replace(/\./g, "").replace(",", "."));
    if (n > 0) { onSave(n); onClose(); }
  };

  return (
    /* Backdrop — onPointerDown fires before focus loss, avoids accidental closes */
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.88)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{ width: "100%", maxWidth: 480, background: "#0d0d0d", border: "1px solid rgba(204,255,0,.22)", borderRadius: "22px 22px 0 0", padding: "28px 22px 44px" }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <p style={{ color: "#CCFF00", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>Configurar</p>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "3px 0 0" }}>Ingreso Mensual</h2>
          </div>
          <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,.08)", border: "none", borderRadius: 11, padding: 9, cursor: "pointer", display: "flex" }}>
            <X size={17} color="#fff" />
          </button>
        </div>

        <div style={{ background: "rgba(204,255,0,.05)", border: "1px solid rgba(204,255,0,.22)", borderRadius: 14, padding: "0 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#CCFF00", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>$</span>
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={val}
            onChange={(e) => setVal(e.target.value.replace(/[^0-9,.]/g, ""))}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            placeholder="0"
            style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 30, fontWeight: 700, width: "100%", padding: "14px 0" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 22 }}>
          {[500000, 750000, 944284, 1200000, 1500000, 2000000].map((n) => {
            const active = val === String(n);
            return (
              <button key={n} type="button" onClick={() => setVal(String(n))}
                style={{ background: active ? "rgba(204,255,0,.15)" : "rgba(255,255,255,.04)", border: `1px solid ${active ? "rgba(204,255,0,.5)" : "rgba(255,255,255,.08)"}`, borderRadius: 11, padding: "9px 4px", color: active ? "#CCFF00" : "rgba(255,255,255,.7)", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                {n === 944284 ? "Prom. real" : ars(n)}
              </button>
            );
          })}
        </div>

        <button type="button" onClick={handleSave}
          style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: "#CCFF00", color: "#000", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
          Guardar ingreso
        </button>
      </div>
    </div>
  );
}

/* ─── AddModal ──────────────────────────────────────────────────────────────── */
function AddModal({ onAdd, onClose }) {
  const [amount, setAmount] = useState("");
  const [name,   setName]   = useState("");
  const [catId,  setCatId]  = useState("needs");
  const [subcat, setSubcat] = useState(SUBCATS.needs[0]);
  const amountRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => amountRef.current?.focus(), 80); return () => clearTimeout(t); }, []);

  const cat    = CATS.find((c) => c.id === catId);
  /* canAdd: amount is a valid number > 0 AND name is not empty */
  const numVal = parseFloat(String(amount).replace(",", "."));
  const canAdd = !isNaN(numVal) && numVal > 0 && name.trim().length > 0;

  const handleCat = (id) => { setCatId(id); setSubcat(SUBCATS[id][0]); };

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({
      id:     Date.now(),
      amount: numVal,
      name:   name.trim(),
      catId,
      subcat,
      date:   new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.88)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{ width: "100%", maxWidth: 480, background: "#0d0d0d", border: "1px solid rgba(255,255,255,.1)", borderRadius: "22px 22px 0 0", padding: "28px 22px 44px" }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <p style={{ color: cat.color, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>Nuevo gasto</p>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "3px 0 0" }}>Registrar</h2>
          </div>
          <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,.08)", border: "none", borderRadius: 11, padding: 9, cursor: "pointer", display: "flex" }}>
            <X size={17} color="#fff" />
          </button>
        </div>

        {/* Amount input — type="text" + inputMode to avoid iOS number quirks */}
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "0 18px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,.35)", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>$</span>
          <input
            ref={amountRef}
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9,.]/g, ""))}
            onKeyDown={(e) => { if (e.key === "Enter") document.getElementById("ff-desc")?.focus(); }}
            placeholder="Monto"
            style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 28, fontWeight: 700, width: "100%", padding: "13px 0" }}
          />
        </div>

        {/* Name input */}
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "0 18px", marginBottom: 18 }}>
          <input
            id="ff-desc"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            placeholder="Descripción  (ej: Supermercado)"
            style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 15, width: "100%", padding: "15px 0" }}
          />
        </div>

        {/* Category buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          {CATS.map((c) => {
            const active = catId === c.id;
            return (
              <button key={c.id} type="button" onClick={() => handleCat(c.id)}
                style={{ background: active ? `${c.color}18` : "rgba(255,255,255,.04)", border: `1px solid ${active ? c.color + "70" : "rgba(255,255,255,.08)"}`, borderRadius: 13, padding: "13px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <c.Icon size={18} color={active ? c.color : "rgba(255,255,255,.35)"} />
                <span style={{ color: active ? c.color : "rgba(255,255,255,.45)", fontSize: 10, fontWeight: 700 }}>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Subcategory chips */}
        <div style={{ marginBottom: 22, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", gap: 7, paddingBottom: 2 }}>
            {SUBCATS[catId].map((s) => {
              const active = subcat === s;
              return (
                <button key={s} type="button" onClick={() => setSubcat(s)}
                  style={{ flexShrink: 0, background: active ? `${cat.color}22` : "rgba(255,255,255,.04)", border: `1px solid ${active ? cat.color + "60" : "rgba(255,255,255,.08)"}`, borderRadius: 18, padding: "7px 13px", cursor: "pointer", color: active ? cat.color : "rgba(255,255,255,.45)", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA — always visible, changes appearance based on canAdd */}
        <button
          type="button"
          onClick={handleAdd}
          style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            background: canAdd ? cat.color : "rgba(255,255,255,.08)",
            color:      canAdd ? "#000"     : "rgba(255,255,255,.3)",
            fontSize: 15, fontWeight: 800, cursor: "pointer",
            transition: "background .2s, color .2s",
          }}
        >
          {canAdd ? "Agregar gasto" : "Completá monto y descripción"}
        </button>
      </div>
    </div>
  );
}

/* ─── App ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [income, setIncome] = useLS("ff_income", SEED_INCOME);
  const [txs,    setTxs]    = useLS("ff_txs",    SEED_TXS);
  const [showIncome, setSI] = useState(false);
  const [showAdd,    setSA] = useState(false);
  const [tab,    setTab]    = useState("dashboard");
  const [filter, setFilter] = useState("all");

  const addTx = useCallback((tx) => setTxs((p) => [tx, ...p]), [setTxs]);
  const delTx = useCallback((id) => setTxs((p) => p.filter((t) => t.id !== id)), [setTxs]);

  const spent = CATS.reduce((acc, c) => {
    acc[c.id] = txs.filter((t) => t.catId === c.id).reduce((s, t) => s + t.amount, 0);
    return acc;
  }, {});
  const totalSpent  = Object.values(spent).reduce((a, b) => a + b, 0);
  const visibleTxs  = filter === "all" ? txs : txs.filter((t) => t.catId === filter);
  const monthCount  = new Set(txs.map((t) => t.date.slice(0, 7))).size;

  return (
    <div style={{ minHeight: "100dvh", background: "#000", color: "#fff", fontFamily: "'SF Pro Display',-apple-system,'Helvetica Neue',sans-serif", maxWidth: 480, margin: "0 auto", paddingBottom: 96 }}>
      <PWAHead />
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; background: #000; overscroll-behavior: none; }
        input::placeholder { color: rgba(255,255,255,.22); }
        ::-webkit-scrollbar { display: none; }
        @keyframes fu { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fu { animation: fu .35s ease forwards; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding: "52px 22px 22px", background: "linear-gradient(180deg,rgba(204,255,0,.04) 0%,transparent 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#CCFF00" }} />
              <span style={{ color: "rgba(255,255,255,.45)", fontSize: 11, textTransform: "uppercase", letterSpacing: 2 }}>
                {new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: -.5 }}>FinFlow</h1>
            <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,.3)", fontSize: 12 }}>Regla 50 · 30 · 20</p>
          </div>
          <button type="button" onClick={() => setSI(true)}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(204,255,0,.1)", border: "1px solid rgba(204,255,0,.28)", borderRadius: 13, padding: "9px 15px", cursor: "pointer" }}>
            <Settings size={15} color="#CCFF00" />
            <span style={{ color: "#CCFF00", fontSize: 12, fontWeight: 700 }}>Ingreso</span>
          </button>
        </div>

        {/* Summary card */}
        <div style={{ marginTop: 18, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 17, padding: "15px 18px", display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, margin: 0 }}>Ingreso mensual</p>
            <p style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "3px 0 0" }}>{ars(income)}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, margin: 0 }}>Total gastado</p>
            <p style={{ color: totalSpent > income ? "#FF3B30" : "#CCFF00", fontSize: 22, fontWeight: 800, margin: "3px 0 0" }}>{ars(totalSpent)}</p>
          </div>
        </div>

        {/* Import badge */}
        <div style={{ marginTop: 9, display: "flex", alignItems: "center", gap: 7, padding: "7px 13px", background: "rgba(204,255,0,.06)", border: "1px solid rgba(204,255,0,.14)", borderRadius: 10 }}>
          <Database size={12} color="#CCFF00" />
          <span style={{ color: "rgba(204,255,0,.75)", fontSize: 11 }}>
            {SEED_TXS.length} gastos importados del Excel · ene–abr 2026
          </span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ padding: "0 22px 2px" }}>
        <div style={{ display: "flex", background: "rgba(255,255,255,.05)", borderRadius: 13, padding: 4 }}>
          {[{ id: "dashboard", label: "Dashboard", Icon: BarChart3 }, { id: "history", label: "Historial", Icon: Clock }].map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: active ? "rgba(204,255,0,.15)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                <t.Icon size={15} color={active ? "#CCFF00" : "rgba(255,255,255,.38)"} />
                <span style={{ color: active ? "#CCFF00" : "rgba(255,255,255,.38)", fontSize: 13, fontWeight: 600 }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Dashboard ── */}
      {tab === "dashboard" && (
        <div className="fu" style={{ padding: "14px 22px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {CATS.map((cat) => <BudgetCard key={cat.id} cat={cat} budget={income * cat.pct} spent={spent[cat.id]} />)}
          </div>

          {/* Distribution bars */}
          <div style={{ marginTop: 14, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 17, padding: "15px 18px" }}>
            <p style={{ color: "rgba(255,255,255,.45)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 13px" }}>Distribución acumulada</p>
            {CATS.map((cat) => {
              const budget = income * cat.pct;
              const s      = spent[cat.id];
              const pct    = budget > 0 ? Math.min(s / budget, 1) : 0;
              const over   = s > budget;
              return (
                <div key={cat.id} style={{ marginBottom: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: cat.color, fontSize: 12, fontWeight: 600 }}>
                      {cat.label} <span style={{ color: "rgba(255,255,255,.28)", fontWeight: 400 }}>({cat.pct * 100}%)</span>
                    </span>
                    <span style={{ color: over ? "#FF3B30" : "rgba(255,255,255,.55)", fontSize: 12 }}>{ars(s)} / {ars(budget)}</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,.06)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct * 100}%`, background: over ? "#FF3B30" : cat.color, borderRadius: 99, transition: "width .6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Patrimonio", value: ars(1636425), sub: "al 01/04/2026", accent: "#CCFF00" },
              { label: "Registros",  value: txs.length,  sub: `${monthCount} meses de historial`, accent: "#fff" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "13px 15px" }}>
                <p style={{ color: "rgba(255,255,255,.38)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 3px" }}>{s.label}</p>
                <p style={{ color: s.accent, fontSize: 17, fontWeight: 800, margin: 0 }}>{s.value}</p>
                <p style={{ color: "rgba(255,255,255,.28)", fontSize: 10, margin: "2px 0 0" }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Recent */}
          {txs.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <p style={{ color: "rgba(255,255,255,.45)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, margin: 0 }}>Recientes</p>
                <button type="button" onClick={() => setTab("history")}
                  style={{ background: "none", border: "none", color: "#CCFF00", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                  Ver todo <ChevronRight size={13} />
                </button>
              </div>
              {txs.slice(0, 5).map((tx) => <TxItem key={tx.id} tx={tx} onDelete={delTx} />)}
            </div>
          )}
        </div>
      )}

      {/* ── History ── */}
      {tab === "history" && (
        <div className="fu" style={{ padding: "14px 22px" }}>
          <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 6, marginBottom: 10, WebkitOverflowScrolling: "touch" }}>
            {[{ id: "all", label: "Todos" }, ...CATS.map((c) => ({ id: c.id, label: c.label }))].map((f) => {
              const active = filter === f.id;
              return (
                <button key={f.id} type="button" onClick={() => setFilter(f.id)}
                  style={{ flexShrink: 0, background: active ? "rgba(204,255,0,.15)" : "rgba(255,255,255,.04)", border: `1px solid ${active ? "rgba(204,255,0,.45)" : "rgba(255,255,255,.08)"}`, borderRadius: 18, padding: "7px 15px", cursor: "pointer", color: active ? "#CCFF00" : "rgba(255,255,255,.45)", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>
                  {f.label}
                </button>
              );
            })}
          </div>

          {visibleTxs.length > 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ color: "rgba(255,255,255,.38)", fontSize: 12 }}>{visibleTxs.length} transacciones</span>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{ars(visibleTxs.reduce((s, t) => s + t.amount, 0))}</span>
              </div>
              {visibleTxs.map((tx) => <TxItem key={tx.id} tx={tx} onDelete={delTx} />)}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "52px 0" }}>
              <CheckCircle size={44} color="rgba(255,255,255,.12)" style={{ marginBottom: 14 }} />
              <p style={{ color: "rgba(255,255,255,.28)", fontSize: 14 }}>Sin transacciones</p>
            </div>
          )}
        </div>
      )}

      {/* ── FAB ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", padding: "0 24px 28px", zIndex: 50, pointerEvents: "none" }}>
        <button
          type="button"
          onClick={() => setSA(true)}
          style={{ pointerEvents: "auto", width: "100%", maxWidth: 436, background: "#CCFF00", border: "none", borderRadius: 17, padding: "17px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: "0 6px 28px rgba(204,255,0,.28)" }}
        >
          <Plus size={21} color="#000" strokeWidth={2.5} />
          <span style={{ color: "#000", fontSize: 15, fontWeight: 800, letterSpacing: .3 }}>Nuevo Gasto</span>
        </button>
      </div>

      {showIncome && <IncomeModal current={income} onSave={setIncome} onClose={() => setSI(false)} />}
      {showAdd    && <AddModal    onAdd={addTx}                       onClose={() => setSA(false)} />}
    </div>
  );
}
