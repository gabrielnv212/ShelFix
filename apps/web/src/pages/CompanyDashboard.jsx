import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, FileText, DollarSign, Percent, AlertTriangle, LayoutTemplate, Crown } from 'lucide-react';

const CompanyDashboard = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalSpaces: 0,
    occupiedSpaces: 0,
    monthlyRevenue: 0,
    expiringContracts: 0
  });
  const [companyPlan, setCompanyPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!currentUser?.company_id) return;
      
      try {
        const [spaces, contracts, company] = await Promise.all([
          pb.collection('spaces').getFullList({ 
            filter: `company_id = "${currentUser.company_id}"`,
            $autoCancel: false 
          }),
          pb.collection('contracts').getFullList({ 
            filter: `company_id = "${currentUser.company_id}" && status = "active"`,
            $autoCancel: false 
          }),
          pb.collection('companies').getOne(currentUser.company_id, { $autoCancel: false })
        ]);

        const occupied = spaces.filter(s => s.status === 'occupied').length;
        const revenue = contracts.reduce((sum, c) => sum + (c.monthly_price || 0), 0);
        
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const expiring = contracts.filter(c => new Date(c.end_date) <= thirtyDaysFromNow).length;

        setStats({
          totalSpaces: spaces.length,
          occupiedSpaces: occupied,
          monthlyRevenue: revenue,
          expiringContracts: expiring
        });

        setCompanyPlan({
          plan: company.subscription_plan || 'Starter',
          max_corridors: company.max_corridors || 5
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [currentUser]);

  const occupancyRate = stats.totalSpaces > 0 
    ? Math.round((stats.occupiedSpaces / stats.totalSpaces) * 100) 
    : 0;

  if (loading) return <div className="p-8 text-center text-zinc-400 pt-24">{t('common.loading')}</div>;

  return (
    <div className="container mx-auto p-6 space-y-8 pt-24">
      <Helmet>
        <title>{t('nav.dashboard')} | Shelfix</title>
      </Helmet>

      {/* Plan Banner */}
      {companyPlan && (
        <div className="glass-panel border-primary/30 bg-primary/5 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-xl text-primary shadow-inner">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg text-white">Plano {companyPlan.plan}</p>
              <p className="text-sm text-zinc-400">Seu plano permite até {companyPlan.max_corridors} corredores por loja.</p>
            </div>
          </div>
          {companyPlan.plan === 'Starter' && (
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/20 bg-transparent">
              Fazer Upgrade
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up stagger-1">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('dashboard.companyTitle')}</h1>
          <p className="text-zinc-400 mt-1">{t('dashboard.companySubtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
            <Link to="/store-layout-builder"><LayoutTemplate className="mr-2 h-4 w-4" /> Construtor de Planta</Link>
          </Button>
          <Button asChild variant="outline" className="glass-panel hover:bg-white/10 border-white/10 text-white">
            <Link to="/spaces"><Map className="mr-2 h-4 w-4" /> {t('nav.spaces')}</Link>
          </Button>
          <Button asChild variant="outline" className="glass-panel hover:bg-white/10 border-white/10 text-white">
            <Link to="/contracts"><FileText className="mr-2 h-4 w-4" /> {t('contracts.newContract')}</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up stagger-2">
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">{t('dashboard.occupancyRate')}</CardTitle>
            <Percent className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{occupancyRate}%</div>
            <p className="text-xs text-zinc-400 mt-2">
              {t('dashboard.spacesOccupied', { occupied: stats.occupiedSpaces, total: stats.totalSpaces })}
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">{t('dashboard.monthlyRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-zinc-400 mt-2">{t('dashboard.fromActiveContracts')}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">{t('dashboard.annualProjection')}</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${(stats.monthlyRevenue * 12).toLocaleString()}</div>
            <p className="text-xs text-zinc-400 mt-2">{t('dashboard.estimatedRunRate')}</p>
          </CardContent>
        </Card>
        <Card className={`glass-card ${stats.expiringContracts > 0 ? "border-destructive/50 bg-destructive/10" : "border-white/10"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">{t('dashboard.expiringSoon')}</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${stats.expiringContracts > 0 ? 'text-destructive animate-pulse' : 'text-primary'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.expiringContracts}</div>
            <p className="text-xs text-zinc-400 mt-2">{t('dashboard.endingIn30Days')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 animate-fade-in-up stagger-3">
        <Card className="glass-card border-white/10 col-span-1">
          <CardHeader>
            <CardTitle className="text-white">{t('dashboard.quickMapPreview')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-black/20 rounded-xl border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 map-grid opacity-30"></div>
            <div className="text-center relative z-10">
              <Map className="h-12 w-12 text-primary mx-auto mb-4 opacity-80 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-sm text-zinc-400 mb-6">{t('dashboard.visualFloorPlan')}</p>
              <Button variant="outline" className="glass-panel hover:bg-white/10 border-white/20 text-white" asChild>
                <Link to="/map">{t('dashboard.openInteractiveMap')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10 col-span-1">
          <CardHeader>
            <CardTitle className="text-white">{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-zinc-500 text-center py-12 italic">{t('dashboard.activityFeed')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDashboard;
