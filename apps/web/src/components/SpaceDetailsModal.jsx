import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const SpaceDetailsModal = ({ space, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!space) return null;

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-500/10 text-green-500 border-green-500/20',
      occupied: 'bg-red-500/10 text-red-500 border-red-500/20',
      expiring_soon: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      maintenance: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      premium_zone: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    };
    return colors[status] || 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  };

  const translateType = (type) => {
    const types = { gondola: 'Gôndola', endcap: 'Ponta', island: 'Ilha' };
    return types[type] || type;
  };

  const translateStatus = (status) => {
    const statuses = {
      available: 'Disponível',
      occupied: 'Ocupado',
      expiring_soon: 'Vencendo em Breve',
      maintenance: 'Manutenção',
      premium_zone: 'Zona Premium'
    };
    return statuses[status] || status;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Espaço: {space.name}</span>
            <Badge variant="outline" className={getStatusColor(space.status)}>
              {translateStatus(space.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block mb-1">Tipo</span>
              <span className="font-medium">{translateType(space.space_type)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Corredor</span>
              <span className="font-medium">{space.corridor > 0 ? space.corridor : 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Lado</span>
              <span className="font-medium capitalize">{space.side === 'left' ? 'Esquerda' : space.side === 'right' ? 'Direita' : 'Centro/Nenhum'}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Posição (X, Y)</span>
              <span className="font-medium">{Math.round(space.position_x)}, {Math.round(space.position_y)}</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mt-2">
            <h4 className="text-sm font-medium mb-3">Informações de Contrato</h4>
            {space.status === 'available' ? (
              <p className="text-sm text-muted-foreground italic">Nenhum contrato ativo para este espaço.</p>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marca/Inquilino:</span>
                  <span className="font-medium">{space.tenant_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor Mensal:</span>
                  <span className="font-medium">{space.monthly_price ? `$${space.monthly_price}` : 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-2">
          <Button variant="outline" disabled>Editar Espaço</Button>
          <Button onClick={() => navigate('/contracts')}>Criar Contrato</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpaceDetailsModal;
