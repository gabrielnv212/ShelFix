import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const AnalyticsDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6 space-y-6 pt-24">
      <Helmet>
        <title>{t('analytics.title')} | Shelfix</title>
      </Helmet>

      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('analytics.title')}</h1>
        <p className="text-zinc-400 mt-1">{t('analytics.subtitle')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 animate-fade-in-up stagger-1">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{t('analytics.revenueTrend')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#a1a1aa" />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} stroke="#a1a1aa" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(20,20,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#00c8ff' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} dot={{r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#111'}} activeDot={{r: 6, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{t('analytics.occupancyByType')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: t('spaces.types.gondola'), occupied: 45, available: 15 },
                { name: t('spaces.types.endcap'), occupied: 20, available: 5 },
                { name: t('spaces.types.island'), occupied: 10, available: 2 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#a1a1aa" />
                <YAxis axisLine={false} tickLine={false} stroke="#a1a1aa" />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(20,20,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="occupied" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                <Bar dataKey="available" stackId="a" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
