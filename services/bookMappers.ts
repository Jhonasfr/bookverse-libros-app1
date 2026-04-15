import { BookFormValues, CreateProductDto, Product } from '@/interfaces/product.interface';

export const emptyBookForm: BookFormValues = {
  categoryId: '1',
  title: '',
  author: '',
  isbn: '',
  genre: '',
  synopsis: '',
  price: '',
  stock: '',
  pages: '',
  coverUrl: '',
};

export const mapFormToPayload = (values: BookFormValues): CreateProductDto => ({
  categoryId: Number(values.categoryId || 1),
  name: values.title.trim(),
  brand: values.author.trim(),
  model: values.isbn.trim() || 'Sin ISBN',
  color: values.genre.trim() || 'General',
  description: values.synopsis.trim(),
  imageUrl: values.coverUrl.trim(),
  price: Number(values.price || 0),
  stock: Number(values.stock || 0),
  weight: Number(values.pages || 0),
});

export const mapProductToForm = (product: Product): BookFormValues => ({
  categoryId: String(product.categoryId ?? 1),
  title: product.name ?? '',
  author: product.brand ?? '',
  isbn: product.model ?? '',
  genre: product.color ?? '',
  synopsis: product.description ?? '',
  price: String(product.price ?? ''),
  stock: String(product.stock ?? ''),
  pages: String(product.weight ?? ''),
  coverUrl: product.imageUrl ?? '',
});
