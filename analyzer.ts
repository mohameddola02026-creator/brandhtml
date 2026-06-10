import {
  BrandAnswers,
  BrandIntelligence,
  BrandDNA,
  TierDecision,
  TierType,
  UpsellItem,
  ContractTerms,
  GeographyType,
  IndustryType,
  CrossQuestionInsight,
  ProjectPhase,
  TimelineImpact,
  BudgetAnalysis,
  ArchetypeAnalysis,
} from './types';
import { questions } from './questions';
import { detectIndustryFromLabel, calculateIndustryPriceMultiplier, getIndustryInsights } from './industryIntel';

const tierConfig: Record<TierType, Omit<TierDecision, 'deposit' | 'depositNumeric' | 'currency' | 'rushPremium' | 'rushNote'>> = {
  PREMIUM: {
    tier: 'بريميوم فاخر وعالي الجودة',
    tierAr: 'Premium Package',
    price: '5,000 ج.م',
    numericPrice: 5000,
    range: '4,500 ج.م - 6,000 ج.م',
    time: '14 إلى 21 يوم عمل',
    class: 'tier-PREMIUM',
    type: 'PREMIUM',
    features: ['شعار + 3 مفاهيم', 'دليل براند شامل', 'قرطاسية كاملة', 'تغليف منتجات', 'قوالب سوشيال', 'ملفات مصدرية'],
  },
  MEDIUM: {
    tier: 'متوسط ومتوازن باحترافية',
    tierAr: 'Standard Package',
    price: '3,000 ج.م',
    numericPrice: 3000,
    range: '2,500 ج.م - 3,500 ج.م',
    time: '7 إلى 12 يوم عمل',
    class: 'tier-MEDIUM',
    type: 'MEDIUM',
    features: ['شعار + 2 مفهوم', 'قرطاسية أساسية', 'قوالب سوشيال', 'ملفات مصدرية'],
  },
  BUDGET: {
    tier: 'اقتصادي وشعبي مرن وسريع',
    tierAr: 'Growth Package',
    price: '1,500 ج.م',
    numericPrice: 1500,
    range: '1,200 ج.م - 1,800 ج.م',
    time: '3 إلى 5 أيام عمل',
    class: 'tier-BUDGET',
    type: 'BUDGET',
    features: ['شعار + 1 مفهوم', 'كارت عمل', 'غلاف سوشيال', 'ملفات نهائية'],
  },
  MICRO: {
    tier: 'ميكرو - شعار منفصل وبسيط',
    tierAr: 'Micro Logo',
    price: '950 ج.م',
    numericPrice: 950,
    range: '750 ج.م - 1,100 ج.م',
    time: '2 إلى 4 أيام عمل',
    class: 'tier-MICRO',
    type: 'MICRO',
    features: ['شعار + 1 مفهوم', 'ملفات نهائية'],
  },
  STARTER: {
    tier: 'ناشئ - للبراندات الجديدة الناشئة',
    tierAr: 'Starter Package',
    price: '750 ج.م',
    numericPrice: 750,
    range: '600 ج.م - 900 ج.م',
    time: '5 إلى 7 أيام عمل',
    class: 'tier-STARTER',
    type: 'STARTER',
    features: ['شعار + 1 مفهوم', 'كارت عمل', 'غلاف سوشيال', 'استشارة توجيهية'],
  },
};

const tierConfigUSD: Record<TierType, Omit<TierDecision, 'deposit' | 'depositNumeric' | 'currency' | 'rushPremium' | 'rushNote'>> = {
  PREMIUM: {
    tier: 'بريميوم فاخر وعالي الجودة',
    tierAr: 'Premium Package',
    price: '$150',
    numericPrice: 150,
    range: '$120 - $180',
    time: '14 إلى 21 يوم عمل',
    class: 'tier-PREMIUM',
    type: 'PREMIUM',
    features: ['Logo + 3 concepts', 'Brand guidelines', 'Full stationery', 'Product packaging', 'Social templates', 'Source files'],
  },
  MEDIUM: {
    tier: 'متوسط ومتوازن باحترافية',
    tierAr: 'Standard Package',
    price: '$80',
    numericPrice: 80,
    range: '$65 - $95',
    time: '7 إلى 12 يوم عمل',
    class: 'tier-MEDIUM',
    type: 'MEDIUM',
    features: ['Logo + 2 concepts', 'Basic stationery', 'Social templates', 'Source files'],
  },
  BUDGET: {
    tier: 'اقتصادي وشعبي مرن وسريع',
    tierAr: 'Growth Package',
    price: '$40',
    numericPrice: 40,
    range: '$35 - $50',
    time: '3 إلى 5 أيام عمل',
    class: 'tier-BUDGET',
    type: 'BUDGET',
    features: ['Logo + 1 concept', 'Business card', 'Social cover', 'Final files'],
  },
  MICRO: {
    tier: 'ميكرو - شعار منفصل وبسيط',
    tierAr: 'Micro Logo',
    price: '$25',
    numericPrice: 25,
    range: '$20 - $35',
    time: '2 إلى 4 أيام عمل',
    class: 'tier-MICRO',
    type: 'MICRO',
    features: ['Logo + 1 concept', 'Final files'],
  },
  STARTER: {
    tier: 'ناشئ - للبراندات الجديدة الناشئة',
    tierAr: 'Starter Package',
    price: '$20',
    numericPrice: 20,
    range: '$15 - $30',
    time: '5 إلى 7 أيام عمل',
    class: 'tier-STARTER',
    type: 'STARTER',
    features: ['Logo + 1 concept', 'Business card', 'Social cover', 'Consultation'],
  },
};

function getSelectedWeight(answers: BrandAnswers, key: keyof BrandAnswers): number {
  const question = questions.find(q => q.answerKey === key);
  if (!question?.options) return 0;
  const selectedValue = answers[key];
  if (Array.isArray(selectedValue)) {
    return question.options
      .filter(o => (selectedValue as string[]).includes(o.label))
      .reduce((sum, o) => sum + o.weight, 0);
  }
  const match = question.options.find(o => o.label === selectedValue);
  return match?.weight ?? 0;
}

function getSelectedTier(answers: BrandAnswers): TierType | null {
  const question = questions.find(q => q.answerKey === 'deliverableScope');
  if (!question?.options) return null;
  const selectedValue = answers.deliverableScope;
  const match = question.options.find(o => o.label === selectedValue);
  return match?.tier ?? null;
}

function getGeographyType(answers: BrandAnswers): GeographyType {
  const geo = answers.geography || '';
  if (geo.includes('عالمي') || geo.includes('قارات') || geo.includes('متعددة')) return 'international';
  if (geo.includes('إقليمي') || geo.includes('خليج') || geo.includes('شرق الأوسط')) return 'regional';
  return 'local';
}

function getIndustryType(answers: BrandAnswers): IndustryType {
  const industry = answers.industry || '';
  const other = answers.industryOther || '';
  return detectIndustryFromLabel(industry + ' ' + other);
}

function isRushRequest(answers: BrandAnswers): boolean {
  const days = answers.timelineDays;
  if (typeof days === 'number' && days <= 7) return true;
  const timeline = answers.timeline || '';
  return timeline.includes('سريع') || timeline.includes('فوري');
}

