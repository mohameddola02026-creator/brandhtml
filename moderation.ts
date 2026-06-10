import { ContentCheckResult, ModerationResult } from './types';

// Comprehensive Arabic profanity - Egyptian, Gulf, Levantine, and Modern Standard
const arabicProfanity = [
  // Core profanity
  'كس', 'كسب', 'كسخ', 'كسم', 'كسمك', 'كسختك', 'كسخت', 'كس امك', 'كس ام', 'كس اختك',
  'كس امكو', 'كس ابو', 'كس عمك', 'كس خالك', 'كس خالتك', 'كس كلب', 'كس حمير',
  'زب', 'زبب', 'زبي', 'زبك', 'زبكو', 'زب ابو', 'زب ام', 'زب طيز',
  'نياك', 'نيك', 'نكح', 'نكحك', 'منيك', 'منيكة', 'منيكك', 'نيكوك',
  'متناك', 'متناكة', 'متناكك', 'متناكو', 'متنك', 'متناكه',
  'شرموط', 'شرموطة', 'شرمط', 'شراميط', 'شرموطك', 'شرموطه',
  'قحبة', 'قحاب', 'قحبه', 'قحب', 'قحبتك',
  'عاهرة', 'عاهور', 'عهر', 'عهرات',
  'زنا', 'زانية', 'زاني', 'زناة', 'زناء',
  'بغا', 'بغاء', 'بغية',
  'لوطي', 'لواط', 'لواطي', 'لواطة',
  'خولي', 'خولة', 'خول',
  'قواد', 'قوادة', 'قوادة', 'قوادون',

  // Egyptian specific
  'معرص', 'معرصة', 'عرص', 'عرصة', 'عرصين',
  'معفن', 'عفن', 'معفنين', 'عفنة',
  'وسخ', 'وسخة', 'موصة', 'موصوص',
  'جربانة', 'جرب', 'جربان', 'قراد', 'قرف',
  'فرخة', 'فرخ', 'فراخ',
  'حمير', 'حمار', 'حمير', 'حمران',
  'كلب', 'كلاب', 'كلب ابن', 'يا ابن الكلب',
  'خنازير', 'خنزير', 'خنز', 'خنزارة',
  'حيوان', 'حيوانات',
  'تبن', 'تبي', 'تبنك',
  'خرا', 'خراء', 'خرء', 'خراك', 'خرتك',
  'طز', 'طزك', 'طز من',
  'زفت', 'زبالة', 'زبالة',
  'هقر', 'هقرك', 'هقراء',
  'سكس', 'سكسي', 'سكسة',
  'نيك', 'نياكة', 'نكاح',

  // More Egyptian slang
  'كسمك', 'كسمكو', 'كسختك', 'كس أمك', 'كس اختك',
  'يا ابن الشرموطة', 'يا ابن القحبة', 'يا ابن الوسخة',
  'يا ابن الحرام', 'يا ابن المتناكة', 'يامنيك', 'يامنيكة',
  'يا خرا', 'يا زبالة', 'ya weskha', 'ya hmar',
  'عمك', 'عميك', 'خالك', 'ختك', 'عرصك',
  'فشخ', 'فشخك', 'فشخة',
  'حشيشي', 'مخنوق', 'مسحوق',
  'قرني', 'قروي', 'بلدي', 'فلاح', 'سايق',
  'كسخرة', 'كسخري', 'كسختة',

  // Body parts in inappropriate context
  'طيز', 'طيزك', 'طيزي', 'طيزة',
  'عير', 'عيرك', 'عيري',
  'طولبة', 'نطع',
  'خصية', 'خصيتين', 'بيضات',
  'بظر', 'فرج', 'عضو',

  // Sexual acts
  'مضاجعة', 'جماع', 'نيك', 'نكاح', 'اغتصاب', 'تحرش',
  'قذف', 'استمناء', 'عادة سرية', 'جنس', 'جنسي',
  'لواط', 'سحاق', 'سحاقيات',
  'جنس ثالث', 'مثلي', 'مثلية',

  // Religious/Moral offensive
  'اللعنة', 'اللعن', 'لعنة', 'ملعون', 'ملعونة', 'لعين',
  'سحق', 'مسحوق', 'سحقت',
  'تبا', 'تبا ل', 'تبا علي',
  'ويل', 'ويلا', 'ويل ل',
  'كافر', 'كفار', 'كفرة', 'تكفير', 'تكفيري',
  'مشرك', 'مشركين', 'شرك', 'وثني',
  'ملحد', 'ملحدين', 'إلحاد', 'الحاد',
  'زنديق', 'زندقة',
  'مرتد', 'رتدة', 'ردة',

  // Curses
  'عنك', 'عن أمك', 'عن أبيك',
  'يلعن', 'يلعنك', 'يلعن أمك', 'يلعن أبو', 'يلعن أبوكي',
  'يلعن شرفك', 'يلعن اهلك',
  'عليك اللعنة', 'عليكم اللعنة',
];

