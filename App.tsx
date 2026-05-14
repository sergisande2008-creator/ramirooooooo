// ... (Keep existing imports)
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';

const FeedbackAIInsight: React.FC<{ feedback: Feedback }> = ({ feedback }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    if (!feedback.comment || feedback.comment.trim() === '') {
      setInsight("No hay suficientes detalles en el comentario para un análisis.");
      return;
    }
    
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Actúa como un coach de restaurantes de estrella Michelin. 
Un cliente dejó esta reseña: "${feedback.comment}" de ${feedback.rating} estrellas en la mesa ${feedback.tableNumber} (${feedback.location}).

Escribe un consejo directo, cortísimo (máximo 2 líneas) y 100% accionable sobre cómo evitar este problema en el futuro o cómo gestionar esa mesa ahora mismo. Cero introducciones, ve directo al grano.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setInsight(response.text || "No se pudo generar el consejo.");
    } catch (err) {
      console.error(err);
      setInsight("Error al conectar con Nexus Coach AI.");
    } finally {
      setLoading(false);
    }
  };

  if (feedback.rating > 3) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-100/50">
      {!insight && !loading && (
        <button 
          onClick={generateInsight}
          className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
        >
          <BrainCircuit size={14} /> Solicitar Análisis de Nexus Coach AI
        </button>
      )}
      
      {loading && (
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 bg-indigo-50/50 px-3 py-1.5 rounded-lg w-it">
          <RefreshCw size={14} className="animate-spin" /> Analizando situación...
        </div>
      )}

      {insight && !loading && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl border border-indigo-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500 rounded-full blur-2xl opacity-10"></div>
          <div className="relative z-10 flex gap-3 items-start">
             <div className="bg-white p-1.5 rounded-lg shadow-sm text-indigo-600 mt-0.5">
               <BrainCircuit size={16} />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase text-indigo-800 tracking-wider mb-0.5">Consejo del Coach</p>
               <p className="text-sm text-slate-700 leading-relaxed font-medium">{insight}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { Screen, MenuCategory, MenuItem, CartItem, Order, OrderStatus, BillRequest, Feedback } from './types';
import { MENU_ITEMS, TABLES } from './constants';
// Import from root ./Button
import { Button } from './Button';

let sharedAudioContext: AudioContext | null = null;
const initAudio = () => {
  try {
    if (!sharedAudioContext) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        sharedAudioContext = new Ctx();
      }
    }
    if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume();
    }
    return sharedAudioContext;
  } catch (e) {
    return null;
  }
};

// Initialize silently on first interaction to allow notifications later
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    initAudio();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
}

const playTone = (type: 'pop' | 'bells') => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    
    if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.04);
      
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'bells') {
      const playBell = (freq: number, delay: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
        gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + delay + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.8);
        
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.8);
      };

      playBell(1046.50, 0); // C6
      playBell(1318.51, 0.15); // E6
      playBell(1567.98, 0.3); // G6
    }
  } catch (e) {
    // Ignore audio errors
  }
};

import { 
  Utensils, 
  ChefHat, 
  ChevronLeft, 
  Home, 
  Plus, 
  Minus, 
  Lock, 
  Search,
  ArrowRight,
  ShoppingBasket,
  Receipt,
  Send,
  X,
  CheckCircle,
  Mail,
  AlertCircle,
  Clock,
  Trash2,
  Bell,
  Sun,
  Loader2,
  Calendar,
  CalendarDays,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Award,
  Users,
  Menu,
  Calculator,
  Printer,
  Sparkles,
  Lightbulb,
  Zap,
  BrainCircuit,
  Star,
  Trophy,
  Target,
  Timer,
  Flame,
  RefreshCw
} from 'lucide-react';

import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  deleteDoc, 
  query,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { handleFirestoreError, OperationType } from './firebaseUtils';
import { signInAnonymously } from 'firebase/auth';
import { Language, UI_TRANSLATIONS, MENU_TRANSLATIONS } from './translations';
import { CashCalculator } from './CashCalculator';
import { motion, AnimatePresence } from 'motion/react';

// --- CONFIGURATION ---

const WEBHOOK_URLS = {
  NEW_ORDER: 'https://nevada-n8n.qtu9is.easypanel.host/webhook/2ab83022-24b9-4066-8654-d6136afcab1d',
  ORDER_ACCEPTED: 'https://nevada-n8n.qtu9is.easypanel.host/webhook/efaabba5-ff9a-475f-8415-94f9496c6102',
  ORDER_COMPLETED: 'https://nevada-n8n.qtu9is.easypanel.host/webhook/3213f4be-ae9b-410a-bc4d-6ce285c2ad50'
};

// --- HELPERS ---

const sendWebhook = async (url: string, order: Order) => {
  if (!url) return;
  try {
    const payload = {
      Numero_Pedido: order.id,
      Numero_Mesa: order.tableNumber,
      Ubicacion: order.location,
      Pedido: order.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      Hora_Pedido: new Date(order.timestamp).toLocaleString('es-ES'),
      Hora_Aceptado: order.acceptedTimestamp ? new Date(order.acceptedTimestamp).toLocaleString('es-ES') : '',
      Hora_Entrega: order.completedTimestamp ? new Date(order.completedTimestamp).toLocaleString('es-ES') : '',
      Estado: order.status,
      Notas_especiales: '',
      Comensales: order.guestCount,
      Total: order.total.toFixed(2)
    };

    console.log(`Sending webhook to ${url}`, payload);

    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("Error sending webhook:", error);
  }
};

// --- SUB-COMPONENTS ---

