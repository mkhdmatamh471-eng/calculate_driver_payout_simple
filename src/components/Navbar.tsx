import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Truck, 
  Phone, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  X,
  Menu,
  Clock,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { formatYER } from '../utils/formatters';
import { PRODUCT_CATEGORIES, KURAIMI_ACCOUNT_INFO } from '../data/yemenData';

interface NavbarProps {
  cartCount: number;
  cartTotalYER: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrderTracker: () => void;
  onOpenAdminPasscode: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotalYER,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenOrderTracker,
  onOpenAdminPasscode,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-teal-900 text-white text-xs py-1.5 sm:py-2 px-3 sm:px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 truncate">
            <span className="flex items-center gap-1.5 bg-sky-800/60 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border border-sky-600/40 shrink-0">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-300" />
              توصيل لجميع العيادات والمحافظات
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-200 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              منتجات أصلية معتمدة 100%
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] shrink-0">
            <button 
              onClick={onOpenAdminPasscode}
              className="flex items-center gap-1 text-amber-300 font-bold hover:text-white transition-colors cursor-pointer bg-slate-900/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-amber-400/40 text-[10px] sm:text-xs"
            >
              <span>👑 لوحة التحكم</span>
            </button>
            <span className="hidden md:inline text-sky-400">|</span>
            <a 
              href={`https://wa.me/${KURAIMI_ACCOUNT_INFO.whatsappSalesSupport}`} 
              target="_blank" 
              rel="noreferrer" 
              className="hidden md:flex items-center gap-1 hover:text-teal-300 transition-colors"
            >
              <Phone className="w-3 h-3 text-teal-400" />
              الدعم: {KURAIMI_ACCOUNT_INFO.whatsappSalesSupport}
            </a>
            <span className="hidden sm:inline text-sky-400">|</span>
            <button 
              onClick={onOpenOrderTracker} 
              className="hidden sm:flex items-center gap-1 hover:text-sky-200 underline underline-offset-2 transition-colors cursor-pointer"
            >
              <Clock className="w-3 h-3 text-sky-300" />
              تتبع طلبيتك
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            <a href="#" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-bold bg-gradient-to-r from-sky-900 via-sky-800 to-teal-700 bg-clip-text text-transparent leading-tight">
                  متجر اليمن لمستلزمات الأسنان
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-sky-600 tracking-wide sm:tracking-wider">
                  DENTAL STORE YEMEN • للعيادات
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن أداة، مادة حشو، أو جهاز تعقيم (مثال: أوتوكلاف، كومبوزيت، توربين)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-11 py-2.5 bg-slate-100/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Order Tracker Mobile shortcut */}
            <button
              onClick={onOpenOrderTracker}
              className="flex sm:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="تتبع طلبيتك"
            >
              <Clock className="w-5 h-5 text-sky-600" />
            </button>

            {/* Order Tracker Tablet / Desktop */}
            <button
              onClick={onOpenOrderTracker}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4 text-sky-600" />
              <span>تتبع الطلب</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 sm:p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-sky-600 transition-colors cursor-pointer"
              title="المفضلة"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-teal-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white hover:from-sky-700 hover:to-teal-700 shadow-sm shadow-sky-600/30 transition-all cursor-pointer group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-900 text-[10px] sm:text-[11px] font-extrabold px-1.5 py-0.2 rounded-full border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none text-right">
                <span className="text-[10px] text-sky-100 font-medium">سلة الشراء</span>
                <span className="text-xs font-bold text-white tracking-wide mt-0.5">
                  {cartTotalYER > 0 ? formatYER(cartTotalYER) : 'فارغة'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 lg:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ابحث عن أدوات أو أجهزة عيادة الأسنان..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Horizontal Sub-bar */}
      <div className="bg-slate-100/90 border-t border-slate-200/60 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center gap-1.5 py-1.5 text-xs font-medium whitespace-nowrap">
          {PRODUCT_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 text-xs ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/80 hover:text-sky-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-4 animate-fade-in shadow-xl">
          <div className="font-bold text-xs sm:text-sm text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>تصفح الأقسام والتصنيفات الطبية</span>
            <span className="text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md font-bold">
              {PRODUCT_CATEGORIES.length} أقسام
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`text-right p-2.5 rounded-xl text-xs font-medium transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
                    : 'hover:bg-slate-50 border-slate-100 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button 
              onClick={() => { onOpenOrderTracker(); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sky-800 font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-sky-600" />
              <span>تتبع شحنة العيادة</span>
            </button>
            
            <a 
              href={`https://wa.me/${KURAIMI_ACCOUNT_INFO.whatsappSalesSupport}`} 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>واتساب المبيعات المباشر</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
