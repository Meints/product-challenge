import { useState, useRef } from 'react';
import type { Product, ProductFormData } from '../types/product';
import { createProduct, updateProduct } from '../services/products';

interface UseProductFormOptions {
  product?: Product | null;
  onSuccess: () => void;
  onError?: (msg: string) => void;
}

export function useProductForm({ product, onSuccess, onError }: UseProductFormOptions) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({ name: '', description: '', price: 0, stock: 0 });
  const prevId = useRef<number | undefined>(product?.id);

  if (product?.id !== prevId.current) {
    prevId.current = product?.id;
    setFormData({
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
    });
  }

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Algo deu errado.';
      onError?.(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return { formData, handleChange, handleSubmit, submitting };
}
