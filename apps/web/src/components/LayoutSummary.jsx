import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, Map, Box, Maximize } from 'lucide-react';

const LayoutSummary = ({ spaces, config }) => {
  const totalGondolas = spaces.filter(s => s.space_type === 'gondola').length;
  const totalEndcaps = spaces.filter(s => s.space_type === 'endcap').length;
  const totalIslands = spaces.filter(s => s.space_type === 'island').length;
  const totalSpaces = spaces.length;
  
  // Assuming 1 meter per gondola length as per requirements
  const linearMeters = totalGondolas * (config?.gondolaLength || 1);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-background/50 backdrop-blur border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Layers className="w-4 h-4" /> Corredores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{config?.corridors || 0}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-background/50 backdrop-blur border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Box className="w-4 h-4" /> Gôndolas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalGondolas}</div>
          <p className="text-xs text-muted-foreground">{linearMeters}m lineares</p>
        </CardContent>
      </Card>

      <Card className="bg-background/50 backdrop-blur border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Map className="w-4 h-4" /> Pontas / Ilhas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEndcaps} / {totalIslands}</div>
        </CardContent>
      </Card>

      <Card className="bg-primary/20 backdrop-blur border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
            <Maximize className="w-4 h-4" /> Total de Espaços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalSpaces}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayoutSummary;
