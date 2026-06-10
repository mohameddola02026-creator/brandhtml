interface IntelligenceMeterProps {
  score: number;
  label: string;
  color?: string;
}

export default function IntelligenceMeter({ score, label, color = '#C9A84C' }: IntelligenceMeterProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-silver text-sm font-cairo">{label}</span>
        <span className="text-gold-light text-sm font-bold font-cairo">{score}%</span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            boxShadow: `0 0 10px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
