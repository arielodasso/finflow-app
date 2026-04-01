const { useState, useEffect } = React;
// Esto mapea los iconos de Lucide para que funcionen
const { 
  ShoppingCart, PiggyBank, Plus, X, ChevronRight, 
  Settings, Trash2, CheckCircle, BarChart3, Clock, 
  Zap, Database 
} = lucide;

// AQUÍ PEGA TODO EL RESTO DEL CÓDIGO QUE TE DIO CLAUDE
import { useState, useEffect, useCallback, useRef } from "react";
import {
  ShoppingCart, PiggyBank, Plus, X,
  ChevronRight, Settings, Trash2, CheckCircle,
  BarChart3, Clock, Zap, Database
} from "lucide-react";

// ─── PWA Head ─────────────────────────────────────────────────────────────────
function PWAHead() {
  useEffect(() => {
    document.title = "FinFlow 50-30-20";
    const metas = [
      { name: "theme-color", content: "#000000" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "FinFlow" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "mobile-web-app-capable", content: "yes" },
    ];
    metas.forEach(({ name, content }) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
      el.content = content;
    });
  }, []);
  return null;
}

// ─── Datos reales extraídos del Excel ─────────────────────────────────────────
// Fuente: Plantilla 50/30/20 – hojas Ingresos, Gastos, Patrimonio
// Período: enero–abril 2026 | Solo transacciones con "Impacta resultados = Si"
// Mapeo de categorías Excel → App:
//   "Necesidades" → needs | "Deseos" → wants | "Ahorro / Inversión" → savings
// Ingreso base: promedio real 3 meses cobrados (ene $1.734.460 + feb $742.612 + mar $355.781) / 3
// Patrimonio al 01/04/2026: $1.636.425

const SEED_INCOME = 944284;

