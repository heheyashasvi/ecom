
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { SALES_METRICS } from '../constants';
import { getInventoryInsights } from '../lib/gemini';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

interface DashboardProps {
  products: Product[];
}

export const Dashboard: React.FC<DashboardProps> = ({ products }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const activeProducts = products.filter(p => p.status === 'active').length;

  useEffect(() => {
    async function loadInsights() {
      if (products.length === 0) return;
      setIsAnalyzing(true);
      const data = await getInventoryInsights(products);
      setInsights(data);
      setIsAnalyzing(false);
    }
    loadInsights();
  }, [products.length]);

  const stats = [
    { label: 'Total Products', value: products.length, icon: '📦', color: 'bg-cyan-500', trend: '+12%' },
    { label: 'Total Stock', value: totalStock, icon: '📊', color: 'bg-emerald-500', trend: '-2%' },
    { label: 'Inv. Value', value: `$${totalValue.toLocaleString()}`, icon: '💰', color: 'bg-teal-600', trend: '+5%' },
    { label: 'Active Status', value: activeProducts, icon: '✅', color: 'bg-amber-500', trend: 'Stable' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <p className="text-slate-500 text-sm font-medium">Real-time system feed active</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
             Export Report
           </button>
           <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
             Q4 Performance
           </span>
        </div>
      </div>

      {/* AI Insights Bar */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-500 rounded-3xl p-1 shadow-xl shadow-teal-100">
        <div className="bg-white/95 backdrop-blur-md rounded-[22px] p-6 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              ✨
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Gemini AI Analyst</h3>
              <p className="text-xs text-teal-600 font-bold uppercase tracking-wider">Smart Recommendations</p>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {isAnalyzing ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-slate-50 animate-pulse rounded-xl border border-slate-100"></div>
              ))
            ) : (
              insights.map((insight, idx) => (
                <div key={idx} className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 flex items-center gap-3 group hover:border-teal-200 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span className="text-sm font-medium text-slate-700">{insight}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-teal-500/10`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-50'}`}>
                {stat.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg className="w-32 h-32 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900">Revenue Performance</h3>
            <p className="text-sm font-medium text-slate-500">Global market trends & projections</p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_METRICS}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900">Units Sold</h3>
            <p className="text-sm font-medium text-slate-500">Monthly fulfillment volume</p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_METRICS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
