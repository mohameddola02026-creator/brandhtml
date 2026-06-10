interface ChoiceCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}

export default function ChoiceCard({ label, selected, onClick, multi }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full px-6 py-4 rounded-xl border text-right font-cairo text-[15px] cursor-pointer
        select-none flex items-center justify-between gap-4
        transition-all duration-250 ease-out
        ${selected
          ? 'border-gold bg-gold/12 text-gold-light font-semibold gold-border-glow'
          : 'border-white/8 bg-white/2 text-silver hover:border-gold hover:text-warm hover:bg-gold/5'
        }
      `}
    >
      <span className="leading-relaxed">{label}</span>
      <span className={`text-base transition-all duration-200 flex-shrink-0 ${selected ? 'text-gold' : 'text-white/20'}`}>
        {selected ? '✦' : multi ? '☐' : '○'}
      </span>
    </button>
  );
}
