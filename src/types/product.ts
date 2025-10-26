export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: ProductImage[];
  features: ProductFeature[];
  specifications: ProductSpec[];
  inStock: boolean;
  badge?: string;
  safetyFeatures: string[];
  certifications: string[];
}

