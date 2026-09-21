import fs from "fs";
import path from "path";
import { type ProductFormValues } from "./validation/product";

export interface ProductItem extends ProductFormValues {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

const SEED_PRODUCTS: ProductItem[] = [
  {
    id: "prod-viet-straight-wig",
    name: "Raw Vietnamese Natural Straight Lace Front Wig",
    slug: "raw-vietnamese-natural-straight-lace-front-wig",
    shortDescription: "Ultra-silky raw Vietnamese single-donor lace front wig with invisible HD swiss lace.",
    fullDescription: "Experience the pinnacle of luxury with our Raw Vietnamese Natural Straight Lace Front Wig. Sourced ethically from single donors in Vietnam, each strand retains aligned cuticles for supreme longevity and lustrous sheen. Features pre-plucked hairline and thin undetectable HD Swiss lace that melts into all complexions.",
    productType: "WIG",
    status: "PUBLISHED",
    basePrice: 450,
    compareAtPrice: 520,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200&auto=format&fit=crop"
    ],
    hairOrigin: "Vietnamese Raw",
    hairTexture: "Natural Straight",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    metaTitle: "Raw Vietnamese Natural Straight Lace Front Wig | Julesbraids",
    metaDescription: "Shop luxury raw Vietnamese natural straight lace front wig with invisible HD Swiss lace.",
    variants: [
      { id: "v-18", sku: "VNW-18", length: "18 inch", price: 450, compareAtPrice: 520, stock: 12, isActive: true },
      { id: "v-20", sku: "VNW-20", length: "20 inch", price: 490, compareAtPrice: 560, stock: 8, isActive: true },
      { id: "v-22", sku: "VNW-22", length: "22 inch", price: 540, compareAtPrice: 600, stock: 5, isActive: true },
      { id: "v-26", sku: "VNW-26", length: "26 inch", price: 610, compareAtPrice: 680, stock: 3, isActive: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-indian-body-wave",
    name: "Virgin Indian Body Wave 3-Bundle Deal",
    slug: "virgin-indian-body-wave-3-bundle-deal",
    shortDescription: "Signature 100% temple virgin Indian hair with bouncy, natural S-pattern waves.",
    fullDescription: "Our temple-sourced Virgin Indian Body Wave bundles offer unmatched bounce, volume, and longevity. Naturally lustrous and heat-friendly, you can bleach, curl, or straighten without sacrificing softness. Includes three generous bundles for a full, voluminous crown.",
    productType: "BUNDLE",
    status: "PUBLISHED",
    basePrice: 320,
    compareAtPrice: 380,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1200&auto=format&fit=crop"
    ],
    hairOrigin: "Virgin Indian",
    hairTexture: "Body Wave",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    variants: [
      { id: "v-b1", sku: "BDL-BW-161820", length: '16", 18", 20"', price: 320, compareAtPrice: 380, stock: 15, isActive: true },
      { id: "v-b2", sku: "BDL-BW-202224", length: '20", 22", 24"', price: 380, compareAtPrice: 440, stock: 10, isActive: true },
      { id: "v-b3", sku: "BDL-BW-242628", length: '24", 26", 28"', price: 440, compareAtPrice: 510, stock: 6, isActive: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-burmese-curly-closure",
    name: "HD Melt 5x5 Swiss Lace Closure - Burmese Curly",
    slug: "hd-melt-5x5-swiss-lace-closure-burmese-curly",
    shortDescription: "Ultra-thin 5x5 HD Swiss lace closure with defined, juicy Burmese curls.",
    fullDescription: "Protect your hairline with our flawless 5x5 HD Melt Lace Closure in Burmese Curly. Hand-tied single knots that bleach effortlessly and lay completely flat against your forehead. Perfect for blending seamlessly with our curly bundles.",
    productType: "CLOSURE",
    status: "PUBLISHED",
    basePrice: 165,
    compareAtPrice: 190,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1200&auto=format&fit=crop"
    ],
    hairOrigin: "Burmese Raw",
    hairTexture: "Curly",
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    variants: [
      { id: "v-c14", sku: "CLS-BC-14", length: "14 inch", price: 165, stock: 20, isActive: true },
      { id: "v-c18", sku: "CLS-BC-18", length: "18 inch", price: 195, stock: 14, isActive: true },
      { id: "v-c22", sku: "CLS-BC-22", length: "22 inch", price: 225, stock: 8, isActive: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-cambodian-frontal-deep",
    name: "13x6 Ear-to-Ear HD Frontal - Deep Wave",
    slug: "13x6-ear-to-ear-hd-frontal-deep-wave",
    shortDescription: "Deep parting space ear-to-ear frontal with rich, defined deep waves.",
    fullDescription: "Achieve deep center, side, or half-up partings with our generous 13x6 HD ear-to-ear frontal. Sourced from Cambodia for exceptional density and thick ends. Pre-plucked with delicate baby hairs for instant styling.",
    productType: "FRONTAL",
    status: "PUBLISHED",
    basePrice: 210,
    compareAtPrice: 245,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop"
    ],
    hairOrigin: "Cambodian Virgin",
    hairTexture: "Deep Wave",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    variants: [
      { id: "v-f16", sku: "FRT-DW-16", length: "16 inch", price: 210, stock: 11, isActive: true },
      { id: "v-f20", sku: "FRT-DW-20", length: "20 inch", price: 250, stock: 7, isActive: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-silk-bonnet-set",
    name: "Luxury Silk Satin Bonnet & Edge Wrap Set",
    slug: "luxury-silk-satin-bonnet-edge-wrap-set",
    shortDescription: "Premium double-lined mulberry-feel satin bonnet with matching compression edge band.",
    fullDescription: "Preserve your lace melts, curls, and hair hydration every night. Made of double-lined ultra-smooth silk satin that eliminates nighttime friction, frizz, and moisture loss.",
    productType: "ACCESSORY",
    status: "PUBLISHED",
    basePrice: 35,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop"
    ],
    hairOrigin: "N/A",
    hairTexture: "Smooth Satin",
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    variants: [
      { id: "v-acc1", sku: "ACC-BNT-GLD", length: "Champagne Gold", price: 35, stock: 45, isActive: true },
      { id: "v-acc2", sku: "ACC-BNT-BLK", length: "Obsidian Black", price: 35, stock: 50, isActive: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

function ensureDataFile(): ProductItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(SEED_PRODUCTS, null, 2), "utf-8");
      return SEED_PRODUCTS;
    }
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(SEED_PRODUCTS, null, 2), "utf-8");
      return SEED_PRODUCTS;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading products store:", err);
    return SEED_PRODUCTS;
  }
}

function writeDataFile(products: ProductItem[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing products store:", err);
  }
}

export async function getAllProducts(filter?: {
  status?: string;
  type?: string;
  search?: string;
}): Promise<ProductItem[]> {
  let products = ensureDataFile();

  if (filter?.status && filter.status !== "ALL") {
    products = products.filter((p) => p.status === filter.status);
  }

  if (filter?.type && filter.type !== "ALL") {
    products = products.filter((p) => p.productType === filter.type);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        p.variants?.some((v) => v.sku.toLowerCase().includes(q))
    );
  }

  return products;
}

export async function getProductById(id: string): Promise<ProductItem | null> {
  const products = ensureDataFile();
  return products.find((p) => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  const products = ensureDataFile();
  return products.find((p) => p.slug === slug) || null;
}

export async function createProduct(data: ProductFormValues): Promise<ProductItem> {
  const products = ensureDataFile();
  
  // Ensure unique slug
  let slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!slug) {
    slug = data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  let finalSlug = slug;
  let counter = 1;
  while (products.some((p) => p.slug === finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  // Normalize variants with IDs if missing
  const normalizedVariants = (data.variants || []).map((v, i) => ({
    ...v,
    id: v.id || `var-${i + 1}-${Date.now()}`,
    sku: v.sku || `SKU-${finalSlug.slice(0, 4).toUpperCase()}-${i + 1}`,
  }));

  const newProduct: ProductItem = {
    ...data,
    id,
    slug: finalSlug,
    variants: normalizedVariants,
    createdAt: now,
    updatedAt: now,
  };

  products.unshift(newProduct);
  writeDataFile(products);

  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<ProductFormValues>
): Promise<ProductItem | null> {
  const products = ensureDataFile();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = products[index];
  const now = new Date().toISOString();

  const updated: ProductItem = {
    ...existing,
    ...data,
    id: existing.id,
    updatedAt: now,
  };

  products[index] = updated;
  writeDataFile(products);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = ensureDataFile();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;

  writeDataFile(filtered);
  return true;
}
