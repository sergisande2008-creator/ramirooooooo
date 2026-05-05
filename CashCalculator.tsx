import React, { useState } from 'react';
import { Calculator, Euro, Eraser, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export const CashCalculator: React.FC = () => {
    const [totalBill, setTotalBill] = useState<string>('');
    const [cashReceived, setCashReceived] = useState<string>('');

    const billAmount = parseFloat(totalBill || '0');
    const receivedAmount = parseFloat(cashReceived || '0');
    const change = receivedAmount - billAmount;

    const quickValues = [5, 10, 20, 50, 100];

    const calculateBreakdown = (amount: number) => {
        let remaining = Math.round(amount * 100);
        const breakdown: { [key: number]: number } = {};
        
        // Use Euros and Cents mapping
        const denominations = [
            50000, 20000, 10000, 5000, 2000, 1000, 500, // bills
            200, 100, 50, 20, 10, 5, 2, 1 // coins
        ];

        for (const denom of denominations) {
            if (remaining >= denom) {
                const count = Math.floor(remaining / denom);
                breakdown[denom] = count;
                remaining %= denom;
            }
        }
        return breakdown;
    };

    const breakdown = change > 0 ? calculateBreakdown(change) : {};

    return (
        <div className="animate-fade-in pb-12 w-full max-w-4xl mx-auto p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Calculator className="text-blue-600" size={32} />
                        Terminal de Caja
                    </h2>
                    <p className="text-slate-500 mt-1">Calcula el cambio exacto a devolver al cliente en efectivo.</p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => { setTotalBill(''); setCashReceived(''); }}
                    className="flex items-center gap-2"
                >
                    <Eraser size={18} />
                    Limpiar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">Total de la Cuenta (€)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Euro size={20} />
                            </span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={totalBill}
                                onChange={(e) => setTotalBill(e.target.value)}
                                className="w-full text-3xl font-bold bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">Efectivo Entregado (€)</label>
                        <div className="relative mb-4">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Euro size={20} />
                            </span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={cashReceived}
                                onChange={(e) => setCashReceived(e.target.value)}
                                className="w-full text-3xl font-bold bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {quickValues.map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setCashReceived((receivedAmount + val).toString())}
                                    className="px-4 py-2 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 font-bold rounded-xl transition-colors"
                                >
                                    +{val}€
                                </button>
                            ))}
                            <button
                                onClick={() => setCashReceived(totalBill)}
                                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-xl transition-colors ml-auto"
                            >
                                Exacto
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 md:p-8 shadow-sm border flex flex-col transition-all duration-300 ${change > 0 ? 'bg-green-50/50 border-green-200' : change < 0 && receivedAmount > 0 ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase text-center">Cambio a Devolver</label>
                    <div className={`text-6xl font-black text-center mb-8 tracking-tighter ${change > 0 ? 'text-green-600' : change < 0 && receivedAmount > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                        {change > 0 ? '+' : ''}{change ? change.toFixed(2) : '0.00'}€
                    </div>
                    
                    {change < 0 && receivedAmount > 0 && (
                        <div className="text-center text-red-500 font-medium mb-4 bg-red-100/50 p-4 rounded-xl">
                            Faltan {Math.abs(change).toFixed(2)}€
                        </div>
                    )}

                    {change > 0 && (
                        <div className="mt-auto">
                            <h3 className="text-center text-sm font-bold tracking-wide text-slate-500 uppercase mb-4">Desglose Sugerido</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {Object.entries(breakdown).sort(([a], [b]) => Number(b) - Number(a)).map(([denom, count]) => {
                                    const value = Number(denom) / 100;
                                    const isCoin = value <= 2;
                                    return (
                                        <div key={denom} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-green-100 shadow-sm">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-white shadow-sm ${isCoin ? 'bg-amber-400' : 'bg-emerald-500 rounded-md'}`}>
                                                {value}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-500 font-bold uppercase">{isCoin ? 'Moneda' : 'Billete'}</span>
                                                <span className="text-lg font-black text-slate-800">x{count}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
