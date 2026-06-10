import { IndustryType, IndustryInsights } from './types';

interface IndustryData {
  nameAr: string;
  topCompetitors: string[];
  trends: string[];
  recommendedColors: string[];
  recommendedStyles: string[];
  tips: string[];
  basePriceMultiplier: number;
  internationalMultiplier: number;
}

const industryDatabase: Record<IndustryType, IndustryData> = {
  real_estate: {
    nameAr: 'التطوير العقاري والمقاولات',
    topCompetitors: [
      'طلعت مصطفى جروب', 'ماونتن فيو', 'سوديك', 'بالم هيلز',
      'Emaar Misr', 'Ora Developers', 'هيدروبيا', 'لا فيستا', 'Almarasim'
    ],
    trends: [
      'تصاميم ثلاثية الأبعاد (3D) تحاكي المشاريع',
      'ألوان داكنة مع لمسات ذهبية تعكس الفخامة',
      'رموز هندسية معمارية في الشعارات',
      'تيبوجرافي كلاسيكية مع عناصر حديثة',
      'فيديوهات رندر CGI للمشاريع'
    ],
    recommendedColors: ['dark-luxury', 'royal', 'trust'],
    recommendedStyles: ['مونوغرام ملكي مع تفاصيل هندسية', 'ختم رسمي بإطار فخم', 'تيبوجرافي كلاسيكي فاخر'],
    tips: [
      'يركز العملاء العقاريين على الثقة والاستقرار',
      'الخطوط الكلاسيكية (Serif) تعطي انطباع العراقة والرسوخ',
      'استخدام عناصر هندسية معمارية يسهل التعرف على النشاط',
      'الألوان الكحلية والذهبية هي الأكثر استخداماً'
    ],
    basePriceMultiplier: 1.2,
    internationalMultiplier: 1.8
  },
  hospitality: {
    nameAr: 'المطاعم والكافيهات والضيافة',
    topCompetitors: [
      'كوستا كوفي', 'ستاربكس', 'كافيه ريتش', 'أندريا',
      'سينابون', 'ماكدونالدز', 'كايزر', 'الشعلان', 'أبو السيد', 'النقيب'
    ],
    trends: [
      'تصاميم مينيمالية عصرية',
      'ألوان دافئة ومشرقة',
      'رموز غذائية مبسطة وأنيقة',
      'تيبوجرافي مقروءة وواضحة',
      'تجربة العميل الشاملة (Customer Experience)'
    ],
    recommendedColors: ['energy', 'earthy', 'organic'],
    recommendedStyles: ['مينيمالية فاخرة مع فراغ سلبي', 'رمزية تجريدية مبتكرة', 'تيبوجرافي عصري ودافئ'],
    tips: [
      'الألوان الدافئة تفتح الشهية وتخلق جو ترحيبي',
      'الخطوط الواضحة سهلة القراءة على قوائم الطعام',
      'الرموز المبسطة تعمل بشكل ممتاز على الأكياس',
      'تجنب التعقيد البصري - البساطة أناقة'
    ],
    basePriceMultiplier: 1.0,
    internationalMultiplier: 1.5
  },
  fashion: {
    nameAr: 'الموضة والأزياء والعطور',
    topCompetitors: [
      'مودانيسي', 'هانم السلطان', 'نيلي', 'زهير مراد',
      'شمس العمالقة', 'إلي صابا', 'هالة شيرين', 'ميمي', 'لوي مارك'
    ],
    trends: [
      'تكستشر بصري راقي (Textures)',
      'ألوان جريئة ومتباينة',
      'شعارات مكتوبة بخطوط مخصصة',
      'رموز تعبر عن الأناقة والتميز',
      'تصميمات تعمل على ملصقات وتغليف فاخر'
    ],
    recommendedColors: ['royal', 'dark-luxury', 'energy'],
    recommendedStyles: ['مونوغرام ملكي', 'تيبوجرافي مخصص بلمسة فنية', 'رمزية بسيطة وأنيقة'],
    tips: [
      'الفخامة البصرية ضرورية في عالم الأزياء',
      'الخطوط العربية المخصصة تعطي تميزاً للبراندات المحلية',
      'الألوان الذهبية والسوداء هي معيار الفخامة',
      'التصميم يجب أن يعمل على ملصقات وتغليف متعددة'
    ],
    basePriceMultiplier: 1.3,
    internationalMultiplier: 2.0
  },
  technology: {
    nameAr: 'التقنية والبرمجيات والذكاء الاصطناعي',
    topCompetitors: [
      'مصروف', 'عقدة', 'ألف', 'فوري سيكورت', 'سيلفر كي',
      'سفير', 'فام', 'كريم', 'أوبر', 'فودافون كاش'
    ],
    trends: [
      'تصاميم مستقبلية ومينيمالية',
      'تدرجات لونية جريئة (Gradients)',
      'أيقونات مبسطة ومفهومة',
      'موشن جرافيك وتحريك رقمي',
      'تصميمات متجاوبة Responsive'
    ],
    recommendedColors: ['trust', 'dark-luxury', 'organic'],
    recommendedStyles: ['مينيمالية حديثة ونظيفة', 'رمزية تجريدية ذكية', 'تيبوجرافي تقني دقيق'],
    tips: [
      'البساطة والوضوح أساس النجاح في التك',
      'الألوان الكحلية والفيروزية تعكس الثقة التقنية',
      'الأيقونات يجب أن تعمل بأحجام صغيرة (App Icons)',
      'الموشن والانيميشن مكمل أساسي للبراند التقني'
    ],
    basePriceMultiplier: 1.1,
    internationalMultiplier: 1.7
  },
  medical: {
    nameAr: 'العيادات والمراكز الطبية والتجميل',
    topCompetitors: [
      'مستشفى النيل بدراوي', 'مستشفى دار الفؤادة', 'عيادات كليوباترا',
      'مراكز دكتور كمال', 'مركز ميتروبل', 'مستشفى دار الشفاء',
      'مراكز لاين', 'عيادات أورايد', 'مركز أورا للأسنان'
    ],
    trends: [
      'ألوان هادئة ومطمئنة',
      'رموز طبية مبسطة',
      'تيبوجرافي واضحة ومقروءة',
      'تصاميم نظيفة تعكس الاحترافية',
      'لوحات خارجية وإرشادية واضحة'
    ],
    recommendedColors: ['trust', 'organic', 'royal'],
    recommendedStyles: ['مينيمالية نظيفة ومطمئنة', 'رمزية مهنية وواضحة', 'تيبوجرافي سهل القراءة'],
    tips: [
      'الألوان الكحلية والخضراء تعطي انطباع النظافة والأمان',
      'تجنب الأحمر الصارخ - قد يثير التوتر الطبي',
      'الخطوط يجب أن تكون سهلة القراءة للمرضى',
      'التخصص الطبي يتطلب مظهراً موثوقاً ومطمئناً'
    ],
    basePriceMultiplier: 1.15,
    internationalMultiplier: 1.6
  },
  ecommerce: {
    nameAr: 'التجارة الإلكترونية والمتاجر',
    topCompetitors: [
      'نون', 'فاشون', 'أمازون', 'جوميا', 'صيداوي',
      'بوسطة', 'أولكس', 'مصروف ماركت', 'سبايس', 'أوكر'
    ],
    trends: [
      'ألوان نابضة وجذابة',
      'رموز سهلة الحفظ والتذكر',
      'تصاميم تعمل على أيقونات التطبيقات',
      'تيبوجرافي محفزة للشراء',
      'تصميمات متوافقة مع المنصات الرقمية'
    ],
    recommendedColors: ['energy', 'trust', 'royal'],
    recommendedStyles: ['رمزية جريئة ومميزة', 'مينيمالية عصرية', 'تيبوجرافي ديناميكية'],
    tips: [
      'التميز البصري ضروري في السوق المزدحم',
      'الألوان الزاهية تجذب الانتباه على المنصات',
      'التصميم يجب أن يظهر بوضوح على الهواتف',
      'تسهيل التعرف على البراند بسرعة'
    ],
    basePriceMultiplier: 0.9,
    internationalMultiplier: 1.4
  },
  education: {
    nameAr: 'التعليم والتدريب والأكاديميات',
    topCompetitors: [
      'الجونة الأكاديمية', 'نيو جيزر', 'المعهد البريطاني',
      'أكاديمية روزيتا', 'إدراك', 'كورسيرا', 'أوداسيتي', 'بوابة التعليم'
    ],
    trends: [
      'تصاميم تعليمية حديثة ومحفزة',
      'ألوان هادئة تحفز التركيز',
      'رموز معرفية وتربوية',
      'تجربة تعلم ممتعة (Gamification)',
      'منصات رقمية تفاعلية'
    ],
    recommendedColors: ['trust', 'organic', 'royal'],
    recommendedStyles: ['مينيمالية تعليمية', 'رمزية معرفية', 'تيبوجرافي مقروءة وواضحة'],
    tips: [
      'الألوان الهادئة تحفز التركيز والتعلم',
      'الرموز المعرفية تسهل التعرف على النشاط',
      'التصميم يجب أن يوحي بالمعرفة والموثوقية',
      'البساطة والوضوح أساس التصميم التعليمي'
    ],
    basePriceMultiplier: 0.9,
    internationalMultiplier: 1.3
  },
  travel: {
    nameAr: 'السفر والسياحة والفنادق',
    topCompetitors: [
      'ترايفجو', 'فلاي إن', 'شتاتنا', 'إيزي تورز',
      'فنادق ماريوت', 'هيلتون', 'أكور', 'فيرمونت'
    ],
    trends: [
      'تصاميم تحفز الاستكشاف والمغامرة',
      'ألوان طبيعية مستوحاة من الوجهات',
      'رموز سفرية وأيقونات مميزة',
      'تجربة حجز سلسة وممتعة',
      'محتوى مرئي غني بالوجهات'
    ],
    recommendedColors: ['organic', 'energy', 'trust'],
    recommendedStyles: ['مينيمالية سفرية', 'رمزية استكشافية', 'تيبوجرافي حيوية وديناميكية'],
    tips: [
      'الألوان المستوحاة من الطبيعة تحفز الاستكشاف',
      'الصور والرموز السياحية تخلق رابطاً عاطفياً',
      'التصميم يجب أن يوحي بالثقة والأمان',
      'المرئيات هي العنصر الأقوى في السياحة'
    ],
    basePriceMultiplier: 1.0,
    internationalMultiplier: 1.5
  },
  production: {
    nameAr: 'الإنتاج والإعلان والستوديوهات',
    topCompetitors: [
      'وكالة بيان', 'فوكس أدفيرتايزينج', 'ديماك', 'أفكار',
      'أرجانز', 'غرافيك أرابيا', 'رويال مديا', 'إنتاج بلس'
    ],
    trends: [
      'تصاميم سينمائية ومتحركة',
      'ألوان جريئة وتدرجات متقدمة',
      'رموز إنتاجية وإبداعية',
      'موشن جرافيك و3D',
      'تجربة بصرية غامرة ومبتكرة'
    ],
    recommendedColors: ['dark-luxury', 'energy', 'royal'],
    recommendedStyles: ['مينيمالية سينمائية', 'رمزية إبداعية جريئة', 'تيبوجرافي مخصصة ومبتكرة'],
    tips: [
      'الإنتاج يتطلب هوية تعكس الإبداع والاحتراف',
      'الألوان الجريئة تعكس الجرأة الفنية',
      'الموشن والانيميشن جزء أساسي من هوية الإنتاج',
      'التصميم يجب أن يوحي بالقصة والسيناريو'
    ],
    basePriceMultiplier: 1.1,
    internationalMultiplier: 1.6
  },
  other: {
    nameAr: 'مجال آخر متخصص',
    topCompetitors: ['الرجاء ذكر المنافسين مباشرة'],
    trends: ['يتحدد حسب طبيعة النشاط'],
    recommendedColors: ['royal', 'dark-luxury'],
    recommendedStyles: ['نظام بصري متكامل'],
    tips: ['سيتم تحديد التوجهات بناءً على تفاصيل المشروع'],
    basePriceMultiplier: 1.0,
    internationalMultiplier: 1.5
  }
};

