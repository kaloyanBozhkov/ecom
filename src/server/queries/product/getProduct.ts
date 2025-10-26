import { cache } from "react";
import { prisma } from "@/server/db";
import { Product } from "@/types/product";
import { GET_PRODUCT_CACHE_DURATION } from "@/utils/constants";

// React cache wrapper - automatically deduplicates requests during a render
const fetchProduct = cache(async (slug: string) => {
  console.log(`📦 Fetching product from DB: ${slug}`);
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  
  if (!product) return null;
  
  // Transform snake_case to camelCase when returning
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    tagline: product.tagline,
    description: product.description,
    price: product.price,
    originalPrice: product.original_price ?? undefined,
    currency: product.currency,
    images: product.images as Product['images'],
    features: product.features as Product['features'],
    specifications: product.specifications as Product['specifications'],
    inStock: product.in_stock,
    badge: product.badge ?? undefined,
    safetyFeatures: product.safety_features,
    certifications: product.certifications,
  } as Product;
});

const fetchAllProducts = cache(async () => {
  console.log(`📦 Fetching all products from DB`);
  const products = await prisma.product.findMany({
    where: { in_stock: true },
  });
  
  // Transform each product when returning
  return products.map((p: typeof products[number]): Product => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    description: p.description,
    price: p.price,
    originalPrice: p.original_price ?? undefined,
    currency: p.currency,
    images: p.images as Product['images'],
    features: p.features as Product['features'],
    specifications: p.specifications as Product['specifications'],
    inStock: p.in_stock,
    badge: p.badge ?? undefined,
    safetyFeatures: p.safety_features,
    certifications: p.certifications,
  }));
});

// In-memory cache for product (since we only have 1 product)
let cachedProduct: Product | null = null;
let cacheTimestamp: number | null = null;

export const getProduct = async (slug: string): Promise<Product | null> => {
  // Check in-memory cache first
  const now = Date.now();
  if (
    cachedProduct && 
    cachedProduct.slug === slug && 
    cacheTimestamp && 
    (now - cacheTimestamp) < GET_PRODUCT_CACHE_DURATION
  ) {
    console.log(`✨ Serving product from in-memory cache: ${slug}`);
    return cachedProduct;
  }

  // Fetch from DB (with React cache deduplication)
  const product = await fetchProduct(slug);
  
  // Store in memory cache
  if (product) {
    cachedProduct = product;
    cacheTimestamp = now;
  }
  
  return product;
};

export const getAllProducts = async (): Promise<Product[]> => {
  return fetchAllProducts();
};

export const clearProductCache = () => {
  cachedProduct = null;
  cacheTimestamp = null;
};

