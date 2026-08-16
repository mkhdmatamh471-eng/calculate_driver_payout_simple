import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Award, 
  CreditCard, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle, 
  Building2,
  Stethoscope
} from 'lucide-react';
import { KURAIMI_ACCOUNT_INFO } from '../data/yemenData';

interface HeroBannerProps {
  onExploreClick: () => void;
  onQuickOrderClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onQuickOrderClick }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-sky-900 via-sky-800 to-teal-900 text-white pt-8 pb-12 px-4 sm:px-6 mb-8 rounded-b-3xl shadow-lg">
      {/* Decorative background grid & glow patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            <div className="inline-flex items-center gap-2 bg-sky-700/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-400/30 text-xs font-semibold text-teal-200">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>المتجر الطبي الأول المتخصص لطب الأسنان في اليمن</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              تجهيز ومستلزمات عيادة الأسنان
              <span className="block mt-2 bg-gradient-to-r from-teal-300 via-sky-200 to-amber-200 bg-clip-text text-transparent">
                بأعلى جودة وأفضل سعر يمني
              </span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              نوفر لأطباء ومراكز الأسنان في اليمن كافة أجهزة الحفر والتعقيم (الأوتوكلاف)، الكومبوزيت، التخدير، وأدوات الجراحة والتقويم مع توصيل مضمون إلى باب العيادة.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>تصفح مستلزمات العيادة</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>

              <a
                href={`https://wa.me/${KURAIMI_ACCOUNT_INFO.whatsappSalesSupport}?text=${encodeURIComponent('السلام عليكم، أرغب في طلب قائمة مستلزمات وأجهزة لعيادتي.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto justify-center px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-sky-300" />
                <span>طلب توريد خاص للعيادة</span>
              </a>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs font-medium text-slate-200">
              <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>شحن لكافة المحافظات</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <CreditCard className="w-4 h-4 text-sky-300 shrink-0" />
                <span>دفع عبر بنك الكريمي حاسب</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                <span>ضمان أجهزة وسنابل أصلية</span>
              </div>
            </div>

          </div>

          {/* Feature Card Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-gradient-to-tr from-slate-900/80 to-sky-950/80 p-6 rounded-2xl border border-sky-400/20 backdrop-blur-md shadow-2xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">حقيبة تجهيز العيادات المتكاملة</h3>
                    <p className="text-[11px] text-slate-300">عروض حصرية للأطباء الجدد والمراكز</p>
                  </div>
                </div>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                  خصم 15%
                </span>
              </div>

              {/* Clinic Guarantees & Features Showcase */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">منتجات وأجهزة طبية أصلية 100%</div>
                    <div className="text-[11px] text-slate-300">مع ضمان الصيانة والاستبدال المباشر</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-300 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">توصيل سريع ومباشر للعيادات</div>
                    <div className="text-[11px] text-slate-300">خدمة شحن لكافة المحافظات اليمنية</div>
                  </div>
                </div>
              </div>

              {/* Kuraimi Payment Trust Badge */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                  متاح عبر تطبيق الكريمي موبايل
                </span>
                <span className="font-bold text-teal-300">توصيل فورى</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
