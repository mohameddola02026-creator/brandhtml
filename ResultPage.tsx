import { useState, useEffect } from 'react';
import {
  BrandAnswers, BrandIntelligence, TierDecision,
  CrossQuestionInsight, ProjectPhase,
} from '../engine/types';
import IntelligenceMeter from './IntelligenceMeter';
import {
  Sparkles, Crown, Palette, Globe, Clock, ShieldCheck, Scale,
  Star, Award, Zap, Heart, Feather, Users, MapPin, AlertCircle,
  CheckCircle, Copy, Printer, MessageCircle, ChevronDown,
  Layers, Target, Eye, Compass, BookOpen, Shield, Smile, TrendingUp,
  DollarSign, Package, FileText, Lock, Gavel, Handshake,
} from 'lucide-react';

interface ResultPageProps {
  answers: BrandAnswers;
  tier: TierDecision;
  intelligence: BrandIntelligence;
  onCopy: () => void;
  onWhatsApp: () => void;
  onPrint: () => void;
  onBack: () => void;
  copyFeedback: boolean;
}

const archetypeIconMap: Record<string, JSX.Element> = {
  crown: <Crown className="w-8 h-8" />,
  palette: <Palette className="w-8 h-8" />,
  shield: <Shield className="w-8 h-8" />,
  'book-open': <BookOpen className="w-8 h-8" />,
  compass: <Compass className="w-8 h-8" />,
  heart: <Heart className="w-8 h-8" />,
  smile: <Smile className="w-8 h-8" />,
  'shield-check': <ShieldCheck className="w-8 h-8" />,
};

