export type Category = "women" | "kids";

export type SizeStock = { size: string; qty: number };

export type Spot = {
  id: string;
  name: string;
  priceSar: number;
  cover: string | null;
};

export type CatalogItem = Spot & {
  category: Category;
  sizes: SizeStock[];
};

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  body: string;
  createdAt: string;
  images: string[];
};

export type ProductImage = { id: string; dataUrl: string };

export type ProductDetail = {
  id: string;
  name: string;
  category: Category;
  priceSar: number;
  description: string;
  fabric: string;
  embroidery: string;
  stones: string;
  details: string;
  images: ProductImage[];
  sizes: SizeStock[];
  reviews: Review[];
};

export type Channel = { label: string; url: string };

export type ChromeData = {
  whatsapp: string;
  channels: Channel[];
  deliveryBaseSar: number;
  hasOwner: boolean;
};

export type HomeData = { women: Spot[]; kids: Spot[] };

export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "out"
  | "ready"
  | "completed"
  | "cancelled";

export const ORDER_STATUSES: { id: OrderStatus; label: string }[] = [
  { id: "new", label: "جديد" },
  { id: "confirmed", label: "مؤكد" },
  { id: "preparing", label: "قيد التجهيز" },
  { id: "out", label: "خرج للتوصيل" },
  { id: "ready", label: "جاهز للاستلام" },
  { id: "completed", label: "مكتمل" },
  { id: "cancelled", label: "ملغى" },
];

export type OrderItem = {
  id: string;
  productId: string | null;
  productName: string;
  size: string;
  qty: number;
  unitPriceSar: number;
};

export type OrderSummary = {
  id: string;
  number: string;
  customerName: string;
  phone: string;
  fulfillment: "delivery" | "pickup";
  status: OrderStatus;
  totalSar: number;
  createdAt: string;
};

export type OrderDetail = OrderSummary & {
  address: string;
  deliveryFeeSar: number;
  feeIsEstimate: boolean;
  paymentMethod: string;
  subtotalSar: number;
  adminNote: string;
  items: OrderItem[];
};

export type Overview = {
  products: number;
  women: number;
  kids: number;
  orders: number;
  newOrders: number;
  salesSar: number;
  lowStock: { productName: string; size: string; qty: number }[];
};

export type ProductInput = {
  name: string;
  category: Category;
  priceSar: number;
  description: string;
  fabric: string;
  embroidery: string;
  stones: string;
  details: string;
  sizes: SizeStock[];
};

export type CartLine = { productId: string; size: string; qty: number };

export const SIZE_RANK = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "2",
  "4",
  "6",
  "8",
  "10",
  "12",
  "14",
  "16",
];

export function sortSizes<T extends { size: string }>(rows: T[]): T[] {
  const rank = (size: string) => {
    const i = SIZE_RANK.indexOf(size.toUpperCase());
    return i === -1 ? 100 + size.charCodeAt(0) : i;
  };
  return [...rows].sort((a, b) => rank(a.size) - rank(b.size) || a.size.localeCompare(b.size));
}

export function statusLabel(id: string): string {
  return ORDER_STATUSES.find((s) => s.id === id)?.label ?? id;
}