function isStarterClient(answers: BrandAnswers): boolean {
  const stage = answers.projectStage || '';
  const invest = answers.investmentPhilosophy || '';
  const pricePos = answers.pricePosition || '';
  const budget = answers.budgetRange || '';
  const aud = answers.targetAudience || [];

  const isStarter = stage.includes('ناشئ') ||
    invest.includes('اقتصادية') ||
    invest.includes('أقل تكلفة') ||
    pricePos.includes('اقتصادي') ||
    pricePos.includes('شعبي') ||
    budget === 'economical';

  const hasYoungAudience = Array.isArray(aud) && aud.some(a => a.includes('جيل الألفية') || a.includes('عائلات'));

  return isStarter || (hasYoungAudience && !invest.includes('استثماري'));
}

function isPremiumClient(answers: BrandAnswers): boolean {
  const pricePos = answers.pricePosition || '';
  const invest = answers.investmentPhilosophy || '';
  const personality = answers.brandPersonality || [];
  const aud = answers.targetAudience || [];
  const color = answers.preferredColors || [];
  const typography = answers.typographyStyle || '';
  const budget = answers.budgetRange || '';
  const economic = answers.audienceEconomic || '';

  let score = 0;
  if (pricePos.includes('لاكشري') || pricePos.includes('حصري')) score += 3;
  if (pricePos.includes('بريميوم') || pricePos.includes('راقي')) score += 2;
  if (invest.includes('أصل استثماري') || invest.includes('مستعد لإنفاق')) score += 3;
  if (Array.isArray(personality) && personality.some(p => p.includes('ملكي') || p.includes('فاخر'))) score += 2;
  if (Array.isArray(aud) && aud.some(a => a.includes('نخبة') || a.includes('VIP'))) score += 2;
  if (Array.isArray(color) && color.some(c => c.includes('royal') || c.includes('dark-luxury'))) score += 1;
  if (typography.includes('سيرف') || typography.includes('كاليجرافي')) score += 1;
  if (budget === 'premium') score += 2;
  if (economic.includes('A+') || economic.includes('نخبة')) score += 2;

  return score >= 5;
}

function calculateAverageWeight(answers: BrandAnswers): number {
  const weightedKeys: (keyof BrandAnswers)[] = [
    'industry', 'projectStage', 'targetAudience', 'geography',
    'pricePosition', 'brandPersonality', 'logoDirection',
    'applicationChannels', 'typographyStyle', 'investmentPhilosophy',
    'audienceEconomic', 'businessSize',
  ];
  let total = 0;
  let count = 0;
  for (const key of weightedKeys) {
    const w = getSelectedWeight(answers, key);
    if (w > 0) { total += w; count++; }
  }
  return count > 0 ? total / count : 2;
}

// ─── Timeline Impact ───
function calculateTimelineImpact(answers: BrandAnswers, tier: TierType): TimelineImpact {
  const days = typeof answers.timelineDays === 'number' ? answers.timelineDays : 21;
  const optimalMap: Record<TierType, number> = { PREMIUM: 18, MEDIUM: 10, BUDGET: 5, MICRO: 3, STARTER: 6 };
  const optimal = optimalMap[tier] || 14;

  let rushMultiplier = 1;
  let qualityImpact = '';
  let priceImpact = '';
  let recommendation = '';

  if (days <= 3) {
    rushMultiplier = 1.75;
    qualityImpact = 'خطير — الوقت لا يكفي لبحث استراتيجي عميق. النتيجة قد تكون دون الإمكانات الحقيقية.';
    priceImpact = '+75% علاوة استعجال — يتطلب أولوية قصوى وتجاوز أعمال أخرى.';
    recommendation = 'ننصح بشدة بتمديد الوقت لـ 7 أيام على الأقل لضمان جودة مقبولة.';
  } else if (days <= 7) {
    rushMultiplier = 1.4;
    qualityImpact = 'مقبول لكن مضغوط — يسمح بتنفيذ سريع مع تضحيات في العمق الاستراتيجي.';
    priceImpact = '+40% علاوة تسريع — أولوية عالية في الجدول.';
    recommendation = 'يمكن العمل بهذا الوقت لكن 10-14 يوم سيعطي نتيجة أفضل بكثير.';
  } else if (days <= 14) {
    rushMultiplier = 1.1;
    qualityImpact = 'جيد — وقت كافٍ لتنفيذ احترافي مع مراجعات.';
    priceImpact = '+10% تعجيل خفيف.';
    recommendation = 'وقت مناسب. 14-21 يوم مثالي لأفضل نتيجة.';
  } else {
    rushMultiplier = 1;
    qualityImpact = 'مثالي — يتيح بحثاً عميقاً وتفاصيل دقيقة وتجارب متعددة.';
    priceImpact = 'لا توجد علاوة إضافية — السعر الأساسي.';
    recommendation = 'هذا الوقت المثالي لنتيجة استثنائية!';
  }

  return {
    selectedDays: days,
    optimalDays: optimal,
    rushMultiplier,
    qualityImpact,
    priceImpact,
    recommendation,
  };
}

// ─── Budget Analysis ───
function calculateBudgetAnalysis(answers: BrandAnswers, tier: TierDecision): BudgetAnalysis {
  const budget = answers.budgetRange || '';
  const currency = tier.currency;
  const price = tier.numericPrice;

  const rangeMap: Record<string, { range: string; rangeAr: string }> = {
    'economical': { range: 'Economical', rangeAr: 'اقتصادية (أقل من 3,000 ج.م)' },
    'medium': { range: 'Medium', rangeAr: 'متوسطة (3,000 - 7,000 ج.م)' },
    'good': { range: 'Good', rangeAr: 'جيدة (7,000 - 12,000 ج.م)' },
    'premium': { range: 'Premium', rangeAr: 'بريميوم (أكثر من 12,000 ج.م)' },
    'open': { range: 'Open', rangeAr: 'مفتوحة — نحدد الأنسب' },
  };

  const selected = rangeMap[budget] || rangeMap['open'];

  const deliverablePrices: { item: string; price: string }[] = [];
  if (tier.type === 'PREMIUM' || tier.type === 'MEDIUM') {
    const fmt = (n: number) => currency === 'USD' ? `$${n}` : `${n.toLocaleString()} ج.م`;
    deliverablePrices.push(
      { item: 'تصميم الشعار', price: fmt(Math.round(price * 0.35)) },
      { item: 'دليل البراند', price: fmt(Math.round(price * 0.15)) },
      { item: 'القرطاسية', price: fmt(Math.round(price * 0.15)) },
      { item: 'السوشيال', price: fmt(Math.round(price * 0.15)) },
      { item: 'التغليف', price: fmt(Math.round(price * 0.2)) },
    );
  } else {
    const fmt = (n: number) => currency === 'USD' ? `$${n}` : `${n.toLocaleString()} ج.م`;
    deliverablePrices.push(
      { item: 'تصميم الشعار', price: fmt(Math.round(price * 0.5)) },
      { item: 'المطبوعات', price: fmt(Math.round(price * 0.3)) },
      { item: 'السوشيال', price: fmt(Math.round(price * 0.2)) },
    );
  }

  const valueScore = Math.min(100, Math.round(
    (tier.type === 'PREMIUM' ? 90 : tier.type === 'MEDIUM' ? 75 : tier.type === 'BUDGET' ? 60 : tier.type === 'STARTER' ? 80 : 50)
  ));

  const benchmarks: Record<string, string> = {
    'real_estate': 'مصممون في هذا القطاع يتقاضون 8,000-15,000 ج.م في مصر',
    'hospitality': 'المتوسط السوقي: 3,000-6,000 ج.م',
    'fashion': 'تصاميم الأزياء تبدأ من 5,000 ج.م للهوية المتكاملة',
    'technology': 'الوكالات التقنية تطلب 4,000-10,000 ج.م',
    'medical': 'المتوسط: 3,500-7,000 ج.م',
    'ecommerce': 'المتوسط: 2,000-5,000 ج.م',
    'other': 'المتوسط السوقي المصري: 2,500-6,000 ج.م',
  };
  const industry = getIndustryType(answers);

  return {
    range: selected.range,
    rangeAr: selected.rangeAr,
    suggestedPrice: price,
    currency,
    pricePerDeliverable: deliverablePrices,
    valueScore,
    competitorBenchmark: benchmarks[industry] || benchmarks['other'],
  };
}

