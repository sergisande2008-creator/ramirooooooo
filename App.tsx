// ... (Keep existing imports)
import React, { useState, useEffect, useRef } from 'react';
import { Screen, MenuCategory, MenuItem, CartItem, Order, OrderStatus } from './types';
import { MENU_ITEMS, TABLES } from './constants';
// Import from root ./Button
import { Button } from './Button';
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
  Send,
  X,
  CheckCircle,
  Clock,
  Trash2,
  Bell,
  Sun,
  Loader2,
  Calendar,
  CalendarDays
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
    
    <div className="w-full max-w-[340px] bg-[#13100b] rounded-[32px] p-8 border border-white/5 flex flex-col items-center shadow-2xl relative z-10">
        
       {/* Brillo decorativo superior */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-24 bg-[#ccc1ab]/5 blur-[50px] rounded-full pointer-events-none"></div>

       {/* Contenido */}
       <div className="flex flex-col items-center w-full relative z-10 py-4">
          
          {/* Logo Box */}
          <div className="w-[88px] h-[88px] bg-[#1a160f] rounded-[24px] flex items-center justify-center mb-8 border border-[#332c1e] shadow-xl">
            <Utensils className="text-[#ccc1ab] w-10 h-10" strokeWidth={1} />
          </div>
          
          {/* Título */}
          <h1 className="text-4xl font-serif font-black text-white mb-2 tracking-wide">
            NEVADA
          </h1>
          <p className="text-[#a39578] text-[11px] font-bold tracking-[0.35em] mb-12">
            {t.premium_experience}
          </p>

          {/* Selector de idioma */}
          <div className="flex gap-4 mb-8">
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
          </div>

          {/* Botones */}
          <div className="w-full space-y-3">
            <button 
              onClick={() => setCurrentScreen(Screen.LOCATION_SELECTION)} 
              className="w-full bg-[#1a160f] text-[#f5f2ed] border border-[#332c1e] h-14 rounded-xl text-[13px] font-bold uppercase tracking-widest hover:bg-[#332c1e] transition-all duration-300 flex items-center justify-center"
            >
              {t.enter_as_diner}
            </button>
           </div>
       </div>
    </div>
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
      <h2 className="text-4xl font-serif font-black text-slate-900 mb-2">{t.location}</h2>
      <p className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-12">{t.where_to_sit}</p>

      <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
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
      <h2 className="text-4xl font-serif font-black text-slate-900 mb-2">{t.table_label}</h2>
      <p className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-12">{t.zone} {selectedLocation}</p>

      <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
        {TABLES.map((table) => (
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
      <h2 className="text-4xl font-serif font-black text-slate-900 mb-2">{t.guests}</h2>
      <p className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-16">{selectedLocation} - {t.table} {selectedTable}</p>

      <div className="flex items-center gap-12 mb-20">
        <button 
          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
          className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-600 active:scale-90 transition-all"
        >
          <Minus size={24} />
        </button>
        
        <span className="text-9xl font-black text-slate-900 tabular-nums font-serif">
          {guestCount}
        </span>

        <button 
          onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
          className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-600 active:scale-90 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <Button 
        fullWidth 
        className="bg-slate-900 text-white max-w-xs shadow-xl shadow-slate-900/20"
        onClick={() => setCurrentScreen(Screen.MENU)}
      >
        {t.start}
      </Button>
    </div>
  </div>
);
};

// 5. Menu & Order Screen
const MenuScreen: React.FC<{
  selectedLocation: string | null;
  selectedTable: string | null;
  guestCount: number;
  setCurrentScreen: (s: Screen) => void;
  activeTab: 'menu' | 'order';
  setActiveTab: (t: 'menu' | 'order') => void;
  cart: CartItem[];
  selectedCategory: MenuCategory;
  setSelectedCategory: (c: MenuCategory) => void;
  getItemQuantity: (id: string) => number;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  getCartTotal: () => number;
  handleSendOrder: () => void;
  orderSuccessMessage: boolean;
  language: Language;
}> = ({ 
  selectedLocation, selectedTable, guestCount, setCurrentScreen,
  activeTab, setActiveTab, cart, selectedCategory, setSelectedCategory,
  getItemQuantity, addToCart, removeFromCart, getCartTotal, handleSendOrder,
  orderSuccessMessage, language
}) => {
  const t = UI_TRANSLATIONS[language];
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
        <button onClick={() => setCurrentScreen(Screen.LANDING)} className="p-3 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-colors">
          <Home size={20} />
        </button>
      </div>

      {/* Custom Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
        <button 
          onClick={() => setActiveTab('order')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'order' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {t.your_order} {cart.length > 0 && `(${cart.reduce((a, b) => a + b.quantity, 0)})`}
        </button>
        <button 
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'menu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {t.menu}
        </button>
      </div>
    </header>

    {/* Content */}
    <div className="flex-1 p-6">
      {activeTab === 'menu' ? (
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
            {MENU_ITEMS
              .filter(item => selectedCategory === MenuCategory.ALL || item.category === selectedCategory)
              .map((item) => {
                const qty = getItemQuantity(item.id);
                // Translate
                const translatedItem = MENU_TRANSLATIONS[item.id]?.[language] || item;
                const { name, description } = translatedItem;

                return (
                  <div key={item.id} className="bg-white p-3 rounded-[24px] shadow-sm border border-slate-100 flex gap-4 items-center group active:scale-[0.98] transition-transform duration-200 relative overflow-hidden">
                    
                    <img src={item.image} alt={name} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="font-serif font-bold text-slate-900 text-base mb-1 leading-tight">{name}</h3>
                      <p className="text-slate-400 text-xs line-clamp-2 mb-3 leading-relaxed">{description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 text-sm">{item.price.toFixed(2)}€</span>
                        
                        {/* Quantity Control Button */}
                        {qty === 0 ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item); // Note: keeping original item structure for cart mechanics
                              }}
                              className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
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
      ) : (
        <div className="flex flex-col items-center justify-center h-full pt-10">
          <h2 className="text-4xl font-serif font-black text-slate-900 mb-2">{t.your_order}</h2>
          <p className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-12">{t.order_details}</p>
          
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
    </div>

    {orderSuccessMessage && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="text-green-500 w-10 h-10" />
          </div>
          <h3 className="font-serif font-black text-2xl text-slate-900 mb-4">{t.confirm_order}</h3>
          <p className="text-slate-500 leading-relaxed text-sm font-medium">
            {t.prepare_order}
          </p>
        </div>
      </div>
    )}

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
}> = ({ setCurrentScreen, orders, updateOrderStatus }) => {
  const activeOrders = orders.filter(o => o.status !== OrderStatus.COMPLETED);

  return (
      <div className="min-h-screen bg-[#111111] text-white p-6">
          <header className="flex items-center justify-between mb-8">
              <div>
                  <h1 className="text-3xl font-serif italic text-white">Cocina</h1>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                      {activeOrders.length} TICKETS ACTIVOS
                  </p>
              </div>
              <button
                  onClick={() => setCurrentScreen(window.location.pathname.startsWith('/cocina') ? Screen.KITCHEN_DASHBOARD : Screen.LANDING)}
                  className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                  <Lock size={20} />
              </button>
          </header>

          {activeOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-slate-600">
                  <CheckCircle size={64} className="mb-4 opacity-20" />
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
                                          Aceptar Ticket
                                      </button>
                                  ) : (
                                      <button
                                          onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)}
                                          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                                      >
                                          <CheckCircle size={18} />
                                          Completar
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
}> = ({ setCurrentScreen, orders, updateOrderStatus, clearOrders }) => {
  // Add state for selected date
  const [selectedDate, setSelectedDate] = useState<string>(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

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

  return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8">
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 max-w-7xl mx-auto">
              <div>
                  <h1 className="text-3xl font-serif font-black text-slate-900 mb-1">Dashboard</h1>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                      HISTORIAL DE COMANDAS
                  </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                  <button
                      onClick={() => {
                          if(confirm('¿Estás seguro de que quieres borrar el historial entero? Esta acción es irreversible.')) {
                              clearOrders();
                          }
                      }}
                      className="px-4 py-2.5 bg-red-50 text-red-600 font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                  >
                      Borrar Todo
                  </button>

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
                      className="p-3 bg-white rounded-xl text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200 transition-colors"
                  >
                      <Lock size={20} />
                  </button>
              </div>
          </header>

          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
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
                                              Cocinar
                                          </button>
                                      )}
                                      {order.status === OrderStatus.IN_PROGRESS && (
                                          <button 
                                              onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)}
                                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                                          >
                                              Completar
                                          </button>
                                      )}
                                  </td>
                              </tr>
                          ))}
                          {sortedOrders.length === 0 && (
                              <tr>
                                  <td colSpan={12} className="px-4 py-8 text-center text-slate-500 font-medium">
                                      No hay pedidos registrados
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'menu' | 'order'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>(MenuCategory.ALL);
  const [chefPin, setChefPin] = useState<string>('');
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('es');
  
  // Kitchen/Orders State
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Authenticate anonymously so we can read/write directly
    signInAnonymously(auth).catch(err => console.warn('Anon auth error:', err));
  }, []);

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

  // Cart Logic
  const addToCart = (item: MenuItem) => {
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

  return (
    <div className="antialiased font-sans text-slate-900 select-none bg-slate-50">
      {currentScreen === Screen.LANDING && (
        <LandingScreen setCurrentScreen={setCurrentScreen} setChefPin={setChefPin} language={language} setLanguage={setLanguage} />
      )}
      {currentScreen === Screen.LOCATION_SELECTION && (
        <LocationSelectionScreen setCurrentScreen={setCurrentScreen} setSelectedLocation={setSelectedLocation} language={language} />
      )}
      {currentScreen === Screen.TABLE_SELECTION && (
        <TableSelectionScreen 
          setCurrentScreen={setCurrentScreen} 
          setSelectedTable={setSelectedTable} 
          selectedLocation={selectedLocation} 
          language={language}
        />
      )}
      {currentScreen === Screen.GUEST_SELECTION && (
        <GuestSelectionScreen 
          setCurrentScreen={setCurrentScreen} 
          guestCount={guestCount} 
          setGuestCount={setGuestCount} 
          selectedLocation={selectedLocation}
          selectedTable={selectedTable}
          language={language}
        />
      )}
      {currentScreen === Screen.MENU && (
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
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          selectedTable={selectedTable}
          guestCount={guestCount}
          orderSuccessMessage={orderSuccessMessage}
          language={language}
        />
      )}
      {currentScreen === Screen.CHEF_LOGIN && (
        <ChefLoginScreen 
          setCurrentScreen={setCurrentScreen}
          chefPin={chefPin}
          setChefPin={setChefPin}
        />
      )}
      {currentScreen === Screen.KITCHEN_DASHBOARD && (
        <KitchenDashboardScreen 
          setCurrentScreen={setCurrentScreen}
          orders={orders}
          updateOrderStatus={updateOrderStatus}
        />
      )}
      {currentScreen === Screen.ADMIN_DASHBOARD && (
        <AdminDashboardScreen 
          setCurrentScreen={setCurrentScreen}
          orders={orders}
          updateOrderStatus={updateOrderStatus}
          clearOrders={clearOrders}
        />
      )}
    </div>
  );
};

export default App;