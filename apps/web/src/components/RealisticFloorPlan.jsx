import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, Grid, RefreshCcw } from 'lucide-react';

const RealisticFloorPlan = ({ spaces, onSpaceClick, readOnly = false }) => {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [hoveredSpace, setHoveredSpace] = useState(null);
  const svgRef = useRef(null);

  const getStatusColor = (status) => {
    const colors = {
      available: '#22c55e', // green-500
      occupied: '#ef4444', // red-500
      expiring_soon: '#facc15', // yellow-400
      maintenance: '#9ca3af', // gray-400
      premium_zone: '#a855f7' // purple-500
    };
    return colors[status] || '#3b82f6'; // blue-500
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    setScale(s => Math.min(Math.max(0.3, s + delta), 3));
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect' && e.target.id === 'grid-bg') {
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
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-white/10 bg-[#0f172a] flex flex-col">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-background/80 backdrop-blur p-2 rounded-lg border border-white/10 shadow-xl">
        <Button variant="ghost" size="icon" onClick={() => setShowGrid(!showGrid)} title="Toggle Grid">
          <Grid className="h-4 w-4 text-white" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(3, s + 0.2))} title="Zoom In">
          <ZoomIn className="h-4 w-4 text-white" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.3, s - 0.2))} title="Zoom Out">
          <ZoomOut className="h-4 w-4 text-white" />
        </Button>
        <Button variant="ghost" size="icon" onClick={resetView} title="Reset View">
          <RefreshCcw className="h-4 w-4 text-white" />
        </Button>
      </div>

      {/* Tooltip */}
      {hoveredSpace && (
        <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl pointer-events-none animate-fade-in-up">
          <h4 className="font-bold text-white text-lg">{hoveredSpace.name}</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
            <span className="text-zinc-400">Tipo:</span>
            <span className="text-white capitalize">{hoveredSpace.space_type}</span>
            <span className="text-zinc-400">Status:</span>
            <span className="text-white capitalize flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{backgroundColor: getStatusColor(hoveredSpace.status)}}></span>
              {hoveredSpace.status.replace('_', ' ')}
            </span>
            <span className="text-zinc-400">Dimensões:</span>
            <span className="text-white">{hoveredSpace.width}x{hoveredSpace.height}cm</span>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <div 
        className={`flex-1 overflow-hidden relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          className="absolute inset-0"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </pattern>
            <pattern id="island-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 10 M 0 0 L 10 10" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
            </pattern>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
            </filter>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
            {/* Background Grid */}
            {showGrid && (
              <rect id="grid-bg" x="-5000" y="-5000" width="10000" height="10000" fill="url(#grid)" />
            )}

            {/* Render Spaces */}
            {spaces.map(space => {
              const color = getStatusColor(space.status);
              const isHovered = hoveredSpace?.id === space.id;
              const w = space.width || (space.space_type === 'island' ? 80 : 40);
              const h = space.height || (space.space_type === 'endcap' ? 30 : 60);
              const x = space.position_x;
              const y = space.position_y;

              return (
                <g 
                  key={space.id} 
                  transform={`translate(${x}, ${y})`}
                  onClick={(e) => {
                    if (!isDragging && onSpaceClick) {
                      e.stopPropagation();
                      onSpaceClick(space);
                    }
                  }}
                  onMouseEnter={() => setHoveredSpace(space)}
                  onMouseLeave={() => setHoveredSpace(null)}
                  className={!readOnly ? "cursor-pointer" : ""}
                  filter={isHovered ? "url(#glow)" : "url(#shadow)"}
                >
                  {/* Base Shape */}
                  <rect 
                    width={w} 
                    height={h} 
                    fill={color} 
                    fillOpacity={isHovered ? 0.9 : 0.7}
                    stroke={isHovered ? '#fff' : 'rgba(255,255,255,0.3)'} 
                    strokeWidth={isHovered ? 2 : 1}
                    rx={space.space_type === 'island' ? 8 : 2}
                    className="transition-all duration-200"
                  />

                  {/* Internal Details based on type */}
                  {space.space_type === 'gondola' && (
                    <g opacity="0.4">
                      <line x1="0" y1={h*0.25} x2={w} y2={h*0.25} stroke="#000" strokeWidth="1" />
                      <line x1="0" y1={h*0.5} x2={w} y2={h*0.5} stroke="#000" strokeWidth="1" />
                      <line x1="0" y1={h*0.75} x2={w} y2={h*0.75} stroke="#000" strokeWidth="1" />
                      <line x1={w/2} y1="0" x2={w/2} y2={h} stroke="#000" strokeWidth="1" strokeDasharray="2,2" />
                    </g>
                  )}

                  {space.space_type === 'island' && (
                    <rect width={w} height={h} fill="url(#island-pattern)" rx={8} />
                  )}

                  {space.space_type === 'endcap' && (
                    <rect x="4" y="4" width={w-8} height={h-8} fill="rgba(0,0,0,0.1)" rx="1" />
                  )}

                  {/* Label */}
                  <text 
                    x={w/2} 
                    y={h/2} 
                    dominantBaseline="middle" 
                    textAnchor="middle" 
                    fill="#fff" 
                    fontSize={space.space_type === 'island' ? "12" : "10"} 
                    fontWeight="bold"
                    style={{ pointerEvents: 'none', textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {space.name.split('-').pop()}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default RealisticFloorPlan;
