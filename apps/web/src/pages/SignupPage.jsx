import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Helmet } from 'react-helmet';
import { Loader2, Sparkles } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      return setError(t('auth.passwordsNotMatch'));
    }

    setIsLoading(true);

    try {
      const company = await pb.collection('companies').create({
        name: formData.companyName,
        cnpj: formData.cnpj,
        subscription_plan: 'Starter'
      }, { $autoCancel: false });

      await pb.collection('users').create({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        name: formData.name,
        role: 'company',
        company_id: company.id,
        language_preference: 'pt-BR'
      }, { $autoCancel: false });

      await login(formData.email, formData.password);
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      setError(t('auth.signupFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-24 relative overflow-hidden">
      <Helmet>
        <title>{t('auth.signUp')} | Shelfix</title>
      </Helmet>
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,200,255,0.15)_0%,transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(150,0,255,0.15)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="w-full max-w-2xl glass-panel p-10 rounded-3xl relative z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('auth.signupTitle')}</h1>
          <p className="text-zinc-400 mt-3">{t('auth.signupSubtitle')}</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-destructive/20 border-destructive/50 text-white">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="companyName" className="text-zinc-300">{t('auth.companyName')}</Label>
              <Input id="companyName" value={formData.companyName} onChange={handleChange} required className="bg-black/20 border-white/10 text-white h-12 rounded-xl" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="cnpj" className="text-zinc-300">{t('auth.cnpj')}</Label>
              <Input id="cnpj" value={formData.cnpj} onChange={handleChange} required className="bg-black/20 border-white/10 text-white h-12 rounded-xl" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="name" className="text-zinc-300">{t('auth.yourName')}</Label>
              <Input id="name" value={formData.name} onChange={handleChange} required className="bg-black/20 border-white/10 text-white h-12 rounded-xl" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-zinc-300">{t('auth.email')}</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} required className="bg-black/20 border-white/10 text-white h-12 rounded-xl" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-zinc-300">{t('auth.password')}</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleChange} required minLength={8} className="bg-black/20 border-white/10 text-white h-12 rounded-xl" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="passwordConfirm" className="text-zinc-300">{t('auth.confirmPassword')}</Label>
              <Input id="passwordConfirm" type="password" value={formData.passwordConfirm} onChange={handleChange} required minLength={8} className="bg-black/20 border-white/10 text-white h-12 rounded-xl" />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all mt-8" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t('auth.createAccount')}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-400">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
            {t('nav.login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
