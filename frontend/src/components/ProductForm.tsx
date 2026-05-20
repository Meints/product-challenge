import type { ProductFormData } from '../types/product';

interface ProductFormProps {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string | number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitting: boolean;
}

export function ProductForm({ formData, onChange, onSubmit, onCancel, submitting }: ProductFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600" htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={e => onChange('name', e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600" htmlFor="description">Descrição</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={e => onChange('description', e.target.value)}
          rows={3}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600" htmlFor="price">Preço</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={e => onChange('price', Number(e.target.value))}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600" htmlFor="stock">Estoque</label>
          <input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={e => onChange('stock', Number(e.target.value))}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
