# Naike Mobile 👟

App mobile da loja **Naike** — loja de artigos, roupas, tênis e acessórios. Desenvolvido como Checkpoint 4 da disciplina de Mobile na FIAP — ADS 3º semestre (2026).

Construído em cima do template [mockmerce-app](https://github.com/FIAP-TDSPG/mockmerce-app) do professor, integrado à plataforma [Mockmerce](https://docs.mockmerce.com.br).

---

## Identificação

| Nome | RM |
|---|---|
| Felipe Kirschner Modesto | 561810 |
| Vitor Dias dos Santos | 565422 |
| João Victor Luiz de Oliveira Resende | 565139 |
| Pedro Henrique Vaz Ferreira | 566551 |

---

## Mapa de autoria

| Integrante | Responsabilidade | Arquivos principais |
|---|---|---|
| Felipe (RM561810) | Fundação do projeto, camada de API, missões do painel (produto variável, estoque) | `src/services/api.ts`, `src/hooks/useProdutos.ts`, `src/hooks/useProduto.ts`, `src/hooks/useProdutoVariavel.ts`, `src/hooks/useEstoque.ts`, `src/screens/Home.tsx`, `src/screens/ProdutoVariavel.tsx`, `src/screens/Estoque.tsx`, `src/screens/Detalhe.tsx` |
| Vitor (RM565422) | Autenticação do comprador, carrinho, checkout, pagamento e NF-e | `src/contexts/AuthContext.tsx`, `src/services/authToken.ts`, `src/hooks/useCheckout.ts`, `src/hooks/usePagamento.ts`, `src/hooks/useNFe.ts`, `src/screens/Login.tsx`, `src/screens/Cadastro.tsx`, `src/screens/Checkout.tsx` |
| Pedro (RM566551) | Missões de webhook, frete, cadastro de cliente e integração de navegação | `src/hooks/useConfigurarWebhook.ts`, `src/hooks/useCotacaoFrete.ts`, `src/hooks/useCadastroCliente.ts`, `src/screens/ConfigurarWebhook.tsx`, `src/screens/CotacaoFrete.tsx`, `src/screens/CadastroCliente.tsx`, `src/screens/Pagamento.tsx` |
| João (RM565139) | Tratamento de pagamento recusado, webhook e reembolso | `src/hooks/useProcessarPagamento.ts`, `src/hooks/useReembolso.ts` |

---

## Missões concluídas (9/12 — 100 XP)

| Missão | XP | Responsável |
|---|---|---|
| Cadastrar produto | 10 XP | Felipe (RM561810) |
| Gerenciar estoque | 10 XP | Felipe (RM561810) |
| Criar produto variável | 15 XP | Felipe (RM561810) |
| Usar o carrinho | 5 XP | Vitor (RM565422) |
| Compra ponta a ponta | 20 XP | Vitor (RM565422) |
| Emitir NF-e | 10 XP | Vitor (RM565422) |
| Cadastrar cliente final | 10 XP | Pedro (RM566551) |
| Configurar webhook | 10 XP | Pedro (RM566551) |
| Cotar frete | 10 XP | Pedro (RM566551) |

---

## Stack

- React Native + TypeScript
- Expo SDK 54
- React Navigation (Native Stack)
- TanStack Query (React Query)
- Axios
- Expo Secure Store

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
   ```
   API_URL=https://api.mockmerce.com.br/v1
   API_KEY=api_gerada_aqui
   RM=rm_do_integrante_aqui
   ```
   > ⚠️ A API key acima será revogada após a correção da atividade. Cada integrante deve preencher o próprio RM para que o painel registre a atividade individual.

4. Inicie o projeto:
   ```bash
   npx expo start
   ```

---

## Como testar as missões

### Cadastrar produto simples
> Feito diretamente via API durante o desenvolvimento. O produto "Tênis Air Max" (SKU: TENIS-001) está cadastrado e publicado na loja.

### Criar produto variável
1. Na Home, toque em **+ Produto variável**
2. Preencha nome e descrição
3. Adicione ao menos uma variante com SKU único, preço, estoque, cor e tamanho
4. Toque em **Criar produto**
5. Alert de sucesso confirma a criação

### Gerenciar estoque
1. Crie um produto variável ou use um já existente
2. Pegue o `variantId` via `GET /v1/products/:id` → campo `variants[].id`
3. Na Home, toque em **📦 Gerenciar estoque**
4. Cole o `variantId`, informe a quantidade e um motivo opcional
5. Toque em **Registrar entrada** — o card exibe o estoque atualizado

### Login e cadastro de cliente
1. Na Home, toque em **👤 Cadastrar cliente**
2. Preencha nome, e-mail e senha
3. Para login, acesse a tela de Login e entre com as credenciais

### Configurar webhook
1. Na Home, toque em **🔗 Configurar webhook**
2. Informe a URL do endpoint e selecione os eventos desejados
3. Toque em **Configurar**

### Cotar frete
1. Na Home, toque em **📦 Cotar frete**
2. Informe o CEP de destino e o peso do pacote
3. Toque em **Cotar** para ver as opções disponíveis

### Compra ponta a ponta
1. Abra um produto e adicione ao carrinho
2. Na Home, toque em **💳 Pagamento**
3. Feche o pedido com **Checkout**
4. Escolha o método de pagamento (PIX, Cartão ou Boleto)
5. Confirme o pagamento — o pedido muda para PAID
6. A NF-e é emitida automaticamente após o pagamento

---

## Estrutura do projeto

```
src/
├── contexts/   # AuthContext — sessão do comprador
├── hooks/      # React Query (useProdutos, useProduto, useProdutoVariavel, useEstoque, useCheckout...)
├── screens/    # Telas (Home, Detalhe, Login, Cadastro, Checkout, ProdutoVariavel, Estoque...)
├── services/   # Instância do Axios e módulo de token
└── types/      # Interfaces TypeScript
```

---

## Decisões técnicas

### 1. Instância única de Axios com interceptors (`src/services/api.ts`)
Toda comunicação com a API passa por uma única instância do Axios configurada com `baseURL`, `timeout` de 10 segundos e os headers fixos `X-API-Key` e `X-Student-RM`. Um interceptor de request injeta o `Authorization: Bearer` automaticamente quando há sessão ativa. Um interceptor de response normaliza qualquer erro em um formato único, eliminando tratamento duplicado nas telas.

### 2. Token do comprador em memória + SecureStore (`src/services/authToken.ts`, `src/contexts/AuthContext.tsx`)
O token de sessão é persistido no `expo-secure-store` e carregado na abertura do app. Durante a sessão, uma cópia em memória é consultada pelo interceptor do Axios — evitando chamadas assíncronas ao SecureStore a cada requisição. No logout, ambos são limpos.

### 3. Nenhum `useEffect` de busca de dados
Todas as buscas usam TanStack Query (`useQuery` e `useMutation`). Isso garante cache automático, estados de loading/error/success padronizados e deduplicação de requisições.

### 4. Separação em camadas por responsabilidade
O projeto segue: `services/` (Axios e token), `contexts/` (sessão), `hooks/` (lógica de dados), `screens/` (somente interface), `types/` (contratos TypeScript). Nenhuma tela importa Axios diretamente.

### 5. Configuração via `app.config.js` com dotenv
Migração do `app.json` estático para `app.config.js` dinâmico, que lê o `.env` via dotenv e expõe as variáveis via `expo-constants`. Permite que cada integrante configure seu próprio RM sem alterar código.

---

## Decisões de produto

A **Naike** é uma loja de tênis e sneakers voltada para entusiastas de cultura urbana e streetwear. O catálogo inclui modelos icônicos como Air Max, Dunk Low e Jordan 1 Retro.

As telas foram construídas priorizando dois fluxos: o de operação da loja (produto variável, estoque, webhook, frete) e o de compra do cliente final (login, carrinho, checkout, pagamento, NF-e) — ambos acessíveis pela mesma Home.

---

## Uso de IA

O grupo utilizou ferramentas de IA como apoio ao desenvolvimento, dado o prazo reduzido decorrente da formação tardia do grupo — situação que impactou todos os projetos do semestre simultaneamente.

**O que foi desenvolvido com auxílio de IA:**
- Estrutura inicial da camada de API (`api.ts`, hooks de listagem e detalhe)
- Telas de `ProdutoVariavel.tsx` e `Estoque.tsx`
- Estrutura do `AuthContext.tsx` e do módulo `authToken.ts`
- Auxílio no debug de erros de integração com a API
- Este README

**O que foi corrigido e ajustado após geração:**
- O formato do payload de criação de produto variável foi corrigido múltiplas vezes após testes reais contra a API — o campo `attributes` foi substituído por `options` como objeto após rejeição da API
- A rota de estoque foi descoberta na documentação após tentativas com rotas incorretas
- Os campos de resposta do estoque (`onHand`, `available`) foram corrigidos após verificar o retorno real da API

---

## Diário de erro

### Felipe (RM561810)

**Bug: Criação de produto variável retornando 400 — "Produto SIMPLE exige sku e price"**

1. **O que apareceu:** Ao tentar criar um produto variável pelo app, a API retornou `400 Bad Request` com a mensagem "Produto SIMPLE exige sku e price".
2. **Como investigou:** Abriu o DevTools, aba Network, e inspecionou o payload enviado. Percebeu que o campo `type` não estava no objeto.
3. **Causa:** O hook `useProdutoVariavel` enviava o payload sem o campo `type`, e a API assumia `SIMPLE` por padrão.
4. **O que mudou:** Adicionado `type: 'VARIABLE'` no payload e `type: string` na interface `CriarProdutoVariavelInput`.

---

### Vitor (RM565422)

**Bug: Token do comprador não persistia ao fechar e reabrir o app**

1. **O que apareceu:** Após login bem-sucedido, fechar e reabrir o app devolvia o usuário para a tela de login.
2. **Como investigou:** Verificou que o token estava salvo apenas em estado React (volátil), destruído quando o app fecha.
3. **Causa:** O token estava em `useState` em vez de `expo-secure-store`.
4. **O que mudou:** Criado o `AuthContext.tsx` com persistência via `SecureStore.setItemAsync` e recuperação na abertura com `SecureStore.getItemAsync`.

---

### Pedro (RM566551)

**Bug: App travando na inicialização após adicionar novas telas**

1. **O que apareceu:** Após criar as telas de webhook, frete e cadastro de cliente, o app travava na abertura com erro de navegação.
2. **Como investigou:** Leu o stack trace no terminal do Expo — apontava para o navigator tentando renderizar uma tela não registrada.
3. **Causa:** As telas foram criadas mas não registradas no stack navigator do `App.tsx`.
4. **O que mudou:** Adicionadas todas as novas rotas no navigator.

---

### João (RM565139)

**Bug: Pagamento recusado causava crash em vez de exibir mensagem de erro**

1. **O que apareceu:** Ao simular pagamento recusado com `simulate: "decline"`, o app quebrava com erro não tratado.
2. **Como investigou:** Testou o fluxo e leu o erro no console do Expo.
3. **Causa:** O `onError` do hook de pagamento não tratava o caso de recusa — o erro era propagado sem captura.
4. **O que mudou:** Adicionado tratamento específico para pagamento recusado, exibindo mensagem explicativa e mantendo o pedido em PENDING.

---

## Limitações conhecidas

- A estilização visual está no padrão funcional — não foi possível finalizar o redesign completo dentro do prazo
- As missões "Tratar pagamento recusado", "Receber webhook" e "Reembolsar pedido" foram implementadas no código mas não registradas no painel até o momento da entrega