const SEED_TRANSACTIONS = [
  {id:1767484800000,amount:4500,name:"Palmeritas para merienda",catId:"wants",subcat:"Restaurantes",date:"2026-01-04T00:00:00"},
  {id:1767571200001,amount:257352.34,name:"Pago tarjeta de crédito",catId:"wants",subcat:"Otro",date:"2026-01-05T00:00:00"},
  {id:1767657600002,amount:76315,name:"Internet",catId:"needs",subcat:"Servicios",date:"2026-01-06T00:00:00"},
  {id:1767744000003,amount:32999,name:"Regalo Luciano",catId:"wants",subcat:"Otro",date:"2026-01-07T00:00:00"},
  {id:1767744000004,amount:15891,name:"Oralsone",catId:"needs",subcat:"Salud",date:"2026-01-07T00:00:00"},
  {id:1767571200005,amount:614.4,name:"IVA AFIP APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-01-05T00:00:00"},
  {id:1767571200006,amount:309.77,name:"IVA AFIP APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-01-05T00:00:00"},
  {id:1767571200007,amount:58.7,name:"PERC. IIBB SS DIGITALES CABA",catId:"needs",subcat:"Servicios",date:"2026-01-05T00:00:00"},
  {id:1767571200008,amount:29.5,name:"PERC. IIBB SS DIGITALES CABA",catId:"needs",subcat:"Servicios",date:"2026-01-05T00:00:00"},
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
  {id:1769904000032,amount:63031.5,name:"Nafta",catId:"needs",subcat:"Transporte",date:"2026-02-01T00:00:00"},
  {id:1769990400033,amount:43152.25,name:"Pago tarjeta de crédito",catId:"needs",subcat:"Otro",date:"2026-02-02T00:00:00"},
  {id:1769990400034,amount:32.5,name:"Pago tarjeta de crédito",catId:"needs",subcat:"Otro",date:"2026-02-02T00:00:00"},
  {id:1769990400035,amount:97057.65,name:"Pago VTV",catId:"needs",subcat:"Transporte",date:"2026-02-02T00:00:00"},
  {id:1770076800036,amount:76315,name:"Internet",catId:"needs",subcat:"Servicios",date:"2026-02-03T00:00:00"},
  {id:1770076800037,amount:0.99,name:"APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-02-03T00:00:00"},
  {id:1770076800038,amount:1.99,name:"APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-02-03T00:00:00"},
  {id:1770076800039,amount:0.41,name:"IVA AFIP APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-02-03T00:00:00"},
  {id:1770076800040,amount:0.04,name:"PERC. IIBB SS DIGITALES CABA",catId:"needs",subcat:"Servicios",date:"2026-02-03T00:00:00"},
  {id:1770076800041,amount:0.2,name:"IVA AFIP APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-02-03T00:00:00"},
  {id:1770076800042,amount:0.02,name:"PERC. IIBB SS DIGITALES CABA",catId:"needs",subcat:"Servicios",date:"2026-02-03T00:00:00"},
  {id:1770249600043,amount:81125.31,name:"Obra social",catId:"needs",subcat:"Salud",date:"2026-02-05T00:00:00"},
  {id:1770681600044,amount:30,name:"Créditos Lovable",catId:"needs",subcat:"Servicios",date:"2026-02-10T00:00:00"},
  {id:1770681600045,amount:20000,name:"Presto plata a Agustina",catId:"wants",subcat:"Otro",date:"2026-02-10T00:00:00"},
  {id:1770681600046,amount:15000,name:"Presto plata a Luciano",catId:"wants",subcat:"Otro",date:"2026-02-10T00:00:00"},
  {id:1770681600048,amount:44000,name:"Presto plata a Luciano",catId:"wants",subcat:"Otro",date:"2026-02-10T00:00:00"},
  {id:1770854400049,amount:35000,name:"Lavado del auto",catId:"wants",subcat:"Otro",date:"2026-02-12T00:00:00"},
  {id:1770854400050,amount:25000,name:"Masajes",catId:"needs",subcat:"Salud",date:"2026-02-12T00:00:00"},
  {id:1770854400051,amount:46015,name:"Nafta y aceite",catId:"needs",subcat:"Transporte",date:"2026-02-12T00:00:00"},
  {id:1770854400052,amount:5000,name:"Carga celular",catId:"needs",subcat:"Servicios",date:"2026-02-12T00:00:00"},
  {id:1770940800053,amount:3600,name:"Estacionamiento Necochea",catId:"wants",subcat:"Viajes",date:"2026-02-13T00:00:00"},
  {id:1770940800054,amount:1300,name:"Peaje ida",catId:"wants",subcat:"Viajes",date:"2026-02-13T00:00:00"},
  {id:1770940800055,amount:1300,name:"Peaje vuelta",catId:"wants",subcat:"Viajes",date:"2026-02-13T00:00:00"},
  {id:1770940800056,amount:20000,name:"Churros mate Necochea",catId:"wants",subcat:"Restaurantes",date:"2026-02-13T00:00:00"},
  {id:1770940800057,amount:150000,name:"Presto plata a mi viejo",catId:"wants",subcat:"Otro",date:"2026-02-13T00:00:00"},
  {id:1770940800058,amount:20,name:"Chat GPT",catId:"needs",subcat:"Servicios",date:"2026-02-13T00:00:00"},
  {id:1771027200059,amount:40000,name:"Cena con Agus (San Valentín)",catId:"wants",subcat:"Restaurantes",date:"2026-02-14T00:00:00"},
  {id:1771027200060,amount:7000,name:"Tortas fritas",catId:"wants",subcat:"Restaurantes",date:"2026-02-14T00:00:00"},
  {id:1771200000061,amount:3000,name:"Pochoclos",catId:"wants",subcat:"Restaurantes",date:"2026-02-16T00:00:00"},
  {id:1771286400062,amount:65000,name:"Nafta",catId:"needs",subcat:"Transporte",date:"2026-02-17T00:00:00"},
  {id:1771286400063,amount:21399,name:"Servidor VPS Mensual",catId:"needs",subcat:"Servicios",date:"2026-02-17T00:00:00"},
  {id:1771459200064,amount:35000,name:"Psicóloga",catId:"needs",subcat:"Salud",date:"2026-02-19T00:00:00"},
  {id:1771459200065,amount:2200,name:"Pan",catId:"needs",subcat:"Supermercado",date:"2026-02-19T00:00:00"},
  {id:1771545600066,amount:52231.74,name:"Monotributo",catId:"needs",subcat:"Otro",date:"2026-02-20T00:00:00"},
  {id:1771372800067,amount:20,name:"Chat GPT",catId:"needs",subcat:"Servicios",date:"2026-02-18T00:00:00"},
  {id:1771632000068,amount:5,name:"Créditos Claude",catId:"needs",subcat:"Servicios",date:"2026-02-21T00:00:00"},
  {id:1771632000069,amount:4600,name:"Coca cola",catId:"wants",subcat:"Restaurantes",date:"2026-02-21T00:00:00"},
  {id:1771891200070,amount:7,name:"Créditos Claude",catId:"needs",subcat:"Servicios",date:"2026-02-24T00:00:00"},
  {id:1771891200071,amount:10,name:"Créditos Claude",catId:"needs",subcat:"Servicios",date:"2026-02-24T00:00:00"},
  {id:1771891200072,amount:10,name:"Créditos Claude",catId:"needs",subcat:"Servicios",date:"2026-02-24T00:00:00"},
  {id:1771891200073,amount:10,name:"Créditos Claude",catId:"needs",subcat:"Servicios",date:"2026-02-24T00:00:00"},
  {id:1771891200074,amount:10,name:"Créditos Claude",catId:"needs",subcat:"Servicios",date:"2026-02-24T00:00:00"},
  {id:1771891200075,amount:29,name:"Apify",catId:"needs",subcat:"Servicios",date:"2026-02-24T00:00:00"},
  {id:1771891200076,amount:10,name:"Créditos Claude",catId:"needs",subcat:"Servicios",date:"2026-02-24T00:00:00"},
  {id:1771891200077,amount:8100,name:"Compra chino",catId:"needs",subcat:"Supermercado",date:"2026-02-24T00:00:00"},
  {id:1771891200078,amount:8000,name:"Fútbol 5",catId:"wants",subcat:"Entretenimiento",date:"2026-02-24T00:00:00"},
  {id:1772064000079,amount:58500,name:"Gimnasio",catId:"needs",subcat:"Salud",date:"2026-02-26T00:00:00"},
  {id:1772064000080,amount:2716.49,name:"Pago Spotify",catId:"wants",subcat:"Suscripciones",date:"2026-02-26T00:00:00"},
  {id:1772064000081,amount:12.5,name:"Lovable",catId:"needs",subcat:"Servicios",date:"2026-02-26T00:00:00"},
  {id:1772064000082,amount:30,name:"Lovable",catId:"needs",subcat:"Servicios",date:"2026-02-26T00:00:00"},
  {id:1772150400083,amount:7000,name:"Panadería",catId:"wants",subcat:"Restaurantes",date:"2026-02-27T00:00:00"},
  {id:1772236800084,amount:5000,name:"Carga celular",catId:"needs",subcat:"Servicios",date:"2026-02-28T00:00:00"},
  {id:1772236800085,amount:15000,name:"Antares",catId:"wants",subcat:"Restaurantes",date:"2026-02-28T00:00:00"},
  {id:1772236800086,amount:10000,name:"Glow",catId:"wants",subcat:"Entretenimiento",date:"2026-02-28T00:00:00"},
  {id:1772323200087,amount:17000,name:"Cancha",catId:"wants",subcat:"Entretenimiento",date:"2026-03-01T00:00:00"},
  {id:1772323200088,amount:2200,name:"Pan",catId:"wants",subcat:"Restaurantes",date:"2026-03-01T00:00:00"},
  {id:1772323200089,amount:21940,name:"Picada",catId:"wants",subcat:"Restaurantes",date:"2026-03-01T00:00:00"},
  {id:1772323200090,amount:1000,name:"Limpiavidrios",catId:"wants",subcat:"Entretenimiento",date:"2026-03-01T00:00:00"},
  {id:1772323200091,amount:54428.06,name:"Pago tarjeta de crédito",catId:"needs",subcat:"Otro",date:"2026-03-01T00:00:00"},
  {id:1772409600094,amount:91,name:"Pago tarjeta de crédito",catId:"needs",subcat:"Otro",date:"2026-03-02T00:00:00"},
  {id:1772409600095,amount:34899,name:"Servidor VPS Mensual",catId:"needs",subcat:"Servicios",date:"2026-03-02T00:00:00"},
  {id:1772409600096,amount:21109.26,name:"Dominio Sigma Tecnologías",catId:"needs",subcat:"Servicios",date:"2026-03-02T00:00:00"},
  {id:1772496000097,amount:0.2,name:"IVA AFIP APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-03-03T00:00:00"},
  {id:1772496000098,amount:0.02,name:"PERC. IIBB SS DIGITALES CABA",catId:"needs",subcat:"Servicios",date:"2026-03-03T00:00:00"},
  {id:1772496000099,amount:0.04,name:"PERC. IIBB SS DIGITALES CABA",catId:"needs",subcat:"Servicios",date:"2026-03-03T00:00:00"},
  {id:1772496000100,amount:0.41,name:"IVA AFIP APPLE.COM/BILL",catId:"needs",subcat:"Servicios",date:"2026-03-03T00:00:00"},
  {id:1772668800101,amount:63007.47,name:"Nafta",catId:"needs",subcat:"Transporte",date:"2026-03-05T00:00:00"},
  {id:1772668800102,amount:80269.03,name:"Obra social",catId:"needs",subcat:"Salud",date:"2026-03-05T00:00:00"},
  {id:1772668800103,amount:35000,name:"Psicóloga",catId:"needs",subcat:"Salud",date:"2026-03-05T00:00:00"},
  {id:1772755200104,amount:16000,name:"Peluquería",catId:"wants",subcat:"Entretenimiento",date:"2026-03-06T00:00:00"},
  {id:1772928000105,amount:21100,name:"Gastos chino",catId:"wants",subcat:"Restaurantes",date:"2026-03-08T00:00:00"},
  {id:1773014400106,amount:27583.72,name:"Pago seguro auto",catId:"needs",subcat:"Transporte",date:"2026-03-09T00:00:00"},
  {id:1773014400107,amount:2600,name:"Kiosco",catId:"wants",subcat:"Restaurantes",date:"2026-03-09T00:00:00"},
  {id:1773878400108,amount:5000,name:"Carga celular",catId:"needs",subcat:"Servicios",date:"2026-03-19T00:00:00"},
  {id:1773878400109,amount:35000,name:"Psicóloga",catId:"needs",subcat:"Salud",date:"2026-03-19T00:00:00"},
  {id:1774137600110,amount:52231.74,name:"Monotributo",catId:"needs",subcat:"Otro",date:"2026-03-22T00:00:00"},
  {id:1774137600111,amount:10000,name:"Antares",catId:"wants",subcat:"Restaurantes",date:"2026-03-22T00:00:00"},
  {id:1774224000112,amount:12500,name:"San Patricio",catId:"wants",subcat:"Restaurantes",date:"2026-03-23T00:00:00"},
  {id:1774310400113,amount:40.79,name:"Apify",catId:"needs",subcat:"Servicios",date:"2026-03-24T00:00:00"},
  {id:1774569600114,amount:29402,name:"Compra chino",catId:"wants",subcat:"Restaurantes",date:"2026-03-27T00:00:00"},
  {id:1774656000115,amount:5000,name:"Carga celular",catId:"needs",subcat:"Servicios",date:"2026-03-28T00:00:00"},
  {id:1774656000116,amount:74007,name:"Nafta",catId:"needs",subcat:"Transporte",date:"2026-03-28T00:00:00"},
  {id:1774656000117,amount:4500,name:"Coca cola",catId:"wants",subcat:"Restaurantes",date:"2026-03-28T00:00:00"},
  {id:1774656000118,amount:8500,name:"Asado",catId:"wants",subcat:"Restaurantes",date:"2026-03-28T00:00:00"},
  {id:1774656000119,amount:2700,name:"Fernet",catId:"wants",subcat:"Restaurantes",date:"2026-03-28T00:00:00"},
  {id:1774915200120,amount:27587,name:"Pago seguro auto",catId:"needs",subcat:"Transporte",date:"2026-03-31T00:00:00"},
  {id:1774915200121,amount:62640.24,name:"Pago tarjeta de crédito",catId:"needs",subcat:"Otro",date:"2026-03-31T00:00:00"},
  {id:1775001600122,amount:22800,name:"Cargador portátil",catId:"needs",subcat:"Otro",date:"2026-04-01T00:00:00"},
];

