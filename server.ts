import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  initDatabase,
  getAllProductsFromDb,
  getProductByIdFromDb,
  createOrderInDb,
  getAllOrdersFromDb,
  trackOrdersFromDb,
  calculateShippingFee,
  addProductToDb,
  updateProductInDb,
  deleteProductFromDb,
  updateOrderStatusInDb,
  getAdminStatsFromDb,
} from './src/db/database.js';
import { YEMEN_GOVERNORATES } from './src/data/yemenData.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Initialize DB and Seed Data
  initDatabase();

  // API Routes
  
  // 1. GET /api/products - Fetch all products
  app.get('/api/products', (req, res) => {
    try {
      const products = getAllProductsFromDb();
      res.json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب المنتجات من قاعدة البيانات' });
    }
  });

  // 2. GET /api/products/:id - Fetch single product
  app.get('/api/products/:id', (req, res) => {
    try {
      const product = getProductByIdFromDb(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
      }
      res.json({ success: true, product });
    } catch (error: any) {
      console.error('Error fetching product:', error);
      res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب تفاصيل المنتج' });
    }
  });

  // 3. POST /api/calculate-shipping - Shipping Fee Logic
  app.post('/api/calculate-shipping', (req, res) => {
    try {
      const { governorateId } = req.body;
      const fee = calculateShippingFee(governorateId || 'sanaa');
      const gov = YEMEN_GOVERNORATES.find((g) => g.id === governorateId) || YEMEN_GOVERNORATES[0];
      
      res.json({
        success: true,
        governorateId: gov.id,
        governorateNameAr: gov.nameAr,
        shippingFeeYER: fee,
        estimatedHours: gov.estimatedHours,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: 'تعذر حساب تكلفة الشحن' });
    }
  });

  // 4. GET /api/governorates - Get governorates list
  app.get('/api/governorates', (req, res) => {
    res.json({
      success: true,
      governorates: YEMEN_GOVERNORATES,
    });
  });

  // 5. POST /api/orders - Create new order
  app.post('/api/orders', (req, res) => {
    try {
      const {
        doctorName,
        phone,
        clinicName,
        governorate,
        detailedAddress,
        gpsCoordinates,
        googleMapsUrl,
        paymentMethod,
        receiptNumber,
        notes,
        promoCode,
        items,
      } = req.body;

      if (!doctorName || !phone || !clinicName || !governorate || !detailedAddress) {
        return res.status(400).json({
          success: false,
          message: 'يرجى استكمال جميع البيانات الأساسية المطلوبة للطلب (الاسم، الهاتف، اسم العيادة، العنوان والمحافظة)',
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'السلة فارغة. يرجى إضافة منتجات للطلب.',
        });
      }

      const order = createOrderInDb({
        doctorName,
        phone,
        clinicName,
        governorate,
        detailedAddress,
        gpsCoordinates,
        googleMapsUrl,
        paymentMethod,
        receiptNumber,
        notes,
        promoCode,
        items,
      });

      console.log(`📦 New order created successfully: ${order.id} for Dr. ${order.customer.doctorName}`);

      res.status(201).json({
        success: true,
        message: 'تم تسجيل واستلام طلب توريد العيادة بنجاح في قاعدة البيانات',
        order,
      });
    } catch (error: any) {
      console.error('Error creating order:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'تعذر تسجيل الطلب في قاعدة البيانات',
      });
    }
  });

  // 6. GET /api/orders - Fetch all orders
  app.get('/api/orders', (req, res) => {
    try {
      const orders = getAllOrdersFromDb();
      res.json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, message: 'تعذر جلب سجل الطلبات' });
    }
  });

  // 7. GET /api/orders/track - Track order by ID or phone number
  app.get('/api/orders/track', (req, res) => {
    try {
      const query = (req.query.q as string) || '';
      if (!query.trim()) {
        return res.json({ success: true, orders: [] });
      }
      const matchingOrders = trackOrdersFromDb(query);
      res.json({
        success: true,
        count: matchingOrders.length,
        orders: matchingOrders,
      });
    } catch (error: any) {
      console.error('Error tracking orders:', error);
      res.status(500).json({ success: false, message: 'حدث خطأ أثناء البحث عن الطلب' });
    }
  });

  // ================= ADMIN API ENDPOINTS ================= //

  // 8. GET /api/admin/stats - Overview Metrics
  app.get('/api/admin/stats', (req, res) => {
    try {
      const stats = getAdminStatsFromDb();
      res.json({ success: true, stats });
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب إحصائيات النظام' });
    }
  });

  // 9. POST /api/products - Create new product
  app.post('/api/products', (req, res) => {
    try {
      const { nameAr, nameEn, brand, category, priceYER, oldPriceYER, stockCount, image, descriptionAr, tag } = req.body;
      if (!nameAr || !category || !priceYER) {
        return res.status(400).json({ success: false, message: 'يرجى إدخال اسم المنتج والتصنيف والسعر بالريال اليمني' });
      }

      const newProduct = addProductToDb({
        nameAr,
        nameEn: nameEn || nameAr,
        brand: brand || 'عام',
        category,
        priceYER: Number(priceYER),
        oldPriceYER: oldPriceYER ? Number(oldPriceYER) : undefined,
        stockCount: Number(stockCount || 10),
        image: image || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
        descriptionAr: descriptionAr || 'مستلزمات أسنان ذات جودة عالية معتمدة.',
        tag,
      });

      res.status(201).json({ success: true, message: 'تمت إضافة المنتج بنجاح إلى قاعدة البيانات', product: newProduct });
    } catch (error: any) {
      console.error('Error creating product:', error);
      res.status(500).json({ success: false, message: 'تعذر إضافة المنتج' });
    }
  });

  // 10. PUT /api/products/:id - Update existing product
  app.put('/api/products/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updatedProduct = updateProductInDb(id, req.body);
      res.json({ success: true, message: 'تم تحديث بيانات المنتج بنجاح', product: updatedProduct });
    } catch (error: any) {
      console.error('Error updating product:', error);
      res.status(500).json({ success: false, message: 'تعذر تحديث بيانات المنتج' });
    }
  });

  // 11. DELETE /api/products/:id - Delete product
  app.delete('/api/products/:id', (req, res) => {
    try {
      const { id } = req.params;
      deleteProductFromDb(id);
      res.json({ success: true, message: 'تم حذف المنتج من المتجر وقاعدة البيانات' });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      res.status(500).json({ success: false, message: 'تعذر حذف المنتج' });
    }
  });

  // 12. PUT /api/orders/:id/status - Update Order & Payment Status
  app.put('/api/orders/:id/status', (req, res) => {
    try {
      const { id } = req.params;
      const { orderStatus, paymentStatus } = req.body;

      if (!orderStatus) {
        return res.status(400).json({ success: false, message: 'يرجى تحديد حالة الطلب الجديدة' });
      }

      const updatedOrder = updateOrderStatusInDb(id, orderStatus, paymentStatus);
      res.json({ success: true, message: 'تم تحديث حالة الطلب بنجاح', order: updatedOrder });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      res.status(500).json({ success: false, message: 'تعذر تحديث حالة الطلب' });
    }
  });

  // Fallback 404 JSON handler for unhandled /api/* routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: 'المسار المطلوب غير موجود في الـ API' });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Dental Store Yemen Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

