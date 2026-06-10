import { useState, useCallback, useRef, useEffect } from 'react';
import {
  BrandAnswers,
  TierDecision,
  BrandIntelligence,
  egyptianGovernorates,
  timeSlots,
  industrySubQuestions,
  stageSubQuestions,
  SubQuestion,
} from './engine/types';
import { questions } from './engine/questions';
import { calculateTier, generateBrandIntelligence } from './engine/analyzer';
import { checkContent } from './engine/moderation';
import ProgressBar from './components/ProgressBar';
import Header from './components/Header';
import ChoiceCard from './components/ChoiceCard';
import ColorCard from './components/ColorCard';
import ResultPage from './components/ResultPage';
import ReviewPage from './components/ReviewPage';
import {
  ArrowLeft, Sparkles, ChevronRight,
  Ban, Clock, MapPin,
} from 'lucide-react';

const initialAnswers: BrandAnswers = {
  brandName: '',
  brandActivity: '',
  slogan: '',
  industry: '',
  industryOther: '',
  industrySubField: '',
  projectStage: '',
  stageChallenge: '',
  vision: '',
  targetAudience: [],
  audienceAge: [],
  audienceGender: '',
  audienceEconomic: '',
  geography: '',
  governorate: '',
  businessSize: '',
  pricePosition: '',
  competitors: '',
  brandPersonality: [],
  brandArchetype: '',
  logoDirection: '',
  preferredColors: [],
  forbiddenColors: '',
  deliverableScope: '',
  previousExperience: '',
  visualHistory: '',
  applicationChannels: [],
  typographyStyle: '',
  typographyDetail: '',
  investmentPhilosophy: '',
  budgetRange: '',
  referenceFiles: [],
  referenceLinks: '',
  timeline: '',
  timelineDays: 21,
  timelineSlot: '',
  additionalServices: [],
  additionalNotes: '',
};

// Steps: 0=intro, 1..N=questions, N+1=review, N+2=result
type AppStep = 'intro' | 'question' | 'sub-question' | 'review' | 'result';

