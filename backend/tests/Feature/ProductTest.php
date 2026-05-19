<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function itCanCreateAProduct()
    {
        $response = $this->postJson('/api/products', [
            'name' => 'Mouse Gamer',
            'description' => 'RGB Mouse',
            'price' => 199.90,
            'stock' => 10,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('products', [
            'name' => 'Mouse Gamer',
            'price' => 199.90,
        ]);
    }

    /** @test */
    public function itCanListProducts()
    {
        Product::factory()->count(3)->create();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'description',
                    'price',
                    'stock',
                ],
            ],
        ]);
    }

    /** @test */
    public function itCanFilterProductsByName()
    {
        Product::factory()->create([
            'name' => 'Mouse Gamer',
        ]);

        Product::factory()->create([
            'name' => 'Teclado',
        ]);

        $response = $this->getJson('/api/products?name=Mouse');

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'name' => 'Mouse Gamer',
        ]);

        $response->assertJsonMissing([
            'name' => 'Teclado',
        ]);
    }

    /** @test */
    public function itCanFilterProductsByPriceRange()
    {
        Product::factory()->create([
            'name' => 'Barato',
            'price' => 50,
        ]);

        Product::factory()->create([
            'name' => 'Caro',
            'price' => 500,
        ]);

        $response = $this->getJson('/api/products?min_price=40&max_price=100');

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'name' => 'Barato',
        ]);

        $response->assertJsonMissing([
            'name' => 'Caro',
        ]);
    }

    /** @test */
    public function itCanFilterProductsByStock()
    {
        Product::factory()->create([
            'name' => 'Em estoque',
            'stock' => 10,
        ]);

        Product::factory()->create([
            'name' => 'Sem estoque',
            'stock' => 0,
        ]);

        $response = $this->getJson('/api/products?stock=10');

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'name' => 'Em estoque',
        ]);

        $response->assertJsonMissing([
            'name' => 'Sem estoque',
        ]);
    }

    /** @test */
    public function itPaginatesProducts()
    {
        Product::factory()->count(15)->create();

        $response = $this->getJson('/api/products');

        $response->dump();

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data',
            'links',
            'meta',
        ]);
    }

    /** @test */
    public function itCanShowAProduct()
    {
        $product = Product::factory()->create();

        $response = $this->getJson('/api/products/'.$product->id);

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'description',
                'price',
                'stock',
            ],
        ]);
    }

    /** @test */
    public function itCanUpdateAProduct()
    {
        $product = Product::factory()->create();

        $response = $this->putJson('/api/products/'.$product->id, [
            'name' => 'Mouse Gamer',
            'description' => 'RGB Mouse',
            'price' => 199.90,
            'stock' => 10,
        ]);

        $response->assertStatus(200);

        $response->assertJson([
            'data' => [
                'id' => $product->id,
                'name' => 'Mouse Gamer',
                'price' => 199.90,
            ],
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Mouse Gamer',
        ]);

        $product->refresh();

        $this->assertEquals('Mouse Gamer', $product->name);
    }

    /** @test */
    public function itCanDeleteAProduct()
    {
        $product = Product::factory()->create();

        $response = $this->deleteJson('/api/products/'.$product->id);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }
}