export default function ResultPage({
  answers, tier, intelligence, onCopy, onWhatsApp, onPrint, onBack, copyFeedback,
}: ResultPageProps) {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [animPhase, setAnimPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimPhase(1), 300),
      setTimeout(() => setAnimPhase(2), 800),
      setTimeout(() => setAnimPhase(3), 1400),
      setTimeout(() => setAnimPhase(4), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const toggleSection = (id: string) => {
    setVisibleSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sectionVisible = (id: string) => visibleSections.has(id);

  const tierColors: Record<string, string> = {
    'tier-PREMIUM': 'from-gold/25 via-gold/10 to-transparent border-gold/40',
    'tier-MEDIUM': 'from-[#639FAB]/20 via-[#639FAB]/8 to-transparent border-[#639FAB]/40',
    'tier-BUDGET': 'from-[#A61C1C]/20 via-[#A61C1C]/8 to-transparent border-[#A61C1C]/40',
    'tier-MICRO': 'from-white/15 via-white/5 to-transparent border-white/20',
    'tier-STARTER': 'from-[#134021]/20 via-[#134021]/8 to-transparent border-[#134021]/40',
  };

  const tierBadgeMap: Record<string, { icon: JSX.Element; label: string }> = {
    'tier-PREMIUM': { icon: <Star className="w-5 h-5" />, label: 'المميزون' },
    'tier-MEDIUM': { icon: <Award className="w-5 h-5" />, label: 'المحترفون' },
    'tier-BUDGET': { icon: <Zap className="w-5 h-5" />, label: 'الرواد' },
    'tier-MICRO': { icon: <Feather className="w-5 h-5" />, label: 'البداية' },
    'tier-STARTER': { icon: <Heart className="w-5 h-5" />, label: 'الناشئون' },
  };

  const badge = tierBadgeMap[tier.class] || tierBadgeMap['tier-MEDIUM'];

  // ─── Section component ───
  const Section = ({ id, icon, title, subtitle, children, defaultOpen = false, accentColor = 'gold' }: {
    id: string; icon: JSX.Element; title: string; subtitle?: string;
    children: React.ReactNode; defaultOpen?: boolean; accentColor?: string;
  }) => {
    useEffect(() => {
      if (defaultOpen) toggleSection(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isOpen = sectionVisible(id);
    const accentMap: Record<string, string> = {
      gold: 'text-gold border-gold/20',
      blue: 'text-[#639FAB] border-[#639FAB]/20',
      green: 'text-[#A3E2C9] border-[#134021]/20',
      red: 'text-[#FF7373] border-[#A61C1C]/20',
    };
    const color = accentMap[accentColor] || accentMap.gold;

    return (
      <div className={`glass-panel rounded-2xl overflow-hidden mb-5 transition-all duration-500 ${isOpen ? 'gold-glow' : ''}`}>
        <button
          onClick={() => toggleSection(id)}
          className={`w-full px-6 py-5 flex items-center justify-between cursor-pointer ${color} hover:bg-white/[0.02] transition-all`}
        >
          <div className="flex items-center gap-3">
            {icon}
            <div className="text-right">
              <h3 className="font-bold font-cairo text-base">{title}</h3>
              {subtitle && <p className="text-silver text-xs mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5 text-mid" />
          </div>
        </button>
        <div className={`transition-all duration-500 ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="px-6 pb-6">
            <div className="h-px bg-gradient-to-l from-transparent via-gold/20 to-transparent mb-5" />
            {children}
          </div>
        </div>
      </div>
    );
  };

  // ─── Data cards ───
  const DataCard = ({ label, value, small }: { label: string; value: string; small?: boolean }) => (
    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
      <div className="text-mid text-[10px] mb-1 uppercase tracking-wider">{label}</div>
      <div className={`${small ? 'text-sm' : 'text-base'} text-warm font-semibold font-cairo leading-relaxed`}>{value}</div>
    </div>
  );

  return (
    <div className="animate-slide-up">
      {/* ═══ HERO HEADER ═══ */}
      <div className={`text-center mb-8 transition-all duration-1000 ${animPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="relative w-28 h-28 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/30 to-gold/5 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-charcoal flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-gold" style={{ filter: 'drop-shadow(0 0 15px rgba(201,168,76,0.6))' }} />
          </div>
        </div>
        <div className="font-display text-[11px] tracking-[5px] text-gold/70 uppercase mb-3">
          Brand Intelligence Analysis
        </div>
        <h2 className="font-cairo text-[clamp(28px,5vw,44px)] font-black leading-tight mb-3">
          تم التحليل بنجاح
        </h2>
        <p className="text-gradient-gold font-cairo text-lg font-bold">
          {answers.brandName || 'مشروعك'}
        </p>
        <p className="text-mid text-sm leading-7 max-w-xl mx-auto mt-3">
          بناءً على إجاباتك، قام النظام الذكي بتحليل متطلباتك وتقدير هويتك البصرية المثالية
        </p>
      </div>

      {/* ═══ CLIENT CLASSIFICATION ═══ */}
      <div className={`transition-all duration-700 ${animPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Section id="classification" icon={<Users className="w-5 h-5 text-gold" />} title="تصنيف العميل" subtitle="من أنت في منظومة التصميم" defaultOpen accentColor="gold">
          <div className="flex gap-3 flex-wrap">
            {badge && (
              <span className="px-5 py-2.5 rounded-full bg-gold/15 text-gold-light text-sm font-bold border border-gold/30 flex items-center gap-2">
                {badge.icon} {badge.label}
              </span>
            )}
            {answers.geography?.includes('عالمي') && (
              <span className="px-5 py-2.5 rounded-full bg-[#639FAB]/15 text-[#9AD1DB] text-sm font-bold border border-[#639FAB]/30 flex items-center gap-2">
                <Globe className="w-4 h-4" /> دولي
              </span>
            )}
            {answers.governorate && (
              <span className="px-5 py-2.5 rounded-full bg-white/8 text-silver text-sm font-bold border border-white/10 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {answers.governorate}
              </span>
            )}
            {answers.audienceEconomic && (
              <span className="px-5 py-2.5 rounded-full bg-gold/10 text-gold-light text-sm font-bold border border-gold/20 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> {answers.audienceEconomic}
              </span>
            )}
          </div>
        </Section>
      </div>

      {/* ═══ INTELLIGENCE METERS ═══ */}
      <div className={`transition-all duration-700 ${animPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Section id="intelligence" icon={<Eye className="w-5 h-5 text-gold" />} title="مقاييس الذكاء البصري" subtitle="تحليل عميق لوعيك الاستراتيجي" defaultOpen accentColor="gold">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IntelligenceMeter score={intelligence.sophisticationScore} label="الوعي الاستراتيجي" color="#C9A84C" />
            <IntelligenceMeter score={intelligence.luxuryAffinity} label="ميل الفخامة" color="#E8D095" />
            <IntelligenceMeter score={intelligence.complexityLevel} label="تعقيد المخرجات" color="#639FAB" />
            <IntelligenceMeter score={intelligence.urgencyLevel} label="الاستعجال" color="#FF7373" />
          </div>
          <div className="mt-4 bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
            <div className="text-gold text-xs font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> خلاصة الذكاء
            </div>
            <p className="text-silver text-sm leading-7">{intelligence.designerNotes}</p>
          </div>
        </Section>
      </div>

      {/* ═══ BRAND DNA ═══ */}
      <div className={`transition-all duration-700 ${animPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Section id="dna" icon={<Sparkles className="w-5 h-5 text-gold" />} title="DNA البراند" subtitle="الهوية الجينية لمشروعك" defaultOpen accentColor="gold">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gold/15 flex items-center justify-center border border-gold/30">
              {archetypeIconMap[intelligence.brandDNA.archetypeIcon] || <Crown className="w-8 h-8 text-gold" />}
            </div>
            <div>
              <div className="text-gold font-display text-xs tracking-[3px] uppercase">Brand Archetype</div>
              <div className="text-warm text-xl font-bold font-cairo">{intelligence.brandDNA.archetype}</div>
            </div>
          </div>
          <p className="text-silver text-sm leading-7 mb-5">{intelligence.brandDNA.archetypeDescription}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            <DataCard label="النبرة العاطفية" value={intelligence.brandDNA.emotionalTone} small />
            <DataCard label="التوجه البصري" value={intelligence.brandDNA.visualDirection} small />
            <DataCard label="سيكولوجية الألوان" value={intelligence.brandDNA.colorPsychology} small />
            <DataCard label="شخصية الخطوط" value={intelligence.brandDNA.typographyPersonality} small />
            <DataCard label="صوت البراند" value={intelligence.brandDNA.brandVoice} small />
            <DataCard label="عامل التمايز" value={intelligence.brandDNA.differentiationFactor} small />
          </div>
          {intelligence.brandDNA.personalityTraits.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {intelligence.brandDNA.personalityTraits.map(t => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-gold/10 text-gold-light text-xs font-semibold border border-gold/20">{t}</span>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* ═══ ARCHETYPE ANALYSIS ═══ */}
      <Section id="archetype" icon={<Crown className="w-5 h-5 text-gold" />} title="تحليل الأصل (Archetype)" subtitle="ما الذي يجعل براندك فريداً" accentColor="gold">
        <div className="mb-5">
          <p className="text-silver text-sm leading-7">{intelligence.archetypeAnalysis.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-[#134021]/10 rounded-xl p-4 border border-[#134021]/20">
            <h4 className="text-[#A3E2C9] text-sm font-bold mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> نقاط القوة
            </h4>
            <ul className="text-silver text-xs space-y-1.5">
              {intelligence.archetypeAnalysis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#A3E2C9] mt-0.5">&#10003;</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#A61C1C]/10 rounded-xl p-4 border border-[#A61C1C]/20">
            <h4 className="text-[#FF7373] text-sm font-bold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> التحديات
            </h4>
            <ul className="text-silver text-xs space-y-1.5">
              {intelligence.archetypeAnalysis.challenges.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#FF7373] mt-0.5">&#9888;</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <DataCard label="الأصل الثانوي" value={intelligence.archetypeAnalysis.secondaryArchetype} small />
          <DataCard label="أمثلة عالمية" value={intelligence.archetypeAnalysis.famousExamples.slice(0, 3).join(', ')} small />
        </div>
        <div className="mt-4">
          <div className="text-gold text-xs font-bold mb-2">إشارات بصرية مقترحة</div>
          <div className="flex gap-2 flex-wrap">
            {intelligence.archetypeAnalysis.visualCues.map((c, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-gold/8 text-gold-light text-xs border border-gold/15">{c}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ PRICE CARD ═══ */}
      <div className={`rounded-3xl overflow-hidden mb-5 border-2 bg-gradient-to-br ${tierColors[tier.class] || tierColors['tier-MEDIUM']} transition-all duration-700 ${animPhase >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="p-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {badge.icon}
                <span className="text-xl font-bold font-cairo text-warm">{tier.tier}</span>
              </div>
              <div className="text-[clamp(36px,6vw,56px)] font-black text-warm mb-2 leading-none">
                {tier.price}
              </div>
              <div className="text-gold-light text-sm">النطاق: {tier.range}</div>
            </div>
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2 text-silver text-sm">
                <Clock className="w-4 h-4 text-gold" /> {tier.time}
              </div>
              <div className="flex items-center gap-2 text-silver text-sm">
                <Globe className="w-4 h-4 text-gold" /> {tier.currency}
              </div>
            </div>
          </div>

          {tier.rushNote && (
            <div className="bg-[#FF7373]/10 border-r-4 border-[#FF7373] px-5 py-4 rounded-l-xl mb-5">
              <div className="text-[#FF7373] text-sm font-bold mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> ملاحظة:
              </div>
              <div className="text-silver text-sm">{tier.rushNote}</div>
            </div>
          )}

          {/* Features */}
          <div className="mb-5">
            <div className="text-gold text-xs font-bold mb-3 flex items-center gap-2">
              <Package className="w-3.5 h-3.5" /> محتويات الباقة
            </div>
            <div className="flex flex-wrap gap-2">
              {tier.features.map((f, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-white/[0.05] text-silver text-xs border border-white/[0.06] flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-gold" /> {f}
                </span>
              ))}
            </div>
          </div>

          {/* Payment Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/[0.04] rounded-xl p-4 text-center">
              <div className="text-mid text-xs mb-1">المقدم 50%</div>
              <div className="text-gold-light font-bold">{tier.deposit}</div>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-4 text-center">
              <div className="text-mid text-xs mb-1">المتبقي</div>
              <div className="text-gold-light font-bold">{tier.deposit}</div>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-4 text-center">
              <div className="text-mid text-xs mb-1">طريقة الدفع</div>
              <div className="text-silver text-sm">تحويل بنكي</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ TIMELINE IMPACT ═══ */}
      <Section id="timeline" icon={<Clock className="w-5 h-5 text-[#639FAB]" />} title="تحليل الإطار الزمني" subtitle="كيف يؤثر وقتك على الجودة والسعر" accentColor="blue">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <DataCard label="الوقت المختار" value={`${intelligence.timelineImpact.selectedDays} يوم`} small />
          <DataCard label="الوقت المثالي" value={`${intelligence.timelineImpact.optimalDays} يوم`} small />
          <DataCard label="معامل الاستعجال" value={`x${intelligence.timelineImpact.rushMultiplier}`} small />
          <DataCard label="تأثير السعر" value={intelligence.timelineImpact.priceImpact.split('—')[0]?.trim() || ''} small />
        </div>
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04] mb-4">
          <div className="text-[#639FAB] text-xs font-bold mb-2 flex items-center gap-2">
            <Target className="w-3.5 h-3.5" /> تأثير الجودة
          </div>
          <p className="text-silver text-sm leading-7">{intelligence.timelineImpact.qualityImpact}</p>
        </div>
        <div className="bg-gold/5 rounded-xl p-4 border border-gold/15">
          <div className="text-gold text-xs font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" /> التوصية
          </div>
          <p className="text-silver text-sm leading-7">{intelligence.timelineImpact.recommendation}</p>
        </div>
      </Section>

      {/* ═══ BUDGET ANALYSIS ═══ */}
      <Section id="budget" icon={<DollarSign className="w-5 h-5 text-gold" />} title="تحليل الميزانية" subtitle="قيمة كل عنصر وتقييم العائد" accentColor="gold">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
          <DataCard label="النطاق" value={intelligence.budgetAnalysis.rangeAr} small />
          <DataCard label="السعر المقترح" value={tier.price} small />
          <DataCard label="درجة القيمة" value={`${intelligence.budgetAnalysis.valueScore}/100`} small />
        </div>
        <div className="mb-5">
          <div className="text-gold text-xs font-bold mb-3">توزيع السعر على المخرجات</div>
          <div className="space-y-2">
            {intelligence.budgetAnalysis.pricePerDeliverable.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-white/[0.03] rounded-lg px-4 py-2.5 border border-white/[0.04]">
                <span className="text-silver text-sm">{item.item}</span>
                <span className="text-gold-light font-bold text-sm">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gold/5 rounded-xl p-4 border border-gold/15">
          <div className="text-gold text-xs font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" /> المقارنة السوقية
          </div>
          <p className="text-silver text-sm leading-7">{intelligence.budgetAnalysis.competitorBenchmark}</p>
        </div>
      </Section>

      {/* ═══ CROSS QUESTION INSIGHTS ═══ */}
      {intelligence.crossQuestionInsights.length > 0 && (
        <Section id="cross" icon={<Layers className="w-5 h-5 text-[#639FAB]" />} title="رؤى مترابطة" subtitle="خيوط الذكاء تربط إجاباتك ببعضها" accentColor="blue">
          <div className="space-y-4">
            {intelligence.crossQuestionInsights.map((insight, i) => (
              <CrossInsightCard key={i} insight={insight} />
            ))}
          </div>
        </Section>
      )}

      {/* ═══ RECOMMENDATIONS ═══ */}
      <Section id="recommendations" icon={<Palette className="w-5 h-5 text-gold" />} title="التوصيات البصرية" subtitle="ما نراه الأنسب لمشروعك" defaultOpen accentColor="gold">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <DataCard label="التوجه الفني" value={intelligence.recommendedStyle} />
          <DataCard label="الألوان" value={intelligence.recommendedPalette} />
          <DataCard label="الخطوط" value={intelligence.recommendedTypography} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intelligence.opportunities.length > 0 && (
            <div className="bg-[#134021]/10 rounded-xl p-4 border border-[#134021]/20">
              <h4 className="text-[#A3E2C9] text-sm font-bold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> فرص
              </h4>
              <ul className="text-silver text-xs space-y-1.5">
                {intelligence.opportunities.map((o, i) => <li key={i}>&#10003; {o}</li>)}
              </ul>
            </div>
          )}
          {intelligence.riskFactors.length > 0 && (
            <div className="bg-[#A61C1C]/10 rounded-xl p-4 border border-[#A61C1C]/20">
              <h4 className="text-[#FF7373] text-sm font-bold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> ملاحظات
              </h4>
              <ul className="text-silver text-xs space-y-1.5">
                {intelligence.riskFactors.map((r, i) => <li key={i}>&#9888; {r}</li>)}
              </ul>
            </div>
          )}
        </div>
      </Section>

      {/* ═══ INDUSTRY INSIGHTS ═══ */}
      <Section id="industry" icon={<Target className="w-5 h-5 text-gold" />} title="ذكاء القطاع" subtitle={`رؤى خاصة بـ ${intelligence.industryInsights.industryNameAr}`} accentColor="gold">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <DataCard label="التوجهات" value={intelligence.industryInsights.trends.slice(0, 3).join(' | ')} />
          <DataCard label="الألوان المقترحة" value={intelligence.industryInsights.recommendedColors.join(' | ')} />
        </div>
        {intelligence.industryInsights.competitors.length > 0 && (
          <div className="mb-4">
            <div className="text-gold text-xs font-bold mb-2">أبرز المنافسين</div>
            <div className="flex flex-wrap gap-2">
              {intelligence.industryInsights.competitors.slice(0, 6).map((c, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-white/[0.04] text-silver text-xs border border-white/[0.06]">{c}</span>
              ))}
            </div>
          </div>
        )}
        <div className="bg-gold/5 rounded-xl p-4 border border-gold/15">
          <div className="text-gold text-xs font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> نصائح
          </div>
          <ul className="text-silver text-xs space-y-1.5">
            {intelligence.industryInsights.tips.map((t, i) => <li key={i}>&#10003; {t}</li>)}
          </ul>
        </div>
      </Section>

      {/* ═══ PROJECT PHASES ═══ */}
      <Section id="phases" icon={<Layers className="w-5 h-5 text-[#639FAB]" />} title="مراحل المشروع" subtitle="خارطة الطريق من الفكرة للتسليم" accentColor="blue">
        <div className="space-y-3">
          {intelligence.projectPhases.map((phase, i) => (
            <PhaseCard key={i} phase={phase} index={i} total={intelligence.projectPhases.length} />
          ))}
        </div>
      </Section>

      {/* ═══ UPSELL RECOMMENDATIONS ═══ */}
      {intelligence.upsellRecommendations.length > 0 && (
        <Section id="upsells" icon={<Sparkles className="w-5 h-5 text-gold" />} title="خدمات تكميلية" subtitle="عناصر تزيد من قيمة هويتك" accentColor="gold">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intelligence.upsellRecommendations.map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04] flex gap-3">
                <div className="text-2xl flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="text-warm text-sm font-bold mb-1">{item.title}</div>
                  <div className="text-silver text-xs leading-5 mb-1.5">{item.description}</div>
                  {item.price && <div className="text-gold text-xs font-bold">{item.price}</div>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ═══ CONTRACT TERMS ═══ */}
      <Section id="contract" icon={<Scale className="w-5 h-5 text-gold" />} title="شروط التعاقد القانونية" subtitle="عقد احترافي يحمي الطرفين" accentColor="gold">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          <div>
            <h4 className="text-gold text-sm font-bold mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> التزامات المصمم
            </h4>
            <ul className="text-silver text-xs space-y-2">
              {intelligence.contractTerms.designerObligations.map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-gold mt-0.5 flex-shrink-0" /> {o}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-gold text-sm font-bold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> التزامات العميل
            </h4>
            <ul className="text-silver text-xs space-y-2">
              {intelligence.contractTerms.clientObligations.map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-gold mt-0.5 flex-shrink-0" /> {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <DataCard label="التعديلات" value={intelligence.contractTerms.revisionPolicy.split('.')[0]} small />
          <DataCard label="التسليم" value={tier.time} small />
          <DataCard label="الدفع" value="50% مقدم" small />
          <DataCard label="الملكية" value="بعد السداد" small />
        </div>

        <div className="space-y-3">
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
            <div className="text-gold text-xs font-bold mb-2 flex items-center gap-2">
              <Handshake className="w-3.5 h-3.5" /> شروط الدفع
            </div>
            <p className="text-silver text-xs leading-6">{intelligence.contractTerms.paymentTerms}</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
            <div className="text-gold text-xs font-bold mb-2 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> شرط الملكية الفكرية
            </div>
            <p className="text-silver text-xs leading-6">{intelligence.contractTerms.copyrightClause}</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
            <div className="text-gold text-xs font-bold mb-2 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> شرط السرية
            </div>
            <p className="text-silver text-xs leading-6">{intelligence.contractTerms.confidentialityClause}</p>
          </div>
          <div className="bg-[#A61C1C]/8 rounded-xl p-4 border border-[#A61C1C]/15">
            <div className="text-[#FF7373] text-xs font-bold mb-2 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" /> سياسة الإلغاء
            </div>
            <p className="text-silver text-xs leading-6 whitespace-pre-line">{intelligence.contractTerms.cancellationPolicy}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
              <div className="text-mid text-[10px] mb-1 flex items-center gap-1"><Gavel className="w-3 h-3" /> القانون الحاكم</div>
              <div className="text-silver text-xs">{intelligence.contractTerms.governingLaw}</div>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
              <div className="text-mid text-[10px] mb-1 flex items-center gap-1"><FileText className="w-3 h-3" /> حل النزاعات</div>
              <div className="text-silver text-xs">{intelligence.contractTerms.disputeResolution}</div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ ACTIONS ═══ */}
      <div className="mt-10 space-y-4">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gold/30 bg-transparent text-gold font-cairo text-sm cursor-pointer transition-all hover:bg-gold/8 ${copyFeedback ? 'bg-gold/15 !border-gold' : ''}`}
            onClick={onCopy}
          >
            <Copy className="w-4 h-4" />
            {copyFeedback ? 'تم النسخ!' : 'نسخ البريف'}
          </button>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gold/30 bg-transparent text-gold font-cairo text-sm cursor-pointer transition-all hover:bg-gold/8"
            onClick={onPrint}
          >
            <Printer className="w-4 h-4" /> طباعة PDF
          </button>
        </div>

        <div className="text-center">
          <button className="btn-gold text-lg px-16 py-6" onClick={onWhatsApp}>
            <MessageCircle className="w-6 h-6" />
            إرسال عبر واتس آب
          </button>
        </div>

        <div className="text-center">
          <button className="btn-outline text-sm py-2 px-6" onClick={onBack}>
            <ChevronDown className="w-4 h-4 inline-block ml-1 rotate-90" />
            العودة للتعديل
          </button>
        </div>

        <p className="text-mid text-xs text-center mt-6 pb-8">
          MA DESIGN STUDIO -- Mohamed Adel
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ───

function CrossInsightCard({ insight }: { insight: CrossQuestionInsight }) {
  const impactColor = insight.impact === 'high' ? 'text-[#FF7373] border-[#A61C1C]/30' :
    insight.impact === 'medium' ? 'text-[#E8D095] border-gold/30' : 'text-[#639FAB] border-[#639FAB]/30';
  const impactLabel = insight.impact === 'high' ? 'تأثير عالي' :
    insight.impact === 'medium' ? 'تأثير متوسط' : 'تأثير منخفض';

  return (
    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-warm text-sm font-bold">{insight.title}</h4>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex-shrink-0 ${impactColor}`}>{impactLabel}</span>
      </div>
      <p className="text-silver text-xs leading-6 mb-3">{insight.description}</p>
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className="text-mid text-[10px]">مرتبط بـ:</span>
        {insight.relatedQuestions.map(q => (
          <span key={q} className="px-2 py-0.5 rounded-full bg-gold/8 text-gold-light text-[10px] border border-gold/15">{q}</span>
        ))}
      </div>
      <div className="bg-gold/5 rounded-lg px-3 py-2 border border-gold/15">
        <div className="text-gold text-[10px] font-bold mb-0.5">التوصية</div>
        <p className="text-silver text-xs leading-5">{insight.recommendation}</p>
      </div>
    </div>
  );
}

function PhaseCard({ phase, index, total }: { phase: ProjectPhase; index: number; total: number }) {
  const isLast = index === total - 1;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center border border-gold/30 text-gold font-bold text-sm font-cairo">
          {index + 1}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gold/20 my-1" />}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-warm text-sm font-bold font-cairo">{phase.nameAr}</span>
          <span className="text-mid text-xs">{phase.duration}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {phase.deliverables.map((d, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-white/[0.04] text-silver text-[10px] border border-white/[0.06]">{d}</span>
          ))}
        </div>
        {phase.dependencies.length > 0 && (
          <div className="text-mid text-[10px]">
            يعتمد على: {phase.dependencies.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
