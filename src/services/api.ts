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
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'فشل في حفظ الطلب بقاعدة البيانات');
  }

  return data.order;
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
  const response = await fetch('/api/admin/stats');
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error('فشل جلب إحصائيات النظام');
  }
  return data.stats;
}

export async function createProductInApi(payload: Partial<Product>): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'فشل في إدراج المنتج الجديد بقاعدة البيانات');
  }
  return data.product;
}

export async function updateProductInApi(id: string, payload: Partial<Product>): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'فشل في تحديث بيانات المنتج');
  }
  return data.product;
}

export async function deleteProductInApi(id: string): Promise<boolean> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'فشل في حذف المنتج');
  }
  return true;
}

export async function fetchAllOrdersFromApi(): Promise<Order[]> {
  const response = await fetch('/api/orders');
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error('فشل جلب سجل الطلبات');
  }
  return data.orders || [];
}

export async function updateOrderStatusInApi(
  orderId: string,
  orderStatus: string,
  paymentStatus?: string
): Promise<Order> {
  const response = await fetch(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderStatus, paymentStatus }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'فشل تحديث حالة الطلب');
  }
  return data.order;
}

