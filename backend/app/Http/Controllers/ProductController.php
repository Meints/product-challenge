<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cacheKey = 'products:'.$request->fullUrl();

        $products = Cache::remember($cacheKey, 60, function () use ($request) {
            $query = Product::query();

            if ($request->filled('name')) {
                $query->where('name', 'like', '%'.$request->name.'%');
            }

            if ($request->filled('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }

            if ($request->filled('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            if ($request->filled('stock')) {
                $query->where('stock', $request->stock);
            }

            return $query->paginate(10);
        });

        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());

        Cache::flush();

        return ApiResponse::success(
            new ProductResource($product),
            'Product created successfully',
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return ApiResponse::success(
            new ProductResource($product)
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        Cache::flush();

        return ApiResponse::success(
            new ProductResource($product),
            'Product updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        Cache::flush();

        return ApiResponse::success(
            null,
            'Product deleted successfully'
        );
    }
}
