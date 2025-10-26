import { Product } from '@/types/product';
import { getProduct, getAllProducts } from '@/server/queries/product/getProduct';

export const getProducts = async (): Promise<Product[]> => {
  return getAllProducts();
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  return getProduct(slug);
};

export const getFeaturedProduct = async (): Promise<Product | null> => {
  return getProduct('safeheat-propane-heater');
};

