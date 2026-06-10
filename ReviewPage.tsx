import { BrandAnswers } from '../engine/types';
import { questions } from '../engine/questions';
import {
  ArrowLeft, ChevronRight, Sparkles, Eye,
} from 'lucide-react';

interface ReviewPageProps {
  answers: BrandAnswers;
  onBack: () => void;
  onProceed: () => void;
}

export default function ReviewPage({ answers, onBack, onProceed }: ReviewPageProps) {
  const entries: { key: string; label: string; value: string; reason: string }[] = [];

  const reasonMap: Record<string, (v: string | string[]) => string> = {
    brandName: () => 'الاسم هو حجر الأساس — منه يُشتق الشعار والهوية.',
    brandActivity: () => 'يحدد التوجه البصري والرموز المستخدمة.',
    slogan: (v) => v ? 'الشعار اللفظي يكمل الرسالة ويعزز التذكر.' : 'لا يوجد — المصمم سيقترح شعاراً لفظياً مناسباً.',
    industry: () => 'القطاع يحدد المنافسين والتوجهات والألوان المناسبة.',
    industrySubField: () => 'التخصص الدقيق يحدد الرموز والأسلوب الأمثل.',
    projectStage: (v) => {
      if (v?.toString().includes('ناشئ')) return 'مشروع ناشئ يحتاج هوية مرنة قابلة للتطور.';
      if (v?.toString().includes('إعادة')) return 'إعادة بناء تتطلب تفكيك الهوية القديمة أولاً.';
      return 'يحدد نقطة البداية وعمق البحث المطلوب.';
    },
    stageChallenge: () => 'التحدي يوجه تركيز المصمم على المشكلة الأهم.',
    vision: (v) => v ? 'الرؤية واضحة — هذا يسرع عملية التصميم.' : 'لا توجد رؤية — المصمم سيبنيها من إجاباتك.',
    targetAudience: () => 'الجمهور يحدد نبرة الهوية والتعقيد البصري.',
    audienceAge: () => 'العمر يحدد الأسلوب: كلاسيكي للكبار، حديث للشباب.',
    audienceGender: () => 'الجندر يحدد نعومة أو قوة العناصر البصرية.',
    audienceEconomic: () => 'المستوى الاقتصادي يحدد مدى الفخامة المطلوبة.',
    geography: () => 'الجغرافيا تحدد العملة ومدى تعقيد الهوية عبر الثقافات.',
    governorate: () => 'المحافظة توجه الهوية نحو عناصر محلية مميزة.',
    businessSize: () => 'حجم المشروع يحدد عدد التطبيقات ونطاق الهوية.',
    pricePosition: () => 'تموضع السعر يحدد عمق التعقيد البصري والخامات المستخدمة.',
    competitors: (v) => v ? 'معرفة المنافسين تضمن التمايز والتفرد.' : 'سيتم البحث عن المنافسين في القطاع.',
    brandPersonality: () => 'الشخصية تترجم مباشرة لأشكال وألوان وخطوط.',
    brandArchetype: () => 'الأصل (Archetype) يحدد الروح العميقة للهوية البصرية.',
    logoDirection: () => 'التوجه الفني يحدد أسلوب تنفيذ الشعار.',
    preferredColors: () => 'الألوان تخلق الانطباع الأول وتربط البراند بالمشاعر.',
    deliverableScope: () => 'حجم المخرجات يحدد الباقة والسعر.',
    previousExperience: () => 'الخبرة السابقة توجه توقعات المصمم.',
    visualHistory: () => 'التاريخ البصري يحدد نقطة الانطلاق.',
    applicationChannels: () => 'القنوات تحدد أحجام وصيغ المخرجات.',
    typographyStyle: () => 'الخطوط هي صوت البراند — تحدد الانطباع العام.',
    typographyDetail: () => 'مستوى التفصيل في الخطوط يؤثر على الجودة والتكلفة.',
    investmentPhilosophy: () => 'فلسفة الاستثمار تحدد التزامك بجودة المخرجات.',
    budgetRange: () => 'الميزانية توجه الباقة المناسبة ومستوى التفاصيل.',
    referenceFiles: (v) => {
      const arr = v as string[];
      return arr?.length > 0 ? 'المراجع تساعد المصمم في فهم ذوقك بدقة.' : 'لا توجد مراجع — المصمم سيبني من الصفر.';
    },
    referenceLinks: (v) => v ? 'الروابط تعطي المصمم اتجاهاً بصرياً واضحاً.' : '',
    timelineDays: () => 'الوقت يحدد الجودة المتوقعة والسعر النهائي.',
    timelineSlot: () => 'فترة التواصل تضمن سير العمل بسلاسة.',
    additionalServices: () => 'خدمات إضافية تعزز قيمة الهوية وتكاملها.',
    additionalNotes: (v) => v ? 'ملاحظاتك تكمل الصورة وتضمن عدم تفويت أي تفصيلة.' : '',
  };

  for (const q of questions) {
    const rawValue = answers[q.answerKey];
    if (rawValue === undefined || rawValue === null || rawValue === '' ||
        (Array.isArray(rawValue) && rawValue.length === 0)) continue;

    const displayValue = Array.isArray(rawValue) ? rawValue.join(' ، ') : String(rawValue);
    if (!displayValue || displayValue === '0') continue;

    const reason = reasonMap[q.answerKey]?.(Array.isArray(rawValue) ? rawValue : String(rawValue)) || 'هذا العامل يؤثر في تحديد الباقة والسعر والتوجه البصري.';

    entries.push({
      key: q.id,
      label: q.text,
      value: displayValue,
      reason,
    });
  }

  return (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/15 flex items-center justify-center border border-gold/30">
          <Eye className="w-8 h-8 text-gold" />
        </div>
        <div className="font-display text-[11px] tracking-[4px] text-gold/70 uppercase mb-3">
          Review Your Answers
        </div>
        <h2 className="font-cairo text-2xl font-bold text-warm mb-2">
          مراجعة إجاباتك
        </h2>
        <p className="text-mid text-sm leading-7 max-w-lg mx-auto">
          قبل عرض النتائج — تأكد من إجاباتك. كل إجابة تؤثر على التوصيات والتسعير.
        </p>
      </div>

      <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto no-scrollbar">
        {entries.map((entry) => (
          <div key={entry.key} className="glass-panel rounded-xl p-5">
            <div className="text-gold text-xs font-bold mb-1.5">{entry.label}</div>
            <div className="text-warm text-sm font-semibold mb-2 leading-relaxed">{entry.value}</div>
            <div className="flex items-start gap-2 bg-gold/5 rounded-lg px-3 py-2 border border-gold/10">
              <Sparkles className="w-3.5 h-3.5 text-gold mt-0.5 flex-shrink-0" />
              <p className="text-silver text-xs leading-5">{entry.reason}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 sticky bottom-0 bg-charcoal/90 backdrop-blur-xl p-4 rounded-xl -mx-4">
        <button
          className="btn-outline flex items-center gap-2"
          onClick={onBack}
        >
          <ChevronRight className="w-4 h-4" />
          السابق
        </button>
        <div className="flex-1" />
        <button
          className="btn-gold flex items-center gap-2"
          onClick={onProceed}
        >
          عرض التحليل الذكي
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
