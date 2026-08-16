import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Send, 
  X, 
  MapPin, 
  Phone, 
  User, 
  Building2, 
  CreditCard, 
  Calendar, 
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  Copy
} from 'lucide-react';
import { Order } from '../types';
import { formatYER, buildWhatsAppOrderMessage } from '../utils/formatters';
import { KURAIMI_ACCOUNT_INFO } from '../data/yemenData';

interface OrderReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const paymentText = 
    order.customer.paymentMethod === 'kuraimi_gateway' ? 'الدفع الإلكتروني عبر بوابة بنك الكريمي (حاسب)' :
    order.customer.paymentMethod === 'kuraimi_manual' ? `التحويل عبر الكريمي موبايل (إيصال: ${order.customer.receiptNumber})` :
    'الدفع نقداً عند التسليم بالعيادة (Cash on Delivery)';

  const whatsappUrl = `https://wa.me/${KURAIMI_ACCOUNT_INFO.whatsappSalesSupport}?text=${buildWhatsAppOrderMessage(
    order.id,
    order.customer.doctorName,
    order.customer.clinicName,
    order.customer.phone,
    order.customer.governorate,
    order.customer.detailedAddress,
    order.customer.googleMapsUrl,
    order.items.map(i => ({ name: i.product.nameAr, quantity: i.quantity, priceYER: i.product.priceYER })),
    order.totalYER,
    paymentText,
    order.customer.receiptNumber
  )}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full my-6 overflow-hidden shadow-2xl border border-slate-200 text-right relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Header */}
        <div className="p-5 bg-gradient-to-r from-teal-700 via-emerald-800 to-sky-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="bg-emerald-400/30 text-teal-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-300/30">
                تم تأكيد واستلام الطلب بنجاح ✓
              </span>
              <h2 className="text-xl font-black mt-1">فاتورة طلب توريد مستلزمات الأسنان</h2>
              <p className="text-xs text-slate-200">رقم الفاتورة المرجعي: <span className="font-mono font-bold text-amber-300">{order.id}</span></p>
            </div>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div id="printable-invoice" className="p-5 sm:p-6 space-y-5 text-slate-800 overflow-y-auto max-h-[70vh]">
          
          {/* Clinic & Order Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium block">اسم الطبيب والعيادة:</span>
              <p className="font-bold text-slate-900 text-sm">{order.customer.doctorName}</p>
              <p className="text-sky-700 font-bold">{order.customer.clinicName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium block">التاريخ ورقم التتبع:</span>
              <p className="font-bold text-slate-800">{order.date}</p>
              <p className="text-slate-600 font-mono">الهاتف: {order.customer.phone}</p>
            </div>

            <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-200/60">
              <span className="text-slate-400 font-medium block">موقع التسليم:</span>
              <p className="font-semibold text-slate-800">
                محافظة {order.customer.governorate} - {order.customer.detailedAddress}
              </p>
              {order.customer.googleMapsUrl && (
                <a
                  href={order.customer.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 font-bold text-[11px] underline flex items-center gap-1 mt-1"
                >
                  <MapPin className="w-3.5 h-3.5" /> عرض موقع العيادة على خريطة جوجل
                </a>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">المنتج الطبي</th>
                  <th className="p-3 text-center">الكمية</th>
                  <th className="p-3 text-left">السعر الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {order.items.map((item) => (
                  <tr key={item.product.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold">
                      {item.product.nameAr}
                      <span className="block text-[10px] text-slate-400 font-normal">{item.product.brand}</span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700">{item.quantity}</td>
                    <td className="p-3 text-left font-bold text-sky-900">
                      {formatYER(item.product.priceYER * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Payment Method Summary */}
          <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>المجموع الفرعي:</span>
              <span className="font-bold text-slate-800">{formatYER(order.subtotalYER)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>رسوم الشحن والتوصيل ({order.customer.governorate}):</span>
              <span className="font-bold text-slate-800">{formatYER(order.shippingFeeYER)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-sky-200 text-base font-black text-sky-950">
              <span>المبلغ الكلي المطلوب:</span>
              <span className="text-teal-700">{formatYER(order.totalYER)}</span>
            </div>

            <div className="pt-2 border-t border-sky-200/80 text-[11px] text-slate-700 font-medium">
              <span className="font-bold text-sky-900">طريقة الدفع المختارة: </span>
              {paymentText}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الفاتورة</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الفاتورة عبر واتساب المبيعات</span>
            </a>

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              متابعة التسوق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
