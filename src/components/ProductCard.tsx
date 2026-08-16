import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Eye, 
  Heart, 
  Star, 
  Check, 
  ShieldCheck, 
  Tag, 
  Sparkles 
} from 'lucide-react';
import { Product } from '../types';
import { formatYER } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onQuickView,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleDirectBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    onBuyNow(product);
  };

  const discountPercent = product.oldPriceYER 
    ? Math.round(((product.oldPriceYER - product.priceYER) / product.oldPriceYER) * 100) 
    : 0;

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 bg-slate-50 overflow-hidden p-4 flex items-center justify-center">
        
        {/* Badges */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1 items-start">
          {product.tag && (
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow-xs flex items-center gap-1 ${
              product.tag === 'الأكثر مبيعاً' ? 'bg-amber-400 text-slate-900' :
              product.tag === 'عرض خاص' ? 'bg-rose-500 text-white' :
              product.tag === 'جديد' ? 'bg-teal-500 text-white' : 'bg-sky-600 text-white'
            }`}>
              <Sparkles className="w-3 h-3" />
              {product.tag}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
              خصم {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 left-2.5 z-10 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600 font-bold border border-rose-200' 
              : 'bg-white/80 hover:bg-white text-slate-500 hover:text-rose-500 border border-slate-200/60'
          }`}
          title={isWishlisted ? 'حذف من المفضلة' : 'إضافة للمفضلة'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.nameAr}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-sky-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-sky-900 font-bold text-xs px-3.5 py-2 rounded-xl shadow-md border border-sky-100 flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Eye className="w-4 h-4 text-sky-600" />
            معاينة سريعة
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-medium mb-1 gap-1">
            <span className="bg-sky-50 text-sky-700 px-1.5 sm:px-2 py-0.5 rounded-md font-bold text-[9px] sm:text-[10px] shrink-0">
              {product.brand}
            </span>
            <span className="text-slate-400 truncate text-[10px] sm:text-[11px]">
              {product.category}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors">
            {product.nameAr}
          </h3>

          {/* Origin & Unit brief */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
            <span className="flex items-center gap-1 text-slate-600 shrink-0">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-600" />
              {product.specifications.origin}
            </span>
            <span>•</span>
            <span className="truncate">{product.specifications.unit}</span>
          </div>
        </div>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between pt-1 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-400 font-normal text-[9px] sm:text-[10px]">({product.reviewsCount})</span>
          </div>
          <span className="text-[9px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-md shrink-0">
            متوفر للعيادات
          </span>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 sm:gap-2">
          <div className="flex items-center justify-between gap-1">
            <div className="flex flex-col">
              {product.oldPriceYER && (
                <span className="text-[10px] sm:text-[11px] text-slate-400 line-through font-medium">
                  {formatYER(product.oldPriceYER)}
                </span>
              )}
              <span className="text-xs sm:text-base font-black text-sky-900 tracking-tight">
                {formatYER(product.priceYER)}
              </span>
            </div>

            <button
              onClick={handleAdd}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border shrink-0 ${
                added
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200 active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden xs:inline">تمت الإضافة</span>
                  <span className="xs:hidden">تمت</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden xs:inline">أضف للسلة</span>
                  <span className="xs:hidden">أضف</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleDirectBuy}
            className="w-full py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white font-extrabold text-[11px] sm:text-xs shadow-sm sm:shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98"
          >
            <span>إتمام عملية الطلب</span>
          </button>
        </div>

      </div>
    </div>
  );
};
