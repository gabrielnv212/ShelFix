import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-4xl pt-24">
      <Helmet>
        <title>{t('nav.settings')} | Shelfix</title>
      </Helmet>

      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('settings.title')}</h1>
        <p className="text-zinc-400 mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="grid gap-6 animate-fade-in-up stagger-1">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{t('settings.language')}</CardTitle>
            <CardDescription className="text-zinc-400">{t('settings.languageDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-w-xs">
              <Label className="text-zinc-300">{t('settings.language')}</Label>
              <Select value={currentLanguage} onValueChange={changeLanguage}>
                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="glass-panel border-white/10 text-white">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="focus:bg-white/10 focus:text-white">
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{t('settings.profile')}</CardTitle>
            <CardDescription className="text-zinc-400">{t('settings.profileDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-zinc-500 italic">Profile settings placeholder</p>
              <Button variant="outline" disabled className="border-white/10 bg-white/5 text-zinc-400">{t('common.edit')} {t('settings.profile')}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{t('settings.notifications')}</CardTitle>
            <CardDescription className="text-zinc-400">{t('settings.notificationsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-zinc-500 italic">Notification settings placeholder</p>
              <Button variant="outline" disabled className="border-white/10 bg-white/5 text-zinc-400">{t('common.edit')} {t('settings.notifications')}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
