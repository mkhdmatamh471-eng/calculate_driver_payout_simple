import React from 'react';
import { 
  Stethoscope, 
  Phone, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Clock,
  Heart
} from 'lucide-react';
import { KURAIMI_ACCOUNT_INFO } from '../data/yemenData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 mt-16 border-t-4 border-sky-600 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top Highlights Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-600/20 text-sky-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">توصيل لكافة المحافظات</h4>
              <p className="text-slate-400 text-[11px]">شحن سريع لـ صنعاء، عدن، تعز، إب وكل المدن</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-600/20 text-teal-400 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">دفع إلكتروني يمني</h4>
              <p className="text-slate-400 text-[11px]">عبر بنك الكريمي حاسب أو الكريمي موبايل</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">منتجات أصلية معتمدة</h4>
              <p className="text-slate-400 text-[11px]">من أشهر الماركات العالمية (3M, NSK, W&H)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600/20 text-rose-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">دعم فني وتوريد عاجل</h4>
              <p className="text-slate-400 text-[11px]">خدمة أطباء الأسنان على مدار الساعة</p>
            </div>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-slate-900 font-bold">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold text-white block">
                  متجر اليمن لمستلزمات الأسنان
                </span>
                <span className="text-[10px] text-sky-400 font-mono">DENTAL STORE YEMEN</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              المنصة اليمنية الرائدة المتخصصة في تزويد وتجهيز عيادات ومراكز طب وجراحة الأسنان بكافة الأدوات، المستهلكات الطبية، الكومبوزيت، وأجهزة التعقيم والتقليح بأسعار تنافسية وخيارات دفع يمنية سهلة.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-teal-300">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>الفرع الرئيسي: صنعاء - شارع الزبيري / فرع عدن - خور مكسر</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="text-white font-bold text-sm border-b border-slate-800 pb-2">
              تصنيفات المستلزمات الطبية
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-sky-400 transition-colors">أدوات الحشو والتركيبات التجميلية</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">الجراحة وأمبولات التخدير</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">أجهزة الأوتوكلاف والتعقيم الطبي</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">مستلزمات وحواصر التقويم</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">مواد الطبعات والألجينات</a></li>
            </ul>
          </div>

          {/* Contact & Kuraimi Info */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="text-white font-bold text-sm border-b border-slate-800 pb-2">
              التواصل والتحويل البنكي
            </h4>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 space-y-1.5">
              <div className="text-teal-400 font-bold">مصرف الكريمي للتمويل الأصغر الإسلامي</div>
              <div className="text-slate-300">رقم الحساب: <span className="font-mono text-amber-300 font-bold">{KURAIMI_ACCOUNT_INFO.accountNumber}</span></div>
              <div className="text-slate-400 text-[11px]">اسم الحساب: {KURAIMI_ACCOUNT_INFO.accountName}</div>
            </div>

            <div className="space-y-1 text-slate-300">
              <div>واتساب المبيعات: <a href={`https://wa.me/${KURAIMI_ACCOUNT_INFO.whatsappSalesSupport}`} className="text-sky-400 font-bold dir-ltr">{KURAIMI_ACCOUNT_INFO.whatsappSalesSupport}</a></div>
              <div>هاتف الإدارة: <span className="text-slate-300 dir-ltr">{KURAIMI_ACCOUNT_INFO.salesPhone}</span></div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>جميع الحقوق محفوظة © 2026 - متجر اليمن لمستلزمات وأجهزة الأسنان.</span>
          <span className="text-[11px] text-slate-400">
            تم التطوير بحب لأطباء الأسنان في اليمن 🦷🇾🇪
          </span>
        </div>

      </div>
    </footer>
  );
};
