import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  Building2, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Upload, 
  Compass, 
  AlertCircle,
  Truck,
  ShieldCheck,
  Send,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CartItem, CheckoutFormData, Order } from '../types';
import { YEMEN_GOVERNORATES, KURAIMI_ACCOUNT_INFO } from '../data/yemenData';
import { formatYER, buildWhatsAppOrderMessage } from '../utils/formatters';
import { submitOrderToApi } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  defaultGovernorateId: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  defaultGovernorateId,
  onOrderSuccess,
}) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    doctorName: '',
    phone: '',
    clinicName: '',
    governorate: defaultGovernorateId || 'sanaa',
    detailedAddress: '',
    gpsCoordinates: null,
    googleMapsUrl: '',
    paymentMethod: 'kuraimi_gateway',
    receiptNumber: '',
    receiptImage: null,
    notes: '',
  });

  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const selectedGov = YEMEN_GOVERNORATES.find((g) => g.id === formData.governorate) || YEMEN_GOVERNORATES[0];
  const subtotal = items.reduce((sum, item) => sum + item.product.priceYER * item.quantity, 0);
  const shippingFee = selectedGov.shippingFeeYER;
  const total = subtotal + shippingFee;

  // Handle Geolocation API
  const handleGetLocation = () => {
    setGettingLocation(true);
    setLocationError('');
    setLocationSuccess(false);

    if (!navigator.geolocation) {
      setLocationError('متصفحك لا يدعم تحديد الموقع الجغرافي التلقائي.');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        setFormData((prev) => ({
          ...prev,
          gpsCoordinates: { lat, lng },
          googleMapsUrl: mapsUrl,
        }));
        setGettingLocation(false);
        setLocationSuccess(true);
      },
      (error) => {
        setGettingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('يرجى السماح بالتصريح للمتصفح للوصول لموقع العيادة الجغرافي.');
        } else {
          setLocationError('تعذر جلب موقع العيادة. يمكنك لصق رابط خرائط جوجل يدوياً.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle Image Upload for Receipt
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, receiptImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = 'يرجى إدخال اسم الطبيب / الطبيبة';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'يرجى إدخال رقم هاتف التواصل اليمني';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'رقم الهاتف قصير جداً. يرجى إدخال رقم يمني صحيح (مثال: 770123456)';
    }
    if (!formData.clinicName.trim()) {
      newErrors.clinicName = 'يرجى إدخال اسم العيادة أو المركز الطبي';
    }
    if (!formData.detailedAddress.trim()) {
      newErrors.detailedAddress = 'يرجى إدخال عنوان العيادة التفصيلي (الشارع/العمارة/الطابق)';
    }
    if (formData.paymentMethod === 'kuraimi_manual' && !formData.receiptNumber.trim()) {
      newErrors.receiptNumber = 'يرجى إدخال رقم إيصال التحويل عبر الكريمي';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let receiptNum = formData.receiptNumber;
      if (!receiptNum && formData.paymentMethod === 'kuraimi_gateway') {
        receiptNum = `HASIB-${Math.floor(100000 + Math.random() * 900000)}`;
      }

      const orderPayload = {
        doctorName: formData.doctorName,
        phone: formData.phone,
        clinicName: formData.clinicName,
        governorate: formData.governorate,
        detailedAddress: formData.detailedAddress,
        gpsCoordinates: formData.gpsCoordinates,
        googleMapsUrl: formData.googleMapsUrl,
        paymentMethod: formData.paymentMethod,
        receiptNumber: receiptNum,
        notes: formData.notes,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const newOrder = await submitOrderToApi(orderPayload);
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error('Failed to place order:', err);
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'حدث خطأ أثناء حفظ الطلب في قاعدة البيانات. يرجى المحاولة لاحقاً.',
      }));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full my-6 overflow-hidden shadow-2xl border border-slate-200 text-right relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">نموذج إتمام الطلب وتوريد العيادة</h2>
              <p className="text-xs text-sky-200">أدخل بيانات العيادة وطريقة الدفع لتجهيز شحنتك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Step 1: Doctor & Clinic Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-sky-900 font-bold text-sm">
              <User className="w-4 h-4 text-sky-600" />
              <span>1. بيانات الطبيب والعيادة</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الاسم الكامل للطبيب / الطبيبة *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="مثال: د. محمد علي الريمي"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className={`w-full text-xs p-3 pr-9 border rounded-xl outline-none transition-all ${
                      errors.doctorName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300 focus:border-sky-500'
                    }`}
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.doctorName && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.doctorName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف للتواصل (واتساب) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="مثال: 770123456 أو 730000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full text-xs p-3 pr-9 border rounded-xl outline-none transition-all ${
                      errors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300 focus:border-sky-500'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.phone && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم العيادة أو المركز الطبي *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="مثال: عيادة الأمل لطب وجراحة الأسنان"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    className={`w-full text-xs p-3 pr-9 border rounded-xl outline-none transition-all ${
                      errors.clinicName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300 focus:border-sky-500'
                    }`}
                  />
                  <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.clinicName && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.clinicName}</p>}
              </div>
            </div>
          </div>

          {/* Step 2: Address & Geolocation Map API */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-sky-900 font-bold text-sm">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>2. عنوان التسليم وتحديد موقع العيادة</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المحافظة اليمنية *</label>
                <select
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  className="w-full text-xs font-bold p-3 border border-slate-300 rounded-xl bg-white outline-none focus:border-sky-500"
                >
                  {YEMEN_GOVERNORATES.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {gov.nameAr} - رسوم الشحن: {formatYER(gov.shippingFeeYER)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  العنوان التفصيلي للعيادة *
                </label>
                <input
                  type="text"
                  placeholder="مثال: شارع الزبيري - جولة كنتاكي - عمارة الأمل - الطابق الثاني"
                  value={formData.detailedAddress}
                  onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })}
                  className={`w-full text-xs p-3 border rounded-xl outline-none transition-all ${
                    errors.detailedAddress ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300 focus:border-sky-500'
                  }`}
                />
                {errors.detailedAddress && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.detailedAddress}</p>
                )}
              </div>
            </div>

            {/* Geolocation Button */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-sky-600" />
                    تحديد موقع العيادة عبر خريطة جوجل (GPS):
                  </span>
                  <p className="text-[11px] text-slate-500">
                    تساعد المندوب في الوصول السريع لدعم دقة تسليم الشحنة
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{gettingLocation ? 'جاري تحديد الإحداثيات...' : 'تحديد الموقع تلقائياً'}</span>
                </button>
              </div>

              {locationSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    تم التقاط إحداثيات موقع العيادة بنجاح ({formData.gpsCoordinates?.lat.toFixed(4)}, {formData.gpsCoordinates?.lng.toFixed(4)})
                  </span>
                  <a
                    href={formData.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-700 underline font-bold flex items-center gap-1"
                  >
                    عرض بالخريطة <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {locationError && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {locationError}
                </p>
              )}

              <div>
                <input
                  type="text"
                  placeholder="أو قم بلصق رابط الخريطة هنا (اختياري)..."
                  value={formData.googleMapsUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-sky-900 font-bold text-sm">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>3. طريقة الدفع وتأكيد الحساب</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Option 1: Kuraimi Gateway */}
              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'kuraimi_gateway' })}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  formData.paymentMethod === 'kuraimi_gateway'
                    ? 'border-sky-600 bg-sky-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">بوابة الكريمي (حاسب)</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'kuraimi_gateway'}
                    onChange={() => {}}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  دفع إلكتروني فوري ومباشر عبر بنك الكريمي
                </p>
              </label>

              {/* Option 2: Kuraimi Mobile Manual */}
              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'kuraimi_manual' })}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  formData.paymentMethod === 'kuraimi_manual'
                    ? 'border-sky-600 bg-sky-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">تحويل الكريمي موبايل</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'kuraimi_manual'}
                    onChange={() => {}}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  تحويل يدوي للرقم المميز مع إرفاق رقم الإيصال
                </p>
              </label>

              {/* Option 3: Cash on Delivery */}
              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'cash_on_delivery' })}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  formData.paymentMethod === 'cash_on_delivery'
                    ? 'border-sky-600 bg-sky-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">الدفع نقداً بالعيادة</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'cash_on_delivery'}
                    onChange={() => {}}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  تسليم المبلغ نقداً لمندوب التوصيل عند استلام الطلب
                </p>
              </label>
            </div>

            {/* If Kuraimi Manual Option Selected */}
            {formData.paymentMethod === 'kuraimi_manual' && (
              <div className="p-4 bg-sky-900 text-white rounded-2xl space-y-3 text-xs animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-sky-700">
                  <span className="font-bold text-teal-300 flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    بيانات حساب بنك الكريمي للتحويل:
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black px-2 py-0.5 rounded text-[10px]">
                    تحويل مباشر
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-200">
                  <div>اسم الحساب: <span className="font-bold text-white">{KURAIMI_ACCOUNT_INFO.accountName}</span></div>
                  <div>رقم الحساب المميز: <span className="font-bold text-amber-300 font-mono text-sm">{KURAIMI_ACCOUNT_INFO.accountNumber}</span></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-teal-200 mb-1">
                      رقم إيصال التحويل *
                    </label>
                    <input
                      type="text"
                      placeholder="أدخل رقم الإيصال من تطبيق الكريمي"
                      value={formData.receiptNumber}
                      onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                      className="w-full p-2.5 bg-white text-slate-900 text-xs font-bold rounded-xl outline-none"
                    />
                    {errors.receiptNumber && (
                      <p className="text-[10px] text-rose-300 font-bold mt-1">{errors.receiptNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-teal-200 mb-1">
                      صورة الإيصال (اختياري)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="hidden"
                        id="receipt-file"
                      />
                      <label
                        htmlFor="receipt-file"
                        className="w-full p-2.5 bg-sky-800 hover:bg-sky-700 text-white text-xs font-bold rounded-xl border border-sky-600 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 text-teal-300" />
                        <span>{formData.receiptImage ? 'تم رفع صورة الإيصال ✓' : 'إرفاق لقطة الشاشة'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظات إضافية للتوريد والتسليم (اختياري)
            </label>
            <textarea
              rows={2}
              placeholder="مثال: يرجى التسليم قبل الساعة 2 ظهراً، أو الاتصال بسكرتارية العيادة..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:border-sky-500"
            />
          </div>

          {/* Summary Box & Submit */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">المبلغ الإجمالي المطلق بالريال اليمني:</span>
              <span className="text-2xl font-black text-sky-900">
                {formatYER(total)}
              </span>
              <span className="text-[11px] text-teal-700 font-bold block mt-0.5">
                (شامل رسوم التوصيل لـ {selectedGov.nameAr})
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد وإرسال الطلب الآن'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
