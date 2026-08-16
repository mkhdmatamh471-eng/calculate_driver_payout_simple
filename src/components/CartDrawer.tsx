import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Tag, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { CartItem } from '../types';
import { formatYER } from '../utils/formatters';
import { YEMEN_GOVERNORATES } from '../data/yemenData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  selectedGovId: string;
  onSelectGovernorate: (govId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  selectedGovId,
  onSelectGovernorate,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // 0.10 for 10%
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.priceYER * item.quantity, 0);
  const selectedGov = YEMEN_GOVERNORATES.find((g) => g.id === selectedGovId) || YEMEN_GOVERNORATES[0];
  const shippingFee = items.length > 0 ? selectedGov.shippingFeeYER : 0;
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'DENTAL10' || promoCode.trim() === 'طبيب10') {
      setAppliedDiscount(0.10);
      setPromoSuccess('تم تطبيق خصم 10% للأطباء والعيادات!');
    } else {
      setPromoError('كود غير صحيح. جرب كود DENTAL10 للخصم العيادي.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-r border-slate-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-900 to-teal-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <h2 className="font-bold text-base">سلة طلبات العيادة</h2>
                <p className="text-xs text-sky-200 font-medium">
                  {items.length} {items.length === 1 ? 'منتج فريد' : 'منتجات فريدة'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-sky-50 mx-auto flex items-center justify-center text-sky-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">سلة العيادة فارغة حالياً</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    قم بإضافة المستلزمات والأدوات الطبية للعيادة لتجهيز طلبيتك واستلامها مباشرة.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.nameAr}
                    className="w-16 h-16 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 text-right min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug">
                      {item.product.nameAr}
                    </h4>
                    <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                      {item.product.brand}
                    </span>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="font-extrabold text-sky-900 text-xs">
                        {formatYER(item.product.priceYER)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded text-slate-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded text-slate-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                    title="حذف المنتج"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              
              {/* Governorate Delivery Calculator */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  محافظة عيادة التسليم (لحساب التوصيل):
                </label>
                <select
                  value={selectedGovId}
                  onChange={(e) => onSelectGovernorate(e.target.value)}
                  className="w-full text-xs font-semibold p-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500/30 outline-none"
                >
                  {YEMEN_GOVERNORATES.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {gov.nameAr} - رسوم الشحن: {formatYER(gov.shippingFeeYER)} ({gov.estimatedHours})
                    </option>
                  ))}
                </select>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="كود الخصم (جرب: DENTAL10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-sky-500 uppercase font-mono"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    تطبيق
                  </button>
                </div>
                {promoError && <p className="text-[10px] text-rose-600 font-bold">{promoError}</p>}
                {promoSuccess && <p className="text-[10px] text-emerald-600 font-bold">{promoSuccess}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/80">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-slate-800">{formatYER(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-teal-700 font-bold">
                    <span>خصم العيادة (10%):</span>
                    <span>- {formatYER(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-sky-600" />
                    تكلفة الشحن والتوصيل ({selectedGov.nameAr}):
                  </span>
                  <span className="font-bold text-slate-800">{formatYER(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-black text-sky-950">
                  <span>الإجمالي الكلي:</span>
                  <span className="text-sky-700">{formatYER(total)}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-sky-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>إتمام الطلب وإدخال بيانات العيادة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
