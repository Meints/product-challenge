## 4.1 API Resources no Laravel

O objetivo dos API Resources no Laravel é padronizar as respostas da API e controlar os dados que serão retornados. Eles funcionam de forma parecida com um DTO, transformando os dados do model antes de enviar para o cliente.

Eles são úteis para:

- manter um padrão nas respostas
- evitar retornar dados desnecessários
- organizar melhor o código
- separar a lógica de resposta do controller

No projeto, utilizei o `ProductResource` para retornar os dados dos produtos de forma padronizada em todos os endpoints.
