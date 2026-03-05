import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, CreditCard, Users, ShieldAlert, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminLayout = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/companies', icon: Building2, label: 'Empresas' },
    { path: '/admin/subscriptions', icon: CreditCard, label: 'Assinaturas' },
    { path: '/admin/users', icon: Users, label: 'Usuários' },
    { path: '/admin/audit', icon: ShieldAlert, label: 'Logs de Auditoria' },
    { path: '/admin/settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl hidden md:block fixed h-[calc(100vh-5rem)] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Administração</h2>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 lg:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
