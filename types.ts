export type TierType = 'PREMIUM' | 'MEDIUM' | 'BUDGET' | 'MICRO' | 'STARTER';

export type IndustryType =
  | 'real_estate'
  | 'hospitality'
  | 'fashion'
  | 'technology'
  | 'medical'
  | 'ecommerce'
  | 'education'
  | 'travel'
  | 'production'
  | 'other';

export type GeographyType = 'local' | 'regional' | 'international';

export type ContentCheckResult = {
  isClean: boolean;
  flaggedWords: string[];
  severity: 'none' | 'warning' | 'critical';
  message: string;
};

export type SubQuestion = {
  id: string;
  text: string;
  hint: string;
  type: 'single' | 'multi' | 'text' | 'textarea' | 'slider';
  answerKey: string;
  options?: { label: string; weight: number; value?: string }[];
  conditionalOn?: string;
  conditionalValue?: string;
};

export interface BrandAnswers {
  brandName: string;
  brandActivity: string;
  slogan: string;
  industry: string;
  industryOther: string;
  industrySubField: string;
  projectStage: string;
  stageChallenge: string;
  vision: string;
  targetAudience: string[];
  audienceAge: string[];
  audienceGender: string;
  audienceEconomic: string;
  geography: string;
  governorate: string;
  businessSize: string;
  pricePosition: string;
  competitors: string;
  brandPersonality: string[];
  brandArchetype: string;
  logoDirection: string;
  preferredColors: string[];
  forbiddenColors: string;
  deliverableScope: string;
  previousExperience: string;
  visualHistory: string;
  applicationChannels: string[];
  typographyStyle: string;
  typographyDetail: string;
  investmentPhilosophy: string;
  budgetRange: string;
  referenceFiles: string[];
  referenceLinks: string;
  timeline: string;
  timelineDays: number;
  timelineSlot: string;
  additionalServices: string[];
  additionalNotes: string;
  // Industry-specific sub-answers
  [key: string]: string | string[] | number;
}

export interface TierDecision {
  tier: string;
  tierAr: string;
  price: string;
  numericPrice: number;
  range: string;
  time: string;
  class: string;
  type: TierType;
  deposit: string;
  depositNumeric: number;
  currency: 'EGP' | 'USD';
  rushPremium?: number;
  rushNote?: string;
  features: string[];
}

export interface BrandIntelligence {
  sophisticationScore: number;
  luxuryAffinity: number;
  complexityLevel: number;
  urgencyLevel: number;
  brandDNA: BrandDNA;
  recommendedStyle: string;
  recommendedPalette: string;
  recommendedTypography: string;
  riskFactors: string[];
  opportunities: string[];
  upsellRecommendations: UpsellItem[];
  designerNotes: string;
  industryInsights: IndustryInsights;
  contractTerms: ContractTerms;
  crossQuestionInsights: CrossQuestionInsight[];
  projectPhases: ProjectPhase[];
  timelineImpact: TimelineImpact;
  budgetAnalysis: BudgetAnalysis;
  archetypeAnalysis: ArchetypeAnalysis;
}

export interface BrandDNA {
  archetype: string;
  archetypeIcon: string;
  archetypeDescription: string;
  personalityTraits: string[];
  emotionalTone: string;
  visualDirection: string;
  colorPsychology: string;
  typographyPersonality: string;
  brandVoice: string;
  differentiationFactor: string;
}

