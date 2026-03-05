import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home, Save, ArrowLeft, Sparkles, Trash2, Plus } from 'lucide-react';
import StoreLayoutWizard from '@/components/StoreLayoutWizard.jsx';
import RealisticFloorPlan from '@/components/RealisticFloorPlan.jsx';
import LayoutSummary from '@/components/LayoutSummary.jsx';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const StoreLayoutBuilderPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companyPlan, setCompanyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatedLayout, setGeneratedLayout] = useState(null);
  const [layoutConfig, setLayoutConfig] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedLayouts, setSavedLayouts] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'create'

  const fetchLayouts = async () => {
    if (!currentUser?.company_id && currentUser?.role !== 'admin') return;
    try {
      const filter = currentUser.role === 'admin' ? '' : `company_id = "${currentUser.company_id}"`;
      const records = await pb.collection('store_layouts').getFullList({
        filter,
        sort: '-created',
        $autoCancel: false
      });
      setSavedLayouts(records);
    } catch (error) {
      console.error("Error fetching layouts:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!currentUser?.company_id && currentUser?.role !== 'admin') return;
      try {
        if (currentUser.company_id) {
          const company = await pb.collection('companies').getOne(currentUser.company_id, { $autoCancel: false });
          setCompanyPlan({
            plan: company.subscription_plan || 'Starter',
            max_corridors: company.max_corridors || 5
          });
        }
        await fetchLayouts();
      } catch (error) {
        console.error("Error init builder:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [currentUser]);

  const handleGenerate = (config, spaces) => {
    setLayoutConfig(config);
    setGeneratedLayout(spaces);
    setViewMode('create');
  };

  const handleSaveLayout = async () => {
    setIsSaving(true);
    try {
      const layoutRecord = await pb.collection('store_layouts').create({
        company_id: currentUser.company_id,
        store_name: layoutConfig.storeName,
        total_corridors: layoutConfig.corridors,
        total_gondolas: generatedLayout.filter(s => s.space_type === 'gondola').length,
        total_endcaps: generatedLayout.filter(s => s.space_type === 'endcap').length,
        total_islands: generatedLayout.filter(s => s.space_type === 'island').length,
        total_spaces: generatedLayout.length,
        layout_data: layoutConfig,
        status: 'active'
      }, { $autoCancel: false });

      const spacePromises = generatedLayout.map(space => {
        const { id, ...spaceData } = space; 
        return pb.collection('spaces').create({
          ...spaceData,
          company_id: currentUser.company_id,
          layout_id: layoutRecord.id,
          attributes: {}
        }, { $autoCancel: false });
      });

      await Promise.all(spacePromises);
      
      toast({ title: "Sucesso", description: "Planta salva com sucesso!" });
      setGeneratedLayout(null);
      setViewMode('list');
      fetchLayouts();
    } catch (error) {
      console.error("Error saving layout:", error);
      toast({ title: "Erro", description: "Erro ao salvar a planta.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLayout = async (layoutId) => {
    try {
      await pb.collection('store_layouts').delete(layoutId, { $autoCancel: false });
      
      // Delete associated spaces
      const spaces = await pb.collection('spaces').getList(1, 500, {
        filter: `layout_id="${layoutId}"`,
        $autoCancel: false
      });
      
      for (const space of spaces.items) {
        await pb.collection('spaces').delete(space.id, { $autoCancel: false });
      }

      toast({ title: "Sucesso", description: "Planta e espaços deletados com sucesso." });
      fetchLayouts();
    } catch (error) {
      console.error("Error deleting layout:", error);
      toast({ title: "Erro", description: "Falha ao deletar planta.", variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground pb-12 pt-20">
      <Helmet>
        <title>Construtor de Planta | Shelfix</title>
      </Helmet>

      {/* Premium Header */}
      <div className="sticky top-20 z-40 glass-panel border-x-0 border-t-0 border-b border-white/10 mb-8">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" /> Painel
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Construtor de Planta</span>
          </div>

          <div className="flex items-center gap-4">
            {companyPlan && (
              <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
                <span className="text-zinc-400">Plano {companyPlan.plan}:</span>
                <span className="font-medium text-primary">Até {companyPlan.max_corridors} corredores</span>
              </div>
            )}
            {viewMode === 'list' && (
              <Button onClick={() => setViewMode('create')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" /> Nova Planta
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4">
        {viewMode === 'list' ? (
          <div className="max-w-5xl mx-auto animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-6">Plantas Salvas</h2>
            {savedLayouts.length === 0 ? (
              <div className="text-center py-16 glass-panel rounded-2xl border-white/10">
                <div className="h-48 w-full max-w-md mx-auto mb-6 opacity-40 pointer-events-none overflow-hidden rounded-xl border border-white/5">
                  <RealisticFloorPlan spaces={[]} readOnly={true} />
                </div>
                <p className="text-zinc-400 mb-4">Nenhuma planta salva ainda.</p>
                <Button onClick={() => setViewMode('create')} className="bg-primary text-primary-foreground">Criar Primeira Planta</Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedLayouts.map(layout => (
                  <div key={layout.id} className="glass-panel p-6 rounded-xl border-white/10 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">{layout.store_name}</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        {layout.total_corridors} Corredores • {layout.total_spaces} Espaços • Criado em {new Date(layout.created).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate('/map')}>
                        Ver no Mapa
                      </Button>
                      {(currentUser.role === 'admin' || currentUser.company_id === layout.company_id) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="bg-destructive/20 text-destructive hover:bg-destructive/40 border-0">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-panel border-white/10 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Deletar Planta</AlertDialogTitle>
                              <AlertDialogDescription className="text-zinc-400">
                                Tem certeza que deseja deletar esta planta? Esta ação não pode ser desfeita e removerá todos os espaços associados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteLayout(layout.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Sim, Deletar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !generatedLayout ? (
          <div className="max-w-5xl mx-auto animate-fade-in-up">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" /> IA Layout Engine
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
                Construtor Inteligente de Layout
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Crie a planta baixa da sua loja em minutos. Nosso motor gera automaticamente as posições, numerações e espaços disponíveis.
              </p>
            </div>
            
            <StoreLayoutWizard companyPlan={companyPlan} onGenerate={handleGenerate} />
            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={() => setViewMode('list')} className="text-zinc-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para lista
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 rounded-2xl">
              <div>
                <h2 className="text-2xl font-bold text-white">{layoutConfig.storeName}</h2>
                <p className="text-zinc-400 mt-1">Planta gerada com sucesso. Revise e salve para ativar os espaços.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setGeneratedLayout(null)} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Refazer
                </Button>
                <Button onClick={handleSaveLayout} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                  {isSaving ? 'Salvando...' : <><Save className="w-4 h-4 mr-2" /> Salvar Planta</>}
                </Button>
              </div>
            </div>

            <LayoutSummary spaces={generatedLayout} config={layoutConfig} />
            
            <div className="mt-8 glass-panel rounded-2xl p-2 h-[600px]">
              <RealisticFloorPlan spaces={generatedLayout} readOnly={true} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StoreLayoutBuilderPage;
