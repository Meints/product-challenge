import { useState } from 'react';
import type { Product } from '../types/product';
import { useProducts } from '../hooks/useProducts';
import { useProductForm } from '../hooks/useProductForm';
import { deleteProduct } from '../services/products';
import { ProductTable } from '../components/ProductTable';
import { ProductFilters } from '../components/ProductFilters';
import { ProductForm } from '../components/ProductForm';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function ProductsPage() {
  const { products, meta, loading, error, updateFilters, goToPage, refetch } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useProductForm({
    product: editingProduct,
    onSuccess: () => {
      setModalOpen(false);
      setEditingProduct(null);
      refetch();
    },
  });

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setDeleting(true);
    try {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
      refetch();
    } catch {
      /* error handled by UI toast if needed */
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 cursor-pointer"
        >
          + Novo Produto
        </button>
      </div>

      <div className="mb-6">
        <ProductFilters onApply={updateFilters} />
      </div>

      {loading && <p className="text-gray-500 text-center py-8">Carregando produtos...</p>}
      {error && <p className="text-red-500 text-center py-8">{error}</p>}
      {!loading && !error && (
        <>
          <ProductTable products={products} onEdit={openEdit} onDelete={setDeletingProduct} />
          {meta && <Pagination meta={meta} onPageChange={goToPage} />}
        </>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editingProduct ? 'Editar Produto' : 'Novo Produto'}>
        <ProductForm
          formData={form.formData}
          onChange={form.handleChange}
          onSubmit={form.handleSubmit}
          onCancel={closeModal}
          submitting={form.submitting}
        />
      </Modal>

      <ConfirmDialog
        open={!!deletingProduct}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir "${deletingProduct?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
        loading={deleting}
      />
    </div>
  );
}
