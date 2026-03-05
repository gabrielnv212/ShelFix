import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AdminAuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const records = await pb.collection('audit_logs').getList(1, 50, {
          sort: '-created',
          $autoCancel: false
        });
        setLogs(records.items);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Helmet>
        <title>Logs de Auditoria | Admin Shelfix</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Logs de Auditoria</h1>
        <p className="text-zinc-400 mt-1">Rastreamento de ações críticas no sistema.</p>
      </div>

      <div className="glass-card border-white/10 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-300">Data/Hora</TableHead>
              <TableHead className="text-zinc-300">Usuário ID</TableHead>
              <TableHead className="text-zinc-300">Ação</TableHead>
              <TableHead className="text-zinc-300">Entidade</TableHead>
              <TableHead className="text-zinc-300">ID Entidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10"><TableCell colSpan={5} className="text-center py-12 text-zinc-400">Carregando...</TableCell></TableRow>
            ) : logs.length === 0 ? (
              <TableRow className="border-white/10"><TableCell colSpan={5} className="text-center py-12 text-zinc-500">Nenhum log registrado.</TableCell></TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="text-zinc-400">{new Date(log.created).toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-300">{log.user_id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/20 text-white bg-white/5">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-300">{log.entity_type}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">{log.entity_id}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAuditLogPage;
