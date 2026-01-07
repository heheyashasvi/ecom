
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ProductManager } from './components/ProductManager';
import { AdminOnboarding } from './components/AdminOnboarding';
import { View, Admin, Product } from './types';
import { INITIAL_PRODUCTS, INITIAL_ADMINS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<Admin | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [admins, setAdmins] = useState<Admin[]>(INITIAL_ADMINS);

  // Simulate persistent storage
  useEffect(() => {
    const savedProducts = localStorage.getItem('swiftadmin_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
    }

    const savedUser = localStorage.getItem('swiftadmin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('swiftadmin_products', JSON.stringify(newProducts));
  };

  const handleLogin = (admin: Admin) => {
    setUser(admin);
    localStorage.setItem('swiftadmin_user', JSON.stringify(admin));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('swiftadmin_user');
    setCurrentView('dashboard');
  };

  const handleAddAdmin = (newAdmin: Admin) => {
    setAdmins(prev => [...prev, newAdmin]);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      onLogout={handleLogout}
    >
      <div className="animate-in fade-in duration-500">
        {currentView === 'dashboard' && <Dashboard products={products} />}
        {currentView === 'products' && (
          <ProductManager 
            products={products} 
            onUpdateProducts={saveProducts} 
          />
        )}
        {currentView === 'onboarding' && (
          <AdminOnboarding 
            admins={admins} 
            onAddAdmin={handleAddAdmin} 
            currentUser={user}
          />
        )}
        {currentView === 'settings' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">System Settings</h2>
            <p className="text-slate-600">Configuration for API endpoints, storage buckets, and more would go here.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
