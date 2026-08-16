/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Filter, 
  X, 
  Check, 
  Sparkles, 
  Stethoscope, 
  Clock, 
  Layers,
  SlidersHorizontal,
  ArrowUpDown,
  Database,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { Product, CartItem, Order } from './types';
import { MOCK_PRODUCTS } from './data/mockProducts';
import { YEMEN_GOVERNORATES } from './data/yemenData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { Footer } from './components/Footer';
import { formatYER } from './utils/formatters';
import { fetchProductsFromApi } from './services/api';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminPasscodeModal, isAdminSessionValid } from './components/AdminPasscodeModal';

export default function App() {
  // View & Admin States
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [isAdminPasscodeOpen, setIsAdminPasscodeOpen] = useState(false);

  const handleOpenAdminDashboard = () => {
    if (isAdminSessionValid()) {
      setViewMode('admin');
    } else {
      setIsAdminPasscodeOpen(true);
    }
  };

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  // Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [selectedGovId, setSelectedGovId] = useState<string>('sanaa');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch Products from Backend API on mount
  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const fetched = await fetchProductsFromApi();
      setProducts(fetched);
    } catch (err) {
      console.error('Failed to load products from API:', err);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`تمت إضافة ${product.nameAr} إلى السلة`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast('تمت إزالة المنتج من المفضلة');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast('تمت إضافة المنتج لمفضلة العيادة');
        return [...prev, product];
      }
    });
  };

  // Filter & Search Logic
  const brandsList = useMemo(() => {
    const brands = Array.from(new Set(products.map((p) => p.brand)));
    return ['الكل', ...brands];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat = selectedCategory === 'الكل' || p.category === selectedCategory;
        const matchesBrand = selectedBrand === 'الكل' || p.brand === selectedBrand;
        const matchesSearch =
          !searchQuery.trim() ||
          p.nameAr.includes(searchQuery) ||
          p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.includes(searchQuery);

        return matchesCat && matchesBrand && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceYER - b.priceYER;
        if (sortBy === 'price-desc') return b.priceYER - a.priceYER;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy]);

  const cartTotalYER = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.priceYER * item.quantity, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCartItems([]);
    showToast(`تم حفظ الطلب برقم (${order.id}) بنجاح بقاعدة البيانات وتحديث المخزون`);
    loadProducts();
  };

  if (viewMode === 'admin') {
    return <AdminDashboard onBackToStore={() => setViewMode('store')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 text-slate-800 font-['Tajawal',sans-serif] dir-rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-sky-500/30 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        cartCount={cartCount}
        cartTotalYER={cartTotalYER}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenAdminPasscode={handleOpenAdminDashboard}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Promotional Banner */}
      <HeroBanner
        onExploreClick={() => {
          const el = document.getElementById('products-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onQuickOrderClick={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main id="products-section" className={`flex-1 max-w-7xl mx-auto px-3 sm:px-6 w-full space-y-4 sm:space-y-6 ${cartCount > 0 ? 'pb-24 sm:pb-32' : 'pb-8 sm:pb-12'}`}>
        
        {/* Controls & Toolbar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              مستلزمات وأدوات الأسنان المتاحة
            </span>
            <span className="bg-sky-100 text-sky-800 font-extrabold text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} منتج
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
            {/* Brand Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 sm:px-3 py-1.5">
              <span className="text-slate-500 font-medium text-[11px] sm:text-xs">الماركة:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-[11px] sm:text-xs"
              >
                {brandsList.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 sm:px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium text-[11px] sm:text-xs">الترتيب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-[11px] sm:text-xs"
              >
                <option value="default">الافتراضي</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
            </div>

            {(selectedCategory !== 'الكل' || selectedBrand !== 'الكل' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('الكل');
                  setSelectedBrand('الكل');
                  setSearchQuery('');
                }}
                className="text-rose-600 font-bold hover:underline text-[11px] sm:text-xs"
              >
                إعادة ضبط الفلاتر
              </button>
            )}
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
            <Search className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">لا توجد نتائج مطابقة لبحثك</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              جرب البحث عن منتج آخر مثل (كومبوزيت، أوتوكلاف، ليدوكائين، أو سنابل)
            </p>
            <button
              onClick={() => {
                setSelectedCategory('الكل');
                setSelectedBrand('الكل');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              عرض كافة المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onBuyNow={() => setIsCheckoutOpen(true)}
                onQuickView={(p) => setQuickViewProduct(p)}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlist.some((w) => w.id === product.id)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        selectedGovId={selectedGovId}
        onSelectGovernorate={setSelectedGovId}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        defaultGovernorateId={selectedGovId}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Quick View Product Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Order Receipt Modal (Show after order completion) */}
      <OrderReceiptModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        recentOrder={completedOrder}
      />

      {/* Wishlist Modal View */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 text-right space-y-4 max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-base font-bold text-slate-900">مفضلة العيادة ({wishlist.length})</h2>
            </div>

            {wishlist.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">لا توجد منتجات محفوظة بالمفضلة حالياً.</p>
            ) : (
              <div className="space-y-2 divide-y divide-slate-100">
                {wishlist.map((item) => (
                  <div key={item.id} className="pt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt={item.nameAr} className="w-12 h-12 rounded-xl object-contain bg-slate-50 border p-1" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.nameAr}</h4>
                        <span className="text-xs font-black text-sky-900">{formatYER(item.priceYER)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleAddToCart(item, 1);
                        setIsWishlistOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="px-3 py-1.5 bg-sky-600 text-white font-bold text-xs rounded-xl"
                    >
                      أضف للسلة
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Passcode Protection Modal */}
      <AdminPasscodeModal
        isOpen={isAdminPasscodeOpen}
        onClose={() => setIsAdminPasscodeOpen(false)}
        onSuccess={() => {
          setIsAdminPasscodeOpen(false);
          setViewMode('admin');
        }}
      />

      {/* Sticky Floating Bottom Checkout Bar */}
      {cartCount > 0 && viewMode === 'store' && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 text-white border-t border-sky-500/40 p-3 sm:p-4 shadow-2xl backdrop-blur-md animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-600/30 border border-sky-400/40 flex items-center justify-center text-teal-300 font-bold shrink-0">
                <ShoppingBag className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <div className="text-[11px] sm:text-xs text-sky-200 font-medium">
                  السلة بها <strong className="text-amber-300 font-black">{cartCount}</strong> منتجات مختارة
                </div>
                <div className="text-sm sm:text-lg font-black text-white">
                  المجموع: <span className="text-teal-300">{formatYER(cartTotalYER)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="hidden sm:inline-flex px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
              >
                تعديل السلة
              </button>
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-teal-400 hover:from-amber-500 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-amber-300"
              >
                <span>إتمام عملية الطلب الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Admin Quick Access Badge */}
      <div className={`fixed z-40 transition-all ${cartCount > 0 ? 'bottom-20 left-4 sm:bottom-20 sm:left-6' : 'bottom-6 left-6'}`}>
        <button
          onClick={handleOpenAdminDashboard}
          className="px-4 py-3 bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-extrabold text-xs rounded-full shadow-2xl border-2 border-amber-400/50 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">👑 لوحة تحكم المتجر</span>
        </button>
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}
