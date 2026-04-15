export interface CreateProductDto {
  categoryId: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  brand: string;
  model: string;
  weight: number;
  color: string;
}

export interface Product extends CreateProductDto {
  id: number;
  sellerId?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookFormValues {
  categoryId: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  synopsis: string;
  price: string;
  stock: string;
  pages: string;
  coverUrl: string;
}
