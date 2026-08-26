# Naike Mobile 👟

App mobile da loja **Naike**, desenvolvido como atividade progressiva da disciplina de Mobile na FIAP — ADS 3º semestre (2026).

Construído em cima do template [mockmerce-app](https://github.com/FIAP-TDSPG/mockmerce-app) do professor, integrado à plataforma [Mockmerce](https://docs.mockmerce.com.br).

---

## Missões concluídas (3/12)

| Missão | XP | Responsável |
|---|---|---|
| Cadastrar produto | 10 XP | RM561810 |
| Criar produto variável | 15 XP | RM561810 |
| Gerenciar estoque | 10 XP | RM561810 |

---

## Stack

- React Native + TypeScript
- Expo
- React Navigation (Native Stack)
- TanStack Query (React Query)
- Axios

---

## Como rodar

1. Clone o repositório:
```bash
   git clone https://github.com/FeKiModesto/Naike-Mobile.git
   cd Naike-Mobile
```

2. Instale as dependências:
```bash
   npm install
```

3. Crie o arquivo `.env` na raiz com base no `.env.example`:
```bash
API_URL=https://api.mockmerce.com.br/v1
API_KEY=sua_chave_aqui
RM=seu_rm_aqui
```

4. Inicie o projeto:
```bash
   npx expo start
```

---

## Como testar as missões

### Cadastrar produto
1. Na Home, toque em **+ Produto variável** → troca pra tela simples não existe ainda, use o painel web em [alun.mockmerce.com.br](https://alun.mockmerce.com.br)

> A missão de cadastrar produto simples foi feita diretamente via API durante o desenvolvimento.

### Criar produto variável
1. Na Home, toque em **+ Produto variável**
2. Preencha nome e descrição
3. Preencha ao menos uma variante com SKU único (ex: `DUNK-001`), preço, estoque, cor e tamanho
4. Toque em **Criar produto**
5. Alert de sucesso confirma a criação

### Gerenciar estoque
1. Crie um produto variável (passo acima)
2. Pegue o `variantId` da variante pelo endpoint:
```
GET https://api.mockmerce.com.br/v1/products/:id
```
3. Na Home, toque em **📦 Gerenciar estoque**
4. Cole o `variantId`, informe a quantidade e um motivo opcional
5. Toque em **Registrar entrada**
6. O card exibe o estoque atualizado

---

## Estrutura do projeto
```
src/
├── hooks/ # React Query (useProdutos, useProdutoVariavel, useEstoque...)
├── screens/ # Telas (Home, Detalhe, ProdutoVariavel, Estoque)
├── services/ # Instância do Axios
└── types/ # Interfaces TypeScript
```

## Grupo

| Nome | RM |
|---|---|
| Felipe Kirschner Modesto | 561810 |
| Vitor Dias dos Santos | 565422 |
| João Victor Luiz de Oliveira Resende | 565139 |
| Pedro Henrique Vaz Ferreira | 566551 |
