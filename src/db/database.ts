import fs from 'fs';
import path from 'path';
import { MOCK_PRODUCTS } from '../data/mockProducts.js';
import { YEMEN_GOVERNORATES } from '../data/yemenData.js';

export interface DbProduct {
  id: string;
  name_ar: string;
  name_en: string;
  brand: string;
  category: string;
  price_yer: number;
  old_price_yer?: number;
  in_stock: number;
  stock_count: number;
  rating: number;
  reviews_count: number;
  image: string;
  description_ar: string;
  specifications_json: string;
  tag?: string;
}

export interface DbOrder {
  id: string;
  doctor_name: string;
  phone: string;
  clinic_name: string;
  governorate: string;
  detailed_address: string;
  gps_coordinates_json: string;
  google_maps_url: string;
  payment_method: string;
  receipt_number: string;
  notes: string;
  items_json: string;
  subtotal_yer: number;
  shipping_fee_yer: number;
  discount_yer: number;
  total_yer: number;
  payment_status: string;
  order_status: string;
  created_at: string;
}

// Check for node:sqlite DatabaseSync
let sqliteDb: any = null;
let isNativeSqlite = false;

function setupSqliteInstance() {
  if (sqliteDb) return;
  try {
    // Try requiring Node's native sqlite module (Node 22+)
    const { DatabaseSync } = require('node:sqlite');
    const dbPath = path.join(process.cwd(), 'dental_store.db');
    sqliteDb = new DatabaseSync(dbPath);
    isNativeSqlite = true;
    console.log('✅ SQLite Database initialized via node:sqlite at:', dbPath);
  } catch (err) {
    console.log('ℹ️ Native node:sqlite not available, using JSON file database fallback.');
  }
}

// Fallback JSON DB file path
const jsonDbPath = path.join(process.cwd(), 'dental_store.json');

interface LocalJsonDb {
  products: DbProduct[];
  orders: DbOrder[];
}