// English profanity - comprehensive list
const englishProfanity = [
  // F-words
  'fuck', 'fucking', 'fucked', 'fucker', 'fuckers', 'fuckin', 'fuck you',
  'motherfucker', 'motherfuckers', 'motherfucking',

  // Sexual
  'sex', 'sexual', 'sexy', 'horny', 'nude', 'naked', 'nudes',
  'porn', 'porno', 'pornography', 'pornographic', 'pornhub', 'xvideos', 'xnxx',
  'xxx', 'adult', 'adult content', 'adult entertainment',
  'penis', 'vagina', 'dick', 'cock', 'pussy', 'tits', 'boobs', 'breasts',
  'ass', 'asshole', 'butt', 'butthole', 'anal',
  'cum', 'cumshot', 'sperm', 'semen',
  'blowjob', 'handjob', 'masturbation', 'masturbate',
  'orgasm', 'orgasms', 'climax',
  'erotic', 'erotica', 'kinky', 'fetish',
  'prostitute', 'prostitution', 'hooker', 'escort', 'brothel', 'whore', 'slut',
  'stripper', 'strip club',

  // B-words
  'bitch', 'bitches', 'bitchy', 'son of a bitch',
  'bastard', 'bastards',

  // Offensive
  'shit', 'shits', 'shitting', 'shitty', 'bullshit', 'horseshit', 'crap',
  'damn', 'goddamn', 'goddamned',
  'hell', 'what the hell', 'bloody hell',

  // Racial/ethnic slurs
  'nigger', 'niggers', 'nigga', 'niggas',
  'negro', 'negroes',
  'chink', 'chinks',
  'spic', 'spics',
  'kike', 'kikes',
  'wetback', 'wetbacks',
  'towelhead',
  'camel jockey',
  'sand nigger',
  'raghead',

  // LGBTQ+ slurs
  'fag', 'faggot', 'fags', 'faggots',
  'dyke', 'dykes',
  'tranny', 'trannies',
  'queer', 'homo', 'homos',

  // Mental/physical insults
  'retard', 'retarded', 'retards',
  'idiot', 'idiots', 'moron', 'morons', 'imbecile',
  'stupid', 'dumb', 'dumbass',
  'cripple', 'crippled', 'spastic',

  // Hate/violence
  'hate', 'kill', 'murder', 'assassinate', 'slaughter',
  'terrorist', 'terrorism', 'terror', 'bomb', 'bomber',
  'nazi', 'nazis', 'hitler', 'hitler youth', 'white power', 'white supremacy',
  'kkk', 'ku klux klan',
  'isis', 'isil', 'al qaeda', 'taliban', 'jihad', 'jihadist',
  'extremist', 'extremism', 'radical', 'radicalized',

  // Drugs
  'drugs', 'drug dealer', 'drug dealer', 'drug lord', 'cartel',
  'cocaine', 'coke', 'crack', 'crack cocaine',
  'heroin', 'smack', 'junk', 'junkie',
  'meth', 'methamphetamine', 'crystal meth', 'ice', 'crank',
  'marijuana', 'weed', 'pot', 'grass', 'ganja', 'mary jane', 'cannabis',
  'lsd', 'acid', 'ecstasy', 'mdma', 'molly', 'mushrooms', 'shrooms',
  'opium', 'opiates', 'opioids', 'fentanyl',
  'dealer', 'pusher', 'addict', 'addiction',

  // Gaming/inappropriate
  'rape', 'rapist', 'raping', 'raped',
  'molestation', 'molest', 'molester', 'pedophile', 'paedophile', 'pedo',
  'abuse', 'abused', 'abuser',
  'suicide', 'kill yourself', 'kys', 'self-harm', 'cutting',

  // Religious offense
  'god damn', 'goddamn', 'jesus christ', 'jesus fucking christ', 'jesus h christ',
  'holy shit', 'holy fuck',
  'damn god', 'curse god',
];

