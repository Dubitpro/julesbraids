import fs from "fs";
import path from "path";
import { getAllProducts, updateProduct, type ProductItem } from "./products-store";

const DATA_DIR = path.join(process.cwd(), "data");

// ================= TYPES =================

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  productType: "WIG" | "BUNDLE" | "CLOSURE" | "FRONTAL" | "ACCESSORY" | "RAW";
  isActive: boolean;
  createdAt: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount?: number;
  isFeatured: boolean;
  status: "ACTIVE" | "DRAFT";
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    name: string;
    length?: string;
    sku: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  paymentStatus: "PAID" | "PENDING" | "REFUNDED";
  fulfillmentStatus: "UNFULFILLED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  carrier?: string;
  trackingNumber?: string;
  createdAt: string;
  notes?: string;
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  tier: "VIP" | "GOLD" | "STANDARD";
  city: string;
  country: string;
  lastOrderDate: string;
  notes?: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  supportPhone: string;
  currency: string;
  timezone: string;
  announcementText: string;
  showAnnouncement: boolean;
  lowStockThreshold: number;
  autoHideOutOfStock: boolean;
  standardShippingFee: number;
  expressShippingFee: number;
  freeShippingThreshold: number;
  hygienePolicy: string;
}

// ================= DEFAULT SEED DATA =================

const SEED_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-wigs",
    name: "Luxury Wigs",
    slug: "wigs",
    description: "Pre-plucked HD lace front wigs, glueless 360 wigs, and full lace natural units.",
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop",
    productType: "WIG",
    isActive: true,
    createdAt: "2026-01-10T12:00:00Z",
  },
  {
    id: "cat-bundles",
    name: "Hair Bundles",
    slug: "bundles",
    description: "100% Virgin Indian temple hair and Vietnamese single-donor bundle deals.",
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop",
    productType: "BUNDLE",
    isActive: true,
    createdAt: "2026-01-10T12:00:00Z",
  },
  {
    id: "cat-closures",
    name: "HD Lace Closures",
    slug: "closures",
    description: "Flawless melt 4x4, 5x5, and 6x6 HD Swiss lace closures with invisible parting.",
    imageUrl: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop",
    productType: "CLOSURE",
    isActive: true,
    createdAt: "2026-01-10T12:00:00Z",
  },
  {
    id: "cat-frontals",
    name: "HD Ear-to-Ear Frontals",
    slug: "frontals",
    description: "13x4 and 13x6 real Swiss ultra-thin frontal pieces for seamless hairlines.",
    imageUrl: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=800&auto=format&fit=crop",
    productType: "FRONTAL",
    isActive: true,
    createdAt: "2026-01-10T12:00:00Z",
  },
  {
    id: "cat-accessories",
    name: "Haircare & Accessories",
    slug: "accessories",
    description: "Silk sleep bonnets, melt bands, edge control, and artisan styling tools.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    productType: "ACCESSORY",
    isActive: true,
    createdAt: "2026-01-10T12:00:00Z",
  },
  {
    id: "cat-raw",
    name: "Raw Unprocessed Hair",
    slug: "raw-hair",
    description: "Single donor unadulterated raw hair from Vietnam, Cambodia, and Burma.",
    imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop",
    productType: "RAW",
    isActive: true,
    createdAt: "2026-01-10T12:00:00Z",
  },
];

const SEED_COLLECTIONS: CollectionItem[] = [
  {
    id: "col-viet-raw",
    name: "Raw Vietnamese Luxury",
    slug: "raw-vietnamese-luxury",
    description: "Ultra-silky, double-drawn single donor raw Vietnamese hair known for unmatched longevity.",
    imageUrl: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=1200&auto=format&fit=crop",
    productCount: 4,
    isFeatured: true,
    status: "ACTIVE",
    createdAt: "2026-01-12T10:00:00Z",
  },
  {
    id: "col-temple-indian",
    name: "Virgin Indian Temple Hair",
    slug: "virgin-indian-temple-hair",
    description: "Ethically donated Indian temple hair with natural body wave and bouncy luster.",
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1200&auto=format&fit=crop",
    productCount: 3,
    isFeatured: true,
    status: "ACTIVE",
    createdAt: "2026-01-14T10:00:00Z",
  },
  {
    id: "col-hd-melt",
    name: "Swiss HD Melt Lace Series",
    slug: "swiss-hd-melt-lace-series",
    description: "Our signature undetectable lace line with hand-tied single knots that melt into skin.",
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1200&auto=format&fit=crop",
    productCount: 6,
    isFeatured: true,
    status: "ACTIVE",
    createdAt: "2026-01-16T10:00:00Z",
  },
  {
    id: "col-bundle-deals",
    name: "Master Braid & Bundle Specials",
    slug: "master-braid-bundle-specials",
    description: "Curated 3-bundle and 4-bundle value packages designed for full, voluminous installs.",
    imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1200&auto=format&fit=crop",
    productCount: 5,
    isFeatured: false,
    status: "ACTIVE",
    createdAt: "2026-01-20T10:00:00Z",
  },
];

