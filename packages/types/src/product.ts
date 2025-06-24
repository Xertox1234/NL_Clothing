/**
 * Product related type definitions
 */

/**
 * Represents a product category
 */
export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
};

/**
 * Represents a product variant (size, color, etc.)
 */
export type ProductVariant = {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  inventoryCount: number;
  price: number;
  salePrice?: number;
  imageUrls?: string[];
};

/**
 * Represents a complete product
 */
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  categoryIds: string[];
  tags?: string[];
  imageUrls: string[];
  rating?: number;
  reviewCount?: number;
  features?: string[];
  isInStock: boolean;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
};
