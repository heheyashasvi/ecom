
import React, { useState } from 'react';
import { Admin } from '../types';

interface AdminOnboardingProps {
  admins: Admin[];
  onAddAdmin: (admin: Admin) => void;
  currentUser: Admin;
}

export const AdminOnboarding: React.FC<AdminOnboardingProps> = ({ admins, onAddAdmin, currentUser }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'manager' as 'manager' | 'super-admin' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAdmin({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      lastLogin: '-'
    });
    setIsAdding(false);
    setFormData({ name: '', email: '', role: 'manager' });
  };

  // Restrict access
  if (currentUser.role !== 'super-admin') {
    return (
      <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4 text-3xl">⚠️</div>
        <h2 className="text-xl font-bold text-amber-900 mb-2">Access Restricted</h2>
        <p className="text-amber-700 font-medium max-w-md">You must be a Super Admin to onboard new administrators or manage permissions. Please contact your system owner for access.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Management</h1>
          <p className="text-slate-500 font-medium">Add and manage administrative access levels.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:translate-y-[-2px] shadow-xl shadow-teal-100 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Invite Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {admins.map((admin) => (
          <div key={admin.id} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 font-black text-xl shadow-inner border border-teal-100">
              {admin.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900">{admin.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  admin.role === 'super-admin' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {admin.role}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">{admin.email}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Last Auth</p>
              <p className="text-xs font-bold text-slate-600">{admin.lastLogin === '-' ? 'Never' : new Date(admin.lastLogin).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10 animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Invite New Admin</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-teal-500/10 focus:bg-white focus:border-teal-500 outline-none transition-all font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  required
                  type="email" 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-teal-500/10 focus:bg-white focus:border-teal-500 outline-none transition-all font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Role Permissions</label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-teal-500/10 focus:bg-white focus:border-teal-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                >
                  <option value="manager">Manager (Read/Write Products)</option>
                  <option value="super-admin">Super Admin (Full Control)</option>
                </select>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-teal-100 hover:translate-y-[-2px] transition-all"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