const SEED_ORDERS: OrderItem[] = [
  {
    id: "ord-1049",
    orderNumber: "JB-1049",
    customerName: "Aaliyah Washington",
    customerEmail: "aaliyah.w@example.com",
    customerPhone: "+1 (555) 234-8901",
    shippingAddress: {
      street: "742 Evergreen Terrace",
      city: "Atlanta",
      state: "GA",
      zipCode: "30301",
      country: "United States",
    },
    items: [
      {
        productId: "prod-viet-straight-wig",
        name: "Raw Vietnamese Natural Straight Lace Front Wig",
        length: "22 inch",
        sku: "VNW-22",
        price: 540,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=300&auto=format&fit=crop",
      },
      {
        productId: "prod-bonnet",
        name: "Silk Satin Protective Sleep Bonnet",
        length: "One Size",
        sku: "ACC-BNT-01",
        price: 25,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=300&auto=format&fit=crop",
      },
    ],
    subtotal: 565,
    shippingCost: 0,
    tax: 42.38,
    total: 607.38,
    currency: "USD",
    paymentStatus: "PAID",
    fulfillmentStatus: "UNFULFILLED",
    createdAt: "2026-09-24T18:45:00Z",
    notes: "Please double knot the lace melt band. Expedited packing requested.",
  },
  {
    id: "ord-1048",
    orderNumber: "JB-1048",
    customerName: "Chloe Dupont",
    customerEmail: "chloe.dupont@parisstyle.fr",
    customerPhone: "+33 6 12 34 56 78",
    shippingAddress: {
      street: "15 Rue de la Paix",
      city: "Paris",
      state: "Île-de-France",
      zipCode: "75002",
      country: "France",
    },
    items: [
      {
        productId: "prod-indian-body-wave",
        name: "Virgin Indian Body Wave 3-Bundle Deal",
        length: '20", 22", 24"',
        sku: "BDL-BW-202224",
        price: 380,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=300&auto=format&fit=crop",
      },
    ],
    subtotal: 380,
    shippingCost: 35,
    tax: 0,
    total: 415,
    currency: "USD",
    paymentStatus: "PAID",
    fulfillmentStatus: "PROCESSING",
    carrier: "DHL Express",
    trackingNumber: "DHL-9842183921",
    createdAt: "2026-09-23T14:15:00Z",
  },
  {
    id: "ord-1047",
    orderNumber: "JB-1047",
    customerName: "Danielle Brooks",
    customerEmail: "danielle.b@salonlux.com",
    customerPhone: "+1 (555) 876-5432",
    shippingAddress: {
      street: "1200 Brickell Ave, Suite 400",
      city: "Miami",
      state: "FL",
      zipCode: "33131",
      country: "United States",
    },
    items: [
      {
        productId: "prod-burmese-curly-closure",
        name: "HD Melt 5x5 Swiss Lace Closure - Burmese Curly",
        length: "18 inch",
        sku: "CLS-BC-18",
        price: 195,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=300&auto=format&fit=crop",
      },
    ],
    subtotal: 390,
    shippingCost: 0,
    tax: 27.3,
    total: 417.3,
    currency: "USD",
    paymentStatus: "PAID",
    fulfillmentStatus: "SHIPPED",
    carrier: "FedEx",
    trackingNumber: "FDX-7749102830",
    createdAt: "2026-09-22T09:30:00Z",
  },
  {
    id: "ord-1046",
    orderNumber: "JB-1046",
    customerName: "Brianna Taylor",
    customerEmail: "brianna.t@glamhair.org",
    customerPhone: "+1 (555) 432-1098",
    shippingAddress: {
      street: "450 Sutter St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94108",
      country: "United States",
    },
    items: [
      {
        productId: "prod-viet-straight-wig",
        name: "Raw Vietnamese Natural Straight Lace Front Wig",
        length: "26 inch",
        sku: "VNW-26",
        price: 610,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=300&auto=format&fit=crop",
      },
    ],
    subtotal: 610,
    shippingCost: 0,
    tax: 51.85,
    total: 661.85,
    currency: "USD",
    paymentStatus: "PAID",
    fulfillmentStatus: "DELIVERED",
    carrier: "UPS",
    trackingNumber: "1Z9999999999999999",
    createdAt: "2026-09-20T11:20:00Z",
  },
];

