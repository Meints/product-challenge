import type { Product } from '../types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return <p className="text-gray-500 text-center py-8">Nenhum produto encontrado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">Nome</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Descrição</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">Preço</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">Estoque</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{product.name}</td>
              <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{product.description}</td>
              <td className="py-3 px-4 text-right font-mono">${Number(product.price).toFixed(2)}</td>
              <td className="py-3 px-4 text-right">{product.stock}</td>
              <td className="py-3 px-4 text-right space-x-3">
                <button
                  onClick={() => onEdit(product)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
