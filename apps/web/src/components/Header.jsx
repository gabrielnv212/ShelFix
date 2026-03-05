import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Map, FileText, BarChart3, LogOut, Menu, X, Settings, User, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { isAuthenticated, currentUser, logout, isAdmin } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHome = location.pathname === '/';

  const navLinks = isAuthenticated ? (
    isAdmin ? [
      { name: t('nav.adminDashboard'), path: '/admin', icon: LayoutDashboard },
    ] : [
      { name: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
      { name: t('nav.spaces'), path: '/spaces', icon: Map },
      { name: t('nav.map'), path: '/map', icon: Map },
      { name: t('nav.contracts'), path: '/contracts', icon: FileText },
      { name: t('nav.analytics'), path: '/analytics', icon: BarChart3 },
    ]
  ) : [];

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled || !isHome ? 'bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">Shelfix</span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-white/10 text-primary' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          )}
          
          {!isAuthenticated && isHome && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
              <a href="#features" className="hover:text-primary transition-colors">Recursos</a>
              <a href="#demo" className="hover:text-primary transition-colors">Demo</a>
              <a href="#pricing" className="hover:text-primary transition-colors">Planos</a>
              <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10">
                    <User className="h-5 w-5 text-zinc-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-panel border-white/10" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{currentUser.name || 'User'}</p>
                      <p className="text-xs leading-none text-zinc-400">
                        {currentUser.email}
                      </p>
                      <p className="text-xs font-semibold text-primary mt-1 capitalize">
                        {currentUser.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('nav.settings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:bg-destructive/20 focus:bg-destructive/20 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/5" asChild>
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 animate-pulse-glow" asChild>
                <Link to="/signup">{t('nav.getStarted')}</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-zinc-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 p-4 absolute w-full">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                {t('nav.settings')}
              </Link>
            )}
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                <Button variant="outline" className="w-full border-white/10 bg-white/5" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button className="w-full bg-primary text-primary-foreground" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/signup">{t('nav.getStarted')}</Link>
                </Button>
              </div>
            ) : (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/20 text-left"
              >
                <LogOut className="w-5 h-5" />
                {t('nav.logout')}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