const SEED_CUSTOMERS: CustomerItem[] = [
  {
    id: "cust-1",
    name: "Aaliyah Washington",
    email: "aaliyah.w@example.com",
    phone: "+1 (555) 234-8901",
    totalOrders: 4,
    totalSpent: 1845.5,
    tier: "VIP",
    city: "Atlanta, GA",
    country: "United States",
    lastOrderDate: "2026-09-24",
    notes: "Prefers raw Vietnamese 22\"-26\" hair. Always add silk bonnet gift.",
    createdAt: "2025-11-15T08:00:00Z",
  },
  {
    id: "cust-2",
    name: "Danielle Brooks",
    email: "danielle.b@salonlux.com",
    phone: "+1 (555) 876-5432",
    totalOrders: 6,
    totalSpent: 2630.0,
    tier: "VIP",
    city: "Miami, FL",
    country: "United States",
    lastOrderDate: "2026-09-22",
    notes: "Salon owner & master braider. Buys wholesale bundles & HD closures.",
    createdAt: "2025-08-10T11:00:00Z",
  },
  {
    id: "cust-3",
    name: "Chloe Dupont",
    email: "chloe.dupont@parisstyle.fr",
    phone: "+33 6 12 34 56 78",
    totalOrders: 2,
    totalSpent: 795.0,
    tier: "GOLD",
    city: "Paris",
    country: "France",
    lastOrderDate: "2026-09-23",
    notes: "European international client. Prefers DHL express shipping.",
    createdAt: "2026-03-01T15:00:00Z",
  },
  {
    id: "cust-4",
    name: "Brianna Taylor",
    email: "brianna.t@glamhair.org",
    phone: "+1 (555) 432-1098",
    totalOrders: 1,
    totalSpent: 661.85,
    tier: "STANDARD",
    city: "San Francisco, CA",
    country: "United States",
    lastOrderDate: "2026-09-20",
    createdAt: "2026-09-18T10:00:00Z",
  },
];

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "JulesBraids & Hairs",
  contactEmail: "contact@julesbraids.com",
  supportPhone: "+1 (800) 585-3742",
  currency: "USD",
  timezone: "America/New_York",
  announcementText: "Experience 100% Virgin Vietnamese, Mexican, Cambodian & Chinese Hair • Free Worldwide Shipping on Orders $300+",
  showAnnouncement: true,
  lowStockThreshold: 5,
  autoHideOutOfStock: false,
  standardShippingFee: 15,
  expressShippingFee: 35,
  freeShippingThreshold: 300,
  hygienePolicy: "For hygiene and sanitary standards, all hair bundles, lace closures, and wigs must be in their original unopened security ties and unworn condition to qualify for exchanges within 14 days.",
};

// ================= FILE HELPERS =================

function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    const fullPath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, JSON.stringify(fallback, null, 2), "utf-8");
      return fallback;
    }
    const data = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return fallback;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  try {
    const fullPath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
  }
}

// ================= CATEGORIES API =================

export async function getCategories(): Promise<CategoryItem[]> {
  return readJsonFile<CategoryItem[]>("categories.json", SEED_CATEGORIES);
}