// ─── Seed localStorage on first load ─────────────────────────────────────────
(function seedIfEmpty() {
  try {
    if (!localStorage.getItem("finflow_income")) localStorage.setItem("finflow_income", JSON.stringify(SEED_INCOME));
    if (!localStorage.getItem("finflow_txs")) localStorage.setItem("finflow_txs", JSON.stringify(SEED_TRANSACTIONS));
  } catch {}
})();

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "needs", label: "Necesidades", pct: 0.5, color: "#CCFF00", icon: ShoppingCart },
  { id: "wants", label: "Deseos", pct: 0.3, color: "#00D4FF", icon: Zap },
  { id: "savings", label: "Ahorro", pct: 0.2, color: "#FF6B35", icon: PiggyBank },
];

const NEEDS_SUBCATS = ["Alquiler/Hipoteca", "Supermercado", "Servicios", "Transporte", "Salud", "Otro"];
const WANTS_SUBCATS = ["Entretenimiento", "Ropa", "Restaurantes", "Viajes", "Suscripciones", "Otro"];
const SAVINGS_SUBCATS = ["Inversión", "Fondo emergencias", "Retiro", "Metas", "Otro"];

function getSubcats(catId) {
  if (catId === "needs") return NEEDS_SUBCATS;
  if (catId === "wants") return WANTS_SUBCATS;
  return SAVINGS_SUBCATS;
}