// Drugs and forbidden substances in Arabic
const drugsArabic = [
  'مخدرات', 'مُخدرات', 'مخدر', 'مخدرة', 'مخدراتية',
  'حشيش', 'حشيشة', 'بانجو', 'بوس', 'أفيون', 'افيون',
  'كوكايين', 'كوكا', 'كوكايينية',
  'هيروين', 'هيروينية', 'سم أبيض',
  'مورفين', 'مورفينة',
  'امفيتامين', 'أمفيتامين', 'منشطات',
  'كبسولات', 'حبوب', 'حبوب مخدرة',
  'كودايين', 'ترامادول', 'ترامال', 'تامول',
  'ال إس دي', 'lsd', 'ايس',
  'اكستاسي', 'extasy', 'mdma', 'مولي',
  'مهلوسات', 'هلوسة',
  'تاجر مخدرات', 'تاجر مخدر', 'بارون مخدرات',
  'مدمن', 'إدمان', 'مدمنين',
  'حقنة', 'حقن مخدر', 'سرنجة',
];

// Gambling and forbidden activities in Arabic
const gamblingArabic = [
  'قمار', 'قمارم', 'مقامرة', 'قمرة',
  'يانصيب', 'لاعبي',
  'كازينو', 'كازينوهات', 'كازينو أون لاين',
  'مراهنات', 'مراهنة', 'رهان', 'رهانات',
  'سحوبات', 'سحب', 'جوائز نقدية', 'ربح سريع',
  'سلوتس', 'سلوت', 'slots', 'poker', 'بوكير',
  'blackjack', 'roulette', 'روليت', 'بلاك جاك',
  'bettting', 'bet', 'betting site',
  'حظ', 'لعب الحظ', 'ألعاب الحظ', 'ألعاب حظ',
];

// Alcohol in Arabic
const alcoholArabic = [
  'خمر', 'خمور', 'خمرة', 'مخمور',
  'كحول', 'كحوليات', 'مشروبات كحولية',
  'بيرة', 'بير', 'جعة', 'جعات',
  'ويسكي', 'ويسكى', 'whisky', 'whiskey',
  'فودكا', 'vodca', 'vodka',
  'روم', 'جين', 'gin', 'rum',
  'نبيذ', 'خمر العنب', 'wine',
  'شمبانيا', 'champagne',
  'براندي', 'brandy', 'كونياك', 'cognac',
  'تيكيلا', 'tezila', 'tequila',
  'أراك', 'عرق', 'arak', 'araak',
  'مشروبات روحية',
];

// Forbidden content types in Arabic
const forbiddenContentArabic = [
  'إباحية', 'اباحية', 'أباحية', 'محتوى إباحي',
  'سكس', 'جنسي', 'جنسية', 'محتوى جنسي',
  'عري', 'تعري', 'مخلة', 'مخل',
  'فاحشة', 'فواحش', 'رذيلة', 'رذائل',
  'ماسج للكبار', 'massage', 'ساونا',
  'راقصات', 'راقصة', 'رقص شرقي',
  'ليلي', 'سهرات ليلية', 'كباريهات', 'كباريه',
];

// Religious extremism and terrorism terms
const extremismTerms = [
  // Arabic
  'ارهاب', 'إرهاب', 'ارهابي', 'إرهابي', 'إرهابية', 'ارهابية',
  'تفجير', 'متفجرات', 'قنبلة', 'عبوة ناسفة', 'استشهادي', 'مفخخة',
  'قتل', 'اغتيال', 'تصفية', 'ذبح',
  'جهاد', 'جهادي', 'جهادية', 'مجاهدين',
  'تكفير', 'تكفيري', 'تكفيريين',
  'خلافة', 'خلافة إسلامية', 'داعش', 'دواعش',
  'نصرة', 'نصريين', 'جبهة النصرة',
  'قاعدة', 'القاعدة', 'طالبان', 'حزب الله',
  'حرق', 'تفجير نفسي', 'سيارة مفخخة',
  // English
  'terror', 'terrorist', 'terrorism', 'terror attack', 'terror cell',
  'bomb', 'bomber', 'bombing', 'explosive', 'ied', 'suicide bomb',
  'martyr', 'martyrdom', 'suicide attack', 'suicide mission',
  'jihad', 'jihadi', 'jihadist', 'holy war',
  'taliban', 'al-qaeda', 'al qaeda', 'qaida', 'hezbollah', 'hizbullah',
  'isis', 'isil', 'daesh', 'daish', 'caliphate', 'islamic state',
];