export async function createCategory(cat: Omit<CategoryItem, "id" | "createdAt">): Promise<CategoryItem> {
  const categories = await getCategories();
  const id = `cat-${Date.now()}`;
  const newCat: CategoryItem = {
    ...cat,
    id,
    createdAt: new Date().toISOString(),
  };
  categories.push(newCat);
  writeJsonFile("categories.json", categories);
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<CategoryItem>): Promise<CategoryItem | null> {
  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...updates };
  writeJsonFile("categories.json", categories);
  return categories[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  writeJsonFile("categories.json", filtered);
  return true;
}

// ================= COLLECTIONS API =================

export async function getCollections(): Promise<CollectionItem[]> {
  return readJsonFile<CollectionItem[]>("collections.json", SEED_COLLECTIONS);
}

export async function createCollection(col: Omit<CollectionItem, "id" | "createdAt">): Promise<CollectionItem> {
  const collections = await getCollections();
  const id = `col-${Date.now()}`;
  const newCol: CollectionItem = {
    ...col,
    id,
    createdAt: new Date().toISOString(),
  };
  collections.push(newCol);
  writeJsonFile("collections.json", collections);
  return newCol;
}

export async function updateCollection(id: string, updates: Partial<CollectionItem>): Promise<CollectionItem | null> {
  const collections = await getCollections();
  const index = collections.findIndex((c) => c.id === id);
  if (index === -1) return null;
  collections[index] = { ...collections[index], ...updates };
  writeJsonFile("collections.json", collections);
  return collections[index];
}

export async function deleteCollection(id: string): Promise<boolean> {
  const collections = await getCollections();
  const filtered = collections.filter((c) => c.id !== id);
  if (filtered.length === collections.length) return false;
  writeJsonFile("collections.json", filtered);
  return true;
}

// ================= ORDERS API =================

export async function getOrders(): Promise<OrderItem[]> {
  return readJsonFile<OrderItem[]>("orders.json", SEED_ORDERS);
}

export async function getOrderById(id: string): Promise<OrderItem | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id) || null;
}

export async function updateOrder(id: string, updates: Partial<OrderItem>): Promise<OrderItem | null> {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...updates };
  writeJsonFile("orders.json", orders);
  return orders[index];
}

export async function createOrder(data: Omit<OrderItem, "id" | "orderNumber" | "createdAt">): Promise<OrderItem> {
  const orders = await getOrders();
  const orderNum = `JB-${Math.floor(1050 + Math.random() * 9000)}`;
  const id = `ord-${Date.now()}`;
  const newOrder: OrderItem = {
    ...data,
    id,
    orderNumber: orderNum,
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  writeJsonFile("orders.json", orders);
  return newOrder;
}

// ================= CUSTOMERS API =================

export async function getCustomers(): Promise<CustomerItem[]> {
  return readJsonFile<CustomerItem[]>("customers.json", SEED_CUSTOMERS);
}

export async function createCustomer(data: Omit<CustomerItem, "id" | "createdAt">): Promise<CustomerItem> {
  const customers = await getCustomers();
  const id = `cust-${Date.now()}`;
  const newCustomer: CustomerItem = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };
  customers.unshift(newCustomer);
  writeJsonFile("customers.json", customers);
  return newCustomer;
}

export async function updateCustomer(id: string, updates: Partial<CustomerItem>): Promise<CustomerItem | null> {
  const customers = await getCustomers();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return null;
  customers[index] = { ...customers[index], ...updates };
  writeJsonFile("customers.json", customers);
  return customers[index];
}

// ================= SETTINGS API =================

export async function getStoreSettings(): Promise<StoreSettings> {
  return readJsonFile<StoreSettings>("settings.json", DEFAULT_SETTINGS);
}

export async function updateStoreSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated = { ...current, ...updates };
  writeJsonFile("settings.json", updated);
  return updated;
}

// ================= INVENTORY API =================

export async function updateVariantStock(
  productId: string,
  variantIndexOrId: number | string,
  newStock: number
): Promise<ProductItem | null> {
  const products = await getAllProducts();
  const product = products.find((p) => p.id === productId);
  if (!product || !product.variants) return null;

  const updatedVariants = product.variants.map((v, idx) => {
    if (v.id === variantIndexOrId || idx === variantIndexOrId) {
      return { ...v, stock: Math.max(0, newStock) };
    }
    return v;
  });

  return updateProduct(productId, { variants: updatedVariants });
}
