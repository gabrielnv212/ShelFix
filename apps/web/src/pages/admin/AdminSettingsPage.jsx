import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AdminSettingsPage = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações Salvas",
      description: "As alterações foram aplicadas com sucesso."
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl">
      <Helmet>
        <title>Configurações | Admin Shelfix</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Configurações do Sistema</h1>
        <p className="text-zinc-400 mt-1">Gerencie parâmetros globais da plataforma.</p>
      </div>

      <div className="grid gap-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Limites de Planos</CardTitle>
            <CardDescription className="text-zinc-400">Configure os limites para cada nível de assinatura.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Starter (Corredores)</Label>
                <Input defaultValue="5" type="number" className="bg-black/20 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Professional (Corredores)</Label>
                <Input defaultValue="25" type="number" className="bg-black/20 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Enterprise (Corredores)</Label>
                <Input defaultValue="999" type="number" className="bg-black/20 border-white/10 text-white" />
              </div>
            </div>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">Salvar Limites</Button>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Templates de Email</CardTitle>
            <CardDescription className="text-zinc-400">Configure os remetentes e templates padrão.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Email de Remetente (No-Reply)</Label>
              <Input defaultValue="noreply@shelfix.com" className="bg-black/20 border-white/10 text-white" />
            </div>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">Salvar Email</Button>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Backup e Exportação</CardTitle>
            <CardDescription className="text-zinc-400">Exporte os dados do sistema para backup.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Exportar Banco de Dados (JSON)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