// ─── Brand DNA / Archetype ───
function generateBrandDNA(answers: BrandAnswers): BrandDNA {
  const archetypeMap: Record<string, { icon: string; desc: string; tone: string; direction: string; colorPsych: string; typoPersonality: string; voice: string; diff: string }> = {
    'الحاكم': {
      icon: 'crown',
      desc: 'براند يسعى للسيطرة والقيادة — يعكس القوة والاستقرار والهيبة. العملاء يثقون به كمرجع.',
      tone: 'حازم ومؤثر',
      direction: 'هندسة بصرية صارمة مع عناصر ملكية وأشكال هندسية قوية',
      colorPsych: 'ذهبي (سلطة)، كحلي (ثقة)، أسود (قوة)',
      typoPersonality: 'سيرف كلاسيكي أو سان سيرف قوي ذو وزن ثقيل',
      voice: 'مؤكد وقيادي — يخاطب العقل والثقة',
      diff: 'الجمع بين الهيبة المؤسسية والأناقة البصرية',
    },
    'المبدع': {
      icon: 'palette',
      desc: 'براند يكرس للابتكار والتفرد — لا يكرر أحداً ويصنع عالمه البصري الخاص.',
      tone: 'ملهم ومبتكر',
      direction: 'تجريبي وجريء مع عناصر فنية فريدة وتركيبات غير تقليدية',
      colorPsych: 'تدرجات جريئة، ألوان غير متوقعة، تناقضات بصرية',
      typoPersonality: 'خطوط مخصصة ومبتكرة — كسر القواعد التقليدية',
      voice: 'خلاق ومتحرر — يخاطب الخيال والإلهام',
      diff: 'القدرة على خلق لغة بصرية لم تُرَ من قبل',
    },
    'البطل': {
      icon: 'shield',
      desc: 'براند يرمز للإنجاز والتفوق — يعد بالنتائج ويثبتها. يحفز العملاء للتطور.',
      tone: 'حافز ومؤثر',
      direction: 'قوي وديناميكي مع عناصر حركة وإنجاز — خطوط مائلة وأشكال صاعدة',
      colorPsych: 'أحمر (قوة)، أزرق (ثقة)، ذهبي (انجاز)',
      typoPersonality: 'سان سيرف قوي وديناميكي — يعبر عن الحركة',
      voice: 'مؤكد ومحفز — يخاطب الطموح والإنجاز',
      diff: 'الربط بين الهوية وبين قصة الإنجاز والتفوق',
    },
    'الحكيم': {
      icon: 'book-open',
      desc: 'براند يمثل المعرفة والخبرة — المصدر الموثوق الذي يلجأ إليه الجميع.',
      tone: 'راقٍ ومطلع',
      direction: 'كلاسيكي ورصين مع عناصر تراثية ومسافات فراغ مدروسة',
      colorPsych: 'كحلي (حكمة)، أخضر داكن (نمو)، بيج (استقرار)',
      typoPersonality: 'سيرف كلاسيكي — يعكس العراقة والعمق',
      voice: 'متعلم وموجه — يخاطب العقل والوعي',
      diff: 'الجمع بين العمق المعرفي والأناقة البصرية',
    },
    'المستكشف': {
      icon: 'compass',
      desc: 'براند يمثل الحرية والمغامرة — يكسر الروتين ويفتح آفاقاً جديدة.',
      tone: 'حر ومغامر',
      direction: 'مفتوح وفضائي مع عناصر طبيعية وأفقية — فراغ سلبي واسع',
      colorPsych: 'أخضر (طبيعة)، برتقالي (مغامرة)، سماوي (أفق)',
      typoPersonality: 'سان سيرف مفتوح وخفيف — يعبر عن الحرية',
      voice: 'مغامر ومحرر — يخاطب الفضول والاكتشاف',
      diff: 'خلق شعور بالرحلة والمغامرة في كل عنصر بصري',
    },
    'العاشق': {
      icon: 'heart',
      desc: 'براند يحتفل بالجمال والعاطفة — كل تفصيلة تعبر عن الحب والتقدير.',
      tone: 'دافئ وعاطفي',
      direction: 'ناعم وانسيابي مع منحنيات عضوية ولمسات عضوية',
      colorPsych: 'ذهبي (رقي)، وردي (عاطفة)، بيج (دفء)',
      typoPersonality: 'كاليجرافي أو سيرف ناعم — يعبر عن الأنوثة والرقي',
      voice: 'عاطفي ومغوي — يخاطب القلب والحواس',
      diff: 'إضفاء شعور بالرقي والعاطفة على كل نقطة تلامس',
    },
    'المرح': {
      icon: 'smile',
      desc: 'براند يضفي البهجة والمرح — لا يأخذ نفسه بجدية مفرطة ويعشق الإمتاع.',
      tone: 'مرح وخفيف',
      direction: 'حيوي وملون مع أشكال مستديرة وعناصر مرحة ومفاجئة',
      colorPsych: 'ألوان نابضة ومتباينة — أصفر، برتقالي، أزرق فاتح',
      typoPersonality: 'سان سيرف مستدير وخفيف — يعبر عن البهجة',
      voice: 'مرح وقريب — يخاطب البهجة والاستمتاع',
      diff: 'خلق تجربة ممتعة لا تُنسى في كل تفاعل',
    },
    'الراعي': {
      icon: 'shield-check',
      desc: 'براند يوفر الأمان والرعاية — العميل يشعر بالحماية والثقة والاهتمام.',
      tone: 'مطمئن وراعٍ',
      direction: 'ناعم ودائري مع عناصر حماية ومساحات آمنة — ألوان هادئة',
      colorPsych: 'أخضر فاتح (أمان)، أزرق سماوي (ثقة)، بيج (رعاية)',
      typoPersonality: 'سان سيرف دافئ ومقروء — يشعرك بالأمان',
      voice: 'مطمئن وداعم — يخاطب الحاجة للأمان',
      diff: 'خلق شعور عميق بالثقة والرعاية في كل عنصر',
    },
  };

  const archetype = answers.brandArchetype || 'المبدع';
  const archetypeKey = archetype.split('(')[0].trim();
  const data = archetypeMap[archetypeKey] || archetypeMap['المبدع'];

  const traits: string[] = [];
  if (Array.isArray(answers.brandPersonality)) {
    traits.push(...answers.brandPersonality);
  }

  return {
    archetype: archetypeKey,
    archetypeIcon: data.icon,
    archetypeDescription: data.desc,
    personalityTraits: traits,
    emotionalTone: data.tone,
    visualDirection: data.direction,
    colorPsychology: data.colorPsych,
    typographyPersonality: data.typoPersonality,
    brandVoice: data.voice,
    differentiationFactor: data.diff,
  };
}

