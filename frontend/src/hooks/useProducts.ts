import { useState, useEffect, useCallback, useRef } from 'react';
import type { Product, ProductFilters, PaginationMeta } from '../types/product';
import { getProducts } from '../services/products';

const FILTER_KEYS: (keyof ProductFilters)[] = ['name', 'min_price', 'max_price', 'stock'];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const run = async () => {
      try {
        const params: Record<string, string | number | undefined> = { page };
        for (const key of FILTER_KEYS) {
          const value = filters[key];
          if (value !== undefined && value !== '') params[key] = value;
        }
        const res = await getProducts(params);
        if (!cancelledRef.current) {
          setProducts(res.data);
          setMeta(res.meta);
        }
      } catch {
        if (!cancelledRef.current) setError('Erro ao carregar produtos.');
      } finally {
        if (!cancelledRef.current) setLoading(false);
      }
    };

    run();

    return () => { cancelledRef.current = true; };
  }, [page, filters, refreshKey]);

  const updateFilters = useCallback((next: ProductFilters) => {
    setFilters(next);
    setPage(1);
    setLoading(true);
    setError(null);
  }, []);

  const goToPage = useCallback((p: number) => {
    setPage(p);
    setLoading(true);
    setError(null);
  }, []);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshKey(k => k + 1);
  }, []);

  return { products, meta, filters, loading, error, updateFilters, goToPage, refetch };
}
