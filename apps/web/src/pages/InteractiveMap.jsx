import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import RealisticFloorPlan from '@/components/RealisticFloorPlan.jsx';
import SpaceDetailsModal from '@/components/SpaceDetailsModal.jsx';

const InteractiveMap = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      if (!currentUser?.company_id) return;
      const records = await pb.collection('spaces').getFullList({
        filter: `company_id = "${currentUser.company_id}"`,
        $autoCancel: false
      });
      setSpaces(records);
    };
    fetchSpaces();
  }, [currentUser]);

  const handleSpaceClick = (space) => {
    setSelectedSpace(space);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col pt-20">
      <Helmet>
        <title>{t('map.title')} | Shelfix</title>
      </Helmet>

      <div className="bg-card border-b border-white/10 p-4 flex items-center justify-between z-10 glass-panel rounded-none">
        <div>
          <h1 className="text-xl font-bold text-white">{t('map.title')}</h1>
          <p className="text-sm text-zinc-400">{t('map.subtitle')}</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <RealisticFloorPlan spaces={spaces} onSpaceClick={handleSpaceClick} />
      </div>

      <SpaceDetailsModal 
        space={selectedSpace} 
        isOpen={!!selectedSpace} 
        onClose={() => setSelectedSpace(null)} 
      />
    </div>
  );
};

export default InteractiveMap;
