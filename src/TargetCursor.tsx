import { useEffect, useState } from 'react';
import './TargetCursor.css';

interface TargetCursorProps {
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  parallaxOn?: boolean;
  hoverDuration?: number;
}

export default function TargetCursor({
  spinDuration = 1.5,
  hideDefaultCursor = true,
  hoverDuration = 0.3
}: TargetCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
      // S'assurer que le curseur par défaut est masqué partout
      const style = document.createElement('style');
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
        document.body.style.cursor = 'auto';
      };
    }
  }, [hideDefaultCursor]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Mouvement direct sans aucun lissage pour une réactivité "normale"
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('cursor-target') ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.classList.contains('btn') ||
        target.classList.contains('project-link') ||
        target.classList.contains('nav-link') ||
        target.classList.contains('mobile-nav-link')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('cursor-target') ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.classList.contains('btn') ||
        target.classList.contains('project-link') ||
        target.classList.contains('nav-link') ||
        target.classList.contains('mobile-nav-link')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={`target-cursor ${isHovering ? 'hovering' : ''}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        '--spin-duration': `${spinDuration}s`,
        '--hover-duration': `${hoverDuration}s`
      } as React.CSSProperties}
    >
      {/* SVG pour les 4 arcs parfaits */}
      <svg className="cursor-outer" width="50" height="50" viewBox="0 0 50 50">
        <path d="M 25 5 A 20 20 0 0 1 45 25" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M 45 25 A 20 20 0 0 1 25 45" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M 25 45 A 20 20 0 0 1 5 25" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M 5 25 A 20 20 0 0 1 25 5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
      
      {/* Point central */}
      <div className="cursor-inner"></div>
    </div>
  );
}
