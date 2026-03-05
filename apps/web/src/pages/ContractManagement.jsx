import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText } from 'lucide-react';

const ContractManagement = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!currentUser?.company_id) return;
      try {
        const records = await pb.collection('contracts').getFullList({
          filter: `company_id = "${currentUser.company_id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setContracts(records);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [currentUser]);

  return (
    <div className="container mx-auto p-6 space-y-6 pt-24">
      <Helmet>
        <title>{t('contracts.title')} | Shelfix</title>
      </Helmet>

      <div className="flex justify-between items-center animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('contracts.title')}</h1>
          <p className="text-zinc-400 mt-1">{t('contracts.subtitle')}</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> {t('contracts.newContract')}
        </Button>
      </div>

      <div className="glass-card border-white/10 rounded-2xl overflow-hidden animate-fade-in-up stagger-1">
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-300">{t('contracts.tenant')}</TableHead>
              <TableHead className="text-zinc-300">{t('contracts.spaceId')}</TableHead>
              <TableHead className="text-zinc-300">{t('contracts.startDate')}</TableHead>
              <TableHead className="text-zinc-300">{t('contracts.endDate')}</TableHead>
              <TableHead className="text-zinc-300">{t('contracts.monthly')}</TableHead>
              <TableHead className="text-zinc-300">{t('common.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10"><TableCell colSpan={6} className="text-center py-12 text-zinc-400">{t('common.loading')}</TableCell></TableRow>
            ) : contracts.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="text-center py-16 text-zinc-500">
                  <FileText className="mx-auto h-10 w-10 mb-3 opacity-20" />
                  {t('contracts.noContracts')}
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => (
                <TableRow key={contract.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-white">{contract.tenant_name}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">{contract.space_id}</TableCell>
                  <TableCell className="text-zinc-300">{new Date(contract.start_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-zinc-300">{new Date(contract.end_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-white font-medium">${contract.monthly_price?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={contract.status === 'active' ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-white/20 text-zinc-400 bg-white/5'}>
                      {contract.status}
                    </Badge>
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

export default ContractManagement;