export default function App() {
  const [appStep, setAppStep] = useState<AppStep>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<BrandAnswers>(initialAnswers);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [tierDecision, setTierDecision] = useState<TierDecision | null>(null);
  const [intelligence, setIntelligence] = useState<BrandIntelligence | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [moderationError, setModerationError] = useState<{ message: string; field: string } | null>(null);
  const [currentSubQuestions, setCurrentSubQuestions] = useState<SubQuestion[]>([]);
  const [subQIndex, setSubQIndex] = useState(0);
  const [showGovernorate, setShowGovernorate] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const visibleQuestions = questions.filter(q => {
    if (q.conditionalShow) return q.conditionalShow(answers);
    if (q.type === 'governorate') return showGovernorate;
    return true;
  });

  const totalVisible = visibleQuestions.length;
  const currentQuestion = visibleQuestions[qIndex];

  const triggerAnim = useCallback(() => setAnimKey(prev => prev + 1), []);

  useEffect(() => {
    if (screenRef.current) screenRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [qIndex, appStep, subQIndex]);

  useEffect(() => {
    setShowGovernorate(answers.geography?.includes('محلي') || false);
    if (!answers.geography?.includes('محلي')) {
      setAnswers(prev => ({ ...prev, governorate: '' }));
    }
  }, [answers.geography]);

  const handleTextChange = useCallback((value: string, fieldName: string, setter: (v: string) => void) => {
    setter(value);
    if (value.length > 3) {
      const result = checkContent(value);
      if (!result.isClean && result.severity === 'critical') {
        setModerationError({ message: result.message, field: fieldName });
      } else {
        setModerationError(null);
      }
    }
  }, []);

  const handleSingleChoice = useCallback((key: keyof BrandAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleMultiChoice = useCallback((key: keyof BrandAnswers, value: string) => {
    setAnswers(prev => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  }, []);

  const handleColorToggle = useCallback((colorName: string) => {
    setSelectedColors(prev => {
      const next = prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName];
      setAnswers(a => ({ ...a, preferredColors: next }));
      return next;
    });
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const names = Array.from(files).map(f => f.name);
      setAnswers(prev => ({ ...prev, referenceFiles: names }));
    }
  }, []);

  const goNext = useCallback(() => {
    if (!currentQuestion) return;

    // Check for industry sub-questions
    if (currentQuestion.answerKey === 'industry' && answers.industry) {
      const industryVal = currentQuestion.options?.find(o => o.label === answers.industry)?.value;
      if (industryVal && industrySubQuestions[industryVal]) {
        setCurrentSubQuestions(industrySubQuestions[industryVal]);
        setSubQIndex(0);
        setAppStep('sub-question');
        triggerAnim();
        setModerationError(null);
        return;
      }
    }

    // Check for stage sub-questions
    if (currentQuestion.answerKey === 'projectStage' && answers.projectStage) {
      let stageKey = '';
      if (answers.projectStage.includes('ناشئ')) stageKey = 'startup';
      else if (answers.projectStage.includes('إعادة')) stageKey = 'rebrand';
      else if (answers.projectStage.includes('ناجح') || answers.projectStage.includes('عناصر')) stageKey = 'established';

      if (stageKey && stageSubQuestions[stageKey]) {
        setCurrentSubQuestions([stageSubQuestions[stageKey]]);
        setSubQIndex(0);
        setAppStep('sub-question');
        triggerAnim();
        setModerationError(null);
        return;
      }
    }

    // Skip governorate question if not local
    if (qIndex + 1 < totalVisible) {
      setQIndex(qIndex + 1);
      triggerAnim();
    } else {
      setAppStep('review');
      triggerAnim();
    }
    setModerationError(null);
  }, [qIndex, totalVisible, currentQuestion, answers, triggerAnim]);

  const goPrev = useCallback(() => {
    if (appStep === 'sub-question') {
      if (subQIndex > 0) {
        setSubQIndex(subQIndex - 1);
      } else {
        setAppStep('question');
      }
      triggerAnim();
      return;
    }
    if (appStep === 'review') {
      setAppStep('question');
      triggerAnim();
      return;
    }
    if (appStep === 'result') {
      setAppStep('review');
      triggerAnim();
      return;
    }
    if (qIndex > 0) {
      setQIndex(qIndex - 1);
      triggerAnim();
    }
  }, [appStep, qIndex, subQIndex, triggerAnim]);

  const handleShowResult = useCallback(() => {
    const tier = calculateTier(answers);
    const intel = generateBrandIntelligence(answers);
    setTierDecision(tier);
    setIntelligence(intel);
    setAppStep('result');
    triggerAnim();
  }, [answers, triggerAnim]);

  const handleCopy = useCallback(() => {
    if (!tierDecision || !intelligence) return;
    let text = '═══════════════════════════════════════\n';
    text += '   BRAND STRATEGY INTELLIGENCE BRIEF\n';
    text += '   MA DESIGN STUDIO\n';
    text += '═══════════════════════════════════════\n\n';
    text += `الباقة: ${tierDecision.tier}\n`;
    text += `السعر: ${tierDecision.price}\n`;
    text += `النطاق: ${tierDecision.range}\n`;
    text += `التسليم: ${tierDecision.time}\n`;
    text += `المقدم: ${tierDecision.deposit}\n`;
    text += `العملة: ${tierDecision.currency}\n\n`;
    text += `DNA: ${intelligence.brandDNA.archetype}\n`;
    text += `التوجه: ${intelligence.recommendedStyle}\n`;
    text += `الألوان: ${intelligence.recommendedPalette}\n`;
    text += `الخطوط: ${intelligence.recommendedTypography}\n`;
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    });
  }, [tierDecision, intelligence]);

  const handleWhatsApp = useCallback(() => {
    if (!tierDecision) return;
    let text = '*بريف استراتيجية الهوية البصرية*\n';
    text += '═════════════════\n';
    text += `*الباقة:* ${tierDecision.tier}\n`;
    text += `*السعر:* ${tierDecision.price}\n`;
    text += `*التسليم:* ${tierDecision.time}\n`;
    text += `*المقدم:* ${tierDecision.deposit}\n`;
    if (tierDecision.rushNote) text += `*ملاحظة:* ${tierDecision.rushNote}\n`;
    text += '═════════════════\n';
    window.open('https://wa.me/201152048938?text=' + encodeURIComponent(text), '_blank');
  }, [tierDecision]);

  // ─── Progress calculation ───
  const getProgress = () => {
    if (appStep === 'intro') return 0;
    if (appStep === 'result') return 100;
    if (appStep === 'review') return 95;
    return Math.round(((qIndex + 1) / totalVisible) * 90);
  };

  // ─── Render Intro ───
  const renderIntro = () => (
    <div key={animKey} className="animate-slide-up relative">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Sparkles className="w-16 h-16 text-gold" style={{ filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.5))' }} />
          <div className="absolute inset-0 animate-ping opacity-20">
            <Sparkles className="w-16 h-16 text-gold" />
          </div>
        </div>
      </div>

      <div className="font-display text-[13px] tracking-[4px] text-gold uppercase mb-6 font-bold text-center">
        Brand Intelligence Brief
      </div>

      <h1 className="font-cairo text-[clamp(32px,5vw,54px)] font-bold leading-tight mb-5 text-center">
        هندسة الهوية البصرية السينمائية
        <br />
        <span className="text-gradient-gold">تبدأ من فهم عميق لعقليتك وطموحك.</span>
      </h1>

      <p className="text-mid text-base leading-8 mb-12 font-light max-w-[580px] text-center">
        مرحباً بك في استديو MA. استبيان ذكي مصمم خصيصاً لفهم رؤيتك وطموحك البصري،
        وتحليل متطلباتك لتقديم عرض احترافي يليق بمشروعك.
      </p>

      <div className="flex gap-8 mb-14 flex-wrap justify-center">
        {[
          'تحليل ذكي مترابط',
          'تسعير شفاف ومحدد',
          'عقد قانوني احترافي',
        ].map(text => (
          <div key={text} className="flex items-center gap-2.5 text-silver text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-gold" />
            {text}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="btn-gold relative overflow-hidden group" onClick={() => { setAppStep('question'); setQIndex(0); triggerAnim(); }}>
          <span className="relative z-10 flex items-center gap-3">
            ابدأ الآن
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );

  // ─── Render Timeline Slider ───
  const renderTimelineSlider = () => {
    const days = typeof answers.timelineDays === 'number' ? answers.timelineDays : 21;
    const min = 1;
    const max = 30;
    let priceMultiplier = 1;
    let qualityLabel = '';
    let qualityColor = '';

    if (days <= 3) { priceMultiplier = 1.75; qualityLabel = 'خطير — جودة منخفضة جداً'; qualityColor = 'text-[#FF7373]'; }
    else if (days <= 7) { priceMultiplier = 1.4; qualityLabel = 'مضغوط — جودة مقبولة'; qualityColor = 'text-[#E8D095]'; }
    else if (days <= 14) { priceMultiplier = 1.1; qualityLabel = 'جيد — وقت كافٍ'; qualityColor = 'text-[#A3E2C9]'; }
    else { priceMultiplier = 1; qualityLabel = 'مثالي — أفضل جودة ممكنة'; qualityColor = 'text-[#A3E2C9]'; }

    const basePrice = 3000;
    const estimatedPrice = Math.round(basePrice * priceMultiplier);

    return (
      <div className="mb-7 space-y-6">
        <div className="text-center">
          <div className="text-6xl font-black text-warm mb-1">{days}</div>
          <div className="text-mid text-sm">يوم عمل</div>
        </div>

        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            value={days}
            onChange={e => setAnswers(prev => ({ ...prev, timelineDays: parseInt(e.target.value) }))}
            className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(201,168,76,0.5)]
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold-light"
            style={{
              background: `linear-gradient(to left, #C9A84C ${((max - days) / max) * 100}%, rgba(255,255,255,0.05) ${((max - days) / max) * 100}%)`,
            }}
          />
          <div className="flex justify-between text-mid text-[10px] mt-2">
            <span>1 يوم</span>
            <span>7 أيام</span>
            <span>14 يوم</span>
            <span>30 يوم</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.04]">
            <div className="text-mid text-[10px] mb-1">تأثير الجودة</div>
            <div className={`${qualityColor} text-sm font-bold`}>{qualityLabel}</div>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.04]">
            <div className="text-mid text-[10px] mb-1">تأثير السعر</div>
            <div className="text-gold-light text-sm font-bold">
              {priceMultiplier > 1 ? `+${Math.round((priceMultiplier - 1) * 100)}%` : 'لا علاوة'}
            </div>
          </div>
        </div>

        <div className="bg-gold/5 rounded-xl p-4 border border-gold/15 text-center">
          <div className="text-mid text-[10px] mb-1">التكلفة التقديرية لهذا الوقت</div>
          <div className="text-gold text-xl font-bold">{estimatedPrice.toLocaleString()} ج.م</div>
          <div className="text-mid text-[10px] mt-1">التكلفة النهائية تعتمد على الباقة والقطاع</div>
        </div>
      </div>
    );
  };

  // ─── Render Budget Page ───
  const renderBudgetOptions = () => {
    const budgetOptions = [
      { label: 'اقتصادية (أقل من 3,000 ج.م)', value: 'economical', weight: 1, desc: 'للمشاريع الناشئة أو التجريبية' },
      { label: 'متوسطة (3,000 - 7,000 ج.م)', value: 'medium', weight: 2, desc: 'للهوية المتوازنة والاحترافية' },
      { label: 'جيدة (7,000 - 12,000 ج.م)', value: 'good', weight: 3, desc: 'للهوية الشاملة والمتكاملة' },
      { label: 'بريميوم (أكثر من 12,000 ج.م)', value: 'premium', weight: 4, desc: 'للفخامة المطلقة والتعقيد العميق' },
      { label: 'مفتوحة — حدد الأنسب لمشروعي', value: 'open', weight: 3, desc: 'النظام يحدد الباقة المثالية' },
    ];

    return (
      <div className="flex flex-col gap-3 mb-7">
        {budgetOptions.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setAnswers(prev => ({ ...prev, budgetRange: opt.value }))}
            className={`w-full px-6 py-4 rounded-xl border text-right font-cairo cursor-pointer
              select-none flex flex-col gap-1 transition-all duration-250 ease-out
              ${answers.budgetRange === opt.value
                ? 'border-gold bg-gold/12 text-gold-light font-semibold gold-border-glow'
                : 'border-white/8 bg-white/2 text-silver hover:border-gold hover:text-warm hover:bg-gold/5'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="leading-relaxed text-[15px]">{opt.label}</span>
              <span className={`text-base ${answers.budgetRange === opt.value ? 'text-gold' : 'text-white/20'}`}>
                {answers.budgetRange === opt.value ? '✦' : '○'}
              </span>
            </div>
            <span className="text-mid text-xs">{opt.desc}</span>
          </button>
        ))}
      </div>
    );
  };

  // ─── Render Governorate Select ───
  const renderGovernorateSelect = () => (
    <div className="mb-7 animate-slide-up">
      <label className="block text-gold text-sm font-semibold mb-3">
        <MapPin className="w-4 h-4 inline-block ml-2" />
        اختر المحافظة الرئيسية:
      </label>
      <select
        className="input-field cursor-pointer"
        value={answers.governorate}
        onChange={e => setAnswers(prev => ({ ...prev, governorate: e.target.value }))}
      >
        <option value="">اختر المحافظة...</option>
        {egyptianGovernorates.map(gov => (
          <option key={gov} value={gov}>{gov}</option>
        ))}
      </select>
    </div>
  );

  // ─── Render Time Slot Select ───
  const renderTimeSlotSelect = () => (
    <div className="mb-7 animate-slide-up">
      <label className="block text-gold text-sm font-semibold mb-3">
        <Clock className="w-4 h-4 inline-block ml-2" />
        اختر الفترة الزمنية المناسبة للتواصل:
      </label>
      <div className="flex flex-col gap-3">
        {timeSlots.map(slot => (
          <ChoiceCard
            key={slot}
            label={slot}
            selected={answers.timelineSlot === slot}
            onClick={() => handleSingleChoice('timelineSlot', slot)}
          />
        ))}
      </div>
    </div>
  );

  // ─── Render Single Question ───
  const renderQuestion = (q: typeof questions[0]) => {
    if (!q) return null;

    return (
      <div key={animKey} className="animate-slide-up relative">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-8 overflow-hidden">
          {visibleQuestions.slice(Math.max(0, qIndex - 3), Math.min(qIndex + 4, totalVisible)).map((vq, i) => {
            const actualI = Math.max(0, qIndex - 3) + i;
            return (
              <div
                key={vq.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  actualI === qIndex ? 'w-6 bg-gold' :
                  actualI < qIndex ? 'bg-gold/40 w-1.5' : 'bg-white/8 w-1.5'
                }`}
              />
            );
          })}
        </div>

        <div className="font-display text-[13px] text-gold tracking-[3px] mb-6 flex items-center gap-4">
          السؤال {String(qIndex + 1).padStart(2, '0')} من {totalVisible}
          <div className="flex-1 h-px bg-gradient-to-l from-gold/25 to-transparent" />
        </div>
        <div className="deco-line" />

        <p className="font-cairo text-[clamp(20px,4vw,28px)] font-bold leading-relaxed mb-3 text-warm">
          {q.text}
        </p>
        <p className="text-mid text-sm leading-7 mb-10 font-light">{q.hint}</p>

        {q.type === 'single' && q.options && (
          <div className="flex flex-col gap-3 mb-7">
            {q.options.map(opt => (
              <ChoiceCard
                key={opt.label}
                label={opt.label}
                selected={answers[q.answerKey] === opt.label}
                onClick={() => handleSingleChoice(q.answerKey, opt.label)}
              />
            ))}
          </div>
        )}

        {q.type === 'multi' && q.options && (
          <div className="flex flex-col gap-3 mb-7">
            {q.options.map(opt => {
              const arr = (answers[q.answerKey] as string[]) || [];
              const isSelected = arr.includes(opt.label);
              // Skip "لا أحتاج" if other options are selected
              if (opt.label.includes('لا أحتاج') && arr.length > 0 && !isSelected) return null;
              return (
                <ChoiceCard
                  key={opt.label}
                  label={opt.label}
                  selected={isSelected}
                  onClick={() => {
                    if (opt.label.includes('لا أحتاج')) {
                      setAnswers(prev => ({ ...prev, [q.answerKey]: [opt.label] }));
                    } else {
                      handleMultiChoice(q.answerKey, opt.label);
                    }
                  }}
                  multi
                />
              );
            })}
          </div>
        )}

        {q.type === 'text' && (
          <div className="mb-7 space-y-4">
            {q.answerKey === 'brandName' && (
              <>
                <input
                  type="text"
                  className="input-field"
                  placeholder="اسم البراند أو الكيان التجاري..."
                  maxLength={100}
                  value={answers.brandName}
                  onChange={e => handleTextChange(e.target.value, 'اسم البراند', (v) => setAnswers(prev => ({ ...prev, brandName: v })))}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="طبيعة عمل النشاط..."
                  maxLength={150}
                  value={answers.brandActivity}
                  onChange={e => handleTextChange(e.target.value, 'النشاط', (v) => setAnswers(prev => ({ ...prev, brandActivity: v })))}
                />
              </>
            )}
            {q.answerKey === 'slogan' && (
              <input
                type="text"
                className="input-field"
                placeholder="الشعار اللفظي التسويقي..."
                maxLength={150}
                value={answers.slogan}
                onChange={e => handleTextChange(e.target.value, 'الشعار', (v) => setAnswers(prev => ({ ...prev, slogan: v })))}
              />
            )}
            {q.answerKey === 'industry' && (
              <>
                <div className="flex flex-col gap-3 mb-4">
                  {q.options?.map(opt => (
                    <ChoiceCard
                      key={opt.label}
                      label={opt.label}
                      selected={answers[q.answerKey] === opt.label}
                      onClick={() => handleSingleChoice(q.answerKey, opt.label)}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  className="input-field"
                  placeholder="أو اكتب المجال يدوياً..."
                  maxLength={100}
                  value={answers.industryOther}
                  onChange={e => handleTextChange(e.target.value, 'المجال', (v) => setAnswers(prev => ({ ...prev, industryOther: v })))}
                />
              </>
            )}
          </div>
        )}

        {q.type === 'textarea' && (
          <div className="mb-7">
            <textarea
              className="input-field"
              rows={3}
              placeholder={
                q.answerKey === 'vision' ? 'الرؤية والرسالة والقيم...' :
                q.answerKey === 'competitors' ? 'المنافسون الرئيسيون...' :
                'أي تفاصيل إضافية...'
              }
              value={answers[q.answerKey] as string || ''}
              onChange={e => handleTextChange(e.target.value, q.id, (v) => setAnswers(prev => ({ ...prev, [q.answerKey]: v })))}
            />
          </div>
        )}

        {q.type === 'color' && (
          <div className="mb-7">
            <ColorCard selectedColors={selectedColors} onToggle={handleColorToggle} />
            <input
              type="text"
              className="input-field"
              placeholder="ألوان ترفض استخدامها..."
              maxLength={150}
              value={answers.forbiddenColors}
              onChange={e => setAnswers(prev => ({ ...prev, forbiddenColors: e.target.value }))}
            />
          </div>
        )}

        {q.type === 'governorate' && renderGovernorateSelect()}
        {q.type === 'timeline-slot' && renderTimeSlotSelect()}
        {q.type === 'slider' && renderTimelineSlider()}
        {q.type === 'budget' && renderBudgetOptions()}

        {q.type === 'file' && (
          <div className="mb-7">
            <div className="text-gold text-[13px] mb-2 font-semibold">رفع ملفات مرجعية:</div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.ai,.psd"
              onChange={handleFileChange}
              className="input-field text-silver file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-cairo file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
            />
            {answers.referenceFiles.length > 0 && (
              <div className="mt-3 text-gold-light text-[13px]">
                الملفات: {(answers.referenceFiles as string[]).join(' | ')}
              </div>
            )}
            <textarea
              className="input-field mt-4"
              rows={2}
              placeholder="روابط ملهمة (Behance, Pinterest)..."
              value={answers.referenceLinks}
              onChange={e => handleTextChange(e.target.value, 'الروابط', (v) => setAnswers(prev => ({ ...prev, referenceLinks: v })))}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center mt-10 gap-4 flex-wrap justify-between sticky bottom-0 bg-charcoal/80 backdrop-blur-xl p-4 rounded-xl -mx-4">
          <button
            className="btn-outline flex items-center gap-2"
            onClick={goPrev}
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </button>
          <div className="text-mid text-sm">
            {qIndex + 1} / {totalVisible}
          </div>
          <button
            className="btn-gold flex items-center gap-2"
            onClick={goNext}
          >
            {qIndex === totalVisible - 1 ? 'مراجعة الإجابات' : 'التالي'}
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ─── Render Sub-Question ───
  const renderSubQuestion = () => {
    const sq = currentSubQuestions[subQIndex];
    if (!sq) return null;

    return (
      <div key={`sub-${animKey}`} className="animate-slide-up relative">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-gold" />
          <span className="text-gold text-sm font-bold font-cairo">سؤال تخصصي</span>
          <div className="flex-1 h-px bg-gradient-to-l from-gold/25 to-transparent" />
        </div>
        <div className="deco-line" />

        <p className="font-cairo text-2xl font-bold leading-relaxed mb-3 text-warm">
          {sq.text}
        </p>
        <p className="text-mid text-sm leading-7 mb-10 font-light">{sq.hint}</p>

        {sq.type === 'single' && sq.options && (
          <div className="flex flex-col gap-3 mb-7">
            {sq.options.map(opt => (
              <ChoiceCard
                key={opt.label}
                label={opt.label}
                selected={answers[sq.answerKey as keyof BrandAnswers] === opt.label}
                onClick={() => handleSingleChoice(sq.answerKey, opt.label)}
              />
            ))}
          </div>
        )}

        {sq.type === 'multi' && sq.options && (
          <div className="flex flex-col gap-3 mb-7">
            {sq.options.map(opt => {
              const arr = (answers[sq.answerKey as keyof BrandAnswers] as string[]) || [];
              return (
                <ChoiceCard
                  key={opt.label}
                  label={opt.label}
                  selected={arr.includes(opt.label)}
                  onClick={() => handleMultiChoice(sq.answerKey, opt.label)}
                  multi
                />
              );
            })}
          </div>
        )}

        <div className="flex items-center mt-10 gap-4 flex-wrap justify-between sticky bottom-0 bg-charcoal/80 backdrop-blur-xl p-4 rounded-xl -mx-4">
          <button className="btn-outline flex items-center gap-2" onClick={goPrev}>
            <ChevronRight className="w-4 h-4" /> السابق
          </button>
          <button className="btn-gold flex items-center gap-2" onClick={() => {
            if (subQIndex < currentSubQuestions.length - 1) {
              setSubQIndex(subQIndex + 1);
              triggerAnim();
            } else {
              setAppStep('question');
              goNext();
            }
          }}>
            التالي <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ─── Render Moderation Error ───
  const renderModerationError = () => {
    if (!moderationError) return null;
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
        <div className="glass-panel rounded-3xl p-10 max-w-lg text-center animate-slide-up border-2 border-red-500/50">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <Ban className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-3xl font-bold text-red-400 mb-4 font-cairo">
            تنبيه أمني
          </h3>
          <p className="text-silver leading-8 mb-6">
            {moderationError.message}
          </p>
          <div className="bg-red-500/10 rounded-xl p-4 mb-6">
            <p className="text-red-300 text-sm">
              الحقل المحظور: {moderationError.field}
            </p>
          </div>
          <button
            className="px-8 py-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all font-cairo font-bold"
            onClick={() => setModerationError(null)}
          >
            حسناً، سأقوم بالتعديل
          </button>
        </div>
      </div>
    );
  };

  // ─── Main Render ───
  const renderScreen = () => {
    if (moderationError) return null;

    switch (appStep) {
      case 'intro':
        return renderIntro();
      case 'question':
        return currentQuestion ? renderQuestion(currentQuestion) : null;
      case 'sub-question':
        return renderSubQuestion();
      case 'review':
        return (
          <ReviewPage
            answers={answers}
            onBack={goPrev}
            onProceed={handleShowResult}
          />
        );
      case 'result':
        if (!tierDecision || !intelligence) return null;
        return (
          <ResultPage
            answers={answers}
            tier={tierDecision}
            intelligence={intelligence}
            onCopy={handleCopy}
            onWhatsApp={handleWhatsApp}
            onPrint={() => window.print()}
            onBack={goPrev}
            copyFeedback={copyFeedback}
          />
        );
      default:
        return renderIntro();
    }
  };

  return (
    <div className="min-h-screen relative">
      {appStep !== 'intro' && (
        <>
          <ProgressBar current={getProgress()} total={100} />
          <Header currentStep={appStep === 'result' ? -1 : qIndex + 1} />
        </>
      )}

      <main
        ref={screenRef}
        className={`min-h-screen flex flex-col items-center justify-center px-4 md:px-6 relative z-[1] ${
          appStep === 'intro' ? 'pt-8 pb-8' :
          appStep === 'result' ? 'pt-28 pb-8' :
          'pt-36 pb-8'
        }`}
      >
        <div className={`w-full ${appStep === 'result' ? 'max-w-[860px]' : 'max-w-[720px]'}`}>
          {renderScreen()}
        </div>
      </main>

      {renderModerationError()}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          body::before { display: none !important; }
          .glass-panel { background: #f8f8f8 !important; border: 1px solid #ddd !important; }
          .text-gold, .text-gold-light { color: #C9A84C !important; }
          .text-warm, .text-silver, .text-mid { color: #333 !important; }
        }
      `}</style>
    </div>
  );
}