function generateArchetypeAnalysis(answers: BrandAnswers): ArchetypeAnalysis {
  const primary = answers.brandArchetype || 'المبدع';
  const primaryKey = primary.split('(')[0].trim();

  const archetypeData: Record<string, { secondary: string; desc: string; strengths: string[]; challenges: string[]; famous: string[]; visualCues: string[] }> = {
    'الحاكم': {
      secondary: 'الحكيم',
      desc: 'قيادة واستقرار — براند يمسك بزمام السوق ويفرض معاييره.',
      strengths: ['ثقة فورية من العملاء', 'تموضع واضح كقائد', 'قيمة perceived عالية', 'ولاء عملاء قوي'],
      challenges: ['قد يبدو متعالياً للبعض', 'توقع مستمر بالتميز', 'صعوبة التوسع للأسواق الشعبية'],
      famous: ['Mercedes-Benz', 'Rolex', 'Apple', 'BMW'],
      visualCues: ['أشكال هندسية قوية', 'ألوان داكنة مع ذهبي', 'مساحات فراغ مدروسة', 'رموز القوة والسيطرة'],
    },
    'المبدع': {
      secondary: 'المستكشف',
      desc: 'ابتكار بلا حدود — براند يصنع عالماً بصرياً لم يسبقه إليه أحد.',
      strengths: ['تميز مطلق في السوق', 'جاذبية للإبداعيين', 'قدرة على صنع تريند', 'مرونة في التعبير'],
      challenges: ['قد لا يفهم الجميع الرؤية', 'يحتاج وقتاً أطول للبحث', 'صعوبة التوازن بين الإبداع والتجاري'],
      famous: ['Adobe', 'Lego', 'Dyson', 'Absolut Vodka'],
      visualCues: ['تكستشر بصرية فريدة', 'تركيبات لونية غير تقليدية', 'خطوط مخصصة', 'عناصر تجريدية مبتكرة'],
    },
    'البطل': {
      secondary: 'المبدع',
      desc: 'إنجاز وتفوق — براند يعد بالنتائج ويحققها دائماً.',
      strengths: ['تحفيز قوي للشراء', 'قصة نجاح مقنعة', 'ربط بالإنجاز الشخصي', 'انتشار سريع بالنتائج'],
      challenges: ['ضغط توقعات عالي', 'كل منتج يجب أن يثبت نفسه', 'صعوبة الحفاظ على مستوى الإنجاز'],
      famous: ['Nike', 'FedEx', 'BMW', 'Under Armour'],
      visualCues: ['خطوط ديناميكية مائلة', 'رموز الحركة والقوة', 'ألوان صارخة مع أسود', 'تركيبات بصرية قوية'],
    },
    'الحكيم': {
      secondary: 'الراعي',
      desc: 'معرفة وخبرة — المرجع الأول الذي يثق به الجميع.',
      strengths: ['ثقة مؤسسية عميقة', 'ولاء طويل الأمد', 'قدرة على التوسع الأكاديمي', 'مصداقية عالية'],
      challenges: ['قد يبدو محافظاً', 'بطء في التفاعل مع التريند', 'صعوبة جذب الشباب بدون تحديث'],
      famous: ['Harvard', 'BBC', 'Google', 'The Economist'],
      visualCues: ['كلاسيكية رصينة', 'مسافات فراغ واسعة', 'ألوان عميقة ومؤسسية', 'خطوط سيرف تقليدية'],
    },
    'المستكشف': {
      secondary: 'المرح',
      desc: 'حرية واكتشاف — براند لا يعرف حدوداً ويفتح آفاقاً جديدة.',
      strengths: ['جاذبية للمغامرين', 'تميز بالخروج عن المألوف', 'مرونة عالية', 'قدرة على خلق مجتمع'],
      challenges: ['قد يفقد التركيز', 'صعوبة الحفاظ على هوية واحدة', 'توقع مستمر بالجديد'],
      famous: ['Jeep', 'The North Face', 'REI', 'Patagonia'],
      visualCues: ['فراغ سلبي واسع', 'ألوان طبيعية مفتوحة', 'صور وأيقونات الطبيعة', 'خطوط خفيفة ومفتوحة'],
    },
    'العاشق': {
      secondary: 'المبدع',
      desc: 'جمال وعاطفة — براند يحتفل بالذوق الرفيع ويغوي الحواس.',
      strengths: ['ارتباط عاطفي عميق', 'قيمة perceived عالية جداً', 'ولاء عملاء مطلق', 'قدرة على التسعير Premium'],
      challenges: ['يحتاج صيانة بصرية مستمرة', 'حساس للأخطاء في التنفيذ', 'سقف توقعات مرتفع'],
      famous: ['Chanel', 'Victoria\'s Secret', 'Godiva', 'Dior'],
      visualCues: ['منحنيات عضوية ناعمة', 'ألوان دافئة وغنية', 'تكستشر فاخرة', 'كاليجرافي وخطوط أنثوية'],
    },
    'المرح': {
      secondary: 'المستكشف',
      desc: 'مرح وبهجة — براند لا يأخذ نفسه بجدية ويجعل الحياة أجمل.',
      strengths: ['انتشار سريع وعضوي', 'ارتباط شعبي قوي', 'محتوى قابل للمشاركة', 'جاذبية عبر الأجيال'],
      challenges: ['صعوبة الارتقاء للبريميوم', 'قد لا يؤخذ بجدية', 'يحتاج محتوى دائم'],
      famous: ['M&M\'s', 'Old Spice', 'Skittles', 'Ben & Jerry\'s'],
      visualCues: ['ألوان نابضة ومتباينة', 'أشكال مستديرة ومرحة', 'أنيميشن وحيوية', 'خطوط مستديرة وخفيفة'],
    },
    'الراعي': {
      secondary: 'الحكيم',
      desc: 'رعاية وأمان — براند يجعلك تشعر بالحماية والاهتمام الحقيقي.',
      strengths: ['ثقة عميقة وفورية', 'ولاء طويل الأمد', 'انتشار بالتوصيات', 'جاذبية عائلية'],
      challenges: ['قد يبدو تقليدياً', 'صعوبة التميز في سوق مزدحم', 'التوازن بين الرعاية والحداثة'],
      famous: ['Johnson & Johnson', 'Volvo', 'UNICEF', 'Campbell\'s'],
      visualCues: ['أشكال دائرية ودافئة', 'ألوان هادئة ومطمئنة', 'مساحات آمنة ومفتوحة', 'رموز الحماية والرعاية'],
    },
  };

  const data = archetypeData[primaryKey] || archetypeData['المبدع'];

  return {
    primaryArchetype: primaryKey,
    secondaryArchetype: data.secondary,
    description: data.desc,
    strengths: data.strengths,
    challenges: data.challenges,
    famousExamples: data.famous,
    visualCues: data.visualCues,
  };
}

