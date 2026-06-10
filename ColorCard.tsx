import { colorPalettes } from '../engine/questions';

interface ColorCardProps {
  selectedColors: string[];
  onToggle: (colorName: string) => void;
}

export default function ColorCard({ selectedColors, onToggle }: ColorCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
      {colorPalettes.map((palette) => {
        const isSelected = selectedColors.includes(palette.category);
        return (
          <button
            key={palette.category}
            type="button"
            onClick={() => onToggle(palette.category)}
            className={`
              border rounded-xl p-3 cursor-pointer flex items-center gap-3.5
              transition-all duration-250 ease-out
              ${isSelected
                ? 'border-gold bg-gold/10 text-gold-light'
                : 'border-white/8 bg-white/2 hover:border-gold hover:bg-gold/3'
              }
            `}
          >
            <div
              className="w-9 h-9 rounded-lg flex-shrink-0 border border-white/20"
              style={{ background: palette.gradient }}
            />
            <span className={`text-[13px] font-semibold ${isSelected ? 'text-gold-light' : 'text-silver'}`}>
              {palette.fullName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
