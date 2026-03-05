import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Edit, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const records = await pb.collection('companies').getFullList({
          sort: '-created',
          $autoCancel: false
        });
        setCompanies(records);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cnpj.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Helmet>
        <title>Empresas | Admin Shelfix</title>
      </Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Empresas</h1>
          <p className="text-zinc-400 mt-1">Gerencie os clientes da plataforma.</p>
        </div>
      </div>

      <div className="glass-card border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Buscar por nome ou CNPJ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-white/10 text-white h-10 rounded-xl" 
            />
          </div>
        </div>
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-300">Nome</TableHead>
              <TableHead className="text-zinc-300">CNPJ</TableHead>
              <TableHead className="text-zinc-300">Plano</TableHead>
              <TableHead className="text-zinc-300">Data de Cadastro</TableHead>
              <TableHead className="text-right text-zinc-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10"><TableCell colSpan={5} className="text-center py-12 text-zinc-400">Carregando...</TableCell></TableRow>
            ) : filteredCompanies.length === 0 ? (
              <TableRow className="border-white/10"><TableCell colSpan={5} className="text-center py-12 text-zinc-500">Nenhuma empresa encontrada.</TableCell></TableRow>
            ) : (
              filteredCompanies.map((company) => (
                <TableRow key={company.id} className="border-white/10 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedCompany(company)}>
                  <TableCell className="font-medium text-white">{company.name}</TableCell>
                  <TableCell className="text-zinc-400">{company.cnpj}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                      {company.subscription_plan || 'Starter'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400">{new Date(company.created).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10" onClick={(e) => { e.stopPropagation(); setSelectedCompany(company); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedCompany} onOpenChange={(open) => !open && setSelectedCompany(null)}>
        <DialogContent className="glass-panel border-white/10 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedCompany?.name}</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-zinc-400 mb-1">CNPJ</p>
                  <p className="font-medium">{selectedCompany.cnpj}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-zinc-400 mb-1">Plano Atual</p>
                  <Badge className="bg-primary text-primary-foreground">{selectedCompany.subscription_plan || 'Starter'}</Badge>
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-zinc-400 mb-1">Limite de Corredores</p>
                  <p className="font-medium">{selectedCompany.max_corridors || 5}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-zinc-400 mb-1">Ciclo de Faturamento</p>
                  <p className="font-medium capitalize">{selectedCompany.billing_cycle || 'Mensal'}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Edit className="w-4 h-4 mr-2"/> Editar Empresa</Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Ver Plantas</Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Ver Contratos</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCompaniesPage;