// ─── Cross Question Insights ───
function generateCrossQuestionInsights(answers: BrandAnswers): CrossQuestionInsight[] {
  const insights: CrossQuestionInsight[] = [];

  // Industry + Audience alignment
  const industry = getIndustryType(answers);
  const aud = answers.targetAudience || [];
  if (industry === 'real_estate' && Array.isArray(aud) && aud.some(a => a.includes('نخبة') || a.includes('VIP'))) {
    insights.push({
      title: 'تمايز عقاري-نخبوي',
      description: 'النشاط العقاري مع جمهور النخبة يتطلب هوية فائقة الفخامة تعكس الثقة والاستقرار.',
      relatedQuestions: ['industry', 'targetAudience', 'pricePosition'],
      impact: 'high',
      recommendation: 'التركيز على لوحة dark-luxury مع ذهبي وأشكال هندسية معمارية.',
    });
  }

  // Budget + Scope alignment
  const budget = answers.budgetRange || '';
  const scope = answers.deliverableScope || '';
  if (budget === 'economical' && scope.includes('الكاملة')) {
    insights.push({
      title: 'تناقض ميزانية-مخرجات',
      description: 'تريد هوية كاملة بميزانية اقتصادية — نحتاج لضبط التوقعات أو ترقية الباقة.',
      relatedQuestions: ['budgetRange', 'deliverableScope'],
      impact: 'high',
      recommendation: 'نقترح باقة متوسطة كحل وسط أو تقليص المخرجات لتناسب الميزانية.',
    });
  }

  // Geography + Price Position
  const geo = getGeographyType(answers);
  const pricePos = answers.pricePosition || '';
  if (geo === 'international' && (pricePos.includes('اقتصادي') || pricePos.includes('متوسط'))) {
    insights.push({
      title: 'فجوة تسعير-جغرافيا',
      description: 'السوق الدولي يتوقع مستوى بريميوم. التسعير المتوسط قد يضعف الموقف التنافسي.',
      relatedQuestions: ['geography', 'pricePosition'],
      impact: 'medium',
      recommendation: 'الارتقاء للتموضع البريميوم أو تخصيص الهوية للأسواق المستهدفة.',
    });
  }

  // Personality + Typography alignment
  const personality = answers.brandPersonality || [];
  const typo = answers.typographyStyle || '';
  if (Array.isArray(personality) && personality.some(p => p.includes('ملكي')) && typo.includes('سان سيرف')) {
    insights.push({
      title: 'تناقض شخصية-خطوط',
      description: 'الشخصية الملكية تتوافق أكثر مع خطوط السيرف الكلاسيكية. السان سيرف قد يضعف الإحساس الفاخر.',
      relatedQuestions: ['brandPersonality', 'typographyStyle'],
      impact: 'medium',
      recommendation: 'نقترح تجربة سيرف كلاسيكي أو كاليجرافي عربي لتعزيز الفخامة.',
    });
  }

  // Timeline + Complexity
  const days = typeof answers.timelineDays === 'number' ? answers.timelineDays : 21;
  const channels = answers.applicationChannels || [];
  if (days <= 7 && Array.isArray(channels) && channels.length >= 3) {
    insights.push({
      title: 'ضغط وقت-تعقيد',
      description: 'تطبيقات متعددة مع وقت قصير جداً — الجودة س تتأثر حتماً.',
      relatedQuestions: ['timelineDays', 'applicationChannels'],
      impact: 'high',
      recommendation: 'تمديد الوقت أو تقليص القنوات في المرحلة الأولى.',
    });
  }

  // Archetype + Color alignment
  const archetype = answers.brandArchetype || '';
  const colors = answers.preferredColors || [];
  if (archetype.includes('الحاكم') && Array.isArray(colors) && colors.some(c => c === 'energy')) {
    insights.push({
      title: 'تناقض أصل-ألوان',
      description: 'أصل الحاكم يتوافق مع dark-luxury أو royal أكثر من energy. الألوان الجريئة قد تضعف الهيبة.',
      relatedQuestions: ['brandArchetype', 'preferredColors'],
      impact: 'medium',
      recommendation: 'إضافة عناصر من dark-luxury لتحقيق التوازن.',
    });
  }

  // Stage + Investment
  const stage = answers.projectStage || '';
  const invest = answers.investmentPhilosophy || '';
  if (stage.includes('ناشئ') && invest.includes('استثماري')) {
    insights.push({
      title: 'ناشئ طموح',
      description: 'رغم أن المشروع ناشئ، إلا أن استثمارك في الهوية يدل على رؤية بعيدة — فرصة لبناء أساس قوي.',
      relatedQuestions: ['projectStage', 'investmentPhilosophy'],
      impact: 'medium',
      recommendation: 'نقترح باقة متوسطة قابلة للتطوير مع دليل براند لضمان الاتساق المستقبلي.',
    });
  }

  // Audience economic + Price position
  const economic = answers.audienceEconomic || '';
  if (economic.includes('A+') && !pricePos.includes('لاكشري')) {
    insights.push({
      title: 'فرصة لاكشري ضائعة',
      description: 'جمهورك نخبة فائقة الثراء لكن تموضعك ليس Luxury — هذا يخسر فرص تسعير أعلى.',
      relatedQuestions: ['audienceEconomic', 'pricePosition'],
      impact: 'high',
      recommendation: 'الارتقاء للتموضع Luxury ليتوافق مع جمهورك ويعظم أرباحك.',
    });
  }

  return insights;
}

