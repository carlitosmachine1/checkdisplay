import { useState, useEffect, FormEvent } from "react";
import {
  Smartphone,
  Laptop,
  Cpu,
  Phone,
  Clock,
  Search,
  X,
  Check,
  MapPin,
  Battery,
  Wifi,
  User,
  Calendar,
  ArrowRight,
  Database,
  CheckCircle2,
  Menu,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  CloudLightning,
  QrCode
} from "lucide-react";

// Mock initial data
interface ClockInRecord {
  id: string;
  employeeName: string;
  role: string;
  timestamp: string;
  type: "personal" | "vehiculo" | "herramienta";
  assetName?: string;
  location: string;
  status: "success" | "offline" | "pending";
  battery: number;
}

const INITIAL_RECORDS: ClockInRecord[] = [
  {
    id: "REC-101",
    employeeName: "Alejandro Torres",
    role: "Supervisor de Obra",
    timestamp: "11:24:15 AM",
    type: "personal",
    location: "Frente Bosques - Lat 20.67",
    status: "success",
    battery: 94
  },
  {
    id: "REC-102",
    employeeName: "María Gómez",
    role: "Operador Maquinaria",
    timestamp: "11:15:30 AM",
    type: "vehiculo",
    assetName: "Excavadora CAT 320",
    location: "Frente Bosques - Lat 20.67",
    status: "success",
    battery: 89
  },
  {
    id: "REC-103",
    employeeName: "Roberto Sanz",
    role: "Técnico Electricista",
    timestamp: "10:50:11 AM",
    type: "herramienta",
    assetName: "Rotomartillo Bosch Pro",
    location: "Almacén General GDL",
    status: "offline",
    battery: 92
  },
  {
    id: "REC-104",
    employeeName: "Diana Ruiz",
    role: "Control de Calidad",
    timestamp: "09:30:22 AM",
    type: "personal",
    location: "Planta Industrial El Salto",
    status: "success",
    battery: 81
  },
  {
    id: "REC-105",
    employeeName: "Felipe Ortiz",
    role: "Ingeniero Civil",
    timestamp: "08:15:00 AM",
    type: "personal",
    location: "Frente Colinas - Lat 20.72",
    status: "success",
    battery: 74
  }
];

const AVAILABLE_STAF_SIMULATE = [
  { name: "Carlos Mendoza", role: "Albañilería Especializada", avatar: "👨‍🏭" },
  { name: "Sofía Martínez", role: "Líder de Cuadrilla", avatar: "👩‍💼" },
  { name: "Ignacio Vega", role: "Operador de Volquete", avatar: "👨‍🔧" },
  { name: "Laura Esparza", role: "Seguridad Industrial", avatar: "👩‍⚕️" }
];

const VEHICLE_ASSETS = ["Camión de Volteo #4", "Generador Diésel Cummins", "Montacargas Yale 4ton"];
const TOOL_ASSETS = ["Esmeril Angular Dewalt", "Estación Total Topcon GPT", "Soldadora Inverter Soland"];

