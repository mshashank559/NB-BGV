import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export interface CarouselCandidateItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  employer: string;
  status: 'Responded' | 'Sent' | 'Opened' | 'Draft' | 'Expired';
}

export interface CircularCarouselProps {
  items: CarouselCandidateItem[];
  cardWidth?: number;
  gap?: number;
  tilt?: number;
  perspective?: number;
  autoplay?: 'drift' | 'none';
  speed?: number;
  pauseOnHover?: boolean;
  onItemClick?: (item: CarouselCandidateItem) => void;
}

export const CircularCarousel: React.FC<CircularCarouselProps> = ({
  items,
  cardWidth = 230,
  gap = 25,
  tilt = -5,
  perspective = 2200,
  autoplay = 'drift',
  speed = 12,
  pauseOnHover = true,
  onItemClick,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartX = useRef(0);
  const rotationAtDragStart = useRef(0);
  const animFrameId = useRef<number | null>(null);

  const n = items.length;
  const angleStep = 360 / Math.max(n, 1);
  // Calculate optimal cylinder radius
  const radius = Math.max(280, Math.round((cardWidth + gap) / (2 * Math.tan(Math.PI / n))));

  // Autoplay Drift Animation
  useEffect(() => {
    if (autoplay !== 'drift') return;

    let lastTime = performance.now();
    const drift = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!isDragging && (!pauseOnHover || !isHovered)) {
        setRotation((prev) => (prev - speed * dt) % 360);
      }
      animFrameId.current = requestAnimationFrame(drift);
    };

    animFrameId.current = requestAnimationFrame(drift);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [autoplay, speed, isDragging, isHovered, pauseOnHover]);

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    rotationAtDragStart.current = rotation;
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX.current;
      setRotation(rotationAtDragStart.current + deltaX * 0.35);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    rotationAtDragStart.current = rotation;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    setRotation(rotationAtDragStart.current + deltaX * 0.4);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const getStatusBadge = (status: CarouselCandidateItem['status']) => {
    switch (status) {
      case 'Responded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-600 border border-blue-500/30">
            <Clock className="w-3 h-3" /> Sent
          </span>
        );
      case 'Opened':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 border border-amber-500/30">
            <ShieldCheck className="w-3 h-3" /> Opened
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-600 border border-slate-500/30">
            <AlertCircle className="w-3 h-3" /> {status}
          </span>
        );
    }
  };

  return (
    <div
      className="relative w-full h-[360px] flex items-center justify-center select-none overflow-hidden"
      style={{ perspective: `${perspective}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Rotating Cylinder Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-75 ease-out cursor-grab active:cursor-grabbing"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt}deg) rotateY(${rotation}deg)`,
        }}
      >
        {items.map((item, index) => {
          const itemAngle = index * angleStep;
          // Calculate angle relative to viewer
          const angleNorm = ((itemAngle + rotation) % 360 + 360) % 360;
          const rad = (angleNorm * Math.PI) / 180;
          // Depth calculation: cos(rad) where 1 is front, -1 is back
          const depth = Math.cos(rad);
          const opacity = 0.35 + 0.65 * Math.max(0, depth);
          const scale = 0.88 + 0.12 * Math.max(0, depth);

          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                // Snap clicked card to front
                setRotation(-itemAngle);
                onItemClick?.(item);
              }}
              className="absolute group rounded-2xl p-4 flex flex-col justify-between transition-all duration-300"
              style={{
                width: `${cardWidth}px`,
                height: `${cardWidth * 1.25}px`,
                transformStyle: 'preserve-3d',
                transform: `rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${scale})`,
                opacity: opacity,
                pointerEvents: depth > -0.2 ? 'auto' : 'none',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                boxShadow:
                  depth > 0.5
                    ? '0 16px 36px -4px rgba(37, 99, 235, 0.18), 0 4px 12px rgba(0, 0, 0, 0.04)'
                    : '0 6px 16px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Card Header: Avatar & Status Badge */}
              <div className="flex items-center justify-between">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20 shadow-sm"
                />
                {getStatusBadge(item.status)}
              </div>

              {/* Candidate Info */}
              <div className="my-2">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 line-clamp-1">{item.subtitle}</p>
                <div className="mt-2 text-[10px] font-semibold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md inline-block">
                  {item.employer}
                </div>
              </div>

              {/* Card Footer: View Details CTA */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-blue-600 font-semibold">
                <span>View Verification</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CircularCarousel;
