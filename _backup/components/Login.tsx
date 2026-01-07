
import React, { useState } from 'react';
import { Admin } from '../types';
import { INITIAL_ADMINS } from '../constants';

interface LoginProps {
  onLogin: (admin: Admin) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@swiftadmin.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundAdmin = INITIAL_ADMINS.find(a => a.email === email && password === 'password');
    if (foundAdmin) {
      onLogin({
        ...foundAdmin,
        lastLogin: new Date().toISOString()
      });
    } else {
      setError('Invalid credentials. Hint: use the default values.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
      <div className="absolute inset-0 bg-teal-600/10 blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-teal-600 rounded-[28px] flex items-center justify-center text-white text-3xl mx-auto shadow-2xl shadow-teal-500/20 mb-8 border border-white/10">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">SwiftAdmin</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Cloud Infrastructure Dashboard</p>
        </div>

        <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-white/10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Auth Identifier</label>
              <div className="relative group">
                 <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-teal-500/10 focus:bg-white focus:border-teal-500 transition-all outline-none font-bold"
                  placeholder="name@company.com"
                />
                <div className="absolute left-4 top-5 text-slate-400 group-focus-within:text-teal-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Access Key</label>
              <div className="relative group">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-teal-500/10 focus:bg-white focus:border-teal-500 transition-all outline-none font-bold"
                  placeholder="••••••••"
                />
                <div className="absolute left-4 top-5 text-slate-400 group-focus-within:text-teal-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-5 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 animate-in shake duration-300">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-5 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-teal-500/20 hover:translate-y-[-2px] active:scale-[0.98] transition-all"
            >
              Verify & Launch
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50">
            <div className="flex flex-col items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Environment Dev-Access:</span>
              <code className="bg-teal-50 px-3 py-1.5 rounded-lg text-teal-700">admin@swiftadmin.com // password</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
