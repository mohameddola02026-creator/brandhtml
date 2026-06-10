interface HeaderProps {
  currentStep: number;
}

export default function Header({ currentStep }: HeaderProps) {
  const getStepText = () => {
    if (currentStep === -1) return 'تحليل مكتمل';
    if (currentStep === 0) return 'Brand Brief';
    return (
      <>
        سؤال <span className="text-gold font-bold">{currentStep}</span>
      </>
    );
  };

  return (
    <header className="fixed top-1 left-0 right-0 px-6 md:px-10 py-5 flex justify-between items-center bg-charcoal/85 backdrop-blur-xl border-b border-gold/10 z-[99]">
      <div className="font-display text-2xl font-black text-gold tracking-widest flex items-center gap-2">
        MA <span className="text-gold-light text-sm">✦</span>
        <span className="text-silver font-cairo text-sm font-light tracking-normal mr-1">DESIGN STUDIO</span>
      </div>
      <div className="text-mid text-sm font-normal tracking-wide font-cairo">
        {getStepText()}
      </div>
    </header>
  );
}
