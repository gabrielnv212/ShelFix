import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Helmet } from 'react-helmet';
import { Loader2, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const authData = await login(email, password);
      if (authData.record.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/' ? '/dashboard' : from);
      }
    } catch (err) {
      setError(t('auth.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>{t('nav.login')} | Shelfix</title>
      </Helmet>
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,200,255,0.15)_0%,transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(150,0,255,0.15)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-10 rounded-3xl relative z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('auth.loginTitle')}</h1>
          <p className="text-zinc-400 mt-3">{t('auth.loginSubtitle')}</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-destructive/20 border-destructive/50 text-white">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-zinc-300">{t('auth.email')}</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary/50 h-12 rounded-xl transition-all"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-300">{t('auth.password')}</Label>
              <Link to="#" className="text-sm text-primary hover:text-primary/80 transition-colors">{t('auth.forgotPassword')}</Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-black/20 border-white/10 text-white focus:border-primary focus:ring-primary/50 h-12 rounded-xl transition-all"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t('auth.signIn')}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-400">
          {t('auth.noAccount')}{' '}
          <Link to="/signup" className="text-primary font-medium hover:text-primary/80 transition-colors">
            {t('auth.signUp')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
