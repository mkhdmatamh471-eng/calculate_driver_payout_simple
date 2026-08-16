export function formatYER(amount: number): string {
  return new Intl.NumberFormat('ar-YE', {
    maximumFractionDigits: 0,
  }).format(amount) + ' ر.ي';
}

export function formatYemenPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('967')) {
    return '+' + cleaned;
  }
  if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('0'))) {
    return '+967 ' + cleaned;
  }
  return phone;
}

export function buildWhatsAppOrderMessage(
  orderId: string,
  doctorName: string,
  clinicName: string,
  phone: string,
  governorate: string,
  address: string,
  googleMapsUrl: string,
  items: { name: string; quantity: number; priceYER: number }[],
  totalYER: number,
  paymentMethodText: string,
  receiptNumber?: string
): string {
  let msg = `*طلب جديد من متجر اليمن لمستلزمات الأسنان* 🦷✨\n\n`;
  msg += `*رقم الطلب:* ${orderId}\n`;
  msg += `*اسم الطبيب/العيادة:* ${doctorName} (${clinicName || 'عيادة حرة'})\n`;
  msg += `*رقم الهاتف:* ${phone}\n`;
  msg += `*المحافظة:* ${governorate}\n`;
  msg += `*العنوان التفصيلي:* ${address}\n`;
  if (googleMapsUrl) {
    msg += `*موقع العيادة على الخريطة:* ${googleMapsUrl}\n`;
  }
  msg += `\n*المنتجات المطلوبة:*\n`;
  items.forEach((item, idx) => {
    msg += `${idx + 1}. ${item.name} × ${item.quantity} = ${formatYER(item.priceYER * item.quantity)}\n`;
  });
  msg += `\n*الإجمالي الكلي:* ${formatYER(totalYER)}\n`;
  msg += `*طريقة الدفع:* ${paymentMethodText}\n`;
  if (receiptNumber) {
    msg += `*رقم إيصال الكريمي:* ${receiptNumber}\n`;
  }
  msg += `\nيرجى تأكيد تجهيز الطلبية وتحديد موعد تسليم المندوب. شكراً لكم!`;

  return encodeURIComponent(msg);
}
