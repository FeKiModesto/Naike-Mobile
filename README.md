# Naike Mobile 👟

App mobile da loja **Naike**, desenvolvido como atividade progressiva da disciplina de Mobile na FIAP — ADS 3º semestre (2026).

Construído em cima do template [mockmerce-app](https://github.com/FIAP-TDSPG/mockmerce-app) do professor, integrado à plataforma [Mockmerce](https://docs.mockmerce.com.br).

---

## Missões implementadas

- ✅ **Cadastrar produto** — formulário simples com nome, descrição, SKU, preço e estoque
- ✅ **Criar produto variável** — produto com múltiplas variantes (cor + tamanho), adição e remoção de variantes na hora
- ✅ **Gerenciar estoque** — entrada de estoque por ID de variante, com retorno da quantidade antes e depois

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

4. Rode o projeto:
```bash
   npx expo start
```

---

## Navegação

A Home lista os produtos da loja e tem dois botões de acesso rápido:

- **+ Produto variável** → tela de cadastro com variantes
- **📦 Gerenciar estoque** → tela de entrada de estoque por variante

---

## Grupo

| Nome | RM |
|---|---|
| Felipe Kirschner Modesto | 561810 |
| Vitor Dias dos Santos | 565422 |
| João Victor Luiz de Oliveira Resende | 565139 |
| Pedro Henrique Vaz Ferreira | 566551 |