// ─── Local Storage Hook ───────────────────────────────────────────────────────
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : defaultValue; }
    catch { return defaultValue; }
  });
  const set = useCallback((v) => {
    setValue(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [value, set];
}

const fmt = (n) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

// ─── Ring Progress ────────────────────────────────────────────────────────────
function RingProgress({ pct, color, size = 120, stroke = 10, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const over = pct > 1;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={over ? "#FF3B30" : color} strokeWidth={stroke}
          strokeDasharray={`${circ * Math.min(pct, 1)} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

// ─── Income Modal ─────────────────────────────────────────────────────────────
function IncomeModal({ current, onSave, onClose }) {
  const [val, setVal] = useState(current > 0 ? String(current) : "");
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const quickVals = [500000, 750000, 944284, 1200000, 1500000, 2000000];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, background: "linear-gradient(160deg,#0d0d0d,#111)", border: "1px solid rgba(204,255,0,0.2)", borderRadius: "24px 24px 0 0", padding: "32px 24px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <p style={{ color: "#CCFF00", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>Configurar</p>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "4px 0 0" }}>Ingreso Mensual</h2>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, padding: 10, cursor: "pointer" }}><X size={18} color="#fff" /></button>
        </div>
        <div style={{ background: "rgba(204,255,0,0.05)", border: "1px solid rgba(204,255,0,0.2)", borderRadius: 16, padding: "4px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#CCFF00", fontSize: 24, fontWeight: 700 }}>$</span>
          <input ref={ref} type="number" inputMode="numeric" value={val} onChange={e => setVal(e.target.value)} placeholder="0"
            style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 32, fontWeight: 700, width: "100%", padding: "16px 0" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {quickVals.map(n => (
            <button key={n} onClick={() => setVal(String(n))} style={{ background: val === String(n) ? "rgba(204,255,0,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${val === String(n) ? "rgba(204,255,0,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "10px 4px", color: val === String(n) ? "#CCFF00" : "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
              {n === 944284 ? "Prom. real" : fmt(n)}
            </button>
          ))}
        </div>
        <button onClick={() => { const n = parseFloat(val); if (n > 0) { onSave(n); onClose(); } }}
          style={{ width: "100%", padding: "18px", borderRadius: 16, border: "none", background: "#CCFF00", color: "#000", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          Guardar Ingreso
        </button>
      </div>
    </div>
  );
}

// ─── Add Expense Modal ────────────────────────────────────────────────────────
function AddExpenseModal({ onAdd, onClose }) {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [catId, setCatId] = useState("needs");
  const [subcat, setSubcat] = useState(NEEDS_SUBCATS[0]);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const cat = CATEGORIES.find(c => c.id === catId);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, background: "linear-gradient(160deg,#0d0d0d,#111)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px 24px 0 0", padding: "32px 24px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <p style={{ color: cat.color, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>Nuevo Gasto</p>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "4px 0 0" }}>Registrar</h2>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, padding: 10, cursor: "pointer" }}><X size={18} color="#fff" /></button>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "4px 20px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 24, fontWeight: 700 }}>$</span>
          <input ref={ref} type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Monto"
            style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 28, fontWeight: 700, width: "100%", padding: "14px 0" }} />
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "0 20px", marginBottom: 20 }}>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Descripción"
            style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 16, width: "100%", padding: "16px 0" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {CATEGORIES.map(c => {
            const Icon = c.icon;
            const active = catId === c.id;
            return (
              <button key={c.id} onClick={() => { setCatId(c.id); setSubcat(getSubcats(c.id)[0]); }}
                style={{ background: active ? `${c.color}15` : "rgba(255,255,255,0.04)", border: `1px solid ${active ? c.color+"60" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, padding: "14px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Icon size={20} color={active ? c.color : "rgba(255,255,255,0.4)"} />
                <span style={{ color: active ? c.color : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600 }}>{c.label}</span>
              </button>
            );
          })}
        </div>
        <div style={{ marginBottom: 24, overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
            {getSubcats(catId).map(s => (
              <button key={s} onClick={() => setSubcat(s)} style={{ background: subcat === s ? `${cat.color}20` : "rgba(255,255,255,0.04)", border: `1px solid ${subcat === s ? cat.color+"50" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap", color: subcat === s ? cat.color : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 500 }}>{s}</button>
            ))}
          </div>
        </div>
        <button onClick={() => { const n = parseFloat(amount); if (!n || !name.trim()) return; onAdd({ id: Date.now(), amount: n, name: name.trim(), catId, subcat, date: new Date().toISOString() }); onClose(); }}
          style={{ width: "100%", padding: "18px", borderRadius: 16, border: "none", background: cat.color, color: "#000", fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: (!amount || !name) ? 0.5 : 1 }}>
          Agregar Gasto
        </button>
      </div>
    </div>
  );
}

// ─── Tx Item ──────────────────────────────────────────────────────────────────
function TxItem({ tx, onDelete }) {
  const cat = CATEGORIES.find(c => c.id === tx.catId) || CATEGORIES[0];
  const Icon = cat.icon;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: `${cat.color}15`, border: `1px solid ${cat.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} color={cat.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.name}</p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "2px 0 0" }}>
          {tx.subcat} · {new Date(tx.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{fmt(tx.amount)}</span>
        <button onClick={() => onDelete(tx.id)} style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.2)", borderRadius: 10, padding: 8, cursor: "pointer" }}>
          <Trash2 size={14} color="#FF3B30" />
        </button>
      </div>
    </div>
  );
}

// ─── Budget Card ──────────────────────────────────────────────────────────────
function BudgetCard({ cat, budget, spent }) {
  const pct = budget > 0 ? spent / budget : 0;
  const over = pct > 1;
  const Icon = cat.icon;
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${over ? "rgba(255,59,48,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 20, padding: "20px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <RingProgress pct={pct} color={cat.color} size={110} stroke={9}>
        <Icon size={20} color={cat.color} />
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginTop: 2 }}>{Math.round(pct * 100)}%</span>
      </RingProgress>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: cat.color, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>{cat.label}</p>
        <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: "4px 0 2px" }}>{fmt(spent)}</p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>de {fmt(budget)}</p>
      </div>
      <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(pct * 100, 100)}%`, background: over ? "#FF3B30" : cat.color, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Restante</span>
        <span style={{ color: over ? "#FF3B30" : "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600 }}>
          {over ? `−${fmt(spent - budget)}` : fmt(budget - spent)}
        </span>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [income, setIncome] = useLocalStorage("finflow_income", SEED_INCOME);
  const [transactions, setTransactions] = useLocalStorage("finflow_txs", SEED_TRANSACTIONS);
  const [showIncome, setShowIncome] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [filterCat, setFilterCat] = useState("all");

  const addTx = useCallback((tx) => setTransactions(p => [tx, ...p]), [setTransactions]);
  const delTx = useCallback((id) => setTransactions(p => p.filter(t => t.id !== id)), [setTransactions]);

  const spentByCat = CATEGORIES.reduce((acc, c) => {
    acc[c.id] = transactions.filter(t => t.catId === c.id).reduce((s, t) => s + t.amount, 0);
    return acc;
  }, {});
  const totalSpent = Object.values(spentByCat).reduce((a, b) => a + b, 0);
  const filteredTx = filterCat === "all" ? transactions : transactions.filter(t => t.catId === filterCat);

  const months = [...new Set(transactions.map(t => t.date.slice(0, 7)))].length;
  const patrimony = 1636425;

  return (
    <div style={{ minHeight: "100dvh", background: "#000", color: "#fff", fontFamily: "'SF Pro Display',-apple-system,'Helvetica Neue',sans-serif", maxWidth: 480, margin: "0 auto", paddingBottom: 90 }}>
      <PWAHead />
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        body{margin:0;background:#000;overscroll-behavior:none}
        input::placeholder{color:rgba(255,255,255,0.2)}
        ::-webkit-scrollbar{display:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.4s ease forwards}
      `}</style>

      {/* Header */}
      <div style={{ padding: "56px 24px 24px", background: "linear-gradient(180deg,rgba(204,255,0,0.04) 0%,transparent 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#CCFF00" }} />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, textTransform: "uppercase", letterSpacing: 2 }}>
                {new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>FinFlow</h1>
            <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Regla 50 · 30 · 20</p>
          </div>
          <button onClick={() => setShowIncome(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(204,255,0,0.1)", border: "1px solid rgba(204,255,0,0.25)", borderRadius: 14, padding: "10px 16px", cursor: "pointer" }}>
            <Settings size={16} color="#CCFF00" />
            <span style={{ color: "#CCFF00", fontSize: 13, fontWeight: 600 }}>Ingreso</span>
          </button>
        </div>

        {/* Income card */}
        <div style={{ marginTop: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "16px 20px", display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, margin: 0 }}>Ingreso Mensual</p>
            <p style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: "4px 0 0" }}>{fmt(income)}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, margin: 0 }}>Total gastado</p>
            <p style={{ color: totalSpent > income ? "#FF3B30" : "#CCFF00", fontSize: 24, fontWeight: 800, margin: "4px 0 0" }}>{fmt(totalSpent)}</p>
          </div>
        </div>

        {/* Excel badge */}
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(204,255,0,0.06)", border: "1px solid rgba(204,255,0,0.15)", borderRadius: 12 }}>
          <Database size={13} color="#CCFF00" />
          <span style={{ color: "rgba(204,255,0,0.8)", fontSize: 12 }}>
            {SEED_TRANSACTIONS.length} gastos importados del Excel · ene–abr 2026
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 24px", marginBottom: 4 }}>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 4 }}>
          {[{ id: "dashboard", label: "Dashboard", icon: BarChart3 }, { id: "history", label: "Historial", icon: Clock }].map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: tab === t.id ? "rgba(204,255,0,0.15)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Icon size={16} color={tab === t.id ? "#CCFF00" : "rgba(255,255,255,0.4)"} />
                <span style={{ color: tab === t.id ? "#CCFF00" : "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 600 }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dashboard */}
      {tab === "dashboard" && (
        <div className="fu" style={{ padding: "16px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {CATEGORIES.map(cat => <BudgetCard key={cat.id} cat={cat} budget={income * cat.pct} spent={spentByCat[cat.id]} />)}
          </div>

          {/* Bars */}
          <div style={{ marginTop: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "16px 20px" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 14px" }}>Distribución acumulada</p>
            {CATEGORIES.map(cat => {
              const budget = income * cat.pct;
              const spent = spentByCat[cat.id];
              const pct = Math.min(budget > 0 ? spent / budget : 0, 1);
              const over = spent > budget;
              return (
                <div key={cat.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: cat.color, fontSize: 13, fontWeight: 600 }}>{cat.label} <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>({cat.pct * 100}%)</span></span>
                    <span style={{ color: over ? "#FF3B30" : "rgba(255,255,255,0.6)", fontSize: 13 }}>{fmt(spent)} / {fmt(budget)}</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct * 100}%`, background: over ? "#FF3B30" : cat.color, borderRadius: 99, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats grid */}
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 16px" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 4px" }}>Patrimonio</p>
              <p style={{ color: "#CCFF00", fontSize: 18, fontWeight: 800, margin: 0 }}>{fmt(patrimony)}</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: "2px 0 0" }}>al 01/04/2026</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 16px" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 4px" }}>Registros</p>
              <p style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: 0 }}>{transactions.length}</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: "2px 0 0" }}>{months} meses de historial</p>
            </div>
          </div>

          {/* Recent */}
          {transactions.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: 0 }}>Recientes</p>
                <button onClick={() => setTab("history")} style={{ background: "none", border: "none", color: "#CCFF00", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  Ver todo <ChevronRight size={14} />
                </button>
              </div>
              {transactions.slice(0, 5).map(tx => <TxItem key={tx.id} tx={tx} onDelete={delTx} />)}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {tab === "history" && (
        <div className="fu" style={{ padding: "16px 24px" }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
            {[{ id: "all", label: "Todos" }, ...CATEGORIES.map(c => ({ id: c.id, label: c.label }))].map(f => (
              <button key={f.id} onClick={() => setFilterCat(f.id)} style={{ background: filterCat === f.id ? "rgba(204,255,0,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${filterCat === f.id ? "rgba(204,255,0,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, padding: "8px 16px", cursor: "pointer", whiteSpace: "nowrap", color: filterCat === f.id ? "#CCFF00" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 500 }}>{f.label}</button>
            ))}
          </div>
          {filteredTx.length > 0 ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{filteredTx.length} transacciones</span>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{fmt(filteredTx.reduce((s, t) => s + t.amount, 0))}</span>
              </div>
              {filteredTx.map(tx => <TxItem key={tx.id} tx={tx} onDelete={delTx} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <CheckCircle size={48} color="rgba(255,255,255,0.15)" style={{ marginBottom: 16 }} />
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 15 }}>Sin transacciones en esta categoría</p>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setShowAdd(true)} style={{ position: "fixed", bottom: 28, right: "50%", transform: "translateX(50%)", maxWidth: 480, width: "calc(100% - 48px)", background: "#CCFF00", border: "none", borderRadius: 18, padding: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 8px 32px rgba(204,255,0,0.25)", zIndex: 50 }}>
        <Plus size={22} color="#000" strokeWidth={2.5} />
        <span style={{ color: "#000", fontSize: 16, fontWeight: 800 }}>Nuevo Gasto</span>
      </button>

      {showIncome && <IncomeModal current={income} onSave={setIncome} onClose={() => setShowIncome(false)} />}
      {showAdd && <AddExpenseModal onAdd={addTx} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
