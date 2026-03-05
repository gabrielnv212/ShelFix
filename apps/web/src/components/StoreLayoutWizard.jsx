import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateLayout } from '@/lib/LayoutGenerationEngine.js';
import LayoutSummary from './LayoutSummary.jsx';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const StoreLayoutWizard = ({ companyPlan, onGenerate }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [config, setConfig] = useState({
    storeName: '',
    corridors: 1,
    gondolasPerSide: 5,
    gondolaLength: 1,
    gondolaHeight: 2,
    levels: 5,
    islands: 0,
    endcapRule: '1_per_2'
  });

  const maxCorridors = companyPlan?.max_corridors || 5; // Default fallback

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!config.storeName) return setError('Nome da loja é obrigatório.');
      if (config.corridors < 1) return setError('Deve ter pelo menos 1 corredor.');
      if (config.corridors > maxCorridors) {
        return setError(`Seu plano permite no máximo ${maxCorridors} corredores. Faça upgrade para adicionar mais.`);
      }
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleGenerate = () => {
    const spaces = generateLayout(config);
    onGenerate(config, spaces);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-2">
      {[1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            step === i ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 
            step > i ? 'bg-primary/50 text-white' : 'bg-muted text-muted-foreground'
          }`}>
            {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
          </div>
          {i < 4 && <div className={`h-1 w-12 rounded-full ${step > i ? 'bg-primary/50' : 'bg-muted'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-3xl mx-auto bg-card/60 backdrop-blur-xl border-white/10 shadow-2xl">
      <CardHeader>
        {renderStepIndicator()}
        <CardTitle className="text-2xl text-center">
          {step === 1 && 'Informações Básicas'}
          {step === 2 && 'Configuração de Gôndolas'}
          {step === 3 && 'Espaços Especiais'}
          {step === 4 && 'Revisão e Geração'}
        </CardTitle>
        <CardDescription className="text-center">
          Configure os parâmetros para gerar a planta baixa automaticamente.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 min-h-[300px]">
        {error && (
          <Alert variant="destructive" className="bg-destructive/20 border-destructive/50 text-destructive-foreground">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <Label>Nome da Loja / Layout</Label>
              <Input 
                value={config.storeName} 
                onChange={e => setConfig({...config, storeName: e.target.value})}
                placeholder="Ex: Filial Centro"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Total de Corredores</Label>
              <Input 
                type="number" 
                min="1" 
                max={maxCorridors}
                value={config.corridors} 
                onChange={e => setConfig({...config, corridors: parseInt(e.target.value) || 1})}
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                Seu plano atual permite até {maxCorridors} corredores.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gôndolas por Lado (Profundidade)</Label>
                <Input 
                  type="number" min="1" 
                  value={config.gondolasPerSide} 
                  onChange={e => setConfig({...config, gondolasPerSide: parseInt(e.target.value) || 1})}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Comprimento por Gôndola (m)</Label>
                <Input 
                  type="number" min="1" step="0.5"
                  value={config.gondolaLength} 
                  onChange={e => setConfig({...config, gondolaLength: parseFloat(e.target.value) || 1})}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Altura (m)</Label>
                <Input 
                  type="number" min="1" step="0.1"
                  value={config.gondolaHeight} 
                  onChange={e => setConfig({...config, gondolaHeight: parseFloat(e.target.value) || 2})}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Níveis/Prateleiras</Label>
                <Input 
                  type="number" min="1"
                  value={config.levels} 
                  onChange={e => setConfig({...config, levels: parseInt(e.target.value) || 5})}
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <Label>Regra para Pontas de Gôndola</Label>
              <Select value={config.endcapRule} onValueChange={v => setConfig({...config, endcapRule: v})}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Em todos os corredores</SelectItem>
                  <SelectItem value="1_per_2">1 a cada 2 corredores</SelectItem>
                  <SelectItem value="ends_only">Apenas nas extremidades da loja</SelectItem>
                  <SelectItem value="none">Nenhuma ponta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantidade de Ilhas Promocionais</Label>
              <Input 
                type="number" min="0" 
                value={config.islands} 
                onChange={e => setConfig({...config, islands: parseInt(e.target.value) || 0})}
                className="bg-background/50"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-muted/30 p-4 rounded-lg border border-white/5">
              <h3 className="font-medium mb-4">Resumo da Geração</h3>
              <LayoutSummary spaces={generateLayout(config)} config={config} />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Revise os dados acima. Ao clicar em "Gerar Planta", o sistema criará a representação visual e os registros no banco de dados.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-white/10 pt-6">
        <Button variant="outline" onClick={handleBack} disabled={step === 1} className="bg-background/50">
          <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        
        {step < 4 ? (
          <Button onClick={handleNext}>
            Próximo <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleGenerate} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Gerar Planta <CheckCircle2 className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StoreLayoutWizard;
