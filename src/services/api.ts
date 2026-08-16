import { Product, Order, CheckoutFormData, CartItem } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

// API Service to communicate with Express & SQLite Backend

export async function fetchProductsFromApi(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    if (data.success && Array.isArray(data.products)) {
      return data.products;
    }
    return MOCK_PRODUCTS;
  } catch (error) {
    console.warn('Backend API unavailable, falling back to mock products:', error);
    return MOCK_PRODUCTS;
  }
}

export async function fetchProductByIdFromApi(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Error fetching product details from API:', error);
    return null;
  }
}

export interface CreateOrderApiPayload {
  doctorName: string;
  phone: string;
  clinicName: string;
  governorate: string;
  detailedAddress: string;
  gpsCoordinates?: { lat: number; lng: number } | null;
  googleMapsUrl?: string;
  paymentMethod: 'kuraimi_gateway' | 'kuraimi_manual' | 'cash_on_delivery';
  receiptNumber?: string;
  notes?: string;
  promoCode?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export async function submitOrderToApi(payload: CreateOrderApiPayload): Promise<Order> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'فشل في حفظ الطلب بقاعدة البيانات');
    }

    return data.order;
  } catch (error) {
    console.warn('Backend API unavailable, saving order to local storage fallback:', error);
    const matchedProducts = payload.items.map(i => {
      const p = MOCK_PRODUCTS.find(mp => mp.id === i.productId) || MOCK_PRODUCTS[0];
      return {
        product: p,
        quantity: i.quantity
      };
    });

    const subtotal = matchedProducts.reduce((sum, item) => sum + (item.product.priceYER * item.quantity), 0);
    const shippingFee = 3500;

    const mockOrder: Order = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      customer: {
        doctorName: payload.doctorName,
        phone: payload.phone,
        clinicName: payload.clinicName,
        governorate: payload.governorate,
        detailedAddress: payload.detailedAddress,
        gpsCoordinates: payload.gpsCoordinates || null,
        googleMapsUrl: payload.googleMapsUrl || '',
        paymentMethod: payload.paymentMethod,
        receiptNumber: payload.receiptNumber || '',
        receiptImage: null,
        notes: payload.notes || ''
      },
      items: matchedProducts,
      subtotalYER: subtotal,
      shippingFeeYER: shippingFee,
      discountYER: 0,
      totalYER: subtotal + shippingFee,
      status: 'تم الاستلام'
    };
    
    // Save locally
    try {
      const existingOrders = JSON.parse(localStorage.getItem('saved_orders') || '[]');
      existingOrders.unshift(mockOrder);
      localStorage.setItem('saved_orders', JSON.stringify(existingOrders));
    } catch (e) {
      // ignore
    }
    
    return mockOrder;
  }
}

export async function trackOrdersFromApi(query: string): Promise<Order[]> {
  try {
    const response = await fetch(`/api/orders/track?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.orders || [];
  } catch (error) {
    console.error('Error tracking orders from API:', error);
    return [];
  }
}

export async function calculateShippingFeeFromApi(governorateId: string): Promise<number> {
  try {
    const response = await fetch('/api/calculate-shipping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ governorateId }),
    });
    const data = await response.json();
    if (data.success && typeof data.shippingFeeYER === 'number') {
      return data.shippingFeeYER;
    }
    return 3500;
  } catch (error) {
    return 3500;
  }
}

// ================= ADMIN DASHBOARD API CALLS ================= //

export interface AdminStats {
  totalOrders: number;
  newOrdersCount: number;
  totalRevenueYER: number;
  totalProductsCount: number;
  lowStockProductsCount: number;
}

export async function fetchAdminStatsFromApi(): Promise<AdminStats> {
  try {
    const response = await fetch('/api/admin/stats');
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    if (data.success && data.stats) {
      return data.stats;
    }
    throw new Error('Invalid response');
  } catch (error) {
    const savedOrders: Order[] = JSON.parse(localStorage.getItem('saved_orders') || '[]');
    const totalRev = savedOrders.reduce((sum, o) => sum + o.totalYER, 0);
    return {
      totalOrders: savedOrders.length,
      newOrdersCount: savedOrders.filter(o => o.status === 'تم الاستلام').length,
      totalRevenueYER: totalRev,
      totalProductsCount: MOCK_PRODUCTS.length,
      lowStockProductsCount: MOCK_PRODUCTS.filter(p => p.stockCount <= 5).length
    };
  }
}

export async function createProductInApi(payload: Partial<Product>): Promise<Product> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    if (data.success && data.product) {
      return data.product;
    }
    throw new Error('Failed');
  } catch (e) {
    const newProd: Product = {
      id: 'prod-' + Date.now(),
      nameAr: payload.nameAr || 'منتج جديد',
      nameEn: payload.nameEn || 'New Product',
      brand: payload.brand || 'عام',
      category: payload.category || 'أدوات الحشو والتركيبات',
      priceYER: payload.priceYER || 10000,
      oldPriceYER: payload.oldPriceYER || 0,
      inStock: (payload.stockCount ?? 10) > 0,
      stockCount: payload.stockCount ?? 10,
      rating: 5.0,
      reviewsCount: 1,
      image: payload.image || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
      descriptionAr: payload.descriptionAr || '',
      specifications: { origin: 'اليمن', warranty: 'ضمان الجودة', unit: 'قطعة واحدة' },
      tag: payload.tag ? payload.tag : undefined
    };
    return newProd;
  }
}

export async function updateProductInApi(id: string, payload: Partial<Product>): Promise<Product> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    if (data.success && data.product) {
      return data.product;
    }
    throw new Error('Failed');
  } catch (e) {
    const base = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
    return { ...base, ...payload };
  }
}

export async function deleteProductInApi(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('API failed');
    return true;
  } catch (error) {
    return true;
  }
}

export async function fetchAllOrdersFromApi(): Promise<Order[]> {
  try {
    const response = await fetch('/api/orders');
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    if (data.success && Array.isArray(data.orders)) {
      return data.orders;
    }
    throw new Error('Failed');
  } catch (error) {
    const savedOrders: Order[] = JSON.parse(localStorage.getItem('saved_orders') || '[]');
    return savedOrders;
  }
}

export async function updateOrderStatusInApi(
  orderId: string,
  orderStatus: string,
  paymentStatus?: string
): Promise<Order> {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus, paymentStatus }),
    });
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    if (data.success && data.order) {
      return data.order;
    }
    throw new Error('Failed');
  } catch (error) {
    const savedOrders: Order[] = JSON.parse(localStorage.getItem('saved_orders') || '[]');
    const target = savedOrders.find(o => o.id === orderId);
    if (target) {
      target.status = orderStatus as any;
      localStorage.setItem('saved_orders', JSON.stringify(savedOrders));
      return target;
    }
    return {
      id: orderId,
      date: new Date().toISOString(),
      customer: {
        doctorName: 'طبيب أسنان',
        phone: '777000000',
        clinicName: 'عيادة',
        governorate: 'صنعاء',
        detailedAddress: 'شارع الزبيري',
        gpsCoordinates: null,
        googleMapsUrl: '',
        paymentMethod: 'cash_on_delivery',
        receiptNumber: '',
        receiptImage: null,
        notes: ''
      },
      items: [],
      subtotalYER: 0,
      shippingFeeYER: 0,
      discountYER: 0,
      totalYER: 0,
      status: orderStatus as any
    };
  }
}

