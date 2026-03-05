import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowUpCircle, XCircle } from 'lucide-react';

const AdminSubscriptionsPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const records = await pb.collection('companies').getFullList({
          sort: '-created',
          $autoCancel: false
        });
        setCompanies(records);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Helmet>
        <title>Assinaturas | Admin Shelfix</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Assinaturas</h1>
        <p className="text-zinc-400 mt-1">Gerencie os planos e faturamentos dos clientes.</p>
      </div>

      <div className="glass-card border-white/10 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-300">Empresa</TableHead>
              <TableHead className="text-zinc-300">Plano</TableHead>
              <TableHead className="text-zinc-300">Ciclo</TableHead>
              <TableHead className="text-zinc-300">Vencimento</TableHead>
              <TableHead className="text-right text-zinc-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10"><TableCell colSpan={5} className="text-center py-12 text-zinc-400">Carregando...</TableCell></TableRow>
            ) : companies.length === 0 ? (
              <TableRow className="border-white/10"><TableCell colSpan={5} className="text-center py-12 text-zinc-500">Nenhuma assinatura encontrada.</TableCell></TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-white">{company.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                      {company.subscription_plan || 'Starter'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-300 capitalize">{company.billing_cycle || 'Mensal'}</TableCell>
                  <TableCell className="text-zinc-400">
                    {company.plan_end_date ? new Date(company.plan_end_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10" title="Estender">
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/20" title="Upgrade">
                        <ArrowUpCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20" title="Cancelar">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminSubscriptionsPage;
