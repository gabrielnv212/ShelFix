import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Trash2, KeyRound, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const records = await pb.collection('users').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setUsers(records);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user) => {
    if (user.is_root) {
      toast({ title: "Ação negada", description: "Não é possível deletar o usuário root.", variant: "destructive" });
      return;
    }
    if (window.confirm(`Tem certeza que deseja deletar o usuário ${user.email}?`)) {
      try {
        await pb.collection('users').delete(user.id, { $autoCancel: false });
        toast({ title: "Sucesso", description: "Usuário deletado com sucesso." });
        fetchUsers();
      } catch (error) {
        toast({ title: "Erro", description: "Falha ao deletar usuário.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Helmet>
        <title>Usuários | Admin Shelfix</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Usuários</h1>
        <p className="text-zinc-400 mt-1">Gerencie os acessos ao sistema.</p>
      </div>

      <div className="glass-card border-white/10 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-300">Email</TableHead>
              <TableHead className="text-zinc-300">Nome</TableHead>
              <TableHead className="text-zinc-300">Role</TableHead>
              <TableHead className="text-zinc-300">Data de Cadastro</TableHead>
              <TableHead className="text-right text-zinc-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10"><TableCell colSpan={5} className="text-center py-12 text-zinc-400">Carregando...</TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow className="border-white/10"><TableCell colSpan={5} className="text-center py-12 text-zinc-500">Nenhum usuário encontrado.</TableCell></TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-white flex items-center gap-2">
                    {user.email}
                    {user.is_root && <Shield className="w-4 h-4 text-yellow-500" title="Root Admin" />}
                  </TableCell>
                  <TableCell className="text-zinc-300">{user.name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.role === 'admin' ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' : 'border-blue-500/50 text-blue-400 bg-blue-500/10'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400">{new Date(user.created).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10" title="Resetar Senha">
                        <KeyRound className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10" title="Desativar">
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${user.is_root ? 'text-zinc-600 cursor-not-allowed' : 'text-destructive hover:text-destructive hover:bg-destructive/20'}`}
                        onClick={() => handleDelete(user)}
                        disabled={user.is_root}
                        title="Deletar"
                      >
                        <Trash2 className="h-4 w-4" />
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

export default AdminUsersPage;