export interface CrossQuestionInsight {
  title: string;
  description: string;
  relatedQuestions: string[];
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface ProjectPhase {
  name: string;
  nameAr: string;
  duration: string;
  deliverables: string[];
  dependencies: string[];
}

export interface TimelineImpact {
  selectedDays: number;
  optimalDays: number;
  rushMultiplier: number;
  qualityImpact: string;
  priceImpact: string;
  recommendation: string;
}

export interface BudgetAnalysis {
  range: string;
  rangeAr: string;
  suggestedPrice: number;
  currency: 'EGP' | 'USD';
  pricePerDeliverable: { item: string; price: string }[];
  valueScore: number;
  competitorBenchmark: string;
}

export interface ArchetypeAnalysis {
  primaryArchetype: string;
  secondaryArchetype: string;
  description: string;
  strengths: string[];
  challenges: string[];
  famousExamples: string[];
  visualCues: string[];
}

export interface UpsellItem {
  icon: string;
  title: string;
  description: string;
  value: 'high' | 'medium' | 'low';
  price?: string;
}

export interface IndustryInsights {
  industry: IndustryType;
  industryNameAr: string;
  competitors: string[];
  trends: string[];
  recommendedColors: string[];
  recommendedStyles: string[];
  tips: string[];
}

export interface ContractTerms {
  designerObligations: string[];
  clientObligations: string[];
  revisionPolicy: string;
  deliveryPolicy: string;
  paymentTerms: string;
  copyrightClause: string;
  cancellationPolicy: string;
  jurisdiction: string;
  governingLaw: string;
  disputeResolution: string;
  confidentialityClause: string;
}

export interface QuestionConfig {
  id: string;
  number: number;
  text: string;
  hint: string;
  type: 'single' | 'multi' | 'text' | 'textarea' | 'color' | 'file' | 'governorate' | 'timeline-slot' | 'slider' | 'budget' | 'review';
  options?: { label: string; weight: number; tier?: TierType; value?: string }[];
  answerKey: keyof BrandAnswers;
  isMulti?: boolean;
  subQuestions?: SubQuestion[];
  conditionalShow?: (answers: BrandAnswers) => boolean;
  section?: string;
  icon?: string;
}

export interface ModerationResult {
  isClean: boolean;
  flaggedWords: string[];
  message: string;
}

export const TOTAL_STEPS = 22;

export const egyptianGovernorates = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'الغربية',
  'المنوفية', 'القليوبية', 'كفر الشيخ', 'البحيرة', 'الإسماعيلية',
  'بورسعيد', 'السويس', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
  'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'مطروح',
  'شمال سيناء', 'جنوب سيناء', 'الوادي الجديد', 'الجيزة الجديدة'
];

export const timeSlots = [
  '09:00 صباحاً - 12:00 ظهراً',
  '12:00 ظهراً - 03:00 عصراً',
  '03:00 عصراً - 06:00 مساءً',
  '06:00 مساءً - 09:00 ليلاً',
  '09:00 ليلاً - 12:00 منتصف الليل',
  'مرن - أي وقت مناسب للمصمم'
];

