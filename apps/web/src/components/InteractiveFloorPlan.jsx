import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, Grid, RefreshCcw } from 'lucide-react';
import SpaceDetailsModal from './SpaceDetailsModal.jsx';

const InteractiveFloorPlan = ({ spaces }) => {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const mapRef = useRef(null);

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-500/80 border-green-400',
      occupied: 'bg-red-500/80 border-red-400',
      expiring_soon: 'bg-yellow-400/80 border-yellow-300',
      maintenance: 'bg-gray-500/80 border-gray-400',
      premium_zone: 'bg-purple-500/80 border-purple-400'
    };
    return colors[status] || 'bg-blue-500/80 border-blue-400';
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    setScale(s => Math.min(Math.max(0.3, s + delta), 3));
  };

  const handleMouseDown = (e) => {
    if (e.target === mapRef.current || e.target.classList.contains('map-grid')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm flex flex-col">
      
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-background/80 backdrop-blur p-2 rounded-lg border border-white/10 shadow-xl">
        <Button variant="ghost" size="icon" onClick={() => setShowGrid(!showGrid)} title="Toggle Grid">
          <Grid className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(3, s + 0.2))} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.3, s - 0.2))} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={resetView} title="Reset View">
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Area */}
      <div 
        className={`flex-1 overflow-hidden relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        ref={mapRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className={`absolute inset-0 origin-top-left transition-transform duration-75 ${showGrid ? 'map-grid' : ''}`}
          style={{ 
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            width: '4000px',
            height: '4000px'
          }}
        >
          {spaces.map(space => (
            <div
              key={space.id}
              onClick={(e) => { e.stopPropagation(); setSelectedSpace(space); }}
              className={`absolute border rounded shadow-sm flex items-center justify-center text-[10px] font-bold text-white transition-all hover:shadow-lg hover:ring-2 ring-white/50 cursor-pointer ${getStatusColor(space.status)}`}
              style={{
                left: `${space.position_x}px`,
                top: `${space.position_y}px`,
                width: `${space.width || (space.space_type === 'island' ? 80 : 40)}px`,
                height: `${space.height || (space.space_type === 'endcap' ? 30 : 60)}px`,
              }}
              title={`${space.name} - ${space.space_type}`}
            >
              <span className="truncate px-1">{space.name}</span>
            </div>
          ))}
        </div>
      </div>

      <SpaceDetailsModal 
        space={selectedSpace} 
        isOpen={!!selectedSpace} 
        onClose={() => setSelectedSpace(null)} 
      />
    </div>
  );
};

export default InteractiveFloorPlan;
