import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Map, FileText, Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ companies: 0, spaces: 0, contracts: 0 });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comps, spcs, ctrs] = await Promise.all([
          pb.collection('companies').getList(1, 50, { sort: '-created', $autoCancel: false }),
          pb.collection('spaces').getList(1, 1, { $autoCancel: false }),
          pb.collection('contracts').getList(1, 1, { $autoCancel: false })
        ]);

        setStats({
          companies: comps.totalItems,
          spaces: spcs.totalItems,
          contracts: ctrs.totalItems
        });
        setCompanies(comps.items);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-zinc-400">{t('common.loading')}</div>;

  return (
    <div className="container mx-auto p-6 space-y-8 pt-24">
      <Helmet>
        <title>{t('nav.adminDashboard')} | Shelfix</title>
      </Helmet>

      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('dashboard.adminTitle')}</h1>
        <p className="text-zinc-400 mt-2">{t('dashboard.adminSubtitle')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up stagger-1">
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">{t('dashboard.totalCompanies')}</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.companies}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">{t('dashboard.totalSpaces')}</CardTitle>
            <Map className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.spaces}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">{t('dashboard.activeContracts')}</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.contracts}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">{t('dashboard.systemHealth')}</CardTitle>
            <Activity className="h-4 w-4 text-primary animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{t('dashboard.optimal')}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/10 animate-fade-in-up stagger-2">
        <CardHeader>
          <CardTitle className="text-white">{t('dashboard.recentCompanies')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-zinc-300">{t('common.name')}</TableHead>
                  <TableHead className="text-zinc-300">CNPJ</TableHead>
                  <TableHead className="text-zinc-300">{t('dashboard.plan')}</TableHead>
                  <TableHead className="text-zinc-300">{t('dashboard.joined')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={4} className="text-center text-zinc-500 py-8">{t('dashboard.noCompanies')}</TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company.id} className="border-white/10 hover:bg-white/5 transition-colors">
                      <TableCell className="font-medium text-white">{company.name}</TableCell>
                      <TableCell className="text-zinc-400">{company.cnpj}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">{company.subscription_plan || 'Starter'}</Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400">{new Date(company.created).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