export const industrySubQuestions: Record<string, SubQuestion[]> = {
  'real_estate': [
    {
      id: 're-sub1',
      text: 'ما نوع النشاط العقاري؟',
      hint: 'حدد نوع العقارات التي تتعامل معها.',
      type: 'single',
      answerKey: 'industrySubField',
      options: [
        { label: 'تطوير عقاري سكني', weight: 3 },
        { label: 'تطوير عقاري تجاري', weight: 3 },
        { label: 'مقاولات وتشطيبات', weight: 2 },
        { label: 'استشارات هندسية', weight: 2 },
        { label: 'ديكور وتصميم داخلي', weight: 2 },
        { label: 'إدارة أملاك', weight: 1 },
      ],
    },
  ],
  'hospitality': [
    {
      id: 'hosp-sub1',
      text: 'ما نوع النشاط في الضيافة؟',
      hint: 'حدد نوع الخدمة.',
      type: 'single',
      answerKey: 'industrySubField',
      options: [
        { label: 'مطعم فاخر', weight: 3 },
        { label: 'كافيه أو صالة شاي', weight: 2 },
        { label: 'فندق أو منتجع', weight: 3 },
        { label: 'كاترينغ وخدمات غذائية', weight: 2 },
        { label: 'مخبز أو حلويات', weight: 2 },
      ],
    },
  ],
  'fashion': [
    {
      id: 'fash-sub1',
      text: 'ما تخصصك في عالم الموضة؟',
      hint: 'حدد مجالك بدقة.',
      type: 'single',
      answerKey: 'industrySubField',
      options: [
        { label: 'أزياء نسائية فاخرة', weight: 4 },
        { label: 'أزياء رجالية', weight: 3 },
        { label: 'عطور وكيماويات', weight: 3 },
        { label: 'مجوهرات وإكسسوارات', weight: 3 },
        { label: 'أحذية وحقائب', weight: 2 },
      ],
    },
  ],
  'technology': [
    {
      id: 'tech-sub1',
      text: 'ما مجالك التقني؟',
      hint: 'حدد نوع الخدمة التقنية.',
      type: 'single',
      answerKey: 'industrySubField',
      options: [
        { label: 'تطبيقات موبايل', weight: 2 },
        { label: 'منصات SaaS', weight: 3 },
        { label: 'ذكاء اصطناعي', weight: 3 },
        { label: 'أمن سيبراني', weight: 2 },
        { label: 'تجارة إلكترونية', weight: 2 },
        { label: 'وكالة رقمية', weight: 2 },
      ],
    },
  ],
  'medical': [
    {
      id: 'med-sub1',
      text: 'ما التخصص الطبي؟',
      hint: 'حدد نوع المركز.',
      type: 'single',
      answerKey: 'industrySubField',
      options: [
        { label: 'عيادات أسنان', weight: 2 },
        { label: 'مركز تجميل', weight: 3 },
        { label: 'مستشفى عام', weight: 2 },
        { label: 'صيدلية', weight: 1 },
        { label: 'مختبرات وتحاليل', weight: 2 },
        { label: 'علاج طبيعي', weight: 2 },
      ],
    },
  ],
  'ecommerce': [
    {
      id: 'ecom-sub1',
      text: 'ما نوع المتجر؟',
      hint: 'حدد نوع التجارة.',
      type: 'single',
      answerKey: 'industrySubField',
      options: [
        { label: 'متجر إلكتروني شامل', weight: 2 },
        { label: 'متجر تخصصي niche', weight: 3 },
        { label: 'منصة marketplace', weight: 3 },
        { label: 'متجر محلي_DELIVERY', weight: 1 },
      ],
    },
  ],
  'education': [
    {
      id: 'edu-sub1',
      text: 'ما نوع المؤسسة التعليمية؟',
      hint: 'حدد التخصص.',
      type: 'single',
      answerKey: 'industrySubField',
      options: [
        { label: 'أكاديمية تدريب مهني', weight: 2 },
        { label: 'منصة تعليمية أونلاين', weight: 2 },
        { label: 'حضانة أو مدرسة', weight: 1 },
        { label: 'مركز لغات', weight: 2 },
      ],
    },
  ],
  'travel': [
    {
      id: 'travel-sub1',
      text: 'ما نوع خدمة السياحة؟',
      hint: 'حدد النشاط السياحي.',
      type: 'single',
      answerKey: 'industrySubField',
      options: [
        { label: 'شركة سياحة وسفر', weight: 2 },
        { label: 'فندق أو منتجع', weight: 3 },
        { label: 'شركة نقل سياحي', weight: 2 },
        { label: 'تجارب سياحية', weight: 2 },
      ],
    },
  ],
  'production': [
    {
      id: 'prod-sub1',
      text: 'ما نوع الإنتاج؟',
      hint: 'حدد التخصص.',
      type: 'single',
      answerKey: 'industrySubField',
      options: [
        { label: 'إنتاج فيديو', weight: 2 },
        { label: 'ستوديو تصوير', weight: 2 },
        { label: 'وكالة إعلان', weight: 3 },
        { label: 'موشن جرافيك', weight: 2 },
      ],
    },
  ],
};

export const stageSubQuestions: Record<string, SubQuestion> = {
  'startup': {
    id: 'stage-startup',
    text: 'ما التحدي الأكبر كبراند ناشئ؟',
    hint: 'هذا يساعدنا في توجيه الهوية.',
    type: 'single',
    answerKey: 'stageChallenge',
    options: [
      { label: 'بناء الثقة من الصفر', weight: 3 },
      { label: 'التميز في سوق مزدحم', weight: 2 },
      { label: 'ميزانية محدودة', weight: 1 },
      { label: 'عدم وضوح الهوية بعد', weight: 2 },
    ],
  },
  'rebrand': {
    id: 'stage-rebrand',
    text: 'لماذا تريد إعادة بناء الهوية؟',
    hint: 'فهم الدوافع يساعد في التوجيه.',
    type: 'single',
    answerKey: 'stageChallenge',
    options: [
      { label: 'الهوية الحالية عفا عليها الزمن', weight: 2 },
      { label: 'توسع المشروع ويحتاج مظهراً أقوى', weight: 3 },
      { label: 'تغيير في الجمهور أو الخدمات', weight: 3 },
      { label: 'تجربة سابقة غير ناجحة', weight: 2 },
    ],
  },
  'established': {
    id: 'stage-established',
    text: 'ما الذي ينقص هويتك الحالية؟',
    hint: 'حدد الفجوة.',
    type: 'single',
    answerKey: 'stageChallenge',
    options: [
      { label: 'تحتاج عناصر إضافية (تغليف، سوشيال)', weight: 2 },
      { label: 'تحتاج دليل براند شامل', weight: 3 },
      { label: 'تريد تحديثاً جزئياً', weight: 1 },
      { label: 'التوسع لأسواق جديدة', weight: 3 },
    ],
  },
};