// 1. Landing Screen (REDISEÑADA)
const LandingScreen: React.FC<{
  setCurrentScreen: (s: Screen) => void;
  setChefPin: (s: string) => void;
  language: Language;
  setLanguage: (l: Language) => void;
}> = ({ setCurrentScreen, setChefPin, language, setLanguage }) => {
  const t = UI_TRANSLATIONS[language];
  return (
  <div className="min-h-screen bg-[#1a160f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
    {/* Fondo sutil */}
    <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[#f5f2ed]/5 blur-[120px] pointer-events-none" />
    
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-[340px] bg-[#13100b] rounded-[32px] p-8 border border-white/5 flex flex-col items-center shadow-2xl relative z-10"
    >
        
       {/* Brillo decorativo superior */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-24 bg-[#ccc1ab]/5 blur-[50px] rounded-full pointer-events-none"></div>

       {/* Contenido */}
       <div className="flex flex-col items-center w-full relative z-10 py-4">
          
          {/* Logo Box */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            className="w-[88px] h-[88px] bg-[#1a160f] rounded-[24px] flex items-center justify-center mb-8 border border-[#332c1e] shadow-xl"
          >
            <Utensils className="text-[#ccc1ab] w-10 h-10" strokeWidth={1} />
          </motion.div>
          
          {/* Título */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-4xl font-serif font-black text-white mb-2 tracking-wide"
          >
            NEVADA
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-[#a39578] text-[11px] font-bold tracking-[0.35em] mb-12"
          >
            {t.premium_experience}
          </motion.p>

          {/* Selector de idioma */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-4 mb-8"
          >
            <button 
              onClick={() => setLanguage('es')}
              className={`flex flex-col items-center gap-2 transition-all ${language === 'es' ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80'}`}
            >
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3hzt4_aWEXUGyNM0_d6L7ipRcV3E5dd2Pbg&s" alt="Español" className="w-8 h-6 object-cover rounded-sm shadow-sm" />
              <span className="text-[#f5f2ed] text-[8px] font-bold uppercase tracking-wider">Español</span>
            </button>
            <button 
              onClick={() => setLanguage('ca')}
              className={`flex flex-col items-center gap-2 transition-all ${language === 'ca' ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80'}`}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Catalonia.svg/330px-Flag_of_Catalonia.svg.png" alt="Català" className="w-8 h-6 object-cover rounded-sm shadow-sm" />
              <span className="text-[#f5f2ed] text-[8px] font-bold uppercase tracking-wider">Català</span>
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`flex flex-col items-center gap-2 transition-all ${language === 'en' ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80'}`}
            >
              <img src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTAMcQflmNx6bt0zdTX1GlMwMlxBA09nrhgpbbhLn1LskueEVPkdqPLeZw3n_ujPzVVRiavP4R9JyVnxIasnvrmELvrMYQ7flVuo1pmOK6x3P7VumQfoGEbTeM2K5-8wZrJ1hCdgjwx9g&usqp=CAc" alt="English" className="w-8 h-6 object-cover rounded-sm shadow-sm" />
              <span className="text-[#f5f2ed] text-[8px] font-bold uppercase tracking-wider">English</span>
            </button>
          </motion.div>

          {/* Botones */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="w-full space-y-3"
          >
            <button 
              onClick={() => setCurrentScreen(Screen.LOCATION_SELECTION)} 
              className="w-full bg-[#1a160f] text-[#f5f2ed] border border-[#332c1e] h-14 rounded-xl text-[13px] font-bold uppercase tracking-widest hover:bg-[#332c1e] transition-all duration-300 flex items-center justify-center"
            >
              {t.enter_as_diner}
            </button>
           </motion.div>
       </div>
    </motion.div>
    <button 
      onClick={() => setCurrentScreen(Screen.CHEF_LOGIN)}
      className="absolute bottom-6 right-6 p-4 text-[#332c1e] hover:text-[#665a3f] transition-colors"
    >
      <Lock size={16} />
    </button>
  </div>
);
};

// 2. Location Selection
const LocationSelectionScreen: React.FC<{
  setCurrentScreen: (s: Screen) => void;
  setSelectedLocation: (l: 'DENTRO' | 'FUERA') => void;
  language: Language;
}> = ({ setCurrentScreen, setSelectedLocation, language }) => {
  const t = UI_TRANSLATIONS[language];
  return (
  <div className="min-h-screen bg-slate-50 flex flex-col p-6">
    <div className="flex items-center mb-8 pt-4">
      <button onClick={() => setCurrentScreen(Screen.LANDING)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
        <ChevronLeft size={28} />
      </button>
    </div>

    <div className="flex-1 flex flex-col items-center">
      <h2 
        className="text-4xl font-serif font-black text-slate-900 mb-2"
      >
        {t.location}
      </h2>
      <p 
        className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-12"
      >
        {t.where_to_sit}
      </p>

      <div 
        className="grid grid-cols-1 gap-6 w-full max-w-sm"
      >
        <button
          onClick={() => {
            setSelectedLocation('DENTRO');
            setCurrentScreen(Screen.TABLE_SELECTION);
          }}
          className="bg-white rounded-3xl p-8 flex flex-row items-center gap-6 shadow-sm border border-slate-100 hover:border-blue-500 hover:shadow-md active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-colors">
             <Home size={32} />
          </div>
          <div className="text-left">
              <span className="block text-2xl font-black text-slate-900">{t.inside}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.inside_desc}</span>
          </div>
        </button>

        <button
          onClick={() => {
            setSelectedLocation('FUERA');
            setCurrentScreen(Screen.TABLE_SELECTION);
          }}
          className="bg-white rounded-3xl p-8 flex flex-row items-center gap-6 shadow-sm border border-slate-100 hover:border-blue-500 hover:shadow-md active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-colors">
             <Sun size={32} />
          </div>
          <div className="text-left">
              <span className="block text-2xl font-black text-slate-900">{t.outside}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.outside_desc}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
);
};

// 3. Table Selection
const TableSelectionScreen: React.FC<{
  setCurrentScreen: (s: Screen) => void;
  setSelectedTable: (t: string) => void;
  selectedLocation: string | null;
  language: Language;
}> = ({ setCurrentScreen, setSelectedTable, selectedLocation, language }) => {
  const t = UI_TRANSLATIONS[language];
  return (
  <div className="min-h-screen bg-slate-50 flex flex-col p-6">
    <div className="flex items-center mb-8 pt-4">
      <button onClick={() => setCurrentScreen(Screen.LOCATION_SELECTION)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
        <ChevronLeft size={28} />
      </button>
    </div>

    <div className="flex-1 flex flex-col items-center">
      <h2 
        className="text-4xl font-serif font-black text-slate-900 mb-2"
      >
        {t.table_label}
      </h2>
      <p 
        className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-12"
      >
        {t.zone} {selectedLocation === 'DENTRO' ? t.inside : t.outside}
      </p>

      <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
        {TABLES.map((table, i) => (
          <button
            key={table}
            onClick={() => {
              setSelectedTable(table);
              setCurrentScreen(Screen.GUEST_SELECTION);
            }}
            className="aspect-square bg-white rounded-3xl flex flex-col items-center justify-center shadow-sm border border-slate-100 hover:border-blue-500 hover:shadow-md active:scale-95 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 text-slate-300 text-xs font-bold mb-2 group-hover:text-blue-400">{t.number}</span>
            <span className="relative z-10 text-6xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{table}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);
};

// 4. Guest Selection
const GuestSelectionScreen: React.FC<{
  setCurrentScreen: (s: Screen) => void;
  guestCount: number;
  setGuestCount: (n: number) => void;
  selectedLocation: string | null;
  selectedTable: string | null;
  language: Language;
}> = ({ setCurrentScreen, guestCount, setGuestCount, selectedLocation, selectedTable, language }) => {
  const t = UI_TRANSLATIONS[language];
  return (
  <div className="min-h-screen bg-slate-50 flex flex-col p-6">
    <div className="flex items-center mb-8 pt-4 relative z-20">
      <button onClick={() => setCurrentScreen(Screen.TABLE_SELECTION)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
        <ChevronLeft size={28} />
      </button>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center -mt-20">
      <h2 
        className="text-4xl font-serif font-black text-slate-900 mb-2"
      >
        {t.guests}
      </h2>
      <p 
        className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-16"
      >
        {selectedLocation === 'DENTRO' ? t.inside : t.outside} - {t.table} {selectedTable}
      </p>

      <div 
        className="flex items-center gap-12 mb-20"
      >
        <button 
          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
          className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-600 active:scale-90 transition-all"
        >
          <Minus size={24} />
        </button>
        
        <span 
          key={guestCount}
          className="text-9xl font-black text-slate-900 tabular-nums font-serif transition-colors"
        >
          {guestCount}
        </span>

        <button 
          onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
          className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-600 active:scale-90 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <div
        className="w-full flex justify-center"
      >
        <Button 
          fullWidth 
          className="bg-slate-900 text-white max-w-xs shadow-xl shadow-slate-900/20"
          onClick={() => setCurrentScreen(Screen.ALLERGIES_SELECTION)}
        >
          {t.start}
        </Button>
      </div>
    </div>
  </div>
);
};

// 4.5 Allergies Selection
const AllergiesSelectionScreen: React.FC<{
  setCurrentScreen: (s: Screen) => void;
  userAllergies: string;
  setUserAllergies: (a: string) => void;
  language: Language;
}> = ({ setCurrentScreen, userAllergies, setUserAllergies, language }) => {
  const t = UI_TRANSLATIONS[language];
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6">
      <div className="flex items-center mb-8 pt-4 relative z-20">
        <button onClick={() => setCurrentScreen(Screen.GUEST_SELECTION)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
          <ChevronLeft size={28} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-20 max-w-md mx-auto w-full">
        <h2 className="text-4xl font-serif font-black text-slate-900 mb-2 text-center">
          {t.any_allergies}
        </h2>
        <p className="text-slate-500 font-medium text-sm text-center mb-12">
          {t.allergies_desc}
        </p>

        <textarea
          value={userAllergies}
          onChange={(e) => setUserAllergies(e.target.value)}
          placeholder={t.allergies_placeholder}
          className="w-full p-6 h-32 rounded-3xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-slate-800 placeholder:text-slate-400 font-medium text-lg mb-12"
        />

        <div className="w-full flex justify-center">
          <Button 
            fullWidth 
            className="bg-slate-900 text-white max-w-xs shadow-xl shadow-slate-900/20"
            onClick={() => setCurrentScreen(Screen.MENU)}
          >
            {userAllergies.trim() ? t.continue_btn : t.no_allergies}
          </Button>
        </div>
      </div>
    </div>
  );
};

// 5. Menu & Order Screen
const ALLERGEN_MAPPING: Record<string, string[]> = {
  'gluten': ['gluten', 'blat', 'wheat', 'trigo'],
  'lactosa': ['lactosa', 'lactose', 'lacti', 'dairy', 'leche', 'milk', 'llet', 'queso', 'cheese', 'formatge'],
  'huevo': ['huevo', 'egg', 'ou', 'huevos', 'eggs', 'ous'],
  'pescado': ['pescado', 'fish', 'peix'],
  'marisco': ['marisco', 'seafood', 'marisc', 'crustaceos', 'crustaceans', 'crustacis', 'moluscos', 'shellfish', 'gamba', 'pulpo', 'prawn', 'shrimp'],
  'sulfitos': ['sulfitos', 'sulfites', 'sulfits', 'vino', 'wine', 'vi'],
  'frutos secos': ['frutos secos', 'nuts', 'fruits secs', 'nueces', 'nuez', 'almendra', 'almond', 'avellana', 'hazelnut'],
  'soja': ['soja', 'soy', 'soya'],
  'mostaza': ['mostaza', 'mustard', 'mostassa'],
  'sesamo': ['sesamo', 'sesame', 'sesam', 'sésamo'],
  'apio': ['apio', 'celery', 'api'],
  'cacahuete': ['cacahuete', 'peanut', 'cacauet', 'cacahuetes', 'peanuts', 'cacauets']
};

const MenuScreen: React.FC<{
  selectedLocation: string | null;
  selectedTable: string | null;
  guestCount: number;
  setCurrentScreen: (s: Screen) => void;
  activeTab: 'menu' | 'order' | 'bill';
  setActiveTab: (t: 'menu' | 'order' | 'bill') => void;
  cart: CartItem[];
  selectedCategory: MenuCategory;
  setSelectedCategory: (c: MenuCategory) => void;
  getItemQuantity: (id: string) => number;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  getCartTotal: () => number;
  handleSendOrder: () => void;
  handleRequestBill: (method: 'CARD' | 'CASH' | 'ONLINE', splitWays?: number, itemsToPay?: { id: string; name: string; quantity: number; price: number }[]) => void;
  handleSubmitFeedback: (rating: number, comment: string) => void;
  orderSuccessMessage: boolean;
  billSuccessMessage: boolean;
  setBillSuccessMessage: (v: boolean) => void;
  language: Language;
  menuItems: MenuItem[];
  hasActiveOrders: boolean;
  orders: Order[];
  billRequests: BillRequest[];
  userAllergies: string;
}> = ({ 
  selectedLocation, selectedTable, guestCount, setCurrentScreen,
  activeTab, setActiveTab, cart, selectedCategory, setSelectedCategory,
  getItemQuantity, addToCart, removeFromCart, getCartTotal, handleSendOrder,
  handleRequestBill, handleSubmitFeedback, orderSuccessMessage, billSuccessMessage, setBillSuccessMessage, language, menuItems, hasActiveOrders, orders, billRequests, userAllergies
}) => {
  const t = UI_TRANSLATIONS[language];
  const [splitMode, setSplitMode] = useState<'ALL' | 'SPLIT' | 'ITEMS'>('ALL');
  const [selectedSplitItems, setSelectedSplitItems] = useState<Record<string, number>>({});
  
  // Feedback States
  const [feedbackStep, setFeedbackStep] = useState<'RATING' | 'BAD' | 'GOOD'>('RATING');
  const [ratingStar, setRatingStar] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    if (billSuccessMessage) {
      setFeedbackStep('RATING');
      setRatingStar(0);
      setFeedbackText('');
    }
  }, [billSuccessMessage]);

  const itemStats = useMemo(() => {
    const stats: Record<string, { totalOrdered: number, orderedLastHour: number }> = {};
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    // Initialize stats
    menuItems.forEach(item => {
      stats[item.id] = { totalOrdered: 0, orderedLastHour: 0 };
    });

    orders.forEach(order => {
      const isRecent = order.timestamp > oneHourAgo;
      order.items.forEach(item => {
        if (!stats[item.id]) {
          stats[item.id] = { totalOrdered: 0, orderedLastHour: 0 };
        }
        stats[item.id].totalOrdered += item.quantity;
        if (isRecent) {
          stats[item.id].orderedLastHour += item.quantity;
        }
      });
    });

    return stats;
  }, [orders, menuItems]);

  const topOrderedValue = useMemo(() => {
    let max = 0;
    Object.values(itemStats).forEach(s => {
      if (s.totalOrdered > max) max = s.totalOrdered;
    });
    return max;
  }, [itemStats]);

  const tableOrdersNow = orders.filter(o => o.location === selectedLocation && o.tableNumber === selectedTable && !o.paid);
  const tablePendingBillsNow = billRequests.filter(b => b.location === selectedLocation && b.tableNumber === selectedTable && b.status === 'PENDING');
  
  let isFullyCovered = false;
  if (tableOrdersNow.length === 0) {
      isFullyCovered = true;
  } else if (tablePendingBillsNow.some(b => !b.splitWays && !b.itemsToPay)) {
      isFullyCovered = true;
  } else if (tablePendingBillsNow.filter(b => b.splitWays === guestCount).length >= guestCount) {
      isFullyCovered = true;
  } else {
      const itemsMap: Record<string, number> = {};
      tableOrdersNow.forEach(order => {
          order.items.forEach(item => {
              const unpaidQty = item.quantity - (item.paidQuantity || 0);
              if (unpaidQty > 0) itemsMap[item.id] = (itemsMap[item.id] || 0) + unpaidQty;
          });
      });
      tablePendingBillsNow.filter(b => b.itemsToPay).forEach(bill => {
          bill.itemsToPay?.forEach(paidItem => {
              if (itemsMap[paidItem.id]) {
                  itemsMap[paidItem.id] -= paidItem.quantity;
              }
          });
      });
      const unrequestedItemsQty = Object.values(itemsMap).reduce((a,b) => a + Math.max(0, b), 0);
      if (unrequestedItemsQty <= 0) {
          isFullyCovered = true;
      }
  }
  const showCuentaTab = tableOrdersNow.length > 0 && !isFullyCovered;

  React.useEffect(() => {
      // Auto-redirect if they are stuck on bill tab but shouldn't be
      if (!showCuentaTab && activeTab === 'bill') {
          setActiveTab('menu');
      }
  }, [showCuentaTab, activeTab, setActiveTab]);

  return (
  <div className="min-h-screen bg-slate-50 flex flex-col pb-24 relative">
    {/* Header */}
    <header className="bg-white/80 backdrop-blur-lg px-6 pt-12 pb-4 sticky top-0 z-20 border-b border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 rounded-xl p-2.5 shadow-lg shadow-slate-900/20">
             <Utensils className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-black text-slate-900 leading-none text-lg">NEVADA</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              {selectedLocation === 'DENTRO' ? t.inside : t.outside} {selectedTable} <span className="mx-1 text-slate-300">|</span> {guestCount} {t.pax}
            </p>
          </div>
        </div>
        <button onClick={() => { setCurrentScreen(Screen.LANDING); }} className="p-3 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-colors">
          <Home size={20} />
        </button>
      </div>

      {/* Custom Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
        <button 
          onClick={() => setActiveTab('order')}
          className={`flex-1 py-2.5 text-[10px] sm:text-xs font-bold rounded-xl transition-all ${activeTab === 'order' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {t.your_order} {cart.length > 0 && `(${cart.reduce((a, b) => a + b.quantity, 0)})`}
        </button>
        <button 
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-2.5 text-[10px] sm:text-xs font-bold rounded-xl transition-all ${activeTab === 'menu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {t.menu}
        </button>
        {showCuentaTab && (
          <button 
            onClick={() => setActiveTab('bill')}
            className={`flex-1 py-2.5 text-[10px] sm:text-xs font-bold rounded-xl transition-all ${activeTab === 'bill' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {t.ask_bill || 'CUENTA'}
          </button>
        )}
      </div>
    </header>

    {/* Content */}
    <div className="flex-1 p-6">
      {activeTab === 'menu' && (
        <>
          {/* Filter Pills */}
          <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 mb-2">
            {[MenuCategory.ALL, ...Object.values(MenuCategory).filter(c => c !== MenuCategory.ALL)].map((cat) => {
              const catLabels: Record<string, string> = {
                  [MenuCategory.ALL]: t.all,
                  [MenuCategory.STARTERS]: t.starters,
                  [MenuCategory.MAINS]: t.mains,
                  [MenuCategory.SECONDS]: t.seconds,
                  [MenuCategory.DESSERTS]: t.desserts,
                  [MenuCategory.DRINKS]: t.drinks,
              };
              return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' 
                    : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
                }`}
              >
                {catLabels[cat] || cat}
              </button>
            )})}
          </div>

            {/* Menu List */}
            <div className="space-y-5">
              {menuItems
                .filter(item => selectedCategory === MenuCategory.ALL || item.category === selectedCategory)
                .map((item, i) => {
                  const qty = getItemQuantity(item.id);
                  // Translate
                  const translatedItem = MENU_TRANSLATIONS[item.id]?.[language] || item;
                  const { name, description } = translatedItem;

                  const hasAllergyWarning = userAllergies.trim() && (() => {
                    const normalizeText = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    const words = userAllergies.split(/[\s,]+/).map(normalizeText).filter(w => w.length > 2);
                    const normalizedName = normalizeText(name);
                    const normalizedDesc = normalizeText(description);
                    const normalizedAllergens = item.allergens?.map(normalizeText) || [];
                    
                    const expandedAllergens: string[] = [];
                    normalizedAllergens.forEach(allergen => {
                      expandedAllergens.push(allergen);
                      if (ALLERGEN_MAPPING[allergen]) {
                        expandedAllergens.push(...ALLERGEN_MAPPING[allergen].map(normalizeText));
                      }
                    });

                    return words.some(word => 
                      normalizedName.includes(word) || 
                      normalizedDesc.includes(word) ||
                      expandedAllergens.some(a => a.includes(word))
                    );
                  })();

                  const getScarcityMessage = () => {
                    if (item.fewUnitsLeft) {
                      return {
                        text: language === 'en' ? `Last units available` : `Últimas 2 raciones disponibles`,
                        icon: <Flame size={12} className="shrink-0" />,
                        color: 'text-red-700 bg-red-50 border-red-200'
                      };
                    }

                    const stats = itemStats[item.id];
                    if (!stats) return null;

                    if (stats.totalOrdered > 0 && stats.totalOrdered === topOrderedValue && topOrderedValue >= 1) {
                      return { 
                        text: language === 'en' ? `Most popular today!` : `¡El más popular hoy!`, 
                        icon: <TrendingUp size={12} className="shrink-0" />,
                        color: 'text-amber-700 bg-amber-50 border-amber-200'
                      };
                    }

                    return null;
                  };
                  
                  const scarcityMessage = getScarcityMessage();

                  return (
                    <div 
                      key={item.id} 
                      className={`bg-white p-3 rounded-[24px] shadow-sm border ${hasAllergyWarning ? 'border-red-400 bg-red-50/50' : 'border-slate-100'} flex gap-4 items-center group transition-transform duration-200 relative overflow-hidden ${item.outOfStock ? 'opacity-70' : 'active:scale-[0.98]'}`}
                    >
                    
                    <div className="relative">
                      <img src={item.image} alt={name} className={`w-20 h-20 rounded-2xl object-cover shadow-md ${item.outOfStock ? 'grayscale' : ''}`} />
                      {item.outOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                          <span className="text-white text-[10px] font-bold px-2 py-1 bg-red-600 rounded-full">{t.out_of_stock || "Agotado"}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif font-bold text-slate-900 text-base mb-1 leading-tight">{name}</h3>
                        {hasAllergyWarning && (
                          <span className="shrink-0 bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider">
                            {t.allergy_alert}
                          </span>
                        )}
                      </div>
                      <p className={`text-slate-400 text-xs line-clamp-2 leading-relaxed ${scarcityMessage && !item.outOfStock ? 'mb-2' : 'mb-3'}`}>{description}</p>
                      
                      {scarcityMessage && !item.outOfStock && (
                        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 mb-2 rounded border text-[9px] font-bold uppercase tracking-wider ${scarcityMessage.color}`}>
                          {scarcityMessage.icon}
                          {scarcityMessage.text}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 text-sm">{item.price.toFixed(2)}€</span>
                        
                        {/* Quantity Control Button */}

                        {qty === 0 ? (
                            <button 
                              disabled={item.outOfStock}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item); // Note: keeping original item structure for cart mechanics
                              }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${item.outOfStock ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                            >
                              <Plus size={20} />
                            </button>
                        ) : (
                            <div className="flex items-center gap-1 bg-slate-900 rounded-full p-1 shadow-lg shadow-slate-900/20">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromCart(item.id);
                                    }}
                                    className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center active:scale-90 transition-transform hover:bg-slate-700"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold text-white w-7 text-center text-sm">{qty}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(item);
                                    }}
                                    className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center active:scale-90 transition-transform hover:bg-blue-500"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        </>
      )}
      
      {activeTab === 'order' && (
        <div className="flex flex-col items-center justify-center h-full pt-10">
          <h2 className="text-4xl font-serif font-black text-slate-900 mb-2 text-center">{t.your_order}</h2>
          <p className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-12 text-center">{t.order_details}</p>
          
          {cart.length === 0 ? (
            <div className="flex flex-col items-center opacity-50 mt-10">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                <ShoppingBasket className="text-slate-400 w-10 h-10" />
              </div>
              <p className="font-bold text-slate-400 text-sm uppercase tracking-widest">{t.empty_cart}</p>
              <p className="text-slate-300 text-xs mt-2">{t.empty_cart_desc}</p>
            </div>
          ) : (
            <div className="w-full space-y-4">
              {cart.map((item, idx) => {
                const translatedName = MENU_TRANSLATIONS[item.id]?.[language]?.name || item.name;
                return (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                   <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
                       x{item.quantity}
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm">{translatedName}</h4>
                   </div>
                   <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-900">{(item.price * item.quantity).toFixed(2)}€</span>
                        <button 
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                   </div>
                </div>
              )})}
              <div className="pt-8 border-t border-slate-200 mt-8">
                  <div className="flex justify-between items-end mb-6">
                      <span className="text-slate-400 font-bold text-sm">{t.total_to_pay}</span>
                      <span className="text-4xl font-serif font-black text-slate-900">{getCartTotal().toFixed(2)}€</span>
                  </div>
                  <Button 
                      fullWidth 
                      className="bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                      onClick={handleSendOrder}
                  >
                      {t.send_order}
                  </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bill' && (() => {
        const activeOrders = orders.filter(o => o.location === selectedLocation && o.tableNumber === selectedTable && !o.paid);
        const totalAmount = activeOrders.reduce((acc, order) => acc + order.total, 0);
        
        const unpaidItemsList = (() => {
          const itemsMap: Record<string, { id: string, name: string, price: number, unpaidQty: number }> = {};
          
          // Add all original unpaid items from orders
          activeOrders.forEach(order => {
            order.items.forEach(item => {
              const unpaidQty = item.quantity - (item.paidQuantity || 0);
              if (unpaidQty > 0) {
                if (!itemsMap[item.id]) {
                  itemsMap[item.id] = { id: item.id, name: item.name, price: item.price, unpaidQty: 0 };
                }
                itemsMap[item.id].unpaidQty += unpaidQty;
              }
            });
          });

          // Subtract items that are currently in pending bills
          const pendingBills = billRequests.filter(b => b.location === selectedLocation && b.tableNumber === selectedTable && b.status === 'PENDING' && b.itemsToPay);
          pendingBills.forEach(bill => {
            bill.itemsToPay?.forEach(paidItem => {
              if (itemsMap[paidItem.id]) {
                itemsMap[paidItem.id].unpaidQty -= paidItem.quantity;
                if (itemsMap[paidItem.id].unpaidQty <= 0) {
                  delete itemsMap[paidItem.id];
                }
              }
            });
          });

          return Object.values(itemsMap);
        })();

        const selectedItemsTotal = Object.entries(selectedSplitItems).reduce((sum, [id, qty]) => {
            const item = unpaidItemsList.find(i => i.id === id);
            return sum + (item ? item.price * (qty as number) : 0);
        }, 0);

        const itemsToPayArg = splitMode === 'ITEMS' ? Object.entries(selectedSplitItems).reduce((arr, [id, qty]) => {
            if ((qty as number) > 0) {
              const itemInfo = unpaidItemsList.find(i => i.id === id);
              if (itemInfo) {
                arr.push({ id, name: itemInfo.name, quantity: qty as number, price: itemInfo.price });
              }
            }
            return arr;
        }, [] as { id: string; name: string; quantity: number; price: number }[]) : undefined;

        const handleIncrementSplit = (id: string, maxQty: number) => {
          setSelectedSplitItems(prev => ({
             ...prev,
             [id]: Math.min((prev[id] || 0) + 1, maxQty)
          }));
        };

        const handleDecrementSplit = (id: string) => {
          setSelectedSplitItems(prev => {
             const current = prev[id] || 0;
             if (current <= 1) {
                const newState = { ...prev };
                delete newState[id];
                return newState;
             }
             return { ...prev, [id]: current - 1 };
          });
        };

        const pendingBillsForTable = billRequests.filter(b => b.location === selectedLocation && b.tableNumber === selectedTable && b.status === 'PENDING');
        
        let isFullyRequested = false;
        let currentGuestTurn = 1;
        
        if (splitMode === 'ALL') {
             isFullyRequested = pendingBillsForTable.some(b => !b.splitWays && !b.itemsToPay);
        } else if (splitMode === 'SPLIT') {
             const splitBills = pendingBillsForTable.filter(b => b.splitWays === guestCount);
             isFullyRequested = splitBills.length >= guestCount;
             currentGuestTurn = splitBills.length + 1;
        } else if (splitMode === 'ITEMS') {
             isFullyRequested = unpaidItemsList.length === 0 && activeOrders.length > 0;
             const itemBills = pendingBillsForTable.filter(b => b.itemsToPay && b.itemsToPay.length > 0);
             currentGuestTurn = itemBills.length + 1;
        }

        if (isFullyRequested || activeOrders.length === 0) {
            return null;
        }

        const displayTotal = splitMode === 'SPLIT' && guestCount > 1 
          ? totalAmount / guestCount 
          : splitMode === 'ITEMS' ? selectedItemsTotal : totalAmount;

        return (
        <div className="flex flex-col items-center justify-center h-full pt-10">
          <h2 className="text-4xl font-serif font-black text-slate-900 mb-2 text-center">{t.ask_bill_label || 'LA CUENTA'}</h2>
          
          {splitMode === 'ITEMS' && guestCount > 1 ? (
             <div className="inline-flex items-center gap-2 mb-6 bg-slate-900 text-white px-4 py-1.5 rounded-full shadow-lg shadow-slate-900/20">
                <Users size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">{t.guest_turn} {currentGuestTurn}</span>
             </div>
          ) : (
             <p className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-6 text-center">{t.table_service}</p>
          )}
          
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
             
             {guestCount > 1 && (
               <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                 <button 
                   onClick={() => setSplitMode('ALL')}
                   className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${splitMode === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                 >
                   {t.all_together}
                 </button>
                 <button 
                   onClick={() => setSplitMode('SPLIT')}
                   className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold rounded-lg transition-all ${splitMode === 'SPLIT' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                 >
                   <Users size={12} /> {t.split_evenly}
                 </button>
                 <button 
                   onClick={() => setSplitMode('ITEMS')}
                   className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold rounded-lg transition-all ${splitMode === 'ITEMS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                 >
                   <Menu size={12} /> {t.pay_separately}
                 </button>
               </div>
             )}

             {splitMode === 'ITEMS' && (
                 <div className="mb-6 bg-slate-50 border border-slate-100 rounded-2xl p-4 max-h-[300px] overflow-y-auto w-full text-left inline-block">
                    <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">{t.choose_your_part}</p>
                    {unpaidItemsList.length === 0 ? (
                       <p className="text-sm text-slate-400">{t.no_pending_products}</p>
                    ) : (
                       <div className="space-y-3">
                         {unpaidItemsList.map(item => {
                            const selectedQty = selectedSplitItems[item.id] || 0;
                            return (
                              <div key={item.id} className="flex items-center justify-between">
                                 <div className="flex-1 pr-2">
                                     <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                                     <div className="text-xs text-slate-500">{(item.price * (selectedQty || 1)).toFixed(2)}€ max {item.unpaidQty}</div>
                                 </div>
                                 
                                 <div className="flex items-center bg-white border border-slate-200 rounded-full overflow-hidden shadow-sm shrink-0">
                                     <button 
                                       onClick={() => handleDecrementSplit(item.id)}
                                       className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                                     >
                                        <Minus size={14} />
                                     </button>
                                     <span className="w-6 text-center text-sm font-bold text-slate-900">{selectedQty}</span>
                                     <button 
                                       onClick={() => handleIncrementSplit(item.id, item.unpaidQty)}
                                       className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                                     >
                                        <Plus size={14} />
                                     </button>
                                 </div>
                              </div>
                            );
                         })}
                       </div>
                    )}
                 </div>
             )}

             <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500 font-bold text-sm">
                  {splitMode === 'SPLIT' && guestCount > 1 ? t.table_total_evenly : splitMode === 'ITEMS' ? t.my_part : t.table_total}
                </span>
                <span className="text-3xl font-black text-slate-900">
                   {splitMode === 'SPLIT' ? totalAmount.toFixed(2) : displayTotal.toFixed(2)}€
                </span>
             </div>
             {splitMode === 'SPLIT' && guestCount > 1 && (
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-slate-400 font-medium text-xs"></span>
                    <span className="text-blue-600 font-bold text-sm">
                      {t.to_pay} {(totalAmount / guestCount).toFixed(2)}€{t.per_person}
                    </span>
                 </div>
             )}
             {splitMode !== 'SPLIT' && <div className="mb-6"></div>}
             
             <div className="space-y-3 mb-6">
                <Button
                  fullWidth
                  disabled={splitMode === 'ITEMS' && selectedItemsTotal === 0}
                  className="bg-black text-white hover:bg-slate-800 shadow-xl shadow-black/20 py-4 relative overflow-hidden h-14 disabled:opacity-50 disabled:shadow-none"
                  onClick={() => {
                    handleRequestBill('ONLINE', splitMode === 'SPLIT' && guestCount > 1 ? guestCount : undefined, itemsToPayArg);
                    setSelectedSplitItems({});
                    alert(t.redirecting_stripe);
                  }}
                >
                  <span className="flex items-center justify-center gap-2 relative z-10 w-full">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    {t.pay_apple_pay}
                  </span>
                </Button>
                
                <Button
                  fullWidth
                  disabled={splitMode === 'ITEMS' && selectedItemsTotal === 0}
                  className="bg-blue-800 text-white hover:bg-blue-900 shadow-xl shadow-blue-800/20 py-4 relative overflow-hidden h-14 disabled:opacity-50 disabled:shadow-none"
                  onClick={() => {
                     handleRequestBill('CARD', splitMode === 'SPLIT' && guestCount > 1 ? guestCount : undefined, itemsToPayArg);
                     setSelectedSplitItems({});
                  }}
                >
                  <span className="flex items-center justify-center gap-2 relative z-10 w-full">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    {t.pay_card}
                  </span>
                </Button>

                <Button
                  fullWidth
                  disabled={splitMode === 'ITEMS' && selectedItemsTotal === 0}
                  className="bg-emerald-700 text-white hover:bg-emerald-800 shadow-xl shadow-emerald-700/20 py-4 relative overflow-hidden h-14 disabled:opacity-50 disabled:shadow-none"
                  onClick={() => {
                     handleRequestBill('CASH', splitMode === 'SPLIT' && guestCount > 1 ? guestCount : undefined, itemsToPayArg);
                     setSelectedSplitItems({});
                  }}
                >
                  <span className="flex items-center justify-center gap-2 relative z-10 w-full">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12"></path><path d="M4 14h9"></path><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"></path></svg>
                    {t.pay_cash}
                  </span>
                </Button>
             </div>
          </div>
        </div>
      );})()}
    </div>

    <AnimatePresence>
    {orderSuccessMessage && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="text-green-500 w-10 h-10" />
          </div>
          <h3 className="font-serif font-black text-2xl text-slate-900 mb-4">{t.confirm_order}</h3>
          <p className="text-slate-500 leading-relaxed text-sm font-medium">
            {t.prepare_order}
          </p>
        </motion.div>
      </motion.div>
    )}
    </AnimatePresence>

    <AnimatePresence>
    {billSuccessMessage && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center relative overflow-hidden"
        >
          {feedbackStep === 'RATING' && (
            <>
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Receipt className="text-blue-500 w-10 h-10" />
              </div>
              <h3 className="font-serif font-black text-2xl text-slate-900 mb-2">¡Marchando!</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium mb-6">
                Tu cuenta está en camino. Mientras tanto...
                <br /><br />
                <span className="text-slate-800 font-bold">¿Qué tal ha sido tu experiencia hoy?</span>
              </p>
              
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      setRatingStar(star);
                      if (star <= 3) {
                        setFeedbackStep('BAD');
                      } else {
                        setFeedbackStep('GOOD');
                      }
                    }}
                    className={`p-2 transition-transform hover:scale-110 active:scale-95 ${ratingStar >= star ? 'text-amber-400' : 'text-slate-200'}`}
                  >
                    <Star size={36} fill={ratingStar >= star ? "currentColor" : "none"} strokeWidth={ratingStar >= star ? 0 : 2} />
                  </button>
                ))}
              </div>
            </>
          )}

          {feedbackStep === 'BAD' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                 <AlertCircle className="text-red-500 w-8 h-8" />
               </div>
               <h3 className="font-serif font-black text-xl text-slate-900 mb-2">Lamentamos que no haya sido perfecto.</h3>
               <textarea 
                 value={feedbackText}
                 onChange={e => setFeedbackText(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none resize-none h-24 mb-4"
                 placeholder="Cuentanos qué podemos mejorar..."
               />
               <div className="flex gap-3 w-full">
                  <button onClick={() => setBillSuccessMessage(false)} className="flex-1 py-3 text-slate-500 font-bold text-sm hover:text-slate-700">Cancelar</button>
                  <button onClick={() => {
                     // TODO: In a real app, send silent alert to manager here
                     handleSubmitFeedback(ratingStar, feedbackText);
                  }} className="flex-1 bg-slate-900 text-white rounded-xl font-bold py-3 text-sm hover:bg-slate-800 transition-colors">
                     Enviar Error
                  </button>
               </div>
            </motion.div>
          )}

          {feedbackStep === 'GOOD' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                 <Star className="text-emerald-500 w-8 h-8" fill="currentColor" />
               </div>
               <h3 className="font-serif font-black text-xl text-slate-900 mb-2">¡Nos alegra muchísimo!</h3>
               <p className="text-slate-500 text-sm mb-6">Nos ayuda un montón crecer. ¿Nos ayudas dejándonos esta nota en Google Maps?</p>
               <div className="flex flex-col gap-3 w-full">
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setBillSuccessMessage(false)}
                    className="w-full bg-blue-600 text-white rounded-xl font-bold py-3 text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                  >
                     Dejar reseña en Google
                  </a>
                  <button onClick={() => setBillSuccessMessage(false)} className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">
                     No, gracias
                  </button>
               </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    )}
    </AnimatePresence>

  </div>
);
};

// 7. Chef Login Screen
const ChefLoginScreen: React.FC<{
  setCurrentScreen: (s: Screen) => void;
  chefPin: string;
  setChefPin: (s: string) => void;
}> = ({ setCurrentScreen, chefPin, setChefPin }) => {
  const handleLogin = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (chefPin === '1234') {
          setCurrentScreen(Screen.KITCHEN_DASHBOARD);
          setChefPin('');
      } else if (chefPin === '0000') {
          setCurrentScreen(Screen.ADMIN_DASHBOARD);
          setChefPin('');
      } else {
          alert('PIN Incorrecto');
          setChefPin('');
      }
  };

  return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-[#111111] rounded-[40px] p-8 border border-white/5 relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col items-center relative z-10 w-full">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-400">
              <Lock size={20} />
              </div>
              
              <h2 className="text-3xl font-serif text-white mb-2 italic">Acceso Administrador/Cocina</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Introduce tu código PIN</p>

              <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                  <input 
                      type="password" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={chefPin}
                      onChange={(e) => setChefPin(e.target.value)}
                      placeholder="PIN"
                      autoFocus
                      className="w-full bg-[#1a1a1a] text-white text-center text-2xl tracking-widest font-bold py-4 rounded-xl border border-white/10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-700"
                  />
                  
                  <div className="flex gap-3 mt-4">
                       {!window.location.pathname.startsWith('/dashboard') && !window.location.pathname.startsWith('/cocina') && (
                          <button 
                             type="button"
                             onClick={() => {
                                 setChefPin('');
                                 setCurrentScreen(Screen.LANDING);
                             }}
                            className="flex-1 py-4 bg-[#1a1a1a] text-slate-400 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#222] hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                       )}
                      <button 
                          type="submit"
                          className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
                      >
                          Entrar
                      </button>
                  </div>
              </form>
          </div>
      </div>
      </div>
  );
};

// 8. Kitchen Dashboard
const KitchenDashboardScreen: React.FC<{
  setCurrentScreen: (s: Screen) => void;
  orders: Order[];
  updateOrderStatus: (id: string, s: OrderStatus) => void;
  language: Language;
}> = ({ setCurrentScreen, orders, updateOrderStatus, language }) => {
  const t = UI_TRANSLATIONS[language];
  const activeOrders = orders.filter(o => o.status !== OrderStatus.COMPLETED);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  const previousPendingIds = useRef(new Set(orders.filter(o => o.status === OrderStatus.PENDING).map(o => o.id)));

  useEffect(() => {
    const currentPendingIds = new Set(orders.filter(o => o.status === OrderStatus.PENDING).map(o => o.id));
    const isNewOrder = [...currentPendingIds].some(id => !previousPendingIds.current.has(id));
    
    if (isNewOrder) {
      playTone('bells');
    }
    
    previousPendingIds.current = currentPendingIds;
  }, [orders]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
      <div className="min-h-screen bg-[#111111] text-white p-6">
          <header className="flex items-center justify-between mb-8">
              <div>
                  <h1 className="text-3xl font-serif italic text-white">Cocina</h1>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                      {activeOrders.length} TICKETS ACTIVOS
                  </p>
              </div>
              <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block mr-2">
                      <div className="text-xl font-medium tracking-wide text-slate-300">
                          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                  </div>
                  <button
                      onClick={() => setCurrentScreen(window.location.pathname.startsWith('/cocina') ? Screen.KITCHEN_DASHBOARD : Screen.LANDING)}
                      className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                      <Lock size={20} />
                  </button>
              </div>
          </header>

          {activeOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-slate-600">
                  <div className="text-8xl font-light text-slate-800 mb-8 tracking-tighter">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<span className="text-4xl text-slate-800/50">{currentTime.toLocaleTimeString([], { second: '2-digit' }).replace(/[^0-9]/g, '')}</span>
                  </div>
                  <CheckCircle size={48} className="mb-4 opacity-20" />
                  <p className="uppercase tracking-widest font-bold text-sm">Todo en orden chef</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeOrders.map(order => {
                      const isPending = order.status === OrderStatus.PENDING;

                      return (
                      <div
                          key={order.id}
                          className="relative bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                      >
                          {/* Left Color Strip */}
                          <div className={`absolute left-0 top-0 bottom-0 w-2 ${isPending ? 'bg-amber-500' : 'bg-blue-600'}`}></div>

                          <div className="p-6 pl-8 flex flex-col h-full">
                              {/* Header */}
                              <div className="flex justify-between items-start mb-6">
                                  <div>
                                      <h3 className="text-3xl font-bold text-white mb-1">Mesa {order.tableNumber}</h3>
                                      <div className="text-slate-500 text-xs font-mono flex items-center gap-2">
                                          <span className="uppercase tracking-wider">{order.location}</span>
                                          <span>•</span>
                                          <span>#{order.id}</span>
                                      </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                      <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                                          <Clock size={14} />
                                          <span>{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                      </div>
                                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                          isPending
                                              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20'
                                              : 'bg-blue-500/20 text-blue-500 border border-blue-500/20'
                                      }`}>
                                          {order.status}
                                      </span>
                                  </div>
                              </div>

                              {order.allergies && (
                                <div className="mb-6 bg-red-900/30 border border-red-500/30 p-3 rounded-xl flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                    <AlertCircle className="text-red-400 w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">{t.allergy_alert}</h4>
                                    <p className="text-slate-200 text-sm font-medium">{order.allergies}</p>
                                  </div>
                                </div>
                              )}

                              {/* Divider */}
                              <div className="h-px bg-white/10 w-full mb-6"></div>

                              {/* Items List */}
                              <div className="flex-1 space-y-4 mb-8">
                                  {order.items.map((item, idx) => (
                                      <div key={idx} className="flex items-start gap-4">
                                          <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] border border-white/5 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                              {item.quantity}
                                          </div>
                                          <div className="pt-1.5">
                                              <p className="text-slate-200 text-lg font-medium leading-none">{item.name}</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>

                              {/* Action Button */}
                              <div className="mt-auto">
                                  {isPending ? (
                                      <button
                                          onClick={() => updateOrderStatus(order.id, OrderStatus.IN_PROGRESS)}
                                          className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                                      >
                                          <Bell size={18} fill="currentColor" />
                                          {t.accept_ticket}
                                      </button>
                                  ) : (
                                      <button
                                          onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)}
                                          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                                      >
                                          <CheckCircle size={18} />
                                          {t.complete_btn}
                                      </button>
                                  )}
                              </div>
                          </div>
                      </div>
                  )})}
              </div>
          )}
      </div>
  );
};

// 9. Admin Dashboard
const AdminDashboardScreen: React.FC<{
  setCurrentScreen: (s: Screen) => void;
  orders: Order[];
  updateOrderStatus: (id: string, s: OrderStatus) => void;
  clearOrders: () => void;
  menuItems: MenuItem[];
  updateMenuItem: (item: MenuItem) => void;
  billRequests: BillRequest[];
  feedbacks: Feedback[];
  updateBillStatus: (id: string, s: 'PENDING' | 'COMPLETED') => void;
  language: Language;
}> = ({ setCurrentScreen, orders, updateOrderStatus, clearOrders, menuItems, updateMenuItem, billRequests, feedbacks, updateBillStatus, language }) => {
  const t = UI_TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'INICIO' | 'RESUMENES' | 'CARTA' | 'CUENTAS' | 'CALCULADORA' | 'RESEÑAS'>('INICIO');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  
  // Add state for selected date
  const [selectedDate, setSelectedDate] = useState<string>(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  const prevPendingBillsRef = useRef<string[]>(
    billRequests.filter(r => r.status === 'PENDING').map(b => b.id)
  );

  const playNotificationSound = React.useCallback((tableNumber: string, location: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const friendlyLocation = location.toLowerCase();
        const basePhrase = `Han pedido la cuenta de la mesa ${tableNumber} de ${friendlyLocation}.`;
        const phrase = `${basePhrase} ${basePhrase} ${basePhrase}`;
        
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(v => v.lang.startsWith('es'));
        if (spanishVoice) {
            utterance.voice = spanishVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.log('Audio playback failed', e);
    }
  }, []);

  useEffect(() => {
    const pendingBills = billRequests.filter(r => r.status === 'PENDING');
    const pendingIds = pendingBills.map(b => b.id);
    
    // Find new bills that weren't in the previous list
    const newBills = pendingBills.filter(b => !prevPendingBillsRef.current.includes(b.id));
    
    if (newBills.length > 0) {
      // Just play for the latest one
      const latestBill = newBills[0];
      playNotificationSound(latestBill.tableNumber, latestBill.location);
    }
    
    prevPendingBillsRef.current = pendingIds;
  }, [billRequests, playNotificationSound]);

  // Filter and sort orders
  const sortedOrders = [...orders]
    .filter(order => {
        const orderDate = new Date(order.timestamp);
        const orderDateString = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;
        return orderDateString === selectedDate;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (ts?: number) => {
      if (!ts) return '';
      return new Date(ts).toLocaleString('es-ES', {
          hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
  };

  const getStatusColor = (status: OrderStatus) => {
      switch (status) {
          case OrderStatus.PENDING: return 'bg-amber-100 text-amber-800';
          case OrderStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
          case OrderStatus.COMPLETED: return 'bg-green-100 text-green-800';
          default: return 'bg-slate-100 text-slate-800';
      }
  };

  const [summaryDailyDate, setSummaryDailyDate] = useState<string>(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [summaryMonthlyDate, setSummaryMonthlyDate] = useState<string>(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Summaries Calculations
  const completedBills = billRequests.filter(b => b.status === 'COMPLETED');

  // Daily totals
  const dailyBills = completedBills.filter(
      b => new Date(b.timestamp).toDateString() === new Date(summaryDailyDate).toDateString()
  );
  const dailyTotal = dailyBills.reduce((sum, b) => sum + (b.total || 0), 0);
  const dailyTotalCard = dailyBills.filter(b => b.paymentMethod === 'CARD' || b.paymentMethod === 'ONLINE').reduce((sum, b) => sum + (b.total || 0), 0);
  const dailyTotalCash = dailyBills.filter(b => b.paymentMethod === 'CASH').reduce((sum, b) => sum + (b.total || 0), 0);

  const markFeedbackAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'feedbacks', id), { status: 'READ' });
    } catch(e) {
      handleFirestoreError(e, OperationType.UPDATE, 'feedbacks');
    }
  };

  // Monthly totals
  const [summaryMonthlyYear, summaryMonthlyMonth] = summaryMonthlyDate.split('-');
  const monthlyBills = completedBills.filter(b => {
      const billDate = new Date(b.timestamp);
      return billDate.getMonth() === parseInt(summaryMonthlyMonth) - 1 && billDate.getFullYear() === parseInt(summaryMonthlyYear);
  });
  const monthlyTotal = monthlyBills.reduce((sum, b) => sum + (b.total || 0), 0);
  const monthlyTotalCard = monthlyBills.filter(b => b.paymentMethod === 'CARD' || b.paymentMethod === 'ONLINE').reduce((sum, b) => sum + (b.total || 0), 0);
  const monthlyTotalCash = monthlyBills.filter(b => b.paymentMethod === 'CASH').reduce((sum, b) => sum + (b.total || 0), 0);

  // Global totals
  const globalTotal = completedBills.reduce((sum, b) => sum + (b.total || 0), 0);
  
  const guestSessions = new Set();
  let totalGuests = 0;
  orders.forEach(o => {
     const sessionKey = `${o.location}-${o.tableNumber}-${new Date(o.timestamp).toDateString()}`;
     if (!guestSessions.has(sessionKey)) {
         guestSessions.add(sessionKey);
         totalGuests += (o.guestCount || 0);
     }
  });

  const averageTicket = completedBills.length > 0 ? (globalTotal / completedBills.length) : 0;

  const historicalHighlights = React.useMemo(() => {
     const dailyEarnings: Record<string, number> = {};
     completedBills.forEach(b => {
         const dateObj = new Date(b.timestamp);
         const date = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth()+1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
         dailyEarnings[date] = (dailyEarnings[date] || 0) + (b.total || 0);
     });
     
     let bestDayEarning = { date: '-', amount: 0 };
     let worstDayEarning = { date: '-', amount: Infinity };
     
     Object.entries(dailyEarnings).forEach(([date, amount]) => {
         if (amount > bestDayEarning.amount) bestDayEarning = { date, amount };
         if (amount < worstDayEarning.amount) worstDayEarning = { date, amount };
     });
     
     if (worstDayEarning.amount === Infinity) worstDayEarning = { date: '-', amount: 0 };
     
     const dailyGuests: Record<string, { total: number, sessions: Set<string> }> = {};
     orders.forEach(o => {
         const dateObj = new Date(o.timestamp);
         const date = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth()+1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
         if (!dailyGuests[date]) {
             dailyGuests[date] = { total: 0, sessions: new Set() };
         }
         const sessionKey = `${o.location}-${o.tableNumber}`;
         if (!dailyGuests[date].sessions.has(sessionKey)) {
             dailyGuests[date].sessions.add(sessionKey);
             dailyGuests[date].total += (o.guestCount || 0);
         }
     });

     let bestDayGuests = { date: '-', count: 0 };
     Object.entries(dailyGuests).forEach(([date, data]) => {
         if (data.total > bestDayGuests.count) bestDayGuests = { date, count: data.total };
     });

     return { bestDayEarning, worstDayEarning, bestDayGuests };
  }, [completedBills, orders]);

  const getTopProducts = (orderList: typeof orders) => {
      const productSales: Record<string, {name: string, quantity: number, total: number}> = {};
      orderList.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.id]) {
            productSales[item.id] = { name: item.name, quantity: 0, total: 0 };
          }
          productSales[item.id].quantity += item.quantity;
          productSales[item.id].total += (item.quantity * item.price);
        });
      });
    
      return Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
  };
  const topProductsGlobal = getTopProducts(orders);

  const printTicket = (tableNumber: string, location: string, tableBills: BillRequest[]) => {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      
      const tableTotal = tableBills.reduce((sum, b) => sum + (b.total || 0), 0);
      
      let itemsHtml = '';
      tableBills.forEach(bill => {
          if (bill.splitWays) {
               itemsHtml += `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                      <span>División equitativa (1/${bill.splitWays})</span>
                      <span>${((bill.total || 0)).toFixed(2)}€</span>
                  </div>
              `;
          } else if (bill.itemsToPay && bill.itemsToPay.length > 0) {
              bill.itemsToPay.forEach(item => {
                  itemsHtml += `
                      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                          <span>${item.quantity}x ${item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}€</span>
                      </div>
                  `;
              });
          }
      });

      // Si no hay items especificados en los bills y no es fraccionado, intentamos cogerlos de los pedidos de esa mesa que no esten pagados
      if (itemsHtml === '') {
          const tableOrders = orders.filter(o => o.location === location && o.tableNumber === tableNumber && !o.paid);
          tableOrders.forEach(o => {
              o.items.forEach(item => {
                  let qtyToPay = item.quantity - (item.paidQuantity || 0);
                  if (qtyToPay > 0) {
                      itemsHtml += `
                          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                              <span>${qtyToPay}x ${item.name}</span>
                              <span>${(item.price * qtyToPay).toFixed(2)}€</span>
                          </div>
                      `;
                  }
              });
          });
      }

      const htmlContent = `
          <html>
              <head>
                  <title>Ticket Mesa ${tableNumber}</title>
                  <style>
                      @page {
                          margin: 0;
                          size: 80mm auto;
                      }
                      body { 
                          font-family: 'Courier New', Courier, monospace; 
                          width: 80mm; 
                          margin: 0; 
                          padding: 5mm; 
                          color: black; 
                          font-size: 12px; 
                          box-sizing: border-box; 
                      }
                      .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed black; padding-bottom: 5px; }
                      .items { margin-bottom: 10px; border-bottom: 1px dashed black; padding-bottom: 5px; }
                      .total { display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2em; }
                      @media print {
                          body { padding: 5mm; }
                          html, body {
                              width: 80mm;
                              margin: 0;
                              padding: 0;
                          }
                      }
                  </style>
              </head>
              <body>
                  <div class="header">
                      <h2>NEVADA.</h2>
                      <p>Mesa ${tableNumber} - ${location}</p>
                      <p>${new Date().toLocaleString()}</p>
                  </div>
                  <div class="items">
                      ${itemsHtml || '<p>---</p>'}
                  </div>
                  <div class="total">
                      <span>TOTAL:</span>
                      <span>${tableTotal.toFixed(2)}€</span>
                  </div>
                  <p style="text-align: center; margin-top: 20px;">¡Gracias por su visita!</p>
                  <script>
                      window.onload = function() { window.print(); window.close(); }
                  </script>
              </body>
          </html>
      `;
      printWindow.document.write(htmlContent);
      printWindow.document.close();
  };

  return (
      <div className="min-h-screen bg-slate-50 flex">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 shadow-xl shrink-0 z-10 hidden md:flex">
             <h1 className="text-3xl font-serif font-black mb-12 tracking-wide mt-2">NEVADA<span className="text-blue-500">.</span></h1>
             
             <nav className="flex-1 space-y-2">
                 <button 
                     onClick={() => setActiveTab('INICIO')}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-wide ${activeTab === 'INICIO' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                 >
                     <Home size={18} />
                     Visión General
                 </button>
                 <button 
                     onClick={() => setActiveTab('RESUMENES')}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-wide ${activeTab === 'RESUMENES' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                 >
                     <BarChart3 size={18} />
                     Facturación
                 </button>
                 <button 
                     onClick={() => setActiveTab('CARTA')}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-wide ${activeTab === 'CARTA' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                 >
                     <Utensils size={18} />
                     Gestión de Menú
                 </button>
                 <button 
                     onClick={() => setActiveTab('CUENTAS')}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-wide ${activeTab === 'CUENTAS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                 >
                     <Receipt size={18} />
                     Cobros
                     {(() => {
                         const pendingTables = new Set(billRequests.filter(b => b.status === 'PENDING').map(b => `${b.location}-${b.tableNumber}`));
                         return pendingTables.size > 0 ? (
                             <span className="ml-auto bg-[#4ade80] text-green-900 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                 {pendingTables.size}
                             </span>
                         ) : null;
                     })()}
                 </button>
                 <button 
                     onClick={() => setActiveTab('CALCULADORA')}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-wide ${activeTab === 'CALCULADORA' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                 >
                     <Calculator size={18} />
                     Terminal de Caja
                 </button>
                 <div className="pt-4 mt-2 border-t border-slate-800">
                     <button 
                         onClick={() => setActiveTab('RESEÑAS')}
                         className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-wide group overflow-hidden relative ${activeTab === 'RESEÑAS' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                     >
                         {activeTab === 'RESEÑAS' && <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 shadow-lg opacity-100 transition-opacity"></div>}
                         {!activeTab && <div className="absolute inset-0 bg-red-500/10 group-hover:bg-red-500/20 opacity-100 transition-opacity"></div>}
                         
                         <div className="flex items-center gap-3 relative z-10 w-full rounded-xl">
                             <AlertCircle size={18} className={`${activeTab === 'RESEÑAS' ? 'text-white' : 'text-red-400 group-hover:text-red-300'} transition-colors`} />
                             Malas Reseñas
                             {feedbacks.filter(f => f.status === 'UNREAD').length > 0 && (
                                 <span className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                                     {feedbacks.filter(f => f.status === 'UNREAD').length}
                                 </span>
                             )}
                         </div>
                     </button>
                 </div>
             </nav>
             <button
                 onClick={() => setCurrentScreen(window.location.pathname.startsWith('/dashboard') ? Screen.ADMIN_DASHBOARD : Screen.LANDING)}
                 className="mt-auto flex items-center justify-center gap-2 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all font-bold text-sm"
             >
                 <Lock size={16} />
                 Salir
             </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-h-screen overflow-x-hidden overflow-y-auto w-full">
              {activeTab === 'INICIO' && (
                  <div className="p-6 md:p-8">
                      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                          <div>
                              <h1 className="text-3xl font-serif font-black text-slate-900 mb-1">Dashboard</h1>
                              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                                  HISTORIAL DE COMANDAS
                              </p>
                          </div>
                      
                          <div className="flex flex-wrap items-center gap-4">
                              {/* Date Picker */}
                              <div className="relative flex items-center">
                                  <div className="absolute left-3 text-slate-400 pointer-events-none">
                                      <CalendarDays size={18} />
                                  </div>
                                  <input 
                                      type="date" 
                                      value={selectedDate}
                                      onChange={(e) => setSelectedDate(e.target.value)}
                                      className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                  />
                              </div>
                              <button
                                  onClick={() => setCurrentScreen(window.location.pathname.startsWith('/dashboard') ? Screen.ADMIN_DASHBOARD : Screen.LANDING)}
                                  className="md:hidden p-3 bg-white rounded-xl text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200 transition-colors"
                              >
                                  <Lock size={20} />
                              </button>
                          </div>
                      </header>

                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                          <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm whitespace-nowrap">
                                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                                      <tr>
                                          <th className="px-4 py-4">Numero_Pedido</th>
                                          <th className="px-4 py-4">Numero_Mesa</th>
                                          <th className="px-4 py-4">Ubicacion</th>
                                          <th className="px-4 py-4">Pedido</th>
                                          <th className="px-4 py-4">Hora_Pedido</th>
                                          <th className="px-4 py-4">Hora_Aceptado</th>
                                          <th className="px-4 py-4">Hora_Entrega</th>
                                          <th className="px-4 py-4 text-center">Estado</th>
                                          <th className="px-4 py-4">Notas_especiales</th>
                                          <th className="px-4 py-4 text-center">Comensales</th>
                                          <th className="px-4 py-4 text-right">Total</th>
                                          <th className="px-4 py-4 text-center">Acciones</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                      {sortedOrders.map((order) => (
                                          <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                              <td className="px-4 py-4 font-mono text-xs text-slate-500">{order.id}</td>
                                              <td className="px-4 py-4 font-bold text-slate-900 text-center">{order.tableNumber}</td>
                                              <td className="px-4 py-4 font-medium text-slate-600">{order.location}</td>
                                              <td className="px-4 py-4 text-slate-600 whitespace-normal min-w-[200px]">
                                                  {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                              </td>
                                              <td className="px-4 py-4 text-slate-500 text-xs">{formatDate(order.timestamp)}</td>
                                              <td className="px-4 py-4 text-slate-500 text-xs">{formatDate(order.acceptedTimestamp)}</td>
                                              <td className="px-4 py-4 text-slate-500 text-xs">{formatDate(order.completedTimestamp)}</td>
                                              <td className="px-4 py-4 text-center">
                                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                      {order.status}
                                                  </span>
                                              </td>
                                              <td className="px-4 py-4 text-slate-500"></td>
                                              <td className="px-4 py-4 text-center font-bold text-slate-600">{order.guestCount}</td>
                                              <td className="px-4 py-4 text-right font-bold text-slate-900">{order.total.toFixed(2)}€</td>
                                              <td className="px-4 py-4 text-center">
                                                  {order.status === OrderStatus.PENDING && (
                                                      <button 
                                                          onClick={() => updateOrderStatus(order.id, OrderStatus.IN_PROGRESS)}
                                                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                                                      >
                                                          {t.cook_btn}
                                                      </button>
                                                  )}
                                                  {order.status === OrderStatus.IN_PROGRESS && (
                                                      <button 
                                                          onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)}
                                                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                                                      >
                                                          {t.complete_btn}
                                                      </button>
                                                  )}
                                              </td>
                                          </tr>
                                      ))}
                                      {sortedOrders.length === 0 && (
                                          <tr>
                                              <td colSpan={12} className="px-4 py-8 text-center text-slate-500 font-medium">
                                                  {t.no_orders}
                                              </td>
                                          </tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              )}
              
              {activeTab === 'RESUMENES' && (
                  <div className="p-6 md:p-8 flex-1">
                      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                          <div>
                              <h1 className="text-3xl font-serif font-black text-slate-900 mb-1">Facturación</h1>
                              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                                  FACTURACIÓN GLOBAL
                              </p>
                          </div>
                          <button
                              onClick={() => setCurrentScreen(window.location.pathname.startsWith('/dashboard') ? Screen.ADMIN_DASHBOARD : Screen.LANDING)}
                              className="md:hidden p-3 bg-white rounded-xl text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200 transition-colors self-end"
                          >
                              <Lock size={20} />
                          </button>
                      </header>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group w-full">
                               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                   <BarChart3 size={64} className="text-blue-500" />
                               </div>
                               <div className="flex justify-between items-start relative z-10 mb-6 gap-4 flex-col sm:flex-row">
                                 <div>
                                   <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Facturación Diaria</h3>
                                   <p className="text-sm text-slate-400 font-medium hidden sm:block">Recaudación por día</p>
                                 </div>
                                 <input 
                                     type="date" 
                                     value={summaryDailyDate}
                                     onChange={(e) => setSummaryDailyDate(e.target.value)}
                                     className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm w-full sm:w-auto"
                                 />
                               </div>
                               <p className="text-4xl sm:text-5xl font-serif font-black text-slate-900 relative z-10">{dailyTotal.toFixed(2)}€</p>
                               <div className="flex gap-4 mt-4 relative z-10">
                                   <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex-1">
                                       <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Tarjeta / Online</span>
                                       <span className="text-sm font-black text-blue-700">{dailyTotalCard.toFixed(2)}€</span>
                                   </div>
                                   <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex-1">
                                       <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Efectivo</span>
                                       <span className="text-sm font-black text-emerald-700">{dailyTotalCash.toFixed(2)}€</span>
                                   </div>
                               </div>
                           </div>
                           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group w-full">
                               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                   <Calendar size={64} className="text-blue-500" />
                               </div>
                               <div className="flex justify-between items-start relative z-10 mb-6 gap-4 flex-col sm:flex-row">
                                 <div>
                                   <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Facturación Mensual</h3>
                                   <p className="text-sm text-slate-400 font-medium hidden sm:block">Recaudación por mes</p>
                                 </div>
                                 <input 
                                     type="month" 
                                     value={summaryMonthlyDate}
                                     onChange={(e) => setSummaryMonthlyDate(e.target.value)}
                                     className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm w-full sm:w-auto"
                                 />
                               </div>
                               <p className="text-4xl sm:text-5xl font-serif font-black text-slate-900 relative z-10">{monthlyTotal.toFixed(2)}€</p>
                               <div className="flex gap-4 mt-4 relative z-10">
                                   <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex-1">
                                       <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Tarjeta / Online</span>
                                       <span className="text-sm font-black text-blue-700">{monthlyTotalCard.toFixed(2)}€</span>
                                   </div>
                                   <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex-1">
                                       <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Efectivo</span>
                                       <span className="text-sm font-black text-emerald-700">{monthlyTotalCash.toFixed(2)}€</span>
                                   </div>
                               </div>
                           </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
                              <h3 className="text-slate-800 font-bold mb-6 flex items-center gap-2">
                                  <TrendingUp className="text-blue-500" size={20} />
                                  Métricas Globales (Histórico)
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
                                      <div className="text-slate-400 mb-2 flex items-center gap-2 text-sm font-medium"><ShoppingBag size={16}/> Comandas Totales</div>
                                      <div className="text-2xl font-black text-slate-900">{orders.length}</div>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
                                      <div className="text-slate-400 mb-2 flex items-center gap-2 text-sm font-medium"><Award size={16}/> Ticket Medio</div>
                                      <div className="text-2xl font-black text-slate-900">{averageTicket.toFixed(2)}€</div>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
                                      <div className="text-slate-400 mb-2 flex items-center gap-2 text-sm font-medium"><Users size={16}/> Total Comensales</div>
                                      <div className="text-2xl font-black text-slate-900">{totalGuests}</div>
                                  </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
                                      <div className="text-slate-400 mb-2 flex items-center gap-2 text-sm font-medium"><TrendingUp size={16}/> Mejor Día (Ganancias)</div>
                                      <div className="text-lg font-black text-emerald-700">{historicalHighlights.bestDayEarning.amount.toFixed(2)}€</div>
                                      <div className="text-xs text-slate-500 font-medium">{historicalHighlights.bestDayEarning.date}</div>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
                                      <div className="text-slate-400 mb-2 flex items-center gap-2 text-sm font-medium"><TrendingDown size={16}/> Peor Día (Ganancias)</div>
                                      <div className="text-lg font-black text-red-700">{historicalHighlights.worstDayEarning.amount.toFixed(2)}€</div>
                                      <div className="text-xs text-slate-500 font-medium">{historicalHighlights.worstDayEarning.date}</div>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
                                      <div className="text-slate-400 mb-2 flex items-center gap-2 text-sm font-medium"><Users size={16}/> Día más concurrido</div>
                                      <div className="text-lg font-black text-blue-700">{historicalHighlights.bestDayGuests.count} personas</div>
                                      <div className="text-xs text-slate-500 font-medium">{historicalHighlights.bestDayGuests.date}</div>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                              <h3 className="text-slate-800 font-bold mb-6 flex items-center gap-2">
                                 <Award className="text-amber-500" size={20} /> 
                                 Top 5 Productos
                              </h3>
                              <div className="space-y-4">
                                  {topProductsGlobal.length > 0 ? topProductsGlobal.map((prod, idx) => (
                                      <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                          <div className="flex flex-col pr-2">
                                              <span className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</span>
                                              <span className="text-xs text-slate-500 mt-0.5">{prod.quantity} unidades vendidas</span>
                                          </div>
                                          <div className="font-black text-blue-600 text-sm whitespace-nowrap">
                                              {prod.total.toFixed(2)}€
                                          </div>
                                      </div>
                                  )) : (
                                      <div className="text-sm text-slate-400 font-medium text-center py-4 bg-slate-50 rounded-xl border border-slate-100">{t.no_sales}</div>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'CARTA' && (
                  <div className="animate-fade-in pb-12 w-full max-w-4xl mx-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                          <div>
                              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Gestión del Menú</h2>
                              <p className="text-slate-500 mt-1">Activa o desactiva platos y actualiza sus precios.</p>
                          </div>
                          
                          <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                              <input 
                                  type="text"
                                  placeholder="Buscar plato..."
                                  value={menuSearchQuery}
                                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                              />
                          </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                          <div className="p-4 border-b border-slate-200 bg-slate-50 flex font-bold text-slate-500 text-sm">
                              <div className="flex-1">Plato</div>
                              <div className="w-32 text-center">Estado</div>
                              <div className="w-32 text-center" title="Quedan pocas unidades (Efecto FOMO)">Pocas Unds.</div>
                              <div className="w-32 text-right">Precio</div>
                          </div>
                          <div className="divide-y divide-slate-100">
                              {menuItems
                                .filter(item => item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) || item.description.toLowerCase().includes(menuSearchQuery.toLowerCase()))
                                .map(item => (
                                  <div key={item.id} className={`p-4 flex items-center transition-colors ${item.outOfStock ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}>
                                      <div className="flex-1 flex flex-col md:flex-row gap-4 items-start md:items-center pr-4">
                                          <img src={item.image} alt={item.name} className={`w-16 h-16 rounded-xl object-cover shadow-sm ${item.outOfStock ? 'grayscale opacity-60' : ''}`} />
                                          <div>
                                              <div className="font-bold text-slate-900">{item.name}</div>
                                              <div className="text-xs text-slate-400 mt-0.5 max-w-xs line-clamp-1">{item.description}</div>
                                              <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">{item.category}</span>
                                          </div>
                                      </div>
                                      
                                      <div className="w-32 flex justify-center">
                                          <button
                                              onClick={() => updateMenuItem({ ...item, outOfStock: !item.outOfStock })}
                                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${!item.outOfStock ? 'bg-green-500' : 'bg-slate-300'}`}
                                          >
                                              <span className="sr-only">Toggle stock</span>
                                              <span
                                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${!item.outOfStock ? 'translate-x-6' : 'translate-x-1'}`}
                                              />
                                          </button>
                                      </div>

                                      <div className="w-32 flex justify-center">
                                          <button
                                              onClick={() => updateMenuItem({ ...item, fewUnitsLeft: !item.fewUnitsLeft })}
                                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${item.fewUnitsLeft ? 'bg-red-500' : 'bg-slate-300'}`}
                                              title="Marcar como 'pocas unidades' (FOMO)"
                                          >
                                              <span className="sr-only">Toggle scarcity</span>
                                              <span
                                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.fewUnitsLeft ? 'translate-x-6' : 'translate-x-1'}`}
                                              />
                                          </button>
                                      </div>

                                      <div className="w-32 flex justify-end">
                                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                                              <input 
                                                  type="number"
                                                  step="0.10"
                                                  min="0"
                                                  value={item.price}
                                                  onChange={(e) => {
                                                      const val = parseFloat(e.target.value);
                                                      if (!isNaN(val)) {
                                                          updateMenuItem({ ...item, price: val });
                                                      }
                                                  }}
                                                  className="w-16 text-right outline-none text-slate-800 font-bold bg-transparent"
                                              />
                                              <span className="text-slate-500 font-bold">€</span>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}
              {activeTab === 'CUENTAS' && (
                  <div className="animate-fade-in pb-12 w-full max-w-4xl mx-auto p-6 md:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                          <div>
                              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Cobros</h2>
                              <p className="text-slate-500 mt-1">Peticiones de cuenta de las mesas en tiempo real.</p>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {billRequests.filter(b => b.status === 'PENDING').length === 0 ? (
                              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
                                  <Receipt size={48} className="mb-4 opacity-50" />
                                  <p className="font-medium">{t.no_pending_bills}</p>
                              </div>
                          ) : (
                              (() => {
                                  const pendingBills = billRequests.filter(b => b.status === 'PENDING').sort((a, b) => a.timestamp - b.timestamp);
                                  const groupedBills = pendingBills.reduce((acc, bill) => {
                                      const key = `${bill.location}-${bill.tableNumber}`;
                                      if (!acc[key]) acc[key] = [];
                                      acc[key].push(bill);
                                      return acc;
                                  }, {} as Record<string, BillRequest[]>);

                                  return Object.values(groupedBills).map(tableBills => {
                                      const firstBill = tableBills[0];
                                      const tableNumber = firstBill.tableNumber;
                                      const location = firstBill.location;
                                      
                                      let isFullyRequested = false;
                                      const firstSplitBill = tableBills.find(b => b.splitWays !== undefined);
                                      if (firstSplitBill) {
                                          isFullyRequested = tableBills.length >= firstSplitBill.splitWays;
                                      } else {
                                          const activeTableOrders = orders.filter(o => o.location === location && o.tableNumber === tableNumber && !o.paid);
                                          let totalUnpaidQty = 0;
                                          activeTableOrders.forEach(o => {
                                              o.items.forEach(item => {
                                                  totalUnpaidQty += item.quantity - (item.paidQuantity || 0);
                                              });
                                          });

                                          let totalRequestedQty = 0;
                                          tableBills.forEach(b => {
                                              if (b.itemsToPay && b.itemsToPay.length > 0) {
                                                  b.itemsToPay.forEach(item => {
                                                      totalRequestedQty += item.quantity;
                                                  });
                                              } else {
                                                  totalRequestedQty += totalUnpaidQty; 
                                              }
                                          });
                                          // Add buffer or straight equals
                                          isFullyRequested = totalUnpaidQty === 0 || totalRequestedQty >= totalUnpaidQty;
                                      }

                                      const tableTotal = tableBills.reduce((sum, b) => sum + (b.total || 0), 0);

                                      return (
                                          <div key={`table-${location}-${tableNumber}`} className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200 relative overflow-hidden flex flex-col">
                                              <div className="absolute top-0 right-0 p-4 opacity-10">
                                                  <Receipt size={64} className="text-amber-500" />
                                              </div>
                                              
                                              <div className="relative z-10 flex-1">
                                                  <div className="flex justify-between items-start mb-4">
                                                      <div>
                                                          <h3 className="text-2xl font-bold text-slate-900 mb-1">Mesa {tableNumber}</h3>
                                                          <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">{location}</p>
                                                      </div>
                                                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest border ${isFullyRequested ? 'bg-green-100 text-green-600 border-green-200' : 'bg-amber-100 text-amber-600 border-amber-200'}`}>
                                                          {isFullyRequested ? 'Lista para cobrar' : 'Esperando...'}
                                                      </span>
                                                  </div>
                                                  
                                                  <div className="mb-4 max-h-64 overflow-y-auto pr-1">
                                                      {tableBills.map((bill, idx) => (
                                                          <div key={bill.id} className="mb-3 p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
                                                               <div className="flex flex-col mb-1">
                                                                   <div className="flex justify-between items-center font-bold text-slate-800">
                                                                       <span>
                                                                           {bill.splitWays 
                                                                               ? 'Equitativo' 
                                                                               : `Invitado ${idx + 1}`} 
                                                                           {bill.paymentMethod ? ` - ${bill.paymentMethod === 'ONLINE' ? 'APPLE PAY' : bill.paymentMethod === 'CARD' ? 'DATÁFONO' : 'EFECTIVO'}` : ''}
                                                                       </span>
                                                                       <span>{(bill.total || 0).toFixed(2)}€</span>
                                                                   </div>
                                                                   {bill.splitWays && (
                                                                       <span className="text-xs text-slate-500 font-medium">
                                                                           (División equitativa entre {bill.splitWays} personas)
                                                                       </span>
                                                                   )}
                                                               </div>
                                                               {bill.itemsToPay && bill.itemsToPay.length > 0 && (
                                                                   <div className="text-xs text-slate-500 mt-1 space-y-1">
                                                                        {bill.itemsToPay.map((item, i) => (
                                                                            <div key={i} className="flex justify-between">
                                                                                 <span>{item.quantity}x {item.name}</span>
                                                                                 <span>{(item.price * item.quantity).toFixed(2)}€</span>
                                                                            </div>
                                                                        ))}
                                                                   </div>
                                                               )}
                                                          </div>
                                                      ))}
                                                  </div>
                                                  
                                                  <div className="flex items-center justify-between mb-6 pt-3 border-t border-slate-100">
                                                      <div className="font-bold text-slate-500 text-sm">
                                                          Total Mesa
                                                      </div>
                                                      <div className="text-2xl font-black text-slate-800">
                                                          {tableTotal.toFixed(2)}€
                                                      </div>
                                                  </div>
                                              </div>

                                              <div className="relative z-10 mt-auto flex flex-col gap-2">
                                                  {isFullyRequested ? (
                                                      <Button 
                                                          fullWidth 
                                                          className="bg-blue-600 text-white shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                                                          onClick={() => tableBills.forEach(b => updateBillStatus(b.id, 'COMPLETED'))}
                                                      >
                                                          <CheckCircle size={16} />
                                                          {t.mark_as_paid}
                                                      </Button>
                                                  ) : (
                                                      <Button 
                                                          fullWidth 
                                                          disabled
                                                          className="bg-slate-100 text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200"
                                                      >
                                                          <Clock size={16} />
                                                          Esperando al resto...
                                                      </Button>
                                                  )}
                                                  <Button 
                                                      fullWidth 
                                                      variant="outline"
                                                      className="flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-50"
                                                      onClick={() => printTicket(tableNumber, location, tableBills)}
                                                  >
                                                      <Printer size={16} />
                                                      Imprimir Ticket
                                                  </Button>
                                              </div>
                                          </div>
                                      );
                                  });
                              })()
                          )}
                      </div>
                  </div>
              )}
              {activeTab === 'CALCULADORA' && <CashCalculator />}
              {activeTab === 'RESEÑAS' && (
                  <div className="animate-fade-in pb-12 w-full max-w-4xl mx-auto p-6 md:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                          <div>
                              <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                  <AlertCircle className="text-red-500 w-8 h-8" /> Malas Reseñas
                              </h2>
                              <p className="text-slate-500 mt-1">Interceptadas antes de llegar a Google Maps.</p>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                          {feedbacks.filter(f => f.status === 'UNREAD').length === 0 ? (
                              <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
                                  <Star size={48} className="mb-4 opacity-50 text-slate-300" />
                                  <p className="font-medium">No hay reseñas pendientes.</p>
                              </div>
                          ) : (
                              feedbacks.filter(f => f.status === 'UNREAD').sort((a, b) => b.timestamp - a.timestamp).map(feedback => (
                                  <div key={feedback.id} className={`bg-white p-5 rounded-xl shadow-sm border ${feedback.status === 'UNREAD' ? 'border-red-200 ring-2 ring-red-500/10' : 'border-slate-200'} flex flex-col gap-4`}>
                                      <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
                                          <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-2">
                                                  <div className="flex">
                                                      {[1, 2, 3, 4, 5].map(star => (
                                                          <Star key={star} size={16} className={feedback.rating >= star ? 'text-amber-400' : 'text-slate-200'} fill={feedback.rating >= star ? 'currentColor' : 'none'} />
                                                      ))}
                                                  </div>
                                                  <span className="text-xs font-bold text-slate-400">
                                                      {new Date(feedback.timestamp).toLocaleString()}
                                                  </span>
                                                  {feedback.status === 'UNREAD' && (
                                                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Nuevo</span>
                                                  )}
                                              </div>
                                              <p className="text-slate-700 font-medium text-sm mb-2">&quot;{feedback.comment || 'Sin comentario'}&quot;</p>
                                              <div className="text-xs text-slate-500 font-bold bg-slate-50 inline-block px-3 py-1 rounded-md">
                                                  Mesa {feedback.tableNumber} • {feedback.location}
                                              </div>
                                          </div>
                                          {feedback.status === 'UNREAD' && (
                                              <button 
                                                  onClick={() => markFeedbackAsRead(feedback.id)}
                                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold py-2 px-4 rounded-xl transition-colors shrink-0"
                                              >
                                                  Marcar Leído
                                              </button>
                                          )}
                                      </div>
                                      <FeedbackAIInsight feedback={feedback} />
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              )}
          </div>
      </div>
  );
};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  // State
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    if (window.location.pathname.startsWith('/dashboard')) return Screen.ADMIN_DASHBOARD;
    if (window.location.pathname.startsWith('/cocina')) return Screen.KITCHEN_DASHBOARD;
    return Screen.LANDING;
  });
  const [selectedLocation, setSelectedLocation] = useState<'DENTRO' | 'FUERA' | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [allergiesByTable, setAllergiesByTable] = useState<Record<string, string>>({});
  const [cartsByTable, setCartsByTable] = useState<Record<string, CartItem[]>>({});
  
  const tableKey = `${selectedLocation}-${selectedTable}`;
  const cart = cartsByTable[tableKey] || [];
  const userAllergies = allergiesByTable[tableKey] || '';
  
  const setUserAllergies = React.useCallback((value: React.SetStateAction<string>) => {
    if (!selectedLocation || !selectedTable) return;
    setAllergiesByTable(prev => {
      const currentVal = prev[tableKey] || '';
      const newVal = typeof value === 'function' ? value(currentVal) : value;
      return { ...prev, [tableKey]: newVal };
    });
  }, [selectedLocation, selectedTable, tableKey]);
  
  const setCart = React.useCallback((value: React.SetStateAction<CartItem[]>) => {
    if (!selectedLocation || !selectedTable) return;
    setCartsByTable(prev => {
      const currentCart = prev[tableKey] || [];
      const newCart = typeof value === 'function' ? value(currentCart) : value;
      return { ...prev, [tableKey]: newCart };
    });
  }, [selectedLocation, selectedTable, tableKey]);
  const [activeTab, setActiveTab] = useState<'menu' | 'order'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>(MenuCategory.ALL);
  const [chefPin, setChefPin] = useState<string>('');
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<boolean>(false);
  const [billSuccessMessage, setBillSuccessMessage] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('es');
  
  // Kitchen/Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Bill Requests State
  const [billRequests, setBillRequests] = useState<BillRequest[]>([]);
  
  // Feedback State
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  
  // Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);

  useEffect(() => {
    // Authenticate anonymously so we can read/write directly
    signInAnonymously(auth).catch(err => console.warn('Anon auth error:', err));
  }, []);

  // Sync orders
  useEffect(() => {
    const q = query(collection(db, 'orders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = snapshot.docs.map(doc => doc.data() as Order);
      setOrders(ordersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'orders');
    });

    return () => unsubscribe();
  }, []);

  // Sync bill requests
  useEffect(() => {
    const q = query(collection(db, 'bills'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const billsData: BillRequest[] = snapshot.docs.map(doc => doc.data() as BillRequest);
      setBillRequests(billsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'bills');
    });

    return () => unsubscribe();
  }, []);

  // Sync feedbacks
  useEffect(() => {
    const q = query(collection(db, 'feedbacks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedbacksData: Feedback[] = snapshot.docs.map(doc => doc.data() as Feedback);
      setFeedbacks(feedbacksData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'feedbacks');
    });

    return () => unsubscribe();
  }, []);

  // Listen for table bill completion to kick user to landing and clear data
  const currentTableOrdersCount = selectedLocation && selectedTable 
    ? orders.filter(o => o.location === selectedLocation && o.tableNumber === selectedTable && !o.paid).length 
    : 0;
  const prevTableOrdersCount = useRef(currentTableOrdersCount);

  useEffect(() => {
    if (prevTableOrdersCount.current > 0 && currentTableOrdersCount === 0) {
      if (selectedLocation && selectedTable) {
        const tableKey = `${selectedLocation}-${selectedTable}`;
        setCartsByTable(prev => {
          const next = { ...prev };
          delete next[tableKey];
          return next;
        });
        setAllergiesByTable(prev => {
          const next = { ...prev };
          delete next[tableKey];
          return next;
        });
        if (currentScreen === Screen.MENU || currentScreen === Screen.ALLERGIES_SELECTION) {
          setCurrentScreen(Screen.LANDING);
          setSelectedLocation(null);
          setSelectedTable(null);
          setGuestCount(2);
          setActiveTab('menu');
        }
      }
    }
    prevTableOrdersCount.current = currentTableOrdersCount;
  }, [currentTableOrdersCount, selectedLocation, selectedTable, currentScreen]);

  // Sync menu
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'menu'), async (snapshot) => {
      if (!snapshot.exists()) {
        // Populate if empty
        try {
          await setDoc(doc(db, 'config', 'menu'), { items: MENU_ITEMS });
        } catch (e) {
          console.error("Error setting initial menu", e);
        }
      } else {
        const data = snapshot.data();
        if (data && data.items) {
          const mergedItems = (data.items as MenuItem[]).map(firestoreItem => {
            const baseItem = MENU_ITEMS.find(m => m.id === firestoreItem.id);
            return {
              ...firestoreItem,
              allergens: firestoreItem.allergens || baseItem?.allergens || []
            };
          });
          setMenuItems(mergedItems);
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'config/menu');
    });

    return () => unsubscribe();
  }, []);

  // Cart Logic
  const addToCart = (item: MenuItem) => {
    playTone('pop');
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing) {
        if (existing.quantity === 1) {
          return prev.filter(i => i.id !== itemId);
        }
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev;
    });
  };

  const getCartTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const getItemQuantity = (itemId: string) => {
    return cart.find(i => i.id === itemId)?.quantity || 0;
  };

  const handleSendOrder = async () => {
    if (cart.length === 0) return;

    // Create complete Order object with all details needed for webhook
    const newOrderId = Math.random().toString(36).substr(2, 9);
    const newOrder: Order = {
      id: newOrderId,
      table: `${selectedLocation} ${selectedTable}`,
      tableNumber: selectedTable || '00',
      location: selectedLocation || 'DESCONOCIDO',
      guestCount: guestCount,
      items: [...cart],
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      total: getCartTotal()
    };
    if (userAllergies.trim()) {
      newOrder.allergies = userAllergies.trim();
    }

    try {
      await setDoc(doc(db, 'orders', newOrderId), newOrder);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders');
      return;
    }
    
    setCart([]);
    
    setOrderSuccessMessage(true);
    setTimeout(() => {
        setOrderSuccessMessage(false);
    }, 10000);

    // Trigger Webhook 1: Order Placed
    sendWebhook(WEBHOOK_URLS.NEW_ORDER, newOrder);
  };

  const handleRequestBill = async (method: 'CARD' | 'CASH' | 'ONLINE', splitWays?: number, itemsToPay?: { id: string; name: string; quantity: number; price: number }[]) => {
    const newBillId = Math.random().toString(36).substr(2, 9);
    
    // Calculate total from table orders
    const tableOrders = orders.filter(o => o.location === selectedLocation && o.tableNumber === selectedTable && !o.paid);
    const tableTotal = tableOrders.reduce((sum, order) => sum + order.total, 0);

    const newBill: BillRequest = {
      id: newBillId,
      table: `${selectedLocation} ${selectedTable}`,
      tableNumber: selectedTable || '00',
      location: selectedLocation || 'DESCONOCIDO',
      timestamp: Date.now(),
      status: 'PENDING',
      total: itemsToPay ? itemsToPay.reduce((s, i) => s + (i.price * i.quantity), 0) : (splitWays ? tableTotal / splitWays : tableTotal),
      paymentMethod: method
    };
    
    if (splitWays) newBill.splitWays = splitWays;
    if (itemsToPay && itemsToPay.length > 0) newBill.itemsToPay = itemsToPay;

    // Redirect to menu instantly so the 'LA CUENTA' tab vanishes without flashing
    setActiveTab('menu');

    try {
      await setDoc(doc(db, 'bills', newBillId), newBill);
      setBillSuccessMessage(true);
    } catch(error) {
      handleFirestoreError(error, OperationType.WRITE, 'bills');
    }
  };

  const handleSubmitFeedback = async (rating: number, comment: string) => {
    if (!selectedLocation || !selectedTable) return;

    const newFeedbackId = Math.random().toString(36).substring(2, 9);
    const newFeedback: Feedback = {
      id: newFeedbackId,
      rating,
      comment,
      location: selectedLocation,
      tableNumber: selectedTable,
      timestamp: Date.now(),
      status: 'UNREAD'
    };

    try {
      await setDoc(doc(db, 'feedbacks', newFeedbackId), newFeedback);
      setBillSuccessMessage(false);
    } catch(error) {
      handleFirestoreError(error, OperationType.WRITE, 'feedbacks');
    }
  };

  const clearOrders = async () => {
    try {
      const qs = await getDocs(collection(db, 'orders'));
      const batch = writeBatch(db);
      qs.forEach(document => {
        batch.delete(document.ref);
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'orders');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const now = Date.now();
    
    // Find order to send data to webhook before state update completes
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    // Create a copy of the updated order for the webhook
    const updatedOrder = { ...orders[orderIndex], status: newStatus };
    
    if (newStatus === OrderStatus.IN_PROGRESS) {
        updatedOrder.acceptedTimestamp = now;
        sendWebhook(WEBHOOK_URLS.ORDER_ACCEPTED, updatedOrder);
    } else if (newStatus === OrderStatus.COMPLETED) {
        updatedOrder.completedTimestamp = now;
        sendWebhook(WEBHOOK_URLS.ORDER_COMPLETED, updatedOrder);
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        acceptedTimestamp: newStatus === OrderStatus.IN_PROGRESS ? now : orders[orderIndex].acceptedTimestamp || null,
        completedTimestamp: newStatus === OrderStatus.COMPLETED ? now : orders[orderIndex].completedTimestamp || null
      });
    } catch(error) {
      handleFirestoreError(error, OperationType.UPDATE, 'orders');
    }
  };

  const updateBillStatus = async (billId: string, newStatus: 'PENDING' | 'COMPLETED') => {
    try {
      await updateDoc(doc(db, 'bills', billId), { status: newStatus });
      if (newStatus === 'COMPLETED') {
        const bill = billRequests.find(b => b.id === billId);
        if (bill) {
          const tableOrders = orders.filter(o => o.location === bill.location && o.tableNumber === bill.tableNumber && !o.paid);
          if (bill.itemsToPay && bill.itemsToPay.length > 0) {
             // It's a partial items payment
             for (const paidItem of bill.itemsToPay) {
                let qtyToPay = paidItem.quantity;
                for (const order of tableOrders) {
                   const itemInOrder = order.items.find(i => i.id === paidItem.id);
                   if (itemInOrder && (itemInOrder.quantity > (itemInOrder.paidQuantity || 0))) {
                      const availableToPay = itemInOrder.quantity - (itemInOrder.paidQuantity || 0);
                      const paysHere = Math.min(qtyToPay, availableToPay);
                      itemInOrder.paidQuantity = (itemInOrder.paidQuantity || 0) + paysHere;
                      qtyToPay -= paysHere;
                   }
                   if (qtyToPay <= 0) break;
                }
             }

             // Save updated orders and check if any order is fully paid
             for (const order of tableOrders) {
                const isFullyPaid = order.items.every(i => (i.paidQuantity || 0) >= i.quantity);
                await updateDoc(doc(db, 'orders', order.id), { 
                   items: order.items,
                   paid: isFullyPaid 
                });
             }
          } else if (bill.splitWays) {
             const completedSplits = billRequests.filter(b => b.location === bill.location && b.tableNumber === bill.tableNumber && b.splitWays === bill.splitWays && b.status === 'COMPLETED').length + 1;
             if (completedSplits >= bill.splitWays) {
                 for (const order of tableOrders) {
                    await updateDoc(doc(db, 'orders', order.id), { paid: true });
                 }
             }
          } else {
             // For ALL, mark all as paid
             for (const order of tableOrders) {
                await updateDoc(doc(db, 'orders', order.id), { paid: true });
             }
          }
        }
      }
    } catch(error) {
      handleFirestoreError(error, OperationType.UPDATE, 'bills');
    }
  };

  const updateMenuItem = async (updatedItem: MenuItem) => {
    try {
      const newItems = menuItems.map(item => item.id === updatedItem.id ? updatedItem : item);
      setMenuItems(newItems);
      await setDoc(doc(db, 'config', 'menu'), { items: newItems });
    } catch(error) {
      handleFirestoreError(error, OperationType.WRITE, 'config/menu');
    }
  };

  return (
    <div className="antialiased font-sans text-slate-900 select-none bg-slate-50 relative overflow-hidden min-h-screen">
      <AnimatePresence mode="popLayout">
        {currentScreen === Screen.LANDING && (
          <motion.div key="landing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="absolute inset-0">
            <LandingScreen setCurrentScreen={setCurrentScreen} setChefPin={setChefPin} language={language} setLanguage={setLanguage} />
          </motion.div>
        )}
        {currentScreen === Screen.LOCATION_SELECTION && (
          <motion.div key="location" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="absolute inset-0">
            <LocationSelectionScreen setCurrentScreen={setCurrentScreen} setSelectedLocation={setSelectedLocation} language={language} />
          </motion.div>
        )}
        {currentScreen === Screen.TABLE_SELECTION && (
          <motion.div key="table" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="absolute inset-0">
            <TableSelectionScreen 
              setCurrentScreen={setCurrentScreen} 
              setSelectedTable={setSelectedTable} 
              selectedLocation={selectedLocation} 
              language={language}
            />
          </motion.div>
        )}
        {currentScreen === Screen.GUEST_SELECTION && (
          <motion.div key="guest" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="absolute inset-0">
            <GuestSelectionScreen 
              setCurrentScreen={setCurrentScreen} 
              guestCount={guestCount} 
              setGuestCount={setGuestCount} 
              selectedLocation={selectedLocation}
              selectedTable={selectedTable}
              language={language}
            />
          </motion.div>
        )}
        {currentScreen === Screen.ALLERGIES_SELECTION && (
          <motion.div key="allergies-screen" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="absolute inset-0">
            <AllergiesSelectionScreen 
              setCurrentScreen={setCurrentScreen}
              userAllergies={userAllergies}
              setUserAllergies={setUserAllergies}
              language={language}
            />
          </motion.div>
        )}
        {currentScreen === Screen.MENU && (
          <motion.div key="menu-screen" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="absolute inset-0 overflow-y-auto w-full h-full">
            <MenuScreen 
              setCurrentScreen={setCurrentScreen}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              getCartTotal={getCartTotal}
              getItemQuantity={getItemQuantity}
              handleSendOrder={handleSendOrder}
              handleRequestBill={handleRequestBill}
              handleSubmitFeedback={handleSubmitFeedback}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLocation={selectedLocation}
              selectedTable={selectedTable}
              guestCount={guestCount}
              orderSuccessMessage={orderSuccessMessage}
              billSuccessMessage={billSuccessMessage}
              setBillSuccessMessage={setBillSuccessMessage}
              language={language}
              menuItems={menuItems}
              hasActiveOrders={orders.some(o => o.location === selectedLocation && o.tableNumber === selectedTable && !o.paid)}
              orders={orders}
              billRequests={billRequests}
              userAllergies={userAllergies}
            />
          </motion.div>
        )}
        {currentScreen === Screen.CHEF_LOGIN && (
          <motion.div key="chef-login" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="absolute inset-0">
            <ChefLoginScreen 
              setCurrentScreen={setCurrentScreen}
              chefPin={chefPin}
              setChefPin={setChefPin}
            />
          </motion.div>
        )}
        {currentScreen === Screen.KITCHEN_DASHBOARD && (
          <motion.div key="kitchen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="absolute inset-0 overflow-y-auto">
            <KitchenDashboardScreen 
              setCurrentScreen={setCurrentScreen}
              orders={orders}
              updateOrderStatus={updateOrderStatus}
              language={language}
            />
          </motion.div>
        )}
        {currentScreen === Screen.ADMIN_DASHBOARD && (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="absolute inset-0 overflow-y-auto">
            <AdminDashboardScreen 
              setCurrentScreen={setCurrentScreen}
              orders={orders}
              updateOrderStatus={updateOrderStatus}
              clearOrders={clearOrders}
              menuItems={menuItems}
              updateMenuItem={updateMenuItem}
              billRequests={billRequests}
              feedbacks={feedbacks}
              updateBillStatus={updateBillStatus}
              language={language}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;