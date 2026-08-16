export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  brand: string;
  category: string;
  priceYER: number;
  oldPriceYER?: number;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  image: string;
  descriptionAr: string;
  specifications: {
    origin: string;
    warranty: string;
    unit: string;
    lotExpiry?: string;
    modelNumber?: string;
  };
  tag?: 'الأكثر مبيعاً' | 'عرض خاص' | 'جديد' | 'حسومات عيادية';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Governorate {
  id: string;
  nameAr: string;
  nameEn: string;
  shippingFeeYER: number;
  estimatedHours: string;
}

export interface CheckoutFormData {
  doctorName: string;
  phone: string;
  clinicName: string;
  governorate: string;
  detailedAddress: string;
  gpsCoordinates: { lat: number; lng: number } | null;
  googleMapsUrl: string;
  paymentMethod: 'kuraimi_gateway' | 'kuraimi_manual' | 'cash_on_delivery';
  receiptNumber: string;
  receiptImage: string | null;
  notes: string;
}

export interface Order {
  id: string;
  date: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotalYER: number;
  shippingFeeYER: number;
  discountYER: number;
  totalYER: number;
  status: 'تم الاستلام' | 'جاري التجهيز' | 'قيد الشحن مع المندوب' | 'تم التسليم بالعيادة';
}