export function getIndustryInsights(industryLabel: string): IndustryInsights {
  let industryType: IndustryType = 'other';

  if (industryLabel.includes('عقاري') || industryLabel.includes('مقاولات') || industryLabel.includes('هندسية') || industryLabel.includes('ديكور') || industryLabel.includes('عقارات')) {
    industryType = 'real_estate';
  } else if (industryLabel.includes('مطاعم') || industryLabel.includes('كافيه') || industryLabel.includes('ضيافة') || industryLabel.includes('مطعم')) {
    industryType = 'hospitality';
  } else if (industryLabel.includes('موضة') || industryLabel.includes('أزياء') || industryLabel.includes('عطور') || industryLabel.includes('ملابس')) {
    industryType = 'fashion';
  } else if (industryLabel.includes('تقنية') || industryLabel.includes('برمجيات') || industryLabel.includes('ذكاء') || industryLabel.includes('رقمية') || industryLabel.includes('رقميات')) {
    industryType = 'technology';
  } else if (industryLabel.includes('طبية') || industryLabel.includes('تجميل') || industryLabel.includes('عيادات') || industryLabel.includes('صحة') || industryLabel.includes('عيادة')) {
    industryType = 'medical';
  } else if (industryLabel.includes('تجارة') || industryLabel.includes('متاجر') || industryLabel.includes('إلكترونية') || industryLabel.includes('متجر')) {
    industryType = 'ecommerce';
  } else if (industryLabel.includes('تعليم') || industryLabel.includes('تدريب') || industryLabel.includes('أكاديمي')) {
    industryType = 'education';
  } else if (industryLabel.includes('سفر') || industryLabel.includes('سياحة') || industryLabel.includes('فنادق') || industryLabel.includes('فندق')) {
    industryType = 'travel';
  } else if (industryLabel.includes('إنتاج') || industryLabel.includes('إعلان') || industryLabel.includes('ستوديو')) {
    industryType = 'production';
  }

  const data = industryDatabase[industryType];

  return {
    industry: industryType,
    industryNameAr: data.nameAr,
    competitors: data.topCompetitors,
    trends: data.trends,
    recommendedColors: data.recommendedColors,
    recommendedStyles: data.recommendedStyles,
    tips: data.tips
  };
}

