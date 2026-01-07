
import React, { useState } from 'react';
import { Product } from '../types';
import { generateProductDescription } from '../lib/gemini';

interface ProductFormProps {
  onClose: () => void;
  onSave: (product: Product) => void;
  initialData: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onClose, onSave, initialData }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'Electronics',
      status: 'active',
      image: `https://picsum.photos/seed/${Math.random()}/400/400`
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.category) newErrors.category = 'Category is required';
    } else if (step === 2) {
      if ((formData.price || 0) <= 0) newErrors.price = 'Price must be positive';
      if ((formData.stock || 0) < 0) newErrors.stock = 'Stock cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMagicDescribe = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.category || 'General');
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const nextStep = () => {
    if (validate()) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        id: initialData?.id || Math.random().toString(36).substr(2, 9),
        createdAt: initialData?.createdAt || new Date().toISOString()
      } as Product);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {initialData ? 'Refine Product' : 'New Creation'}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-teal-500' : 'bg-slate-200'}`}></div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Primary Details</label>
                <input 
                  type="text" 
                  className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-100'} focus:ring-4 focus:ring-teal-500/10 focus:bg-white focus:border-teal-500 outline-none transition-all font-bold text-slate-900`}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Hyperion Wireless Earbuds"
                />
                {errors.name && <p className="text-xs text-red-500 mt-2 font-black uppercase tracking-widest">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category Selection</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Electronics', 'Wearables', 'Peripherals', 'Home'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({...formData, category: cat})}
                      className={`px-4 py-3 rounded-xl border text-sm font-black transition-all ${
                        formData.category === cat 
                        ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-200' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                  <button 
                    type="button"
                    disabled={!formData.name || isGenerating}
                    onClick={handleMagicDescribe}
                    className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-teal-100 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? 'Thinking...' : '✨ Auto-Generate'}
                  </button>
                </div>
                <textarea 
                  rows={3}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-teal-500/10 focus:bg-white focus:border-teal-500 outline-none transition-all font-bold text-slate-700"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief summary of features..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pricing ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border ${errors.price ? 'border-red-500' : 'border-slate-100'} focus:ring-4 focus:ring-teal-500/10 focus:bg-white outline-none font-black text-lg text-teal-600`}
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Stock Level</label>
                  <input 
                    type="number" 
                    className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border ${errors.stock ? 'border-red-500' : 'border-slate-100'} focus:ring-4 focus:ring-teal-500/10 focus:bg-white outline-none font-black text-lg`}
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Availability Status</label>
                <div className="flex gap-4">
                  {[
                    { val: 'active', color: 'bg-emerald-500' },
                    { val: 'draft', color: 'bg-amber-500' },
                    { val: 'archived', color: 'bg-slate-400' }
                  ].map((status) => (
                    <button
                      key={status.val}
                      type="button"
                      onClick={() => setFormData({...formData, status: status.val as any})}
                      className={`flex-1 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                        formData.status === status.val 
                          ? `${status.color} border-transparent text-white shadow-xl` 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {formData.status === status.val && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>}
                      {status.val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-500 text-center">
              <div className="relative group mx-auto w-64 h-64 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-teal-600/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, image: `https://picsum.photos/seed/${Math.random()}/400/400`})}
                    className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transform group-hover:scale-110 transition-all"
                  >
                    Refresh Visual
                  </button>
                </div>
              </div>
              <div className="mt-8 space-y-3 bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left">
                <div className="flex justify-between items-center"><span className="text-xs font-black text-slate-400 uppercase tracking-widest">Identifier</span> <span className="font-bold text-slate-900">{formData.name}</span></div>
                <div className="flex justify-between items-center"><span className="text-xs font-black text-slate-400 uppercase tracking-widest">Valuation</span> <span className="font-black text-teal-600 text-xl">${formData.price}</span></div>
                <div className="flex justify-between items-center"><span className="text-xs font-black text-slate-400 uppercase tracking-widest">Inventory</span> <span className="font-bold text-slate-900">{formData.stock} units</span></div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-12 gap-4">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={prevStep}
                className="px-8 py-4 text-slate-500 font-black uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-10 py-5 rounded-[22px] font-black uppercase tracking-widest shadow-xl shadow-teal-100 hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
              >
                Continue
              </button>
            ) : (
              <button 
                type="submit" 
                className="flex-1 bg-emerald-500 text-white px-10 py-5 rounded-[22px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
              >
                Finalize Product
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
