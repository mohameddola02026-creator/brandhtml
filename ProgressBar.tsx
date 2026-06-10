import { useEffect, useState } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const pct = current === 0 ? 0 : Math.round((current / total) * 100);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 50);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gold/10 z-[100]">
      <div
        className="h-full bg-gradient-to-l from-gold-light to-gold transition-all duration-500 ease-out"
        style={{ width: `${width}%`, boxShadow: '0 0 15px rgba(201,168,76,0.6)' }}
      />
    </div>
  );
}