export function getIndustryData(industryType: IndustryType): IndustryData {
  return industryDatabase[industryType] || industryDatabase.other;
}

export function detectIndustryFromLabel(label: string): IndustryType {
  if (label.includes('عقاري') || label.includes('مقاولات') || label.includes('هندسية') || label.includes('ديكور') || label.includes('عقارات')) return 'real_estate';
  if (label.includes('مطاعم') || label.includes('كافيه') || label.includes('ضيافة') || label.includes('مطعم')) return 'hospitality';
  if (label.includes('موضة') || label.includes('أزياء') || label.includes('عطور') || label.includes('ملابس') || label.includes('براند')) return 'fashion';
  if (label.includes('تقنية') || label.includes('برمجيات') || label.includes('ذكاء') || label.includes('رقمية') || label.includes('تطبيق')) return 'technology';
  if (label.includes('طبية') || label.includes('تجميل') || label.includes('عيادة') || label.includes('صحة') || label.includes('مركز')) return 'medical';
  if (label.includes('تجارة') || label.includes('متجر') || label.includes('محل') || label.includes('إلكترونية')) return 'ecommerce';
  if (label.includes('تعليم') || label.includes('تدريب') || label.includes('أكاديمي')) return 'education';
  if (label.includes('سفر') || label.includes('سياحة') || label.includes('فندق')) return 'travel';
  if (label.includes('إنتاج') || label.includes('إعلان') || label.includes('ستوديو')) return 'production';
  return 'other';
}

export function calculateIndustryPriceMultiplier(industryType: IndustryType, isInternational: boolean): number {
  const data = industryDatabase[industryType] || industryDatabase.other;
  return isInternational
    ? data.internationalMultiplier
    : data.basePriceMultiplier;
}
