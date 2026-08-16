import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Building2, 
  Package, 
  Phone,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Order } from '../types';
import { formatYER } from '../utils/formatters';
import { trackOrdersFromApi } from '../services/api';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrder: Order | null;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  recentOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrders, setSearchedOrders] = useState<Order[]>(recentOrder ? [recentOrder] : []);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      if (recentOrder) setSearchedOrders([recentOrder]);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await trackOrdersFromApi(searchQuery);
      setSearchedOrders(results);
    } catch (err) {
      console.error(err);
      setSearchedOrders([]);
    } finally {
      setIsSearching(false);
    }
  };

  const steps = [
    { title: 'تم استلام الطلب', desc: 'تم تسجيل طلبيتك في المنظومة وقاعدة البيانات', icon: CheckCircle2, completed: true },
    { title: 'جاري التجهيز بالمستودع', desc: 'جاري فحص وتغليف أدوات الأسنان بالصندوق الطبي', icon: Package, completed: true },
    { title: 'قيد الشحن مع المندوب', desc: 'الشحنة متجهة لعنوان عيادتك مع المندوب المختص', icon: Truck, completed: true },
    { title: 'تم التسليم بالعيادة', desc: 'تم التسليم والمصادقة بالعيادة', icon: Building2, completed: false },
  ];

  const currentDisplayOrder = searchedOrders.length > 0 ? searchedOrders[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 text-right space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">نظام تتبع شحنات العيادة الفوري</h2>
            <p className="text-xs text-slate-500">أدخل رقم الطلب أو رقم هاتف الطبيب للاستعلام</p>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="رقم الطلب (مثال: ORD-12345) أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs p-3 pr-9 border border-slate-300 rounded-2xl outline-none focus:border-sky-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'بحث'}
          </button>
        </form>

        {/* Display Order Status */}
        {currentDisplayOrder ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">رقم الطلب بقاعدة البيانات:</span>
                <span className="font-bold text-sky-900 font-mono text-sm">{currentDisplayOrder.id}</span>
              </div>
              <div className="text-left">
                <span className="text-slate-400 block font-medium">حالة الدفع والتأكيد:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[10px]">
                  {currentDisplayOrder.paymentStatus === 'Paid' ? 'تم الدفع بنجاح' : 'عند الاستلام'}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-900">الطبيب: {currentDisplayOrder.customer.doctorName}</p>
              <p className="text-slate-600">العيادة: {currentDisplayOrder.customer.clinicName} ({currentDisplayOrder.customer.governorate})</p>
              <p className="font-bold text-teal-700">المبلغ الإجمالي المسجل: {formatYER(currentDisplayOrder.totalYER)}</p>
            </div>

            {/* Steps Progress */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-800 block">حالة التوصيل الفعالة:</span>
              <div className="space-y-3 relative before:absolute before:right-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-200">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                      step.completed ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-300 text-slate-400'
                    }`}>
                      <step.icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">
              {hasSearched ? 'لم يتم العثور على طلب بهذا الرقم بقاعدة البيانات.' : 'لا توجد طلبات سابقة مسجلة.'}
            </p>
            <p className="text-[11px] text-slate-500">
              يمكنك عمل طلب جديد وتجربة حفظه بقاعدة البيانات والتتبع الفوري.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

