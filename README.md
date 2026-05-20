# Products API

API REST para gerenciamento de produtos desenvolvida com Laravel como desafio técnico. Implementa operações CRUD completas, cache inteligente na listagem, filtros via query params, paginação, validação centralizada e respostas padronizadas.

> Este repositório inclui também um **frontend opcional** (React + TypeScript) para visualização dos dados.

## Tecnologias

- **Laravel 12** — framework principal
- **PHP 8.2+** — linguagem
- **SQLite** — SQLite — banco de dados utilizado para simplificar a execução do projeto
- **PHPUnit** — testes automatizados
- **Composer** — gestão de dependências
- **React 19 + TypeScript + Vite** — frontend (opcional, apenas para visualização)

## Instalação

```bash
# Clonar o repositório
git clone <repo-url>
cd product-api

# Instalar dependências
composer install

# Configurar ambiente
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Executar migrations (cria as tabelas no SQLite)
php artisan migrate

# Iniciar servidor de desenvolvimento
php artisan serve
```

A aplicação estará disponível em `http://localhost:8000`.

## Executando os testes

```bash
php artisan test
```

O suite conta com **8 testes de feature** que cobrem criação, listagem, consulta, atualização, remoção, filtros, paginação e validação. Os testes utilizam `RefreshDatabase` com SQLite in-memory, isolando completamente as execuções.

## Estrutura da API

### Listar produtos

```
GET /api/products
```

Retorna a lista paginada de produtos (10 por página). Suporta os filtros descritos abaixo.

**Resposta:**

```json
{
    "data": [
        {
            "id": 1,
            "name": "Mouse Gamer",
            "description": "RGB Mouse",
            "price": 199.90,
            "stock": 10
        }
    ],
    "links": { ... },
    "meta": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 10,
        "total": 1
    }
}
```

### Buscar produto por ID

```
GET /api/products/{id}
```

**Resposta:**

```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Mouse Gamer",
    "description": "RGB Mouse",
    "price": 199.9,
    "stock": 10
  }
}
```

### Criar produto

```
POST /api/products
```

**Body (JSON):**

```json
{
  "name": "Mouse Gamer",
  "description": "RGB Mouse",
  "price": 199.9,
  "stock": 10
}
```

**Resposta (201):**

```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Mouse Gamer",
    "description": "RGB Mouse",
    "price": 199.9,
    "stock": 10
  }
}
```

### Atualizar produto

```
PUT /api/products/{id}
```

**Body (JSON):** mesmo formato da criação, mas todos os campos são opcionais.

**Resposta (200):**

```json
{
    "status": "success",
    "message": "Product updated successfully",
    "data": { ... }
}
```

### Remover produto

```
DELETE /api/products/{id}
```

**Resposta (200):**

```json
{
  "status": "success",
  "message": "Product deleted successfully",
  "data": null
}
```

## Filtros

A listagem aceita os seguintes query params para refinar os resultados:

| Parâmetro   | Tipo   | Descrição                     |
| ----------- | ------ | ----------------------------- |
| `name`      | string | Busca parcial por nome (LIKE) |
| `min_price` | number | Preço mínimo (>=)             |
| `max_price` | number | Preço máximo (<=)             |
| `stock`     | number | Quantidade exata em estoque   |

**Exemplo:**

```
GET /api/products?name=mouse&min_price=50&max_price=200
```

## Paginação

A listagem retorna **10 itens por página**. A resposta inclui `links` (first, last, prev, next) e `meta` com informações de paginação (current_page, last_page, per_page, total). Para navegar entre páginas, use o parâmetro `?page=N`:

```
GET /api/products?page=2
```

## Cache

A listagem de produtos é cacheada por **60 minutos** utilizando o cache do Laravel (driver `database` configurado no `.env`). A chave do cache é única para cada combinação de URL, incluindo filtros e página — ou seja, chamadas diferentes não compartilham o mesmo cache.

O cache é **invalidado automaticamente** sempre que um produto é criado, atualizado ou removido, garantindo que a listagem reflita os dados mais recentes.

## Respostas padronizadas

Todas as respostas seguem um formato consistente definido pela classe `App\Helpers\ApiResponse`:

```json
{
    "status": "success" | "error",
    "message": "Mensagem descritiva",
    "data": { ... } | null,
    "errors": { ... } | null
}
```

## Testes automatizados

Os testes estão em `tests/Feature/ProductTest.php` e cobrem os seguintes cenários:

- **Criação** — verifica status 201 e presença no banco
- **Listagem** — verifica estrutura JSON com `data`, `links`, `meta`
- **Consulta** — verifica retorno correto de um produto específico
- **Atualização** — verifica alteração persistida e resposta
- **Remoção** — verifica exclusão e ausência no banco
- **Filtro por nome** — busca parcial com LIKE
- **Filtro por faixa de preço** — `min_price` e `max_price`
- **Filtro por estoque** — filtro exato por `stock`
- **Paginação** — verifica estrutura de paginação com 15 registros

Para rodar:

```bash
php artisan test
```

Ou com PHPUnit diretamente:

```bash
./vendor/bin/phpunit
```

## Frontend (opcional)

Há um frontend React + TypeScript + Vite em `frontend/` que consome a API para exibir e gerenciar produtos em uma interface visual.

### Executando o frontend

```bash
# Acessar a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (porta 5173)
npm run dev
```

A aplicação espera a API rodando em `http://localhost:8000`. O Vite já está configurado com proxy para redirecionar as chamadas `/api` para o backend.

```bash
# Para gerar os arquivos estáticos de produção
npm run build
```

> O frontend é apenas um complemento visual. Toda a lógica de negócio, validação, cache e persistência está no backend.

## Collection do Insomnia

O diretório `docs/` contém uma collection exportada do Insomnia (`docs/insomnia_collection.yaml`) com todas as requisições configuradas. Importe no Insomnia para testar a API rapidamente sem precisar montar as requisições manualmente.

## Respostas do desafio

As perguntas do desafio técnico estão respondidas em `docs/respostas.md`.