// ─── Project Phases ───
function generateProjectPhases(tier: TierType): ProjectPhase[] {
  const phasesMap: Record<TierType, ProjectPhase[]> = {
    PREMIUM: [
      { name: 'Discovery', nameAr: 'الاستكشاف والبحث', duration: '3-4 أيام', deliverables: ['تحليل المنافسين', 'بحث الجمهور', 'مودبورد'], dependencies: [] },
      { name: 'Concept', nameAr: 'المفاهيم الأولية', duration: '3-4 أيام', deliverables: ['3-5 مفاهيم شعار', 'اتجاهات لونية', 'اتجاهات خطية'], dependencies: ['Discovery'] },
      { name: 'Refinement', nameAr: 'التطوير والتنقيح', duration: '3-4 أيام', deliverables: ['شعار نهائي', 'لوحة ألوان', 'نظام خطوط'], dependencies: ['Concept'] },
      { name: 'Application', nameAr: 'التطبيق والنظام', duration: '4-5 أيام', deliverables: ['قرطاسية', 'تغليف', 'قوالب سوشيال', 'دليل براند'], dependencies: ['Refinement'] },
      { name: 'Delivery', nameAr: 'التسليم النهائي', duration: '2-3 أيام', deliverables: ['ملفات مصدرية', 'ملفات نهائية', 'دليل الاستخدام'], dependencies: ['Application'] },
    ],
    MEDIUM: [
      { name: 'Discovery', nameAr: 'الاستكشاف', duration: '2 أيام', deliverables: ['بحث سريع', 'مودبورد'], dependencies: [] },
      { name: 'Concept', nameAr: 'المفاهيم', duration: '2-3 أيام', deliverables: ['2-3 مفاهيم شعار'], dependencies: ['Discovery'] },
      { name: 'Refinement', nameAr: 'التطوير', duration: '2-3 أيام', deliverables: ['شعار نهائي', 'لوحة ألوان'], dependencies: ['Concept'] },
      { name: 'Application', nameAr: 'التطبيق', duration: '2-3 أيام', deliverables: ['قرطاسية', 'قوالب سوشيال'], dependencies: ['Refinement'] },
      { name: 'Delivery', nameAr: 'التسليم', duration: '1-2 أيام', deliverables: ['ملفات نهائية ومصدرية'], dependencies: ['Application'] },
    ],
    BUDGET: [
      { name: 'Discovery', nameAr: 'الاستكشاف', duration: '1 يوم', deliverables: ['بحث سريع'], dependencies: [] },
      { name: 'Concept', nameAr: 'المفاهيم', duration: '1-2 يوم', deliverables: ['مفهوم شعار'], dependencies: ['Discovery'] },
      { name: 'Refinement', nameAr: 'التطوير', duration: '1 يوم', deliverables: ['شعار نهائي'], dependencies: ['Concept'] },
      { name: 'Delivery', nameAr: 'التسليم', duration: '1 يوم', deliverables: ['ملفات نهائية'], dependencies: ['Refinement'] },
    ],
    MICRO: [
      { name: 'Concept', nameAr: 'المفاهيم', duration: '1-2 يوم', deliverables: ['مفهوم شعار'], dependencies: [] },
      { name: 'Refinement', nameAr: 'التطوير', duration: '1 يوم', deliverables: ['شعار نهائي'], dependencies: ['Concept'] },
      { name: 'Delivery', nameAr: 'التسليم', duration: '1 يوم', deliverables: ['ملفات نهائية'], dependencies: ['Refinement'] },
    ],
    STARTER: [
      { name: 'Discovery', nameAr: 'الاستكشاف', duration: '1 يوم', deliverables: ['استشارة توجيهية', 'بحث سريع'], dependencies: [] },
      { name: 'Concept', nameAr: 'المفاهيم', duration: '1-2 يوم', deliverables: ['مفهوم شعار'], dependencies: ['Discovery'] },
      { name: 'Refinement', nameAr: 'التطوير', duration: '1-2 يوم', deliverables: ['شعار نهائي'], dependencies: ['Concept'] },
      { name: 'Delivery', nameAr: 'التسليم', duration: '1 يوم', deliverables: ['ملفات + استشارة'], dependencies: ['Refinement'] },
    ],
  };

  return phasesMap[tier] || phasesMap.MEDIUM;
}

// ─── Tier Calculation ───
export function calculateTier(answers: BrandAnswers): TierDecision {
  const geography = getGeographyType(answers);
  const industry = getIndustryType(answers);
  const isRush = isRushRequest(answers);
  const isStarter = isStarterClient(answers);
  const useUsd = geography === 'international';
  const industryMulti = calculateIndustryPriceMultiplier(industry, geography === 'international');

  let explicitTier = getSelectedTier(answers);
  let finalTier: TierType;

  if (!explicitTier && isStarter) {
    finalTier = 'STARTER';
  } else if (!explicitTier) {
    const avg = calculateAverageWeight(answers);
    if (avg >= 2.6) finalTier = 'PREMIUM';
    else if (avg >= 1.8) finalTier = 'MEDIUM';
    else finalTier = 'BUDGET';
  } else {
    finalTier = explicitTier;
  }

  const configBase = useUsd ? tierConfigUSD[finalTier] : tierConfig[finalTier];
  let adjustedPrice = Math.round(configBase.numericPrice * industryMulti);

  // Typography detail premium
  const typoDetail = answers.typographyDetail || '';
  if (typoDetail.includes('مخصص بالكامل') || typoDetail.includes('مرسوم يدوياً')) {
    adjustedPrice = Math.round(adjustedPrice * 1.25);
  } else if (typoDetail.includes('تعديل جزئي')) {
    adjustedPrice = Math.round(adjustedPrice * 1.1);
  }

  // Additional services premium
  const addServices = answers.additionalServices || [];
  if (Array.isArray(addServices)) {
    if (addServices.includes('موشن الشعار (Logo Animation)')) adjustedPrice += Math.round(adjustedPrice * 0.2);
    if (addServices.includes('دليل البراند (Brand Book)')) adjustedPrice += Math.round(adjustedPrice * 0.15);
    if (addServices.includes('قوالب سوشيال ميديا')) adjustedPrice += Math.round(adjustedPrice * 0.1);
    if (addServices.includes('تصميم تغليف منتجات')) adjustedPrice += Math.round(adjustedPrice * 0.15);
  }

  let rushPremium = 0;
  let rushNote = '';

  if (isRush && (finalTier === 'PREMIUM' || isPremiumClient(answers))) {
    rushPremium = Math.round(adjustedPrice * 0.75);
    rushNote = 'ملاحظة هامة: طلبك يتضمن تسليم سريع مع اختيار باقة بريميوم ورغبة في الفخامة — هذا يتطلب بذل جهد استثنائي وإعطاء أولوية قصوى لمشروعك. تم إضافة علاوة التسليم المستعجل.';
    adjustedPrice += rushPremium;
  } else if (isRush) {
    rushPremium = Math.round(adjustedPrice * 0.4);
    rushNote = 'تم إضافة علاوة التسليم السريع للحفاظ على الجودة مع ضغط الجدول الزمني.';
    adjustedPrice += rushPremium;
  }

  const depositNum = Math.round(adjustedPrice * 0.5);
  const priceFormatted = useUsd ? `$${adjustedPrice}` : `${adjustedPrice.toLocaleString('ar-EG')} ج.م`;
  const rangeMin = Math.round(adjustedPrice * 0.9);
  const rangeMax = Math.round(adjustedPrice * 1.1);
  const rangeFormatted = useUsd ? `$${rangeMin} - $${rangeMax}` : `${rangeMin.toLocaleString('ar-EG')} ج.م - ${rangeMax.toLocaleString('ar-EG')} ج.م`;
  const depositFormatted = useUsd ? `$${depositNum}` : `${depositNum.toLocaleString('ar-EG')} ج.م`;

  return {
    ...configBase,
    price: priceFormatted,
    numericPrice: adjustedPrice,
    range: rangeFormatted,
    deposit: depositFormatted,
    depositNumeric: depositNum,
    currency: useUsd ? 'USD' : 'EGP',
    rushPremium,
    rushNote,
    features: configBase.features,
  };
}

