import { Governorate } from '../types';

export const YEMEN_GOVERNORATES: Governorate[] = [
  { id: 'sanaa', nameAr: 'صنعاء (أمانة العاصمة والريف)', nameEn: 'Sanaa', shippingFeeYER: 2000, estimatedHours: 'نفس اليوم (خلال 3 - 6 ساعات)' },
  { id: 'aden', nameAr: 'عدن', nameEn: 'Aden', shippingFeeYER: 3500, estimatedHours: 'خلال 24 - 48 ساعة' },
  { id: 'taiz', nameAr: 'تعز', nameEn: 'Taiz', shippingFeeYER: 3000, estimatedHours: 'خلال 24 - 48 ساعة' },
  { id: 'ibb', nameAr: 'إب', nameEn: 'Ibb', shippingFeeYER: 2500, estimatedHours: 'خلال 24 ساعة' },
  { id: 'hudaydah', nameAr: 'الحديدية', nameEn: 'Al-Hudaydah', shippingFeeYER: 3500, estimatedHours: 'خلال 24 - 48 ساعة' },
  { id: 'hadramout_mukalla', nameAr: 'حضرموت - المكلا', nameEn: 'Hadramout - Mukalla', shippingFeeYER: 4500, estimatedHours: 'خلال 48 - 72 ساعة' },
  { id: 'hadramout_seiyun', nameAr: 'حضرموت - سيئون', nameEn: 'Hadramout - Seiyun', shippingFeeYER: 5000, estimatedHours: 'خلال 48 - 72 ساعة' },
  { id: 'dhamar', nameAr: 'ذمار', nameEn: 'Dhamar', shippingFeeYER: 2500, estimatedHours: 'خلال 24 ساعة' },
  { id: 'marib', nameAr: 'مأرب', nameEn: 'Marib', shippingFeeYER: 4000, estimatedHours: 'خلال 48 ساعة' },
  { id: 'shabwah', nameAr: 'شبوة', nameEn: 'Shabwah', shippingFeeYER: 5000, estimatedHours: 'خلال 48 - 72 ساعة' },
  { id: 'amran', nameAr: 'عمران', nameEn: 'Amran', shippingFeeYER: 2500, estimatedHours: 'خلال 24 ساعة' },
  { id: 'hajjah', nameAr: 'حجة', nameEn: 'Hajjah', shippingFeeYER: 3500, estimatedHours: 'خلال 24 - 48 ساعة' },
  { id: 'saada', nameAr: 'صعدة', nameEn: 'Saada', shippingFeeYER: 4000, estimatedHours: 'خلال 48 ساعة' },
  { id: 'albayda', nameAr: 'البيضاء', nameEn: 'Al-Bayda', shippingFeeYER: 3500, estimatedHours: 'خلال 24 - 48 ساعة' },
  { id: 'lahj', nameAr: 'لحج', nameEn: 'Lahj', shippingFeeYER: 3500, estimatedHours: 'خلال 24 - 48 ساعة' },
  { id: 'aldhalee', nameAr: 'الضالع', nameEn: 'Al-Dhale', shippingFeeYER: 3500, estimatedHours: 'خلال 24 - 48 ساعة' },
  { id: 'abyan', nameAr: 'أبين', nameEn: 'Abyan', shippingFeeYER: 4000, estimatedHours: 'خلال 48 ساعة' },
  { id: 'almahrah', nameAr: 'المهرة', nameEn: 'Al-Mahrah', shippingFeeYER: 6000, estimatedHours: 'خلال 3 - 4 أيام' },
];

export const KURAIMI_ACCOUNT_INFO = {
  accountName: 'شركة اليمن لمستلزمات وأجهزة الأسنان',
  accountNumber: '301298455',
  bankName: 'مصرف الكريمي للتمويل الأصغر الإسلامي',
  kuraimiServiceCode: 'DENTAL-YEMEN',
  whatsappSalesSupport: '+967770123456',
  salesPhone: '01-445566',
};

export const PRODUCT_CATEGORIES = [
  'الكل',
  'أدوات الحشو والتركيبات',
  'الجراحة والتخدير',
  'التعقيم والسلامة الطبية',
  'أجهزة ومعدات العيادات',
  'مستلزمات التقويم',
  'مواد الطبعات والقياس',
  'أدوات وقاية وطب أسنان الأطفال',
];