// Banned company industries in Arabic
const bannedIndustriesArabic = [
  'ماركض', 'مسارات', 'كازينو', 'قمار', 'يانصيب',
  'بار', 'بارات', 'حانة', 'حانات', 'كباريه',
  'مشروبات روحية', 'خمور', 'كحول',
  'سجائر', 'سجارة', 'دخان', 'تبغ', 'سج',
  'شيشة', 'أراجيلة', 'فاب', 'فيب', 'vape',
  'أسلحة', 'سلاح', 'مسدس', 'بندقية', 'رشاش',
  'ذخيرة', 'طلقات',
  'إباحي', 'adult content',
  'مخدرات', 'تجارة مخدرات',
];

export function checkContent(text: string): ContentCheckResult {
  if (!text || text.trim().length === 0) {
    return { isClean: true, flaggedWords: [], severity: 'none', message: '' };
  }

  const normalizedInput = text.toLowerCase()
    .replace(/[أإآا]/g, 'ا')
    .replace(/[ةه]/g, 'ه')
    .replace(/[يى]/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const allBannedWords = [
    ...arabicProfanity,
    ...englishProfanity,
    ...drugsArabic,
    ...gamblingArabic,
    ...alcoholArabic,
    ...forbiddenContentArabic,
    ...extremismTerms,
    ...bannedIndustriesArabic,
  ];

  const flaggedWords: string[] = [];
  let hasCritical = false;

  for (const word of allBannedWords) {
    const normalizedWord = word.toLowerCase();
    if (normalizedInput.includes(normalizedWord)) {
      flaggedWords.push(word);

      if (arabicProfanity.includes(word) || englishProfanity.includes(word)) {
        hasCritical = true;
      }
    }
  }

  if (flaggedWords.length === 0) {
    return { isClean: true, flaggedWords: [], severity: 'none', message: '' };
  }

  if (hasCritical) {
    return {
      isClean: false,
      flaggedWords: [...new Set(flaggedWords)],
      severity: 'critical',
      message: 'تم اكتشاف محتوى مخالف وغير لائق. لا يمكن الاستكمال - تم رصد بيانات مخلة وغير أخلاقية. نأسف، لا نستطيع العمل مع هذا المحتوى. يرجى المراجعة وإعادة المحاولة.'
    };
  }

  return {
    isClean: false,
    flaggedWords: [...new Set(flaggedWords)],
    severity: 'warning',
    message: 'تم اكتشاف كلمات قد تكون غير مناسبة. يرجى المراجعة والتأكد من احترافية المحتوى.'
  };
}

export function checkAllAnswers(answers: Record<string, string | string[]>): ModerationResult {
  const textFields: string[] = [];
  const textFieldKeys = [
    'brandName', 'brandActivity', 'slogan', 'vision', 'competitors',
    'additionalNotes', 'industryOther', 'referenceLinks'
  ];

  for (const key of textFieldKeys) {
    const value = answers[key];
    if (typeof value === 'string' && value.trim()) {
      textFields.push(value);
    }
  }

  const allBlockedWords: string[] = [];
  let hasCritical = false;

  for (const text of textFields) {
    const result = checkContent(text);
    if (!result.isClean) {
      allBlockedWords.push(...result.flaggedWords);
      if (result.severity === 'critical') {
        hasCritical = true;
        break; // Stop immediately on critical
      }
    }
  }

  if (allBlockedWords.length === 0) {
    return { isClean: true, flaggedWords: [], message: '' };
  }

  if (hasCritical) {
    return {
      isClean: false,
      flaggedWords: [...new Set(allBlockedWords)],
      message: '⚠️ تنبيه هام: تم اكتشاف محتوى غير لائق أو مخالف للمعايير الأخلاقية. لا يمكن الاستكمال مع هذا المحتوى. نحافظ على بيئة عمل احترافية ونلتزم بأعلى معايير الأخلاق. يرجى إعادة المحاولة بمدخلات مناسبة.'
    };
  }

  return {
    isClean: false,
    flaggedWords: [...new Set(allBlockedWords)],
    message: 'تم اكتشاف كلمات قد تحتاج مراجعة. يرجى التأكد من احترافية المحتوى المُدخل.'
  };
}

export function checkTextImmediately(text: string): { isClean: boolean; message: string } {
  const result = checkContent(text);
  if (!result.isClean && result.severity === 'critical') {
    return {
      isClean: false,
      message: result.message
    };
  }
  return { isClean: true, message: '' };
}