// ─── Brand Intelligence ───
export function generateBrandIntelligence(answers: BrandAnswers): BrandIntelligence {
  const avg = calculateAverageWeight(answers);
  const priceWeight = getSelectedWeight(answers, 'pricePosition');
  const investWeight = getSelectedWeight(answers, 'investmentPhilosophy');
  const personalityWeights = getSelectedWeight(answers, 'brandPersonality');
  const scopeCount = Array.isArray(answers.applicationChannels) ? answers.applicationChannels.length : 0;
  const colorCount = Array.isArray(answers.preferredColors) ? answers.preferredColors.length : 0;

  const sophisticationScore = Math.min(100, Math.round(
    (avg / 4) * 40 + (priceWeight / 4) * 30 + (investWeight / 4) * 20 + (personalityWeights / 9) * 10
  ));

  const luxuryAffinity = Math.min(100, Math.round(
    (priceWeight / 4) * 50 + (investWeight / 4) * 35 + (colorCount > 0 ? 15 : 0)
  ));

  const complexityLevel = Math.min(100, Math.round(
    (scopeCount / 4) * 40 + (avg / 4) * 30 + (colorCount / 6) * 30
  ));

  const timelineWeight = getSelectedWeight(answers, 'timeline');
  const urgencyLevel = Math.min(100, Math.round(
    ((3 - timelineWeight) / 2) * 100
  ));

  const styleMap: Record<string, string> = {
    'مونوغرام (Monogram)': 'مونوغرام ملكي مع تفاصيل هندسية دقيقة',
    'خطي مخصص (Typography)': 'تيبوجرافي مخصص بلمسة سينمائية',
    'أيقوني رمزي (Symbolic)': 'رمزية تجريدية ذكية ومبتكرة',
    'مينيماليست': 'مينيمالية فاخرة مع اهتمام بالفراغ السلبي',
    'ختم رسمي (Emblem)': 'ختم تراثي بإطار فخم وملامح حديثة',
  };
  const recommendedStyle = styleMap[answers.logoDirection] || 'نظام بصري متكامل يجمع بين الأصالة والحداثة';

  const paletteMap: Record<string, string> = {
    'dark-luxury': 'أسود فحمي مع لمسات ذهبية',
    'royal': 'ذهبي وبيج ملكي',
    'trust': 'كحلي وسماوي مؤسسي',
    'organic': 'أخضر عضوي وحيوي',
    'energy': 'أحمر جريء مع تدرجات برتقالية',
    'earthy': 'ترابي دافئ وبني أصيل',
  };

  const preferredColorNames = Array.isArray(answers.preferredColors) ? answers.preferredColors : [];
  const recommendedPalette = preferredColorNames.length > 0
    ? preferredColorNames.map(c => paletteMap[c] || c).join(' + ')
    : 'لوحة ذهبية-فحمية تعكس الفخامة (اقتراح المصمم)';

  const typoMap: Record<string, string> = {
    'سيرف كلاسيكي (Serif)': 'سيرف كلاسيكي فاخر',
    'سان سيرف حديث (Sans-Serif)': 'سان سيرف عصري ونظيف',
    'كاليجرافي عربي': 'كاليجرافي عربي مخصص',
  };
  const recommendedTypography = typoMap[answers.typographyStyle] || 'مزيج متوازن من الخطوط العربية والعالمية';

  const riskFactors: string[] = [];
  const opportunities: string[] = [];

  if (isStarterClient(answers)) {
    opportunities.push('براند ناشئ ذو إمكانيات نمو عالية — فرصة لبناء هوية قابلة للتطوير');
  }
  if (avg >= 2.8) opportunities.push('طموح بصري عالي يسمح بتجريب تقنيات سينمائية متادمة');
  if (priceWeight >= 3) opportunities.push('تموضع بريميوم يتيح استخدام خامات بصرية فاخرة');
  if (scopeCount >= 3) opportunities.push('تطبيق متعدد القنوات يضمن انتشار أوسع للهوية');
  if (avg >= 2.5 && timelineWeight <= 2) riskFactors.push('توقيت ضيق قد يحد من عمق النحت الاستراتيجي المطلوب');
  if (avg < 1.5 && !isStarterClient(answers)) riskFactors.push('توجه اقتصادي قد يحد من التفاصيل الفنية المتاحة');
  if (!answers.vision && avg >= 2) riskFactors.push('غياب الرؤية الواضحة قد يطيل مرحلة البحث والاستكشاف');
  if (answers.competitors && avg >= 2) opportunities.push('معرفة المنافسين تتيح تصميم استراتيجي تفاضلي متميز');
  if (personalityWeights >= 5) opportunities.push('شخصية براند قوية تسهل ترجمة المشاعر لعناصر بصرية');
  if (answers.geography?.includes('عالمي')) {
    opportunities.push('امتداد دولي يتيح تصميم متعدد الأبعاد يعمل عبر الثقافات');
    riskFactors.push('يجب مراعاة التوافق الثقافي واللغوي للأسواق المستهدفة');
  }

  const tier = calculateTier(answers);
  const brandDNA = generateBrandDNA(answers);
  const archetypeAnalysis = generateArchetypeAnalysis(answers);
  const crossQuestionInsights = generateCrossQuestionInsights(answers);
  const projectPhases = generateProjectPhases(tier.type);
  const timelineImpact = calculateTimelineImpact(answers, tier.type);
  const budgetAnalysis = calculateBudgetAnalysis(answers, tier);

  const upsellRecommendations = generateUpsells(answers, avg, tier);
  const designerNotes = generateDesignerNotes(answers, avg, sophisticationScore, luxuryAffinity);
  const industryInsights = getIndustryInsights(answers.industry || answers.industryOther || '');
  const contractTerms = generateContractTerms(answers);

  return {
    sophisticationScore,
    luxuryAffinity,
    complexityLevel,
    urgencyLevel,
    brandDNA,
    recommendedStyle,
    recommendedPalette,
    recommendedTypography,
    riskFactors,
    opportunities,
    upsellRecommendations,
    designerNotes,
    industryInsights,
    contractTerms,
    crossQuestionInsights,
    projectPhases,
    timelineImpact,
    budgetAnalysis,
    archetypeAnalysis,
  };
}

