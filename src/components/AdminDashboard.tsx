import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  DollarSign, 
  MapPin, 
  ExternalLink, 
  Phone, 
  RefreshCw, 
  ArrowLeft, 
  LogOut, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  X,
  Building2,
  Tag,
  Eye,
  ShieldCheck,
  Stethoscope,
  CreditCard,
  Receipt,
  FileText
} from 'lucide-react';
import { Product, Order } from '../types';
import { PRODUCT_CATEGORIES } from '../data/yemenData';
import { formatYER } from '../utils/formatters';
import { 
  fetchAdminStatsFromApi, 
  fetchProductsFromApi, 
  fetchAllOrdersFromApi, 
  createProductInApi, 
  updateProductInApi, 
  deleteProductInApi, 
  updateOrderStatusInApi,
  AdminStats 
} from '../services/api';
import { clearAdminSession } from './AdminPasscodeModal';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('الكل');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('الكل');

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    nameAr: '',
    nameEn: '',
    brand: '3M ESPE',
    category: 'أدوات الحشو',
    priceYER: 10000,
    oldPriceYER: 0,
    stockCount: 15,
    image: '',
    descriptionAr: '',
    tag: '',
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      const [s, p, o] = await Promise.all([
        fetchAdminStatsFromApi(),
        fetchProductsFromApi(),
        fetchAllOrdersFromApi(),
      ]);
      setStats(s);
      setProducts(p);
      setOrders(o);
    } catch (err: any) {
      console.error('Failed loading admin data:', err);
      showToast('تعذر تحميل أحدث بيانات الإدارة');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
    const interval = setInterval(() => {
      loadAllAdminData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Product Modal Open Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      nameAr: '',
      nameEn: '',
      brand: '3M ESPE',
      category: 'أدوات الحشو',
      priceYER: 15000,
      oldPriceYER: 0,
      stockCount: 20,
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
      descriptionAr: 'مستلزمات طب أسنان عالية الجودة معتمدة ومطابقة للمواصفات العالمية.',
      tag: 'جديد',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      brand: product.brand,
      category: product.category,
      priceYER: product.priceYER,
      oldPriceYER: product.oldPriceYER || 0,
      stockCount: product.stockCount,
      image: product.image,
      descriptionAr: product.descriptionAr,
      tag: product.tag || '',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProductInApi(editingProduct.id, productFormData);
        showToast('تم تحديث بيانات المنتج بنجاح');
      } else {
        await createProductInApi(productFormData);
        showToast('تم إدراج المنتج الجديد في قاعدة البيانات');
      }
      setIsProductModalOpen(false);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء حفظ المنتج');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductInApi(id);
      showToast('تم حذف المنتج بنجاح من قاعدة البيانات');
      setDeleteConfirmId(null);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء الحذف');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, orderStatus: string, paymentStatus?: string) => {
    try {
      await updateOrderStatusInApi(orderId, orderStatus, paymentStatus);
      showToast(`تم تحديث حالة الطلب (${orderId}) إلى: ${orderStatus}`);
      loadAllAdminData();
    } catch (err: any) {
      alert('تعذر تحديث حالة الطلب');
    }
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nameAr.includes(productSearch) || p.brand.includes(productSearch);
    const matchesCat = productCatFilter === 'الكل' || p.category === productCatFilter;
    return matchesSearch && matchesCat;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.doctorName.includes(orderSearch) ||
      o.customer.clinicName.includes(orderSearch) ||
      o.customer.phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'الكل' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#1E293B] font-['Tajawal',sans-serif] dir-rtl pb-12">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-sky-500/30 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 medical-shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-md shadow-sky-600/30 shrink-0">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight">لوحة تحكم المتجر</span>
                <span className="bg-sky-500/20 text-sky-300 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border border-sky-500/30">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block truncate max-w-[200px] sm:max-w-none">
                متجر اليمن لطب الأسنان • إدارة الطلبات والمنتجات
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={loadAllAdminData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            <button
              onClick={() => {
                clearAdminSession();
                onBackToStore();
              }}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] sm:text-xs font-bold transition-all border border-rose-500/30 flex items-center gap-1.5 cursor-pointer"
              title="تسجيل الخروج وإلغاء الجلسة"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>

            <button
              onClick={onBackToStore}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-[11px] sm:text-xs font-bold transition-all shadow-md flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">متجر العملاء</span>
              <span className="xs:hidden">المتجر</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Navigation Tabs Bento Pill Bar */}
        <div className="bg-white rounded-3xl p-2 border border-slate-200 medical-shadow flex items-center gap-2 overflow-x-auto custom-scroll">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 min-w-[130px] py-3 px-4 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>الإحصائيات المباشرة</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 min-w-[130px] py-3 px-4 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'products'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>إدارة المنتجات ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 min-w-[130px] py-3 px-4 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>طلبات العيادات الواردة ({orders.length})</span>
            {stats && stats.newOrdersCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse">
                {stats.newOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Bento Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white rounded-3xl p-5 border border-slate-200 medical-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">إجمالي المبيعات</span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {formatYER(stats?.totalRevenueYER || 0)}
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">
                    محسوبة بالريال اليمني بقاعدة البيانات
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 medical-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">إجمالي طلبات العيادات</span>
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {stats?.totalOrders || 0} طلب
                  </h3>
                  <p className="text-[11px] text-sky-600 font-bold mt-1">
                    {stats?.newOrdersCount || 0} طلب جديد قيد التجهيز
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 medical-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">المنتجات بالمتجر</span>
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {stats?.totalProductsCount || 0} صنف
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    مقسمة على كافة التخصصات الطبية
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 medical-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">تنبيهات المخزون</span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {stats?.lowStockProductsCount || 0} أصناف
                  </h3>
                  <p className="text-[11px] text-amber-700 font-bold mt-1">
                    مخزون منخفض أقل من 5 قطع
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Recent Orders Table Bento Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 medical-shadow space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">أحدث الطلبات الواردة مؤخراً</h3>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
                >
                  عرض جميع الطلبات ({orders.length})
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-bold">
                  لا توجد طلبات مسجلة حتى الآن بقاعدة البيانات.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100">
                        <th className="pb-3 font-bold">رقم الطلب</th>
                        <th className="pb-3 font-bold">الطبيب / العيادة</th>
                        <th className="pb-3 font-bold">طريقة الدفع</th>
                        <th className="pb-3 font-bold">رقم الإيصال / الحوالة</th>
                        <th className="pb-3 font-bold">الإجمالي</th>
                        <th className="pb-3 font-bold">حالة الدفع</th>
                        <th className="pb-3 font-bold">حالة الشحن</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-bold text-sky-900 font-mono">{ord.id}</td>
                          <td className="py-3 font-bold text-slate-800">
                            {ord.customer.doctorName}
                            <span className="block text-[10px] text-slate-400 font-normal">{ord.customer.clinicName} • {ord.customer.governorate}</span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              ord.customer.paymentMethod === 'kuraimi_gateway'
                                ? 'bg-sky-100 text-sky-900 border border-sky-200'
                                : ord.customer.paymentMethod === 'kuraimi_manual'
                                ? 'bg-teal-100 text-teal-900 border border-teal-200'
                                : 'bg-amber-100 text-amber-900 border border-amber-200'
                            }`}>
                              {ord.customer.paymentMethod === 'kuraimi_gateway'
                                ? 'الكريمي (حاسب)'
                                : ord.customer.paymentMethod === 'kuraimi_manual'
                                ? 'الكريمي (تحويل)'
                                : 'نقداً عند الاستلام'}
                            </span>
                          </td>
                          <td className="py-3 font-mono font-bold text-xs text-slate-800">
                            {ord.customer.receiptNumber ? (
                              <span className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200">
                                #{ord.customer.receiptNumber}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal text-[11px]">-</span>
                            )}
                          </td>
                          <td className="py-3 font-black text-sky-950">{formatYER(ord.totalYER)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.paymentStatus === 'Paid' ? 'تم الدفع' : 'معلق'}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT (CRUD) */}
        {activeTab === 'products' && (
          <div className="space-y-5">
            
            {/* Products Toolbar */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 medical-shadow flex flex-wrap items-center justify-between gap-4">
              
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                  <input
                    type="text"
                    placeholder="ابحث عن اسم صنف أو ماركة..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full text-xs p-2.5 pr-9 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Category Filter */}
                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="text-xs font-bold p-2.5 bg-slate-100 border-none rounded-2xl outline-none cursor-pointer text-slate-800"
                >
                  <option value="الكل">جميع التصنيفات</option>
                  {PRODUCT_CATEGORIES.filter(c => c !== 'الكل').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Add New Product Button */}
              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج جديد بقاعدة البيانات</span>
              </button>

            </div>

            {/* Products Table Bento Card */}
            <div className="bg-white rounded-3xl border border-slate-200 medical-shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="p-4 font-bold">الصورة</th>
                      <th className="p-4 font-bold">اسم المنتج</th>
                      <th className="p-4 font-bold">التصنيف</th>
                      <th className="p-4 font-bold">الماركة</th>
                      <th className="p-4 font-bold">السعر بالريال اليمني</th>
                      <th className="p-4 font-bold">المخزون المتاح</th>
                      <th className="p-4 font-bold text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <img
                            src={product.image}
                            alt={product.nameAr}
                            className="w-12 h-12 rounded-xl object-contain bg-slate-100 p-1 border border-slate-200"
                          />
                        </td>
                        <td className="p-3 font-bold text-slate-900 max-w-xs">
                          {product.nameAr}
                          <span className="block text-[10px] text-slate-400 font-mono">{product.id}</span>
                        </td>
                        <td className="p-3">
                          <span className="bg-sky-50 text-sky-700 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-600">{product.brand}</td>
                        <td className="p-3 font-black text-sky-950 text-sm">
                          {formatYER(product.priceYER)}
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            product.stockCount <= 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {product.stockCount} قطعة
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(product)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-700 transition-colors cursor-pointer"
                              title="تعديل المنتج"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(product.id)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition-colors cursor-pointer"
                              title="حذف المنتج"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            
            {/* Orders Filter Toolbar */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 medical-shadow flex flex-wrap items-center justify-between gap-4">
              
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="ابحث برقم الطلب، اسم الطبيب، العيادة، أو رقم الهاتف..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full text-xs p-2.5 pr-9 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-bold">الحالة:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="text-xs font-bold p-2.5 bg-slate-100 border-none rounded-2xl outline-none cursor-pointer text-slate-800"
                >
                  <option value="الكل">جميع الحالات</option>
                  <option value="تم الاستلام">تم الاستلام</option>
                  <option value="جاري التجهيز بالمستودع">جاري التجهيز</option>
                  <option value="قيد الشحن مع المندوب">قيد الشحن</option>
                  <option value="تم التسليم بالعيادة">تم التسليم</option>
                </select>
              </div>

            </div>

            {/* Orders List Bento Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-bold text-xs border border-slate-200 medical-shadow">
                لا توجد طلبات مطابقة للبحث حالياً.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl p-6 border border-slate-200 medical-shadow space-y-4">
                    
                    {/* Header Info */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sky-900 font-mono text-base bg-sky-50 px-3 py-1 rounded-xl border border-sky-200">
                          {order.id}
                        </span>
                        <div>
                          <span className="font-extrabold text-slate-900 block text-sm">{order.customer.doctorName}</span>
                          <span className="text-slate-500">{order.customer.clinicName} • {order.customer.governorate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status Selectors */}
                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-500 px-2">الحالة:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value, order.paymentStatus)}
                            className="bg-white font-bold text-xs p-1.5 rounded-xl border border-slate-200 outline-none text-sky-900 cursor-pointer"
                          >
                            <option value="تم الاستلام">تم الاستلام</option>
                            <option value="جاري التجهيز بالمستودع">جاري التجهيز بالمستودع</option>
                            <option value="قيد الشحن مع المندوب">قيد الشحن مع المندوب</option>
                            <option value="تم التسليم بالعيادة">تم التسليم بالعيادة</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-500 px-2">الدفع:</span>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleUpdateOrderStatus(order.id, order.status, e.target.value)}
                            className={`font-bold text-xs p-1.5 rounded-xl border outline-none cursor-pointer ${
                              order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Paid">مدفوع (Paid)</option>
                            <option value="Pending">معلق (Pending)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Address details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
                      <div>
                        <span className="text-slate-400 block font-bold text-[10px] uppercase">رقم التواصل والواتساب:</span>
                        <a
                          href={`https://wa.me/967${order.customer.phone.replace(/^0+/, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-sky-700 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{order.customer.phone}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-bold text-[10px] uppercase">عنوان العيادة التفصيلي:</span>
                        <span className="font-semibold text-slate-800 mt-0.5 block">{order.customer.detailedAddress}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-bold text-[10px] uppercase">موقع الخريطة (GPS):</span>
                        {order.customer.googleMapsUrl ? (
                          <a
                            href={order.customer.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-emerald-700 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>فتح الموقع الخرائطي</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">لم يتم إرفاق إحداثيات</span>
                        )}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">الأصناف المطلوبة:</span>
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-white">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <img src={item.product.image} alt="" className="w-8 h-8 rounded-lg object-contain bg-slate-50 p-0.5 border" />
                              <span className="font-bold text-slate-800">{item.product.nameAr}</span>
                              <span className="text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-md text-[10px]">{item.product.brand}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-slate-600">الكمية: {item.quantity}</span>
                              <span className="font-black text-sky-950">{formatYER(item.product.priceYER * item.quantity)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment & Receipt Details Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                        
                        {/* Payment Method Badge */}
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-sky-700" />
                          <span className="font-bold text-slate-700">طريقة الدفع:</span>
                          <span className={`px-2.5 py-1 rounded-xl font-bold text-xs ${
                            order.customer.paymentMethod === 'kuraimi_gateway'
                              ? 'bg-sky-100 text-sky-900 border border-sky-300'
                              : order.customer.paymentMethod === 'kuraimi_manual'
                              ? 'bg-teal-100 text-teal-900 border border-teal-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {order.customer.paymentMethod === 'kuraimi_gateway'
                              ? '🟢 بوابة الكريمي (حاسب مباشر)'
                              : order.customer.paymentMethod === 'kuraimi_manual'
                              ? '🔵 تحويل بنك الكريمي (موبايل)'
                              : '🟠 الدفع نقداً عند التسليم بالعيادة'}
                          </span>
                        </div>

                        {/* Receipt / Reference Number */}
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-slate-700">رقم إيصال / حوالة الكريمي:</span>
                          {order.customer.receiptNumber ? (
                            <span className="font-mono font-black text-sm text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-300 tracking-wide select-all">
                              #{order.customer.receiptNumber}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-xs font-medium">غير مدخل</span>
                          )}
                        </div>

                        {/* Total Amount */}
                        <div className="text-sm font-black text-slate-900 mr-auto sm:mr-0">
                          الإجمالي الكلي: <span className="text-sky-700 text-base">{formatYER(order.totalYER)}</span>
                        </div>

                      </div>

                      {/* Clinic Notes if present */}
                      {order.customer.notes && (
                        <div className="text-xs text-slate-600 pt-2 border-t border-slate-200/80 flex items-start gap-1.5">
                          <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-800">ملاحظات الطبيب: </span>
                            <span>{order.customer.notes}</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 medical-shadow relative border border-slate-200 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-sky-600" />
                <span>{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد بقاعدة البيانات'}</span>
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المنتج بالعربية *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: طقم كومبوزيت حشوات Z350"
                  value={productFormData.nameAr}
                  onChange={(e) => setProductFormData({ ...productFormData, nameAr: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التصنيف الطبي *</label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-bold bg-white"
                  >
                    {PRODUCT_CATEGORIES.filter(c => c !== 'الكل').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الماركة / الشركة المصنعة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 3M ESPE, NSK, W&H"
                    value={productFormData.brand}
                    onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر (ريال يمني) *</label>
                  <input
                    type="number"
                    required
                    value={productFormData.priceYER}
                    onChange={(e) => setProductFormData({ ...productFormData, priceYER: Number(e.target.value) })}
                    className="w-full p-3 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر القديم (اختياري)</label>
                  <input
                    type="number"
                    value={productFormData.oldPriceYER}
                    onChange={(e) => setProductFormData({ ...productFormData, oldPriceYER: Number(e.target.value) })}
                    className="w-full p-3 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الكمية بالمخزون *</label>
                  <input
                    type="number"
                    required
                    value={productFormData.stockCount}
                    onChange={(e) => setProductFormData({ ...productFormData, stockCount: Number(e.target.value) })}
                    className="w-full p-3 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رابط صورة المنتج (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={productFormData.image}
                  onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الوصف الطبي والتفاصيل</label>
                <textarea
                  rows={3}
                  value={productFormData.descriptionAr}
                  onChange={(e) => setProductFormData({ ...productFormData, descriptionAr: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-medium resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-2xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-md cursor-pointer"
                >
                  حفظ المنتج بقاعدة البيانات
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 border border-slate-200 medical-shadow">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-base">هل أنت تأكد من حذف المنتج؟</h3>
            <p className="text-xs text-slate-500">سيتم إزالة المنتج نهائياً من قاعدة البيانات والمتجر.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs shadow-md cursor-pointer"
              >
                حذف نهائي
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
