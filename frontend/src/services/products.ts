import api from './api';
import type { Product, ProductFormData, PaginatedResponse } from '../types/product';

export async function getProducts(params?: Record<string, string | number | undefined>): Promise<PaginatedResponse<Product>> {
  const clean = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== '')
  );
  const { data } = await api.get<PaginatedResponse<Product>>('/products', { params: clean });
  return data;
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function createProduct(payload: ProductFormData): Promise<Product> {
  const { data } = await api.post<Product>('/products', payload);
  return data;
}

export async function updateProduct(id: number, payload: ProductFormData): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