function generateUpsells(answers: BrandAnswers, avg: number, tier: TierDecision): UpsellItem[] {
  const items: UpsellItem[] = [];
  const fmt = (n: number) => tier.currency === 'USD' ? `$${n}` : `${n.toLocaleString()} ج.م`;

  if (tier.type === 'PREMIUM' || tier.type === 'MEDIUM') {
    items.push({
      icon: '⚡',
      title: 'تحريك الشعار سينمائياً (Motion Logo)',
      description: 'إضافة إنترو متحرك فخم ليكون واجهة سينمائية لفيديوهاتك.',
      value: 'high',
      price: fmt(Math.round(tier.numericPrice * 0.2)),
    });
    items.push({
      icon: '📖',
      title: 'كتاب دليل البراند الشامل (Brand Guidelines)',
      description: 'توثيق قواعد الهوية لمنع تلاعب أي مطبعة بألوانك ومظهرك.',
      value: 'high',
      price: fmt(Math.round(tier.numericPrice * 0.15)),
    });
  }

  if (tier.type === 'BUDGET' || tier.type === 'MICRO' || tier.type === 'STARTER') {
    items.push({
      icon: '💼',
      title: 'ترقية لباقة أعلى',
      description: 'إضافة تطبيقات المطبوعات وعناصر السوشيال لبدء حضورك بشكل رسمي.',
      value: 'medium',
      price: fmt(Math.round(tier.numericPrice * 0.3)),
    });
  }

  if (avg >= 2.5) {
    items.push({
      icon: '🎬',
      title: 'إعلان تجريبي سينمائي (Brand Reveal Video)',
      description: 'فيديو كشف البراند بأسلوب سينمائي مبهر يحقق أقصى تأثير إطلاق.',
      value: 'high',
      price: fmt(Math.round(tier.numericPrice * 0.25)),
    });
  }

  if (answers.geography?.includes('عالمي')) {
    items.push({
      icon: '🌐',
      title: 'نسخة متعددة اللغات',
      description: 'تصميم بديل بالإنجليزية للأسواق الدولية.',
      value: 'medium',
      price: fmt(Math.round(tier.numericPrice * 0.15)),
    });
  }

  return items;
}

function generateDesignerNotes(answers: BrandAnswers, _avg: number, soph: number, luxury: number): string {
  const notes: string[] = [];
  const isStarter = isStarterClient(answers);
  const isPremium = isPremiumClient(answers);

  if (isPremium) {
    notes.push('العميل يسعى للفخامة المطلقة — المخرجات يجب أن تكون بمستوى يفوق توقعاته. خامات راقية وتفاصيل دقيقة.');
  } else if (isStarter) {
    notes.push('براند ناشئ — التركيز على هوية عملية ومرنة قابلة للتطوير مع نمو المشروع.');
  } else if (soph >= 70) {
    notes.push('العميل يمتلك وعياً استراتيجياً عالياً — المخرجات يجب أن تفيق توقعاته.');
  } else if (soph >= 40) {
    notes.push('العميل يبحث عن توازن ذكي — تقديم قيمة واضحة مع الجاذبية البصرية.');
  } else {
    notes.push('العميل يبحث عن حلول عملية — الكفاءة والوضوح البصري المباشر.');
  }

  if (luxury >= 60) notes.push('ميل قوي للفخامة — خامات بصرية راقية وذهبي وظلال عميقة.');
  if (answers.brandName && answers.brandName.length > 15) notes.push('الاسم التجاري طويل — معالجة تيبوجرافية ذكية لضمان التوازن.');
  if (Array.isArray(answers.targetAudience) && answers.targetAudience.length >= 3) notes.push('الجمهور متنوع — الهوية يجب أن تكون مرنة لشرائح متعددة.');
  if (answers.geography?.includes('عالمي')) notes.push('امتداد عالمي — الخطوط والأشكال يجب أن تعمل عبر ثقافات متعددة.');
  if (isRushRequest(answers)) notes.push('طلب تسليم سريع — التنسيق المباشر مع العميل لضمان سرعة الموافقات.');
  if (answers.governorate) notes.push(`النطاق المحلي: ${answers.governorate} — يمكن إضافة عناصر محلية.`);

  return notes.join(' ');
}

function generateContractTerms(answers: BrandAnswers): ContractTerms {
  const isStarter = isStarterClient(answers);
  const isRush = isRushRequest(answers);

  return {
    designerObligations: [
      'تقديم 3-5 مفاهيم أولية للشعار قبل التنفيذ النهائي (أو 1-2 حسب الباقة)',
      'إجراء تعديلات حتى (3 مراجعات) ضمن الباقة المختارة',
      'تسليم ملفات عالية الدقة (AI, EPS, PDF, SVG, PNG)',
      'تقديم دليل استخدام مختصر للألوان والخطوط',
      'الالتزام بالجدول الزمني المتفق عليه',
      'سرية تامة لجميع مراحل العمل والتواصل',
      'ضمان عدم استخدام التصميم لعميل آخر',
      isStarter ? 'استشارة مجانية واحدة لتوجيه البراند الناشئ' : '',
    ].filter(Boolean),
    clientObligations: [
      'تقديم ملاحظات واضحة ومحددة لتسريع عملية التعديلات',
      'الرد على الاستفسارات خلال 24-48 ساعة للحفاظ على الجدول',
      'توفير المحتوى النصي المطلوب (إن وُجد) قبل البدء',
      'الموافقة على المراحل قبل الانتقال للخطوة التالية',
      'احترام حقوق الملكية الفكرية للمصمم حتى السداد الكامل',
      isRush ? 'السرعة في الموافقات ضرورية للإنجاز في الوقت المحدد' : '',
    ].filter(Boolean),
    revisionPolicy: isStarter
      ? '3 مراجعات مجانية. كل تعديل إضافي = 100 ج.م أو ما يعادلها بالدولار.'
      : '3 مراجعات مجانية ضمن الباقة. المراجعات الإضافية تحسب بنسبة 10% من قيمة الباقة.',
    deliveryPolicy: isRush
      ? `التسليم بالجدول الزمني المحدد: ${answers.timeline}. أي تأخير من جانب العميل يمتد الجدول الزمني بما يساويه.`
      : 'التسليم بالمدة المتفق عليها. التأخير من جانب المصمم يستوجب خصماً 5% لكل يوم تأخير.',
    paymentTerms: 'دفع 50% مقدم قبل البدء، والـ 50% المتبقية قبل تسليم الملفات النهائية والمصدرية.',
    copyrightClause: 'جميع حقوق التصميم تنتقل للعميل فور السداد الكامل. يحتفظ المصمم بحق عرض العمل في معرضه الشخصي فقط.',
    cancellationPolicy: `في حالة الإلغاء:
- قبل البدء: استرداد 100% من المقدم.
- بعد المفاهيم الأولية: استرداد 50% من المقدم.
- بعد بدء التنفيذ: لا يوجد استرداد.
${isRush ? '\nالإلغاء بسبب التأخير من جانب المصمم يخضع لتفاوض يعوض العميل.' : ''}`,
    jurisdiction: 'جمهورية مصر العربية',
    governingLaw: 'القانون المصري — قانون حماية حقوق الملكية الفكرية رقم 82 لسنة 2002 وقانون التجارة رقم 17 لسنة 1999',
    disputeResolution: 'في حالة الخلاف، يُلجأ أولاً للتفاوض المباشر خلال 14 يوم. في حال تعذر الحل، يُحال الأمر للتحكيم التجاري وفقاً لقانون التحكيم المصري رقم 27 لسنة 1994.',
    confidentialityClause: 'يلتزم الطرفان بالسرية التامة تجاه جميع المعلومات والبيانات والتصاميم المتبادلة أثناء وبعد تنفيذ المشروع. أي إفشاء يعرض المسؤول للتعويض.',
  };
}

export { isStarterClient, isPremiumClient, isRushRequest, getGeographyType, getIndustryType };