function loadJsonDb(): LocalJsonDb {
  if (!fs.existsSync(jsonDbPath)) {
    const initialDb: LocalJsonDb = {
      products: MOCK_PRODUCTS.map((p) => ({
        id: p.id,
        name_ar: p.nameAr,
        name_en: p.nameEn,
        brand: p.brand,
        category: p.category,
        price_yer: p.priceYER,
        old_price_yer: p.oldPriceYER,
        in_stock: p.inStock ? 1 : 0,
        stock_count: p.stockCount,
        rating: p.rating,
        reviews_count: p.reviewsCount,
        image: p.image,
        description_ar: p.descriptionAr,
        specifications_json: JSON.stringify(p.specifications),
        tag: p.tag || '',
      })),
      orders: [],
    };
    fs.writeFileSync(jsonDbPath, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
  try {
    const data = fs.readFileSync(jsonDbPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { products: [], orders: [] };
  }
}

function saveJsonDb(data: LocalJsonDb) {
  fs.writeFileSync(jsonDbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Initialize SQLite Tables & Seed
export function initDatabase() {
  setupSqliteInstance();
  if (isNativeSqlite && sqliteDb) {
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        brand TEXT NOT NULL,
        category TEXT NOT NULL,
        price_yer INTEGER NOT NULL,
        old_price_yer INTEGER,
        in_stock INTEGER NOT NULL DEFAULT 1,
        stock_count INTEGER NOT NULL DEFAULT 10,
        rating REAL DEFAULT 5.0,
        reviews_count INTEGER DEFAULT 0,
        image TEXT NOT NULL,
        description_ar TEXT,
        specifications_json TEXT,
        tag TEXT
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        doctor_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        clinic_name TEXT NOT NULL,
        governorate TEXT NOT NULL,
        detailed_address TEXT NOT NULL,
        gps_coordinates_json TEXT,
        google_maps_url TEXT,
        payment_method TEXT NOT NULL,
        receipt_number TEXT,
        notes TEXT,
        items_json TEXT NOT NULL,
        subtotal_yer INTEGER NOT NULL,
        shipping_fee_yer INTEGER NOT NULL,
        discount_yer INTEGER NOT NULL DEFAULT 0,
        total_yer INTEGER NOT NULL,
        payment_status TEXT NOT NULL DEFAULT 'Pending',
        order_status TEXT NOT NULL DEFAULT 'تم الاستلام',
        created_at TEXT NOT NULL
      );
    `);

    // Check if products exist in SQLite
    const countStmt = sqliteDb.prepare('SELECT COUNT(*) as count FROM products');
    const row = countStmt.get() as { count: number };
    if (row.count === 0) {
      console.log('🌱 Seeding products into SQLite database...');
      const insertStmt = sqliteDb.prepare(`
        INSERT INTO products (
          id, name_ar, name_en, brand, category, price_yer, old_price_yer,
          in_stock, stock_count, rating, reviews_count, image, description_ar,
          specifications_json, tag
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `);

      for (const p of MOCK_PRODUCTS) {
        insertStmt.run(
          p.id,
          p.nameAr,
          p.nameEn,
          p.brand,
          p.category,
          p.priceYER,
          p.oldPriceYER || null,
          p.inStock ? 1 : 0,
          p.stockCount,
          p.rating,
          p.reviewsCount,
          p.image,
          p.descriptionAr,
          JSON.stringify(p.specifications),
          p.tag || null
        );
      }
      console.log(`✅ Seeded ${MOCK_PRODUCTS.length} dental products into SQLite.`);
    }
  } else {
    // Ensure JSON DB is ready
    loadJsonDb();
  }
}

// Calculate Shipping Fee Logic
export function calculateShippingFee(governorateId: string): number {
  const gov = YEMEN_GOVERNORATES.find((g) => g.id === governorateId);
  if (gov) {
    return gov.shippingFeeYER;
  }
  // Default fallback for unrecognized governorates
  return 3500;
}

// Database Query API Functions
export function getAllProductsFromDb(): any[] {
  if (isNativeSqlite && sqliteDb) {
    const stmt = sqliteDb.prepare('SELECT * FROM products');
    const rows = stmt.all() as DbProduct[];
    return rows.map(formatProductDbToApi);
  } else {
    const jsonDb = loadJsonDb();
    return jsonDb.products.map(formatProductDbToApi);
  }
}

export function getProductByIdFromDb(id: string): any | null {
  if (isNativeSqlite && sqliteDb) {
    const stmt = sqliteDb.prepare('SELECT * FROM products WHERE id = ?');
    const row = stmt.get(id) as DbProduct | undefined;
    return row ? formatProductDbToApi(row) : null;
  } else {
    const jsonDb = loadJsonDb();
    const found = jsonDb.products.find((p) => p.id === id);
    return found ? formatProductDbToApi(found) : null;
  }
}

function formatProductDbToApi(p: DbProduct) {
  let specs = {};
  try {
    specs = p.specifications_json ? JSON.parse(p.specifications_json) : {};
  } catch {
    specs = {};
  }

  return {
    id: p.id,
    nameAr: p.name_ar,
    nameEn: p.name_en,
    brand: p.brand,
    category: p.category,
    priceYER: p.price_yer,
    oldPriceYER: p.old_price_yer || undefined,
    inStock: p.in_stock === 1,
    stockCount: p.stock_count,
    rating: p.rating,
    reviewsCount: p.reviews_count,
    image: p.image,
    descriptionAr: p.description_ar,
    specifications: specs,
    tag: p.tag || undefined,
  };
}

export interface CreateOrderPayload {
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

export function createOrderInDb(payload: CreateOrderPayload) {
  const products = getAllProductsFromDb();
  let subtotal = 0;
  const processedItems: Array<{
    product: any;
    quantity: number;
  }> = [];

  // Calculate Subtotal & Validate Stock
  for (const itemPayload of payload.items) {
    const product = products.find((p) => p.id === itemPayload.productId);
    if (!product) {
      throw new Error(`المنتج المطلوب برقم (${itemPayload.productId}) غير موجود`);
    }

    if (product.stockCount < itemPayload.quantity) {
      throw new Error(`الكمية المطلوبة من ${product.nameAr} غير متوفرة حالياً بالكامل بالمخزون`);
    }

    subtotal += product.priceYER * itemPayload.quantity;
    processedItems.push({
      product,
      quantity: itemPayload.quantity,
    });
  }

  // Shipping Fee Logic
  const shippingFee = calculateShippingFee(payload.governorate);

  // Promo Code Discount Logic
  let discount = 0;
  if (payload.promoCode && (payload.promoCode.trim().toUpperCase() === 'DENTAL10' || payload.promoCode.trim() === 'طبيب10')) {
    discount = Math.round(subtotal * 0.10);
  }

  const total = Math.max(0, subtotal - discount + shippingFee);

  // Generate Order ID & Timestamp
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const orderId = `ORD-${randomNum}`;
  const createdAt = new Date().toISOString();

  const paymentStatus = payload.paymentMethod === 'cash_on_delivery' ? 'Pending' : 'Paid';
  const orderStatus = 'تم الاستلام';

  let finalReceiptNumber = payload.receiptNumber || '';
  if (!finalReceiptNumber && payload.paymentMethod === 'kuraimi_gateway') {
    finalReceiptNumber = `HASIB-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  // Reduce Stock Quantities in Database
  if (isNativeSqlite && sqliteDb) {
    const updateStockStmt = sqliteDb.prepare(`
      UPDATE products 
      SET stock_count = stock_count - ?,
          in_stock = CASE WHEN (stock_count - ?) <= 0 THEN 0 ELSE 1 END
      WHERE id = ?
    `);

    for (const item of processedItems) {
      updateStockStmt.run(item.quantity, item.quantity, item.product.id);
    }

    // Insert Order
    const insertOrderStmt = sqliteDb.prepare(`
      INSERT INTO orders (
        id, doctor_name, phone, clinic_name, governorate, detailed_address,
        gps_coordinates_json, google_maps_url, payment_method, receipt_number,
        notes, items_json, subtotal_yer, shipping_fee_yer, discount_yer,
        total_yer, payment_status, order_status, created_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    insertOrderStmt.run(
      orderId,
      payload.doctorName,
      payload.phone,
      payload.clinicName,
      payload.governorate,
      payload.detailedAddress,
      payload.gpsCoordinates ? JSON.stringify(payload.gpsCoordinates) : null,
      payload.googleMapsUrl || '',
      payload.paymentMethod,
      finalReceiptNumber,
      payload.notes || '',
      JSON.stringify(processedItems),
      subtotal,
      shippingFee,
      discount,
      total,
      paymentStatus,
      orderStatus,
      createdAt
    );
  } else {
    // JSON DB fallback
    const jsonDb = loadJsonDb();

    // Deduct stock
    for (const item of processedItems) {
      const p = jsonDb.products.find((prod) => prod.id === item.product.id);
      if (p) {
        p.stock_count = Math.max(0, p.stock_count - item.quantity);
        p.in_stock = p.stock_count > 0 ? 1 : 0;
      }
    }

    const newOrderRecord: DbOrder = {
      id: orderId,
      doctor_name: payload.doctorName,
      phone: payload.phone,
      clinic_name: payload.clinicName,
      governorate: payload.governorate,
      detailed_address: payload.detailedAddress,
      gps_coordinates_json: payload.gpsCoordinates ? JSON.stringify(payload.gpsCoordinates) : '',
      google_maps_url: payload.googleMapsUrl || '',
      payment_method: payload.paymentMethod,
      receipt_number: finalReceiptNumber,
      notes: payload.notes || '',
      items_json: JSON.stringify(processedItems),
      subtotal_yer: subtotal,
      shipping_fee_yer: shippingFee,
      discount_yer: discount,
      total_yer: total,
      payment_status: paymentStatus,
      order_status: orderStatus,
      created_at: createdAt,
    };

    jsonDb.orders.unshift(newOrderRecord);
    saveJsonDb(jsonDb);
  }

  // Return formatted order object for frontend
  return {
    id: orderId,
    date: createdAt,
    customer: {
      doctorName: payload.doctorName,
      phone: payload.phone,
      clinicName: payload.clinicName,
      governorate: payload.governorate,
      detailedAddress: payload.detailedAddress,
      gpsCoordinates: payload.gpsCoordinates || null,
      googleMapsUrl: payload.googleMapsUrl || '',
      paymentMethod: payload.paymentMethod,
      receiptNumber: finalReceiptNumber,
      receiptImage: null,
      notes: payload.notes || '',
    },
    items: processedItems,
    subtotalYER: subtotal,
    shippingFeeYER: shippingFee,
    discountYER: discount,
    totalYER: total,
    status: orderStatus,
    paymentStatus,
  };
}

export function getAllOrdersFromDb(): any[] {
  if (isNativeSqlite && sqliteDb) {
    const stmt = sqliteDb.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    const rows = stmt.all() as DbOrder[];
    return rows.map(formatOrderDbToApi);
  } else {
    const jsonDb = loadJsonDb();
    return jsonDb.orders.map(formatOrderDbToApi);
  }
}

export function trackOrdersFromDb(query: string): any[] {
  const q = query.trim().toLowerCase();
  const allOrders = getAllOrdersFromDb();
  return allOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(q) ||
      order.customer.phone.includes(q) ||
      order.customer.doctorName.toLowerCase().includes(q) ||
      order.customer.clinicName.toLowerCase().includes(q)
  );
}

function formatOrderDbToApi(o: DbOrder) {
  let items = [];
  let gps = null;
  try {
    items = o.items_json ? JSON.parse(o.items_json) : [];
  } catch {
    items = [];
  }
  try {
    gps = o.gps_coordinates_json ? JSON.parse(o.gps_coordinates_json) : null;
  } catch {
    gps = null;
  }

  return {
    id: o.id,
    date: o.created_at,
    customer: {
      doctorName: o.doctor_name,
      phone: o.phone,
      clinicName: o.clinic_name,
      governorate: o.governorate,
      detailedAddress: o.detailed_address,
      gpsCoordinates: gps,
      googleMapsUrl: o.google_maps_url,
      paymentMethod: o.payment_method,
      receiptNumber: o.receipt_number,
      receiptImage: null,
      notes: o.notes,
    },
    items,
    subtotalYER: o.subtotal_yer,
    shippingFeeYER: o.shipping_fee_yer,
    discountYER: o.discount_yer,
    totalYER: o.total_yer,
    status: o.order_status,
    paymentStatus: o.payment_status,
  };
}

// ================= ADMIN FUNCTIONS ================= //

export function addProductToDb(payload: any) {
  const jsonDb = loadJsonDb();
  const id = `PROD-${Date.now()}`;
  const newProduct: DbProduct = {
    id,
    name_ar: payload.nameAr,
    name_en: payload.nameEn || payload.nameAr,
    brand: payload.brand || 'عام',
    category: payload.category,
    price_yer: Number(payload.priceYER),
    old_price_yer: payload.oldPriceYER ? Number(payload.oldPriceYER) : undefined,
    in_stock: (payload.stockCount || 10) > 0 ? 1 : 0,
    stock_count: Number(payload.stockCount || 10),
    rating: 5.0,
    reviews_count: 1,
    image: payload.image || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
    description_ar: payload.descriptionAr || '',
    specifications_json: JSON.stringify({ 'الضمان': 'سنة معتمدة', 'بلد الصنع': 'المانيا' }),
    tag: payload.tag || '',
  };

  if (isNativeSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare(`
        INSERT INTO products (
          id, name_ar, name_en, brand, category, price_yer, old_price_yer,
          in_stock, stock_count, rating, reviews_count, image, description_ar,
          specifications_json, tag
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        newProduct.id,
        newProduct.name_ar,
        newProduct.name_en,
        newProduct.brand,
        newProduct.category,
        newProduct.price_yer,
        newProduct.old_price_yer || null,
        newProduct.in_stock,
        newProduct.stock_count,
        newProduct.rating,
        newProduct.reviews_count,
        newProduct.image,
        newProduct.description_ar,
        newProduct.specifications_json,
        newProduct.tag || ''
      );
    } catch (err) {
      console.error('Error adding product to SQLite:', err);
    }
  }

  jsonDb.products.unshift(newProduct);
  saveJsonDb(jsonDb);
  return formatProductDbToApi(newProduct);
}

export function updateProductInDb(id: string, payload: any) {
  const jsonDb = loadJsonDb();
  const index = jsonDb.products.findIndex((p) => p.id === id);
  if (index !== -1) {
    const p = jsonDb.products[index];
    if (payload.nameAr) p.name_ar = payload.nameAr;
    if (payload.nameEn) p.name_en = payload.nameEn;
    if (payload.brand) p.brand = payload.brand;
    if (payload.category) p.category = payload.category;
    if (payload.priceYER !== undefined) p.price_yer = Number(payload.priceYER);
    if (payload.oldPriceYER !== undefined) p.old_price_yer = Number(payload.oldPriceYER);
    if (payload.stockCount !== undefined) {
      p.stock_count = Number(payload.stockCount);
      p.in_stock = p.stock_count > 0 ? 1 : 0;
    }
    if (payload.image) p.image = payload.image;
    if (payload.descriptionAr) p.description_ar = payload.descriptionAr;
    if (payload.tag !== undefined) p.tag = payload.tag;
    saveJsonDb(jsonDb);
  }

  if (isNativeSqlite && sqliteDb) {
    try {
      const current = getProductByIdFromDb(id);
      if (current) {
        const nameAr = payload.nameAr || current.nameAr;
        const nameEn = payload.nameEn || current.nameEn;
        const brand = payload.brand || current.brand;
        const category = payload.category || current.category;
        const priceYER = payload.priceYER !== undefined ? Number(payload.priceYER) : current.priceYER;
        const oldPriceYER = payload.oldPriceYER !== undefined ? Number(payload.oldPriceYER) : current.oldPriceYER;
        const stockCount = payload.stockCount !== undefined ? Number(payload.stockCount) : current.stockCount;
        const inStock = stockCount > 0 ? 1 : 0;
        const image = payload.image || current.image;
        const descriptionAr = payload.descriptionAr || current.descriptionAr;
        const tag = payload.tag !== undefined ? payload.tag : (current.tag || '');

        const stmt = sqliteDb.prepare(`
          UPDATE products SET
            name_ar = ?, name_en = ?, brand = ?, category = ?, price_yer = ?,
            old_price_yer = ?, stock_count = ?, in_stock = ?, image = ?,
            description_ar = ?, tag = ?
          WHERE id = ?
        `);
        stmt.run(
          nameAr, nameEn, brand, category, priceYER, oldPriceYER || null,
          stockCount, inStock, image, descriptionAr, tag, id
        );
      }
    } catch (err) {
      console.error('Error updating product in SQLite:', err);
    }
  }

  const updated = getProductByIdFromDb(id);
  if (!updated) {
    throw new Error('المنتج غير موجود');
  }
  return updated;
}

export function deleteProductFromDb(id: string) {
  const jsonDb = loadJsonDb();
  jsonDb.products = jsonDb.products.filter((p) => p.id !== id);
  saveJsonDb(jsonDb);

  if (isNativeSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare('DELETE FROM products WHERE id = ?');
      stmt.run(id);
    } catch (err) {
      console.error('Error deleting product from SQLite:', err);
    }
  }

  return true;
}

export function updateOrderStatusInDb(id: string, orderStatus: string, paymentStatus?: string) {
  const jsonDb = loadJsonDb();
  const jsonOrder = jsonDb.orders.find((o) => o.id === id);
  if (jsonOrder) {
    if (orderStatus) jsonOrder.order_status = orderStatus;
    if (paymentStatus) jsonOrder.payment_status = paymentStatus;
    saveJsonDb(jsonDb);
  }

  if (isNativeSqlite && sqliteDb) {
    try {
      if (orderStatus && paymentStatus) {
        const stmt = sqliteDb.prepare('UPDATE orders SET order_status = ?, payment_status = ? WHERE id = ?');
        stmt.run(orderStatus, paymentStatus, id);
      } else if (orderStatus) {
        const stmt = sqliteDb.prepare('UPDATE orders SET order_status = ? WHERE id = ?');
        stmt.run(orderStatus, id);
      } else if (paymentStatus) {
        const stmt = sqliteDb.prepare('UPDATE orders SET payment_status = ? WHERE id = ?');
        stmt.run(paymentStatus, id);
      }
    } catch (err) {
      console.error('Error updating order in SQLite:', err);
    }
  }

  const allOrders = getAllOrdersFromDb();
  const updatedOrder = allOrders.find((o) => o.id === id);
  if (!updatedOrder) {
    throw new Error('الطلب غير موجود');
  }

  return updatedOrder;
}

export function getAdminStatsFromDb() {
  const products = getAllProductsFromDb();
  const orders = getAllOrdersFromDb();

  const totalRevenueYER = orders.reduce((acc, o) => acc + (o.totalYER || 0), 0);
  const newOrdersCount = orders.filter((o) => o.status === 'تم الاستلام' || o.status === 'جديد' || o.status === 'جاري التجهيز بالمستودع').length;
  const lowStockProductsCount = products.filter((p) => p.stockCount <= 5).length;

  return {
    totalOrders: orders.length,
    newOrdersCount,
    totalRevenueYER,
    totalProductsCount: products.length,
    lowStockProductsCount,
  };
}