export default function App() {
  // Navigation active focus state
  const [activeTab, setActiveTab] = useState<"inicio" | "ecosistema" | "beneficios" | "simulador" | "contacto">("inicio");
  
  // Real-time local clock
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const gdlTime = new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
      setTimeStr(gdlTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Demo scheduler modal state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoFormData, setDemoFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    employeesCount: "1-10",
    interestModule: "Full Ecosistema"
  });
  const [isDemoSubmitted, setIsDemoSubmitted] = useState(false);

  // App simulation states
  const [simFilterType, setSimFilterType] = useState<"todos" | "personal" | "vehiculo" | "herramienta">("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [simLogs, setSimLogs] = useState<ClockInRecord[]>(INITIAL_RECORDS);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Selector for NFC simulation tool
  const [selectedSimStaff, setSelectedSimStaff] = useState(AVAILABLE_STAF_SIMULATE[0]);
  const [simAssetType, setSimAssetType] = useState<"personal" | "vehiculo" | "herramienta">("personal");
  const [selectedSimVehicle, setSelectedSimVehicle] = useState(VEHICLE_ASSETS[0]);
  const [selectedSimTool, setSelectedSimTool] = useState(TOOL_ASSETS[0]);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Product exploration state
  const [selectedProductDetail, setSelectedProductDetail] = useState<"dashboard" | "app" | "kiosko" | null>(null);

  const handleCreateDemo = (e: FormEvent) => {
    e.preventDefault();
    if (!demoFormData.fullName || !demoFormData.email) return;
    setIsDemoSubmitted(true);
    setTimeout(() => {
      setIsDemoSubmitted(false);
      setIsDemoModalOpen(false);
      setDemoFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        employeesCount: "1-10",
        interestModule: "Full Ecosistema"
      });
      triggerToast("¡Demo agendada con éxito! Nos comunicaremos contigo en breve.");
    }, 2000);
  };

  const triggerToast = (msg: string) => {
    setRecentNotification(msg);
    setTimeout(() => {
      setRecentNotification(null);
    }, 4000);
  };

  // Perform a simulated check-in
  const simulateCheckIn = () => {
    let name = selectedSimStaff.name;
    let desc = selectedSimStaff.role;
    let assetNameInput: string | undefined = undefined;

    if (simAssetType === "vehiculo") {
      name = selectedSimStaff.name; // Supervisor who scans vehicle
      assetNameInput = selectedSimVehicle;
    } else if (simAssetType === "herramienta") {
      name = selectedSimStaff.name; // Supervisor who scans tool
      assetNameInput = selectedSimTool;
    }

    const currentLocalTime = new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    const newRecord: ClockInRecord = {
      id: "REC-" + Math.floor(100 + Math.random() * 900),
      employeeName: name,
      role: desc,
      timestamp: currentLocalTime,
      type: simAssetType,
      assetName: assetNameInput,
      location: simAssetType === "personal" ? "Frente Obras Sur - GPS Ok" : "Caseta Control GDL",
      status: isOfflineMode ? "offline" : "success",
      battery: Math.floor(70 + Math.random() * 30)
    };

    setSimLogs([newRecord, ...simLogs]);
    triggerToast(
      `🔔 Tarjeta NFC detectada: Record ${newRecord.id} registrado para ${newRecord.employeeName} ${
        assetNameInput ? `(${assetNameInput})` : ""
      }`
    );
  };

  const filteredLogs = simLogs.filter((log) => {
    const matchesTab = simFilterType === "todos" || log.type === simFilterType;
    const matchesSearch =
      log.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.assetName && log.assetName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Dynamic Action Notification Bubble */}
      {recentNotification && (
        <div className="fixed top-20 right-6 z-50 animate-bounce max-w-sm bg-blue-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-blue-700 flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold leading-none">!</span>
          </div>
          <div>
            <p className="text-sm font-semibold">{recentNotification}</p>
          </div>
          <button 
            onClick={() => setRecentNotification(null)}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Modern Navigation Header */}
      <nav id="navbar_container" className="h-16 px-4 sm:px-10 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center shadow-md">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900">CheckDisplay</span>
            <span className="text-[10px] tracking-widest text-slate-400 font-extrabold uppercase -mt-1 hidden sm:inline">NFC Ecosystem</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="flex items-center gap-4 sm:gap-8 text-sm font-semibold text-slate-600">
          <a 
            href="#ecosystem" 
            onClick={() => setActiveTab("ecosistema")}
            className={`hover:text-blue-800 transition-colors py-1 ${activeTab === "ecosistema" ? "text-blue-800 border-b-2 border-blue-800" : ""}`}
          >
            Ecosistema
          </a>
          <a 
            href="#beneficios" 
            onClick={() => setActiveTab("beneficios")}
            className={`hover:text-blue-800 transition-colors py-1 ${activeTab === "beneficios" ? "text-blue-800 border-b-2 border-blue-800" : ""}`}
          >
            Beneficios
          </a>
          <a 
            href="#contacto" 
            onClick={() => setActiveTab("contacto")}
            className={`hover:text-blue-800 transition-colors py-1 ${activeTab === "contacto" ? "text-blue-800 border-b-2 border-blue-800" : ""}`}
          >
            Contacto
          </a>
          <button 
            id="register_demo_btn"
            onClick={() => setIsDemoModalOpen(true)}
            className="bg-blue-800 text-white px-4 sm:px-5 py-2 rounded-full font-bold hover:bg-blue-900 active:scale-95 transition-all text-xs sm:text-sm shadow-md"
          >
            Agendar Demo
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-8">
        
        {/* Banner Section (Grid cols 12) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xs relative overflow-hidden">
          
          {/* Subtle design elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60"></div>
          
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Lanzamiento 2026
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Control total de personal y activos.<br />
              <span className="text-blue-800">Sin cables, sin infraestructura.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Gestión de asistencia en campo y flujo de herramientas/vehículos mediante etiquetas NFC de bajo costo y tecnología móvil para supervisores. El ecosistema portátil definitivo.
            </p>

            <div className="flex flex-wrap gap-4 items-center pt-2">
              <a 
                href="tel:3322223518" 
                onClick={() => triggerToast("Llamando al soporte técnico... Tel: 33 2222 3518")}
                className="bg-white border border-slate-200 text-slate-900 px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
              >
                <Phone className="w-5 h-5 text-blue-800" />
                <span>33 2222 3518</span>
              </a>

              {/* Company counters */}
              <div className="flex -space-x-3 overflow-hidden items-center ml-2">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  +50
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold shadow-sm text-slate-700">
                  🏗️
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-xs font-bold shadow-sm text-slate-700">
                  ⚡
                </div>
                <span className="pl-6 text-sm font-semibold text-slate-500">
                  Empresas confían en nosotros
                </span>
              </div>
            </div>

            {/* Offline notification banner inside hero */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 max-w-lg mt-2 text-xs">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 font-bold">
                ✓
              </div>
              <div>
                <span className="font-bold text-slate-800 block">Sincronización Total Inteligente</span>
                <p className="text-slate-500">Los dispositivos recopilan tags NFC sin internet y cargan el historial al conectar.</p>
              </div>
            </div>
          </div>

          {/* Interactive Core Simulator Screen (Replaces image with live control) */}
          <div className="lg:col-span-5 flex flex-col h-full bg-slate-900 text-slate-200 p-5 sm:p-6 rounded-2xl shadow-2xl border border-slate-800 relative z-10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Supervisor App Terminal</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <span>96%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className={`w-4 h-4 ${isOfflineMode ? "text-red-400 line-through" : "text-blue-400 animate-pulse"}`} />
                  <span>{isOfflineMode ? "Desconectado" : "Online"}</span>
                </div>
              </div>
            </div>

            {/* Simulated Live UI Screen */}
            <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Reloj México (UTC-6)</span>
                <span className="font-mono text-emerald-400 font-semibold">{timeStr || "Cargando..."}</span>
              </div>

              {/* Selector for Simulation */}
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  1. Seleccionar Tipo de Recurso NFC:
                </label>
                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => { setSimAssetType("personal"); }}
                    className={`py-1 text-xs font-semibold rounded ${
                      simAssetType === "personal"
                        ? "bg-blue-800 text-white"
                        : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    Personal
                  </button>
                  <button
                    onClick={() => { setSimAssetType("vehiculo"); }}
                    className={`py-1 text-xs font-semibold rounded ${
                      simAssetType === "vehiculo"
                        ? "bg-blue-800 text-white"
                        : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    Vehículo
                  </button>
                  <button
                    onClick={() => { setSimAssetType("herramienta"); }}
                    className={`py-1 text-xs font-semibold rounded ${
                      simAssetType === "herramienta"
                        ? "bg-blue-800 text-white"
                        : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    Herramienta
                  </button>
                </div>

                {/* Sub configuration options based on type */}
                {simAssetType === "personal" && (
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-blue-400">Colaborador en Turno:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_STAF_SIMULATE.map((staff) => (
                        <button
                          key={staff.name}
                          onClick={() => setSelectedSimStaff(staff)}
                          className={`flex items-center gap-1.5 p-1.5 rounded text-left text-xs border transition-all ${
                            selectedSimStaff.name === staff.name
                              ? "bg-slate-800 border-blue-500 text-white"
                              : "bg-slate-900 border-slate-800 text-slate-400 font-normal"
                          }`}
                        >
                          <span className="text-sm">{staff.avatar}</span>
                          <span className="truncate">{staff.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {simAssetType === "vehiculo" && (
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-blue-400">Pegatina NFC en Vehículo:</span>
                    <div className="flex flex-col gap-1.5">
                      {VEHICLE_ASSETS.map((v) => (
                        <button
                          key={v}
                          onClick={() => setSelectedSimVehicle(v)}
                          className={`p-1.5 rounded text-left text-xs border transition-all truncate block ${
                            selectedSimVehicle === v
                              ? "bg-slate-800 border-blue-500 text-white"
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          🚛 {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {simAssetType === "herramienta" && (
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-blue-400">Etiqueta RFID en Herramienta:</span>
                    <div className="flex flex-col gap-1.5">
                      {TOOL_ASSETS.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedSimTool(t)}
                          className={`p-1.5 rounded text-left text-xs border transition-all truncate block ${
                            selectedSimTool === t
                              ? "bg-slate-800 border-blue-500 text-white"
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          🔧 {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Trigger simulation action */}
              <button
                onClick={simulateCheckIn}
                className="w-full py-3 bg-blue-700 hover:bg-blue-600 active:scale-95 text-xs sm:text-sm font-bold rounded-xl text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform"
              >
                <QrCode className="w-4 h-4" />
                <span>Simular Escanear Tarjeta NFC</span>
              </button>

              {/* Mode Selection */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  Modo de Conexión:
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isOfflineMode}
                    onChange={(e) => {
                      setIsOfflineMode(e.target.checked);
                      triggerToast(
                        e.target.checked
                          ? "🟠 Supervisor App configurada temporalmente en MODO OFFLINE."
                          : "🟢 Supervisor App de vuelta en MODO ONLINE (Sincronización instantánea)."
                      );
                    }}
                  />
                  <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                  <span className="ml-2 text-[10px] font-bold uppercase text-slate-300">
                    {isOfflineMode ? "Off-Grid" : "Nube"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosistema Grid Section */}
        <section id="ecosystem" className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">Tecnología Versátil</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Ecosistema Portátil CheckDisplay</h2>
            </div>
            <p className="text-slate-500 text-sm max-w-md mt-2 sm:mt-0">
              Cada componente se integra de manera transparente en la nube, garantizando control inmediato incluso en obras de alta dispersión geográfica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Dashboard Web */}
            <div 
              onClick={() => setSelectedProductDetail(selectedProductDetail === "dashboard" ? null : "dashboard")}
              className={`bg-white p-5 rounded-2xl border ${selectedProductDetail === "dashboard" ? "border-blue-400 ring-2 ring-blue-50/50" : "border-slate-100 hover:border-slate-300"} flex flex-col gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-100 group">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80" 
                  alt="Web Dashboard Preview" 
                  className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-lg">
                  <Laptop className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  Dashboard Web Administrativo
                  <ChevronRight size={16} className={`text-slate-400 transition-transform ${selectedProductDetail === "dashboard" ? "rotate-90" : ""}`} />
                </h3>
                <p className="text-xs text-slate-500 leading-normal mt-1">
                  Gestión centralizada para altas de personal, contratos, control de vacaciones e informes automáticos en tiempo real. Unifica tu información.
                </p>
              </div>

              {selectedProductDetail === "dashboard" && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 flex flex-col gap-2 mt-2 animate-fadeIn">
                  <span className="font-bold text-slate-800">Características Clave:</span>
                  <div className="flex items-center gap-2">✓ Reportes Excel/PDF instantáneos</div>
                  <div className="flex items-center gap-2">✓ Alertas de retardos recurrentes</div>
                  <div className="flex items-center gap-2">✓ Monitoreo en vivo de GPS por cuadrilla</div>
                </div>
              )}
            </div>

            {/* Card 2: App Supervisor */}
            <div 
              onClick={() => setSelectedProductDetail(selectedProductDetail === "app" ? null : "app")}
              className={`bg-white p-5 rounded-2xl border ${selectedProductDetail === "app" ? "border-blue-400 ring-2 ring-blue-50/50" : "border-slate-100 hover:border-slate-300"} flex flex-col gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-100 group">
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80" 
                  alt="Supervisor App Preview" 
                  className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-lg">
                  <Smartphone className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  App del Supervisor de Campo
                  <ChevronRight size={16} className={`text-slate-400 transition-transform ${selectedProductDetail === "app" ? "rotate-90" : ""}`} />
                </h3>
                <p className="text-xs text-slate-500 leading-normal mt-1">
                  Convierte cualquier smartphone Android robusto en un lector NFC instantáneo. Ideal para checar cuadrillas con geolocalización.
                </p>
              </div>

              {selectedProductDetail === "app" && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 flex flex-col gap-2 mt-2 animate-fadeIn">
                  <span className="font-bold text-slate-800">Características Clave:</span>
                  <div className="flex items-center gap-2">✓ Captura de coordenadas GPS exacta</div>
                  <div className="flex items-center gap-2">✓ Guardado off-line sin señal móvil</div>
                  <div className="flex items-center gap-2">✓ Sincronización instantánea con la nube</div>
                </div>
              )}
            </div>

            {/* Card 3: Kiosko Standalone */}
            <div 
              onClick={() => setSelectedProductDetail(selectedProductDetail === "kiosko" ? null : "kiosko")}
              className={`bg-white p-5 rounded-2xl border ${selectedProductDetail === "kiosko" ? "border-blue-400 ring-2 ring-blue-50/50" : "border-slate-100 hover:border-slate-300"} flex flex-col gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-100 group">
                <img 
                  src="https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80" 
                  alt="Standalone Terminal Preview" 
                  className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-lg">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  Kiosko Standalone Industrial
                  <ChevronRight size={16} className={`text-slate-400 transition-transform ${selectedProductDetail === "kiosko" ? "rotate-90" : ""}`} />
                </h3>
                <p className="text-xs text-slate-500 leading-normal mt-1">
                  Estaciones fijas de alto rendimiento con módem robusto integrado y batería de respaldo de larga duración. Listos para instalar.
                </p>
              </div>

              {selectedProductDetail === "kiosko" && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 flex flex-col gap-2 mt-2 animate-fadeIn">
                  <span className="font-bold text-slate-800">Características Clave:</span>
                  <div className="flex items-center gap-2">✓ Gabinete metálico de alta resistencia</div>
                  <div className="flex items-center gap-2">✓ Conectividad 4G LTE pre-configurada</div>
                  <div className="flex items-center gap-2">✓ Batería interna contra apagones</div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Live Logs & Monitoring Dashboard (Interactive playground) */}
        <section id="live_dashboard_panel" className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                Consola General en Tiempo Real
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Historial de Entrada e Intellect-Sync 
              </h3>
            </div>

            {/* Filter types */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <button
                onClick={() => setSimFilterType("todos")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  simFilterType === "todos"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSimFilterType("personal")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  simFilterType === "personal"
                    ? "bg-blue-50 text-blue-800"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setSimFilterType("vehiculo")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  simFilterType === "vehiculo"
                    ? "bg-teal-50 text-teal-800"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                Vehículos
              </button>
              <button
                onClick={() => setSimFilterType("herramienta")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  simFilterType === "herramienta"
                    ? "bg-purple-50 text-purple-800"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                Herramientas
              </button>
            </div>
          </div>

          {/* Filtering bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Buscar por colaborador o activo en vivo..."
                value={searchQuery}
                aria-label="Filter records"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-red-500 hover:underline cursor-pointer"
              >
                Limpiar búsqueda
              </button>
            )}

            <div className="ml-auto text-xs text-slate-500 font-semibold flex items-center gap-2">
              <span>Registros mostrados:</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-bold">
                {filteredLogs.length}
              </span>
            </div>
          </div>

          {/* Records Table Scroll wrapper */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-100">
                  <th className="py-3.5 px-4">ID Transacción</th>
                  <th className="py-3.5 px-4">Operador / Colaborador</th>
                  <th className="py-3.5 px-4">Tipo Recurso</th>
                  <th className="py-3.5 px-4">Ubicación / Antena GPS</th>
                  <th className="py-3.5 px-4">Hora Local</th>
                  <th className="py-3.5 px-4 text-center">Batería App</th>
                  <th className="py-3.5 px-4 text-right">Estatus Sinc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-55/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{log.id}</td>
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-slate-800">{log.employeeName}</div>
                          <div className="text-[11px] text-slate-400">{log.role}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {log.type === "personal" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold uppercase">
                            Tarj. Personal
                          </span>
                        )}
                        {log.type === "vehiculo" && (
                          <span className="inline-flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold uppercase w-fit">
                              Pegatina Activo
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 italic">
                              🚛 {log.assetName}
                            </span>
                          </span>
                        )}
                        {log.type === "herramienta" && (
                          <span className="inline-flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 text-[10px] font-bold uppercase w-fit">
                              RFID Herramienta
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 italic">
                              🔧 {log.assetName}
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                          <span>{log.location}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono font-medium">{log.timestamp}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 justify-center bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-medium">
                          {log.battery}%
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {log.status === "success" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-extrabold uppercase">
                            ● Guardado Nube
                          </span>
                        ) : log.status === "offline" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold uppercase">
                            ▲ Almacenado Local
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-extrabold uppercase">
                            ○ Pendiente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400 text-sm">
                      Ningún registro coincide con los filtros de búsqueda. Intenta otra clave.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Benefits Section & Asset Control Panel */}
        <section id="beneficios" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="lg:col-span-5 flex items-center gap-6">
            <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1516514038825-9df030df1414?auto=format&fit=crop&w=400&q=80" 
                alt="NFC Vehicle Tracking Log Asset" 
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Control de Activos</span>
                <h4 className="text-white font-bold text-lg mt-0.5">Control de Maquinaria Pesada</h4>
                <p className="text-white/80 text-[11px] leading-relaxed">Etiquetas adhesivas impermeables diseñadas para el trabajo rudo de campo.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between py-2">
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">¿Por qué CheckDisplay?</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-3">La diferencia de operar con tecnología moderna</h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
                Nuestra propuesta desplaza las complejas instalaciones de cableado por tarjetas RFID de apenas $1 USD por trabajador y lectores móviles autónomos, asegurando la continuidad de tu constructora u operadora.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
                  ✓
                </span>
                <span className="text-xs font-bold uppercase text-slate-500">100% Offline</span>
                <p className="text-[11px] text-slate-400">Guarda fichajes sin cobertura celular, sincroniza al recuperar señal.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-800 font-bold text-sm">
                  ⚡
                </span>
                <span className="text-xs font-bold uppercase text-slate-500">Plug & Play</span>
                <p className="text-[11px] text-slate-400">Configure en 5 minutos de reloj. Reemplace lectores sin cambiar de tarjetas.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-sm">
                  ☁
                </span>
                <span className="text-xs font-bold uppercase text-slate-500">Sync Nube</span>
                <p className="text-[11px] text-slate-400">Concentra reportes semanales al instante desde tu oficina central.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact info widget */}
        <section id="contacto" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
          <div className="flex flex-col gap-3">
            <span className="text-xs text-blue-400 font-extrabold uppercase tracking-widest">¿Tienes un proyecto en puerta?</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Establece tu control hoy mismo</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg leading-relaxed">
              Descubre cómo CheckDisplay puede sincronizar la asistencia de tus cuadrillas de construcción y rastrear préstamos de martillos o rotomartillos en campo de manera rápida y económica.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            <a 
              href="https://wa.me/3322223518" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-slate-950 font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 text-sm"
            >
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shrink-0"></span>
              <span>WhatsApp Directo</span>
            </a>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>Agendar Demo Virtual</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </main>

      {/* Elegant Footer */}
      <footer id="footer_section" className="mt-auto h-auto sm:h-16 py-4 sm:py-0 bg-slate-950 px-4 sm:px-10 flex flex-col sm:flex-row items-center justify-between text-slate-400 shrink-0 text-xs sm:text-sm font-semibold border-t border-slate-900 gap-3 sm:gap-0">
        <span>Guadalajara, Jalisco, México • 2026</span>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <span>Soporte: 33 2222 3518</span>
          <a
            href="https://wa.me/3322223518"
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            WhatsApp Comercial
          </a>
        </div>
      </footer>

      {/* Demo Appointment Scheduler Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden text-slate-705 flex flex-col animate-slideUp">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-base">Agendar Demostración Virtual</span>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="text-white/70 hover:text-white bg-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isDemoSubmitted ? (
              <div className="p-8 text-center flex flex-col items-center gap-3 animate-fadeIn">
                <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-lg font-bold text-slate-900">¡Agenda Solicitada!</h4>
                <p className="text-slate-500 text-xs">
                  Te hemos reservado un espacio de demostración de 15 minutos en vivo. Un consultor se contactará hoy mismo al correo/teléfono registrado.
                </p>
                <button
                  onClick={() => {
                    setIsDemoSubmitted(false);
                    setIsDemoModalOpen(false);
                  }}
                  className="mt-4 px-6 py-2 bg-blue-800 text-white font-bold text-xs rounded-xl hover:bg-blue-900 transition-colors cursor-pointer"
                >
                  Regresar a la Consola
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateDemo} className="p-5 flex flex-col gap-4 text-xs sm:text-sm">
                <p className="text-slate-500 text-xsleading-normal">
                  Completa el formulario para reservar una llamada interactiva donde te mostraremos cómo funciona la sincronización NFC de activos en vivo.
                </p>
                
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700" htmlFor="fullName">Nombre Completo *</label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    value={demoFormData.fullName}
                    onChange={(e) => setDemoFormData({ ...demoFormData, fullName: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700" htmlFor="email">Correo Corporativo *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={demoFormData.email}
                      onChange={(e) => setDemoFormData({ ...demoFormData, email: e.target.value })}
                      className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500"
                      placeholder="juan@empresa.com"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700" htmlFor="phone">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      id="phone"
                      value={demoFormData.phone}
                      onChange={(e) => setDemoFormData({ ...demoFormData, phone: e.target.value })}
                      className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500"
                      placeholder="Ej. 331 222 3518"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700" htmlFor="company">Empresa / Razón Social</label>
                    <input
                      type="text"
                      id="company"
                      value={demoFormData.company}
                      onChange={(e) => setDemoFormData({ ...demoFormData, company: e.target.value })}
                      className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500"
                      placeholder="Ej. Constructora GDL"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700" htmlFor="interestModule">Módulo Principal Interés</label>
                    <select
                      id="interestModule"
                      value={demoFormData.interestModule}
                      onChange={(e) => setDemoFormData({ ...demoFormData, interestModule: e.target.value })}
                      className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option value="Sincronización de Campo">Supervisor App</option>
                      <option value="Estaciones Kiosko">Kiosko Standalone</option>
                      <option value="Control de Flujos">Control de Activos</option>
                      <option value="Full Ecosistema">Ecosistema Completo</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-blue-800 hover:bg-blue-900 active:scale-95 text-white font-bold rounded-xl text-center shadow-lg transition-transform cursor-pointer"
                >
                  Confirmar Agenda Virtual
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
