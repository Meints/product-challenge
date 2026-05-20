import { useState } from "react";
import type { ProductFilters as Filters } from "../types/product";

interface ProductFiltersProps {
  onApply: (filters: Filters) => void;
}

export function ProductFilters({ onApply }: ProductFiltersProps) {
  const [name, setName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [stock, setStock] = useState("");

  const handleApply = () => {
    onApply({
      name: name || undefined,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      stock: stock ? Number(stock) : undefined,
    });
  };

  const handleClear = () => {
    setName("");
    setMinPrice("");
    setMaxPrice("");
    setStock("");
    onApply({});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleApply();
  };

  return (
    <div className="flex flex-wrap gap-3 items-end" onKeyDown={handleKeyDown}>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Buscar por nome..."
          className="border border-gray-300 rounded px-3 py-2 text-sm w-48 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Preço Mín.</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="0.00"
          className="border border-gray-300 rounded px-3 py-2 text-sm w-28 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Preço Máx.</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="0.00"
          className="border border-gray-300 rounded px-3 py-2 text-sm w-28 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Estoque</label>
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Estoque"
          className="border border-gray-300 rounded px-3 py-2 text-sm w-28 focus:outline-none focus:border-blue-500"
        />
      </div>
      <button
        onClick={handleApply}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 cursor-pointer"
      >
        Aplicar
      </button>
      <button
        onClick={handleClear}
        className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-50 cursor-pointer"
      >
        Limpar
      </button>
    </div>
  );
}
