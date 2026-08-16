import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Star, 
  Check, 
  Plus, 
  Minus, 
  Truck, 
  Award, 
  Building2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { formatYER } from '../utils/formatters';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-200 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Image Side */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-center relative">
            <img
              src={product.image}
              alt={product.nameAr}
              className="w-full h-64 object-contain max-h-64"
            />
            {product.tag && (
              <span className="absolute top-3 right-3 bg-sky-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {product.tag}
              </span>
            )}
          </div>

          {/* Details Side */}
          <div className="space-y-4 text-right">
            <div>
              <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-md">
                {product.brand}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2 leading-tight">
                {product.nameAr}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{product.nameEn}</p>
            </div>

            {/* Price Banner */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">السعر للعيادات والمراكز:</span>
                <span className="text-2xl font-black text-sky-900">
                  {formatYER(product.priceYER)}
                </span>
              </div>
              {product.oldPriceYER && (
                <div className="text-left">
                  <span className="text-xs text-slate-400 line-through block">
                    {formatYER(product.oldPriceYER)}
                  </span>
                  <span className="text-xs font-bold text-rose-600">
                    وفرت {formatYER(product.oldPriceYER - product.priceYER)}
                  </span>
                </div>
              )}
            </div>

            {/* Specs Grid */}
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-2.5 bg-sky-50/50 rounded-xl border border-sky-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-bold">بلد الصنع / الماركة:</span>
                  <span>{product.specifications.origin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-bold">الوحدة / العبوة:</span>
                  <span>{product.specifications.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold">الضمان الطبي:</span>
                  <span>{product.specifications.warranty}</span>
                </div>
                {product.specifications.lotExpiry && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold">تاريخ الصلاحية / LOT:</span>
                    <span>{product.specifications.lotExpiry}</span>
                  </div>
                )}
              </div>

              <p className="text-slate-600 leading-relaxed text-xs pt-1">
                {product.descriptionAr}
              </p>
            </div>

            {/* Quantity Controls & Add to Cart */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">الكمية المطلوبة:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:bg-white rounded-lg text-slate-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:bg-white rounded-lg text-slate-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/30'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>تمت الإضافة للسلة بنجاح</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>إضافة إلى سلة المشتريات ({formatYER(product.priceYER * quantity)})</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
