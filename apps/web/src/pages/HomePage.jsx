import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Map, FileText, BarChart3, Layers, Sparkles, ArrowRight, CheckCircle2, ChevronDown, Mail, MessageCircle, Settings2 } from 'lucide-react';
import { Helmet } from 'react-helmet';
import RealisticFloorPlan from '@/components/RealisticFloorPlan.jsx';
import { generateLayout } from '@/lib/LayoutGenerationEngine.js';

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  
  // Demo State
  const [demoConfig, setDemoConfig] = useState({
    corridors: 3,
    gondolasPerSide: 4,
    islands: 1,
    spacing: 2,
    endcapRule: 'all'
  });
  const [demoSpaces, setDemoSpaces] = useState([]);

  useEffect(() => {
    setDemoSpaces(generateLayout(demoConfig));
  }, [demoConfig]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const totalSpaces = demoSpaces.length;
  const linearMeters = demoSpaces.filter(s => s.space_type === 'gondola').length * 1.5; // approx 1.5m per gondola
  const estRevenue = totalSpaces * 150; // approx R$150 per space

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Shelfix | Maximize seu Espaço Retail</title>
        <meta name="description" content="Plataforma inteligente para gestão e monetização de espaços em supermercados." />
      </Helmet>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1613781485416-7c6b97d31e35?auto=format&fit=crop&q=80" 
              alt="Modern commercial space" 
              className="w-full h-full object-cover opacity-30 scale-105 animate-[float_20s_ease-in-out_infinite]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,255,0.1)_0%,transparent_60%)]"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-teal-300 mb-8 animate-fade-in-up opacity-0">
              <Sparkles className="w-4 h-4" />
              <span>O futuro da gestão de espaços comerciais</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 text-white animate-fade-in-up opacity-0 stagger-1 leading-tight">
              Maximize seu Espaço Retail com <span className="text-gradient">Inteligência</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up opacity-0 stagger-2">
              Plataforma inteligente para gestão visual, monetização de gôndolas e otimização de contratos em supermercados e varejo.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up opacity-0 stagger-3">
              <Button size="lg" className="text-lg px-10 h-16 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_-10px_rgba(0,200,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(0,200,255,0.7)] transition-all duration-300" asChild>
                <Link to="/signup">Começar Agora <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 h-16 rounded-xl glass-panel hover:bg-white/10 border-white/20 text-white transition-all duration-300" asChild>
                <a href="#demo">Ver Demo Interativa</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Showcase */}
        <section id="features" className="py-32 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Tudo que você precisa em um só lugar</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Ferramentas poderosas projetadas especificamente para maximizar a receita do seu espaço físico.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { icon: Layers, title: "Construtor Inteligente", desc: "Gere plantas baixas automaticamente baseadas nas dimensões da sua loja." },
                { icon: Map, title: "Mapa 2D em Tempo Real", desc: "Visualize a ocupação, arraste e solte espaços com feedback visual instantâneo." },
                { icon: FileText, title: "Gestão de Contratos", desc: "Controle inquilinos, valores e receba alertas automáticos de vencimento." },
                { icon: BarChart3, title: "Dashboard com KPIs", desc: "Métricas de receita, taxa de ocupação e projeções financeiras em tempo real." },
                { icon: Sparkles, title: "Zonas Premium", desc: "Identifique e precifique áreas de alto tráfego para maximizar lucros." }
              ].map((feature, i) => (
                <div key={i} className="glass-card p-8 rounded-2xl group">
                  <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-lg">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive AI Demo Section */}
        <section id="demo" className="py-32 bg-black/40 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Veja a IA em Ação: Crie uma Planta em Segundos</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Teste nosso Construtor Inteligente sem criar conta. Ajuste os parâmetros e veja a mágica acontecer em tempo real.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              {/* Controls */}
              <div className="lg:w-1/3 space-y-6">
                <div className="glass-panel p-6 rounded-2xl space-y-6">
                  <div className="flex items-center gap-2 text-primary font-semibold mb-4">
                    <Settings2 className="w-5 h-5" /> Parâmetros da Loja
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-white">
                      <label>Número de Corredores</label>
                      <span className="font-bold">{demoConfig.corridors}</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" 
                      value={demoConfig.corridors} 
                      onChange={(e) => setDemoConfig({...demoConfig, corridors: parseInt(e.target.value)})}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-white">
                      <label>Gôndolas por Lado</label>
                      <span className="font-bold">{demoConfig.gondolasPerSide}</span>
                    </div>
                    <input 
                      type="range" min="2" max="8" 
                      value={demoConfig.gondolasPerSide} 
                      onChange={(e) => setDemoConfig({...demoConfig, gondolasPerSide: parseInt(e.target.value)})}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-white">
                      <label>Número de Ilhas</label>
                      <span className="font-bold">{demoConfig.islands}</span>
                    </div>
                    <input 
                      type="range" min="0" max="5" 
                      value={demoConfig.islands} 
                      onChange={(e) => setDemoConfig({...demoConfig, islands: parseInt(e.target.value)})}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-white">
                      <label>Espaçamento (m)</label>
                      <span className="font-bold">{demoConfig.spacing}m</span>
                    </div>
                    <input 
                      type="range" min="1" max="3" step="0.5"
                      value={demoConfig.spacing} 
                      onChange={(e) => setDemoConfig({...demoConfig, spacing: parseFloat(e.target.value)})}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                  <h4 className="text-white font-semibold mb-4">Estatísticas Estimadas</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-zinc-400">Total de Espaços</span>
                      <span className="text-xl font-bold text-white">{totalSpaces}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-zinc-400">Metros Lineares</span>
                      <span className="text-xl font-bold text-white">{linearMeters}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Potencial de Receita</span>
                      <span className="text-xl font-bold text-primary">R$ {estRevenue.toLocaleString()}/mês</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preview */}
              <div className="lg:w-2/3 h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <RealisticFloorPlan spaces={demoSpaces} readOnly={true} />
              </div>
            </div>

            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold text-white mb-6">Pronto para começar? Crie sua conta agora</h3>
              <Button size="lg" className="text-lg px-10 h-16 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_-10px_rgba(0,200,255,0.5)]" asChild>
                <Link to="/signup">Criar Conta Grátis <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Planos que crescem com você</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Escolha a solução ideal para o tamanho da sua operação.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Basic */}
              <div className="glass-card p-8 rounded-3xl flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                <p className="text-zinc-400 mb-6">Para pequenos supermercados</p>
                <div className="text-4xl font-bold text-white mb-8">R$ 297<span className="text-lg text-zinc-500 font-normal">/mês</span></div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Até 5 corredores</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Modo automático simples</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Gestão de contratos básica</li>
                </ul>
                <Button className="w-full h-12 text-lg bg-white/10 hover:bg-white/20 text-white" asChild>
                  <a href="https://wa.me/5521987659877?text=Olá!%20Gostaria%20de%20assinar%20o%20plano%20Basic%20do%20Shelfix" target="_blank" rel="noreferrer">Assinar Agora</a>
                </Button>
              </div>

              {/* Pro */}
              <div className="glass-card p-8 rounded-3xl flex flex-col relative border-primary/50 shadow-[0_0_30px_-10px_rgba(0,200,255,0.3)] transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">Mais Popular</div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-zinc-400 mb-6">Para médias e grandes lojas</p>
                <div className="text-4xl font-bold text-white mb-8">R$ 597<span className="text-lg text-zinc-500 font-normal">/mês</span></div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Até 25 corredores</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Automático + Edição completa</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Dashboard financeiro avançado</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Zonas Premium</li>
                </ul>
                <Button className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" asChild>
                  <a href="https://wa.me/5521987659877?text=Olá!%20Gostaria%20de%20assinar%20o%20plano%20Pro%20do%20Shelfix" target="_blank" rel="noreferrer">Assinar Agora</a>
                </Button>
              </div>

              {/* Elite */}
              <div className="glass-card p-8 rounded-3xl flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-2">Elite</h3>
                <p className="text-zinc-400 mb-6">Para redes e franquias</p>
                <div className="text-4xl font-bold text-white mb-8">Sob Consulta</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Corredores Ilimitados</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Multi-loja (Redes)</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-primary" /> API e Integrações ERP</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-primary" /> Suporte Dedicado 24/7</li>
                </ul>
                <Button className="w-full h-12 text-lg bg-white/10 hover:bg-white/20 text-white" asChild>
                  <a href="https://wa.me/5521987659877?text=Olá!%20Gostaria%20de%20assinar%20o%20plano%20Elite%20do%20Shelfix" target="_blank" rel="noreferrer">Falar com Consultor</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32 bg-black/20 border-t border-white/5">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-white">Perguntas Frequentes</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { q: "Como funciona o Construtor Inteligente?", a: "Basta inserir as dimensões da sua loja e a quantidade de corredores. Nossa IA gera automaticamente a planta baixa 2D com todas as gôndolas, pontas e ilhas numeradas e prontas para locação." },
                { q: "Posso integrar com meu sistema atual?", a: "Sim, o plano Elite oferece acesso à nossa API REST para integração com ERPs e sistemas de gestão financeira." },
                { q: "Como os inquilinos são notificados?", a: "O sistema envia alertas automáticos por e-mail 30 dias antes do vencimento do contrato, permitindo renegociação antecipada." }
              ].map((faq, i) => (
                <div key={i} className="glass-panel rounded-xl overflow-hidden transition-all duration-300">
                  <button 
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(i)}
                  >
                    <span className="text-lg font-medium text-white">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-zinc-400">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-4xl font-bold mb-8 text-white">Pronto para transformar seu espaço?</h2>
            <p className="text-xl text-zinc-400 mb-12">Entre em contato com nossa equipe para uma demonstração personalizada.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button size="lg" className="h-16 px-8 text-lg bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/20" asChild>
                <a href="https://wa.me/5521987659877" target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-3 w-6 h-6" /> WhatsApp: (21) 98765-9877
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-8 text-lg glass-panel hover:bg-white/10 text-white" asChild>
                <a href="mailto:gabrielnv2911@gmail.com">
                  <Mail className="mr-3 w-6 h-6" /> gabrielnv2911@gmail.com
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/60 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl text-white">Shelfix</span>
              </div>
              <p className="text-zinc-400 max-w-sm">
                A plataforma definitiva para gestão visual e monetização de espaços comerciais. Transforme cada centímetro em receita.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Produto</h4>
              <ul className="space-y-4 text-zinc-400">
                <li><a href="#features" className="hover:text-primary transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Planos</a></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Contato</h4>
              <ul className="space-y-4 text-zinc-400">
                <li>WhatsApp: (21) 98765-9877</li>
                <li>Email: gabrielnv2911@gmail.com</li>
                <li>Rio de Janeiro, RJ - Brasil</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
            <p>© 2026 Shelfix Inc. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
