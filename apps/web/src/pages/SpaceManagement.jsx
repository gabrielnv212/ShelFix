import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SpaceManagement = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    space_type: 'gondola',
    status: 'available',
    position_x: 0,
    position_y: 0
  });

  const fetchSpaces = async () => {
    if (!currentUser?.company_id) return;
    try {
      const records = await pb.collection('spaces').getFullList({
        filter: `company_id = "${currentUser.company_id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setSpaces(records);
    } catch (error) {
      console.error("Error fetching spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await pb.collection('spaces').create({
        ...formData,
        company_id: currentUser.company_id,
        attributes: {} 
      }, { $autoCancel: false });
      setIsModalOpen(false);
      setFormData({ name: '', space_type: 'gondola', status: 'available', position_x: 0, position_y: 0 });
      fetchSpaces();
    } catch (error) {
      console.error("Error creating space:", error);
      alert("Failed to create space");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        await pb.collection('spaces').delete(id, { $autoCancel: false });
        fetchSpaces();
      } catch (error) {
        console.error("Error deleting space:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-500/20 text-green-400 border-green-500/30',
      occupied: 'bg-red-500/20 text-red-400 border-red-500/30',
      expiring_soon: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      maintenance: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      premium_zone: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return colors[status] || 'bg-white/10 text-white border-white/20';
  };

  return (
    <div className="container mx-auto p-6 space-y-6 pt-24">
      <Helmet>
        <title>{t('spaces.title')} | Shelfix</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('spaces.title')}</h1>
          <p className="text-zinc-400 mt-1">{t('spaces.subtitle')}</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> {t('spaces.addSpace')}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>{t('spaces.createNew')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">{t('spaces.nameIdentifier')}</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">{t('common.type')}</Label>
                <Select value={formData.space_type} onValueChange={(v) => setFormData({...formData, space_type: v})}>
                  <SelectTrigger className="bg-black/20 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="glass-panel border-white/10 text-white">
                    <SelectItem value="gondola">{t('spaces.types.gondola')}</SelectItem>
                    <SelectItem value="endcap">{t('spaces.types.endcap')}</SelectItem>
                    <SelectItem value="island">{t('spaces.types.island')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">{t('common.status')}</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-black/20 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="glass-panel border-white/10 text-white">
                    <SelectItem value="available">{t('spaces.status.available')}</SelectItem>
                    <SelectItem value="occupied">{t('spaces.status.occupied')}</SelectItem>
                    <SelectItem value="expiring_soon">{t('spaces.status.expiring_soon')}</SelectItem>
                    <SelectItem value="maintenance">{t('spaces.status.maintenance')}</SelectItem>
                    <SelectItem value="premium_zone">{t('spaces.status.premium_zone')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">{t('common.save')}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card border-white/10 rounded-2xl overflow-hidden animate-fade-in-up stagger-1">
        <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input placeholder={t('common.search')} className="pl-10 bg-black/20 border-white/10 text-white h-10 rounded-xl" />
          </div>
        </div>
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-300">{t('common.name')}</TableHead>
              <TableHead className="text-zinc-300">{t('common.type')}</TableHead>
              <TableHead className="text-zinc-300">{t('common.status')}</TableHead>
              <TableHead className="text-zinc-300">{t('spaces.position')}</TableHead>
              <TableHead className="text-right text-zinc-300">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10"><TableCell colSpan={5} className="text-center py-12 text-zinc-400">{t('common.loading')}</TableCell></TableRow>
            ) : spaces.length === 0 ? (
              <TableRow className="border-white/10"><TableCell colSpan={5} className="text-center py-12 text-zinc-500">{t('spaces.noSpaces')}</TableCell></TableRow>
            ) : (
              spaces.map((space) => (
                <TableRow key={space.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-white">{space.name}</TableCell>
                  <TableCell className="capitalize text-zinc-300">{t(`spaces.types.${space.space_type}`)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(space.status)}>
                      {t(`spaces.status.${space.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400 font-mono text-sm">{space.position_x || 0}, {space.position_y || 0}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20" onClick={() => handleDelete(space.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default SpaceManagement;
