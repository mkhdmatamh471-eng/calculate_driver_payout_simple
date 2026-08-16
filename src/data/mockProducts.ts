import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    nameAr: 'طقم حشوات تجميلية كومبوزيت ضوئي (3M Filtek Z250 Universal)',
    nameEn: '3M Filtek Z250 Universal Composite Kit',
    brand: '3M ESPE',
    category: 'أدوات الحشو والتركيبات',
    priceYER: 85000,
    oldPriceYER: 98000,
    inStock: true,
    stockCount: 18,
    rating: 4.9,
    reviewsCount: 34,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'طقم كومبوزيت دقيق ومتعدد الاستخدامات للأسنان الأمامية والخلفية. يتميز بصلابة فائقة، وثبات في اللون، ومقاومة للتآكل مع سهولة التشكيل والتشطيب.',
    specifications: {
      origin: 'الولايات المتحدة الأمريكية (USA)',
      warranty: 'ضمان الجودة والتخزين الطبي',
      unit: 'طقم يحتوي على 4 سرنجات + حمض التخريش + اللاصق (Bonding)',
      lotExpiry: '2028-06',
      modelNumber: 'Z250-KIT'
    },
    tag: 'الأكثر مبيعاً'
  },
  {
    id: 'prod-002',
    nameAr: 'قبضة أسنان توربين سريعة مع إضاءة LED (NSK Pana-Max Plus)',
    nameEn: 'NSK Pana-Max Plus High Speed Turbine Handpiece LED',
    brand: 'NSK Japan',
    category: 'أدوات الحشو والتركيبات',
    priceYER: 135000,
    oldPriceYER: 155000,
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'قبضة أسنان سريعة عالية الأداء مزودة بتوربين ياباني فائق الهدوء ورشاش ماء ثلاثي للتبريد، مع إضاءة LED ناصعة لرؤية جراحية واضحة.',
    specifications: {
      origin: 'اليابان (Japan)',
      warranty: 'ضمان سنة كاملة ضد عيوب التصنيع',
      unit: 'قطعة واحدة مع مفتاح الفتح وكتالوج التشغيل',
      modelNumber: 'PANA-MAX-LED-M4'
    },
    tag: 'عرض خاص'
  },
  {
    id: 'prod-003',
    nameAr: 'جهاز تعقيم أوتوكلاف رقمي 23 لتر فئة B (W&H Lina Autoclave Class B)',
    nameEn: 'W&H Lina 23L Class B Autoclave Sterilizer',
    brand: 'W&H Dental',
    category: 'التعقيم والسلامة الطبية',
    priceYER: 1850000,
    oldPriceYER: 2100000,
    inStock: true,
    stockCount: 4,
    rating: 5.0,
    reviewsCount: 15,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'جهاز تعقيم أوتوكلاف طبي متقدم سعة 23 لتر يعمل بنظام التفريغ الثلاثي (Class B) المناسب لكافة الأدوات الصلبة والمجوفة والمغلفة بكفاءة معقمة 100%.',
    specifications: {
      origin: 'النمسا (Austria)',
      warranty: 'ضمان سنتين مع صيانة مجانية',
      unit: 'جهاز كامل مع 4 صواني ستانلس ستيل ومطبوعات الضمان',
      modelNumber: 'LINA-23L-B'
    },
    tag: 'حسومات عيادية'
  },
  {
    id: 'prod-004',
    nameAr: 'جهاز تحديد ذروة الجذر الرقمي (Woodpecker Woodpex V Apex Locator)',
    nameEn: 'Woodpecker Woodpex V Digital Apex Locator',
    brand: 'Woodpecker',
    category: 'أجهزة ومعدات العيادات',
    priceYER: 110000,
    oldPriceYER: 130000,
    inStock: true,
    stockCount: 15,
    rating: 4.7,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'جهاز تحديد ذروة القناة الجذرية بدقة متناهية وشاشة LCD ملونة تعرض حركة المسبار بوضوح، ويعمل بدقة عالية حتى في البيئات الرطبة والمدمية.',
    specifications: {
      origin: 'الصين - التكنولوجيا الألمانية',
      warranty: 'ضمان سنة واحدة',
      unit: 'الجهاز الأساسي + كابلات القياس + خطافات الشفة وشاحن',
      modelNumber: 'WOODPEX-V'
    },
    tag: 'الأكثر مبيعاً'
  },
  {
    id: 'prod-005',
    nameAr: 'مخدر موضع أسنان ليدوكائين مع أدريناولين (Lidocaine 2% Box of 50)',
    nameEn: 'Dental Local Anesthesia Lidocaine 2% Cartridges',
    brand: 'Septodont',
    category: 'الجراحة والتخدير',
    priceYER: 32000,
    oldPriceYER: 38000,
    inStock: true,
    stockCount: 50,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'أمبولات تخدير موضعي أسنان زجاجية عالية النقاط وسريعة المفعول لتخدير آمن وفعال أثناء العلاج والتنظيف والجراحة.',
    specifications: {
      origin: 'فرنسا (France)',
      warranty: 'تخزين مبرد مصرح',
      unit: 'علبة تحتوي على 50 أمبولة زجاجية سعة 1.8 مل',
      lotExpiry: '2027-11'
    },
    tag: 'جديد'
  },
  {
    id: 'prod-006',
    nameAr: 'طقم حواصر تقويم أسنان معدني روت 022 (American Orthodontics Roth Kit)',
    nameEn: 'American Orthodontics Roth 022 Bracket System Kit',
    brand: 'American Orthodontics',
    category: 'مستلزمات التقويم',
    priceYER: 45000,
    oldPriceYER: 52000,
    inStock: true,
    stockCount: 22,
    rating: 4.8,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'حواصر تقويم أسنان عالية الدقة مصنعة من الستانلس ستيل الطبي المقاوم للصدأ والتآكل بتصميم مريح للمريض يسهل حركة السلك وتوجيه الأسنان.',
    specifications: {
      origin: 'الولايات المتحدة (USA)',
      warranty: 'منتج أصلي 100%',
      unit: 'طقم كامل لـ 20 سناً (فك علوي وسفلي) مع الخطافات 3-4-5',
      modelNumber: 'AO-ROTH-022'
    }
  },
  {
    id: 'prod-007',
    nameAr: 'مادة طبعات أسنان ألجينات فائقة الدقة (Zhermack Tropicalgin 454g)',
    nameEn: 'Zhermack Tropicalgin Alginate Impression Material 454g',
    brand: 'Zhermack',
    category: 'مواد الطبعات والقياس',
    priceYER: 14000,
    oldPriceYER: 17000,
    inStock: true,
    stockCount: 60,
    rating: 4.9,
    reviewsCount: 65,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'ألجينات طبعات أسنان إيطالية ذات تغير لون مؤشر للترطيب والمزج، تعطي تفاصيل دقيقة للغاية برائحة 망جو الاستوائية المحببة للمرضى.',
    specifications: {
      origin: 'إيطاليا (Italy)',
      warranty: 'تعبئة محكمة ضد الرطوبة',
      unit: 'كيس 454 جرام مختوم بأمان',
      lotExpiry: '2028-02'
    },
    tag: 'الأكثر مبيعاً'
  },
  {
    id: 'prod-008',
    nameAr: 'جهاز ضوئي لاسلكي لتصليد الحشوات LED (Woodpecker i-LED Light Cure)',
    nameEn: 'Woodpecker i-LED Wireless Curing Light 1 Second',
    brand: 'Woodpecker',
    category: 'أجهزة ومعدات العيادات',
    priceYER: 95000,
    oldPriceYER: 115000,
    inStock: true,
    stockCount: 14,
    rating: 4.9,
    reviewsCount: 51,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'جهاز لايت كيور لاسلكي فائق السرعة يتميز بقدرته على تجفيف وتصليد الكومبوزيت في ثانية واحدة بقوة إضاءة تصل إلى 2500 mW/cm².',
    specifications: {
      origin: 'الصين',
      warranty: 'ضمان سنة كاملة',
      unit: 'جهاز + قاعدة شحن لاسلكية + واقي عينين ومحول كهربائي',
      modelNumber: 'I-LED-PURPLE'
    },
    tag: 'عرض خاص'
  },
  {
    id: 'prod-009',
    nameAr: 'قفازات فحص طبية لاتكس خالية من البودرة (Box of 100 Latex Powder Free)',
    nameEn: 'Medical Examination Latex Gloves Powder-Free Box 100',
    brand: 'TopGlove',
    category: 'التعقيم والسلامة الطبية',
    priceYER: 9500,
    oldPriceYER: 11500,
    inStock: true,
    stockCount: 100,
    rating: 4.6,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'قفازات فحص طبية لاتكس مرنة ومريحة بدون بودرة لمنع الحساسية، توفر ملمساً ممتازاً وقبضة محكمة أثناء العمليات وأعمال الفحص.',
    specifications: {
      origin: 'ماليزيا (Malaysia)',
      warranty: 'مطابق للمواصفات الطبية ISO',
      unit: 'علبة تحتوي على 100 قفاز (مقاسات S, M, L متوفرة)',
      lotExpiry: '2029-01'
    }
  },
  {
    id: 'prod-0010',
    nameAr: 'طقم أدوات فحص وفحص أسنان ستانلس ستيل (3 Pcs Examination Kit)',
    nameEn: '3 Pcs Dental Examination Set Stainless Steel',
    brand: 'Medisy German Steel',
    category: 'الجراحة والتخدير',
    priceYER: 12000,
    oldPriceYER: 15000,
    inStock: true,
    stockCount: 40,
    rating: 4.8,
    reviewsCount: 30,
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'طقم أدوات تشخيص وفحص الأسنان الأساسي مصنع من الفولاذ المقاوم للصدأ الألماني القابل للتعقيم والتسخين العالي بالأوتوكلاف مراراً وتكراراً.',
    specifications: {
      origin: 'باكستان - ستيل ألماني معتمد',
      warranty: 'ضمان عدم الصدأ لمدة 5 سنوات',
      unit: 'مرآة فحص أسنان + مسبار مستقيم + ملقط جراحي',
      modelNumber: 'EXAM-3PCS-GER'
    }
  },
  {
    id: 'prod-0011',
    nameAr: 'جهاز تقليح وتنظيف الأسنان بالموجات فوق الصوتية (Woodpecker UDS-J Scaler)',
    nameEn: 'Woodpecker UDS-J Ultrasonic Dental Scaler',
    brand: 'Woodpecker',
    category: 'أجهزة ومعدات العيادات',
    priceYER: 145000,
    oldPriceYER: 170000,
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewsCount: 27,
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'جهاز ألتراسونيك سكيلر لإزالة الترسبات الكلسية والتكلسات الجيرية حول الأسنان واللثة بفعالية عالية وبدون ألم للمريض مع التحكم التلقائي بالتردد.',
    specifications: {
      origin: 'الصين',
      warranty: 'ضمان سنة صيانة وقطع غيار',
      unit: 'الجهاز الرئيسي + قبضة قابلة للتعقيم + 5 رؤوس تقليح مختارة',
      modelNumber: 'UDS-J-PORTABLE'
    },
    tag: 'عرض خاص'
  },
  {
    id: 'prod-0012',
    nameAr: 'طقم سنابل أسنان ماسية للتحضير والجراحة (30 Pcs Diamond Burs Set)',
    nameEn: '30 Pcs Dental Diamond Burs Kit for High Speed Handpiece',
    brand: 'Mani Japan',
    category: 'أدوات الحشو والتركيبات',
    priceYER: 28000,
    oldPriceYER: 34000,
    inStock: true,
    stockCount: 35,
    rating: 4.8,
    reviewsCount: 48,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
    descriptionAr: 'علبة مجمعة تضم 30 سنبلة ماسية بأشكال متعددة للقطع السريع، الحفر، تحضير التيجان والجسور وتنعيم الحواف بكفاءة عالية.',
    specifications: {
      origin: 'اليابان (Mani Japan)',
      warranty: 'عالية الصلابة والمتانة',
      unit: 'علبة ألومنيوم أنيقة تحتوي على 30 سنبلة ماسية مختلفة',
      modelNumber: 'MANI-BUR-30'
    }
  }
];
