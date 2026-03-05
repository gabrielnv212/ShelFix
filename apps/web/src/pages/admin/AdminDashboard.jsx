import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Map, FileText, Users, DollarSign, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    companies: 0, users: 0, layouts: 0, spaces: 0, contracts: 0, revenue: 0
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ['#00c8ff', '#a855f7', '#22c55e', '#facc15'];

  const pieData = [
    { name: 'Starter', value: 45 },
    { name: 'Professional', value: 30 },
    { name: 'Enterprise', value: 15 },
  ];

  const barData = [
    { name: 'Jan', revenue: 12000 },
    { name: 'Fev', revenue: 19000 },
    { name: 'Mar', revenue: 25000 },
    { name: 'Abr', revenue: 32000 },
    { name: 'Mai', revenue: 48000 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comps, usrs, lays, spcs, ctrs] = await Promise.all([
          pb.collection('companies').getList(1, 1, { $autoCancel: false }),
          pb.collection('users').getList(1, 1, { $autoCancel: false }),
          pb.collection('store_layouts').getList(1, 1, { $autoCancel: false }),
          pb.collection('spaces').getList(1, 1, { $autoCancel: false }),
          pb.collection('contracts').getFullList({ $autoCancel: false })
        ]);

        const totalRevenue = ctrs.reduce((sum, c) => sum + (c.monthly_price || 0), 0);

        setStats({
          companies: comps.totalItems,
          users: usrs.totalItems,
          layouts: lays.totalItems,
          spaces: spcs.totalItems,
          contracts: ctrs.length,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-zinc-400">Carregando dashboard...</div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <Helmet>
        <title>Admin Dashboard | Shelfix</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Visão Geral do Sistema</h1>
        <p className="text-zinc-400 mt-1">Métricas e KPIs globais da plataforma Shelfix.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">Receita Mensal Recorrente</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">R$ {stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-green-400 mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +12% este mês</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">Total de Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.companies}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.users}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">Plantas Geradas</CardTitle>
            <Map className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.layouts}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">Espaços Mapeados</CardTitle>
            <Map className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.spaces}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">Contratos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.contracts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Assinaturas por Plano</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Crescimento de Receita</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
