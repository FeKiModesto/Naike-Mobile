# Naike Mobile 👟

App mobile da loja **Naike** — loja de artigos, roupas, tênis e acessórios. Desenvolvido como Checkpoint 5 da disciplina de Mobile na FIAP — ADS 3º semestre (2026).

Construído em cima do template [mockmerce-app](https://github.com/FIAP-TDSPG/mockmerce-app) do professor, integrado à plataforma [Mockmerce](https://docs.mockmerce.com.br).

---

## Identificação

| Nome | RM |
|---|---|
| Felipe Kirschner Modesto | 561810 |
| João Victor Luiz de Oliveira Resende | 565139 |
| Pedro Henrique Vaz Ferreira | 566551 |
| Vitor Dias dos Santos | 565422 |

---

## Mapa de autoria

| Integrante | Responsabilidade | Arquivos principais |
|---|---|---|
| Felipe (RM561810) | Fundação do projeto, camada de API, missões do painel (produto variável, estoque), avaliações de produto (CP5) | `src/services/api.ts`, `src/services/reviewService.ts`, `src/hooks/useProdutos.ts`, `src/hooks/useProduto.ts`, `src/hooks/useProdutoVariavel.ts`, `src/hooks/useEstoque.ts`, `src/hooks/useAvaliacoes.ts`, `src/screens/Home.tsx`, `src/screens/ProdutoVariavel.tsx`, `src/screens/Estoque.tsx`, `src/screens/Detalhe.tsx`, `src/screens/Avaliacoes.tsx` |
| Vitor (RM565422) | Autenticação do comprador, carrinho, checkout, pagamento e NF-e | `src/contexts/AuthContext.tsx`, `src/services/authToken.ts`, `src/hooks/useCheckout.ts`, `src/hooks/usePagamento.ts`, `src/hooks/useNFe.ts`, `src/screens/Login.tsx`, `src/screens/Cadastro.tsx`, `src/screens/Checkout.tsx` |
| Pedro (RM566551) | Missões de webhook, frete, cadastro de cliente e integração de navegação | `src/hooks/useConfigurarWebhook.ts`, `src/hooks/useCotacaoFrete.ts`, `src/hooks/useCadastroCliente.ts`, `src/screens/ConfigurarWebhook.tsx`, `src/screens/CotacaoFrete.tsx`, `src/screens/CadastroCliente.tsx`, `src/screens/Pagamento.tsx` |
| João (RM565139) | Tratamento de pagamento recusado, webhook e reembolso | `src/hooks/useProcessarPagamento.ts`, `src/hooks/useReembolso.ts` |

---

## Missões concluídas — CP4 (9/12 — 100 XP)

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

## Requisitos entregues — CP5

| RF | Descrição | Responsável |
|---|---|---|
| RF-35 | Média e contagem de avaliações na tela do produto | Felipe (RM561810) |
| RF-36 | Lista de avaliações com estados de carregamento, erro, vazio e conteúdo | Felipe (RM561810) |
| RF-37 | Consulta can-review antes do formulário, com texto específico por motivo | Felipe (RM561810) |
| RF-38 | Formulário de avaliação com nota e comentário, com validação | Felipe (RM561810) |
| RF-41 | Lista e média atualizadas após envio sem sair da tela | Felipe (RM561810) |
| RF-42 | Avaliações ocultadas pela loja não aparecem no app | Felipe (RM561810) |
| RF-39 | Anexar foto da galeria via POST /uploads (multipart) e usar o mediaId na avaliação | Vitor (RM565422) |
| RF-40 | Galeria negada: formulário segue funcionando e a tela explica o que se perdeu | Vitor (RM565422) |
| RF-43 | Localização com três desfechos: concedida, negada e concedida sem posição | Vitor (RM565422) |
| RF-44 | Lista de pontos de retirada ordenada por distância, com a distância na tela | Vitor (RM565422) |
| RF-45 | Sem posição: a lista continua, sem ordenar, com o motivo e caminho para tentar de novo | Vitor (RM565422) |
| RF-47 | O checkout permite escolher retirada num ponto, e o pedido criado reflete a escolha | Vitor (RM565422) |
| RF-46 | Mapa com os pontos de retirada e a loja (`MapaRetirada`, loja vinda de `GET /store/settings`) | Pedro (RM566551) |
| RF-48 | A tela de retirada trata carregando, vazio e erro | Vitor (RM565422) |
| RF-49 | Controles principais respondem ao toque com mola (`Pressionavel`, usado em botões, chips, cards e estrelas) | Pedro (RM566551) |
| RF-50 | Favoritar tem confirmação visual: o coração pulsa ao ativar (`PulsoAoAtivar`) e os avisos entram com fade | Pedro (RM566551) |
| RF-51 | Grade de produtos entra escalonada, com teto de 300 ms no atraso | Pedro (RM566551) |
| RF-52 | Itens removidos de Favoritos e Carrinho saem animados e os demais se acomodam (`layout`) | Pedro (RM566551) |
| RF-53 | Carregamento com sinal de vida: texto pulsante junto do spinner | Pedro (RM566551) |
| RF-54 | "Reduzir movimento" do sistema: troca deslocamento/escala por opacidade, sem tirar o feedback | Pedro (RM566551) |
| RF-55 | `ANIMACOES_ATIVAS` em `src/lib/animacoes.ts` desliga tudo; defesa na seção "Movimento" | Pedro (RM566551) |
| RF-62 | Durações, molas e escalas vêm de um arquivo único (`src/lib/animacoes.ts`) | Pedro (RM566551) |
| RF-56 | Permissão de notificação pedida depois de favoritar (ou no Perfil), nunca na abertura. Três desfechos: indefinida, concedida e negada | Pedro (RM566551) |
| RF-57 | Caminho B: canal do Android criado e o app consome o histórico da loja (`GET /push/messages`) | Pedro (RM566551) |
| RF-58 | Payload tratado por inteiro: título e corpo para a pessoa, `data` para o app | Pedro (RM566551) |
| RF-59 | O toque abre o produto de `data.produtoId`, inclusive com o app fechado | Pedro (RM566551) |
| RF-60 | Permissão negada: o app segue inteiro e o Perfil explica o estado e como reativar | Pedro (RM566551) |


---

## Stack

- React Native + TypeScript
- Expo SDK 54
- React Navigation (Native Stack)
- TanStack Query (React Query)
- Axios
- Expo Secure Store
- React Native Reanimated 4 + Worklets (movimento)

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

### Avaliações de produto (CP5)
1. Realize uma compra e finalize o pagamento
2. Acesse o produto comprado e toque em **Ver avaliações**
3. O app consulta automaticamente se você pode avaliar
4. Se liberado, preencha a nota (1 a 5) e o comentário e toque em **Enviar avaliação**
5. A média e a lista atualizam na mesma tela sem precisar sair

---

## Estrutura do projeto
```bash
src/
├── contexts/ # AuthContext — sessão do comprador
├── hooks/ # React Query (useProdutos, useProduto, useAvaliacoes...)
├── screens/ # Telas (Home, Detalhe, Avaliacoes, Login, Checkout...)
├── services/ # Instância do Axios, módulo de token e reviewService
└── types/ # Interfaces TypeScript
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

### 6. can-review consultado antes de exibir o formulário (CP5)
Em vez de deixar o usuário preencher tudo e descobrir no POST que não pode avaliar, o app consulta `GET /reviews/can-review` ao abrir a tela. Cada motivo de bloqueio (`NOT_PURCHASED`, `ALREADY_REVIEWED`, `REVIEW_WINDOW_EXPIRED`) exibe uma mensagem específica.

### 7. Média de avaliação sem requisição extra (CP5)
A média e a contagem de avaliações vêm do campo `rating` do próprio `GET /products/:id`, sem precisar buscar a lista completa de avaliações só para calcular. Após envio de uma nova avaliação, o cache do produto é invalidado automaticamente via `queryClient.invalidateQueries`.

---

## Notificações — caminho escolhido (CP5)

**Caminho B (notificação local).** Escolhemos o B porque roda no Expo Go, sem development build, sem credencial do Firebase e sem aparelho Android, e o enunciado diz que os dois caminhos valem o mesmo. Não implementamos o Caminho A: não registramos aparelho em `/customers/me/devices` e não usamos token de push.

**Como funciona**
1. Na abertura o app só **lê** a permissão (`getPermissionsAsync`). Não pede, porque a pessoa ainda não sabe o que ganha.
2. Se já estiver concedida, o app busca `GET /push/messages?status=SENT` e apresenta como notificação local as mensagens ainda não vistas, no máximo 3 por abertura. Os ids já apresentados ficam no AsyncStorage para não repetir.
3. A permissão é pedida em dois momentos: no convite que aparece **depois de favoritar** um produto (Detalhe) e no cartão "Avisos da loja" do Perfil.
4. O canal do Android (`default`) é criado antes de pedir a permissão e antes de agendar qualquer aviso.
5. **Deep link:** o toque abre a tela do produto de `data.produtoId`. Com o app fechado, o toque é lido por `getLastNotificationResponse()` e o destino fica guardado em `src/navigation/navegacao.ts` até o `onReady` do navegador. Um mesmo toque não navega duas vezes.

**Três desfechos da permissão (Perfil):** *indefinida* (explica o ganho e oferece ativar), *concedida* (confirma) e *negada* (o app segue inteiro, explica o que se perde e, se o sistema não aceita mais perguntar, mostra o caminho pelos ajustes do aparelho com um botão para abri-los). Ao voltar dos ajustes o estado se atualiza sozinho.

**API do `expo-notifications` 0.32:** usamos `shouldShowBanner` e `shouldShowList` no handler e `getLastNotificationResponse()` síncrono. Não usamos `getExpoPushTokenAsync`.

---

## Movimento — defesa das animações (CP5)

**Onde fica tudo:** `src/lib/animacoes.ts` guarda durações (150/250/400 ms), molas, escalas e o teto do escalonamento. Nenhum componente escolhe número próprio. O modo atual vem de `useMovimento()`, e a lógica de animação está em quatro componentes: `Pressionavel`, `PulsoAoAtivar`, `Pulsante` e `ItemDeLista`. As telas só os usam.

**Critério:** se o dedo causou o movimento, usa mola (`withSpring`). Se o movimento só informa (entrou, saiu, carregou), usa tempo (`withTiming`). Movimento sem função de informar ou confirmar foi cortado.

**Três modos**

| Modo | Quando | O que acontece |
|---|---|---|
| completo | padrão | escala com mola, pulo, entrada deslizando, saída e acomodação |
| reduzido | "Reduzir movimento" ligado no sistema | some o deslocamento e a escala. O toque escurece, o pulo vira piscada de opacidade, listas só fazem fade. O feedback continua |
| desligado | `ANIMACOES_ATIVAS = false` | nada anima. Os valores mudam no mesmo frame e o app segue utilizável |

**Mantidas e por quê**
- Toque com mola em botões, chips, cards e estrelas: sem isso o usuário não sabe se o toque pegou e toca de novo (num botão de pagar, isso é pedido duplicado).
- Pulo do coração ao favoritar: favoritar não navega nem abre alerta, então essa é a única prova de que funcionou. Só anima ao ativar e reage ao estado, não ao toque, para não confirmar uma gravação que falhou.
- Fade dos avisos (`Notice`): a mensagem de sucesso/erro não surge do nada.
- Entrada escalonada da grade, com teto de 300 ms: guia a leitura e não faz o item 40 esperar 1,6 s.
- Saída animada + `layout` em Favoritos e Carrinho: sem o `layout`, os itens que ficam pulam de posição e a saída se perde.
- Pulso do texto de carregamento: diferencia "ainda trabalhando" de "travou". Fica só no modo completo, porque o spinner nativo já sinaliza nos outros.

**Cortadas**
- Animação nas transições de tela (já existe a nativa do React Navigation).
- Pulo ao desfavoritar e entrada animada ao trocar filtro/busca na Home: remover não merece comemoração, e a grade deslizando a cada letra digitada atrapalha.
- Animações decorativas, sem informação (banner, logo, ícones parados).

**Detalhe técnico:** o app usa `<ReducedMotionConfig mode={ReduceMotion.Never} />`. Sem ele, o Reanimated pula todas as animações quando o sistema pede menos movimento, e o feedback sumiria. Assim o app decide o que substituir. Não há plugin do Reanimated no `babel.config.js`: no SDK 54 o `babel-preset-expo` já cuida disso.

---

## O que não funciona / limitações do CP5

- **Notificações:** só Caminho B. Sem push remoto, o aviso só aparece quando o app é aberto. Se o usuário não abrir o app, nada chega.
- O formato exato da resposta de `GET /push/messages` e de `GET /store/settings` não está documentado. O app lê vários formatos possíveis, mas **não foi testado contra a API real** (sem a chave da loja no ambiente de desenvolvimento). Se o painel não tiver mensagens enviadas ou a localização da loja, não aparece aviso e o mapa fica sem o marcador da loja.
- **Mapa:** funciona no Expo Go. Um APK/AAB próprio no Android exige chave do Google Maps (não versionada). Na web, o mapa é substituído por um aviso e a lista continua.
- Mapa, notificações e movimento foram verificados com `tsc` e bundle, mas **não testados em aparelho** por quem escreveu. É preciso testar no celular: permissões negadas, "Reduzir movimento" e deep link com o app fechado.

---

## Uso de IA

O grupo utilizou ferramentas de IA como apoio pontual durante o desenvolvimento, principalmente para verificação de erros, validação de integrações e garantia de funcionamento dos fluxos implementados.

**CP4:**
- Auxílio na identificação e correção de erros de integração com a API
- Validação do formato de payloads rejeitados pela API
- Verificação de contratos de resposta durante o desenvolvimento

**CP5:**
- Auxílio na implementação do movimento (Reanimated 4): vocabulário em `src/lib/animacoes.ts`, componentes `Pressionavel`, `PulsoAoAtivar`, `Pulsante` e `ItemDeLista` e o modo "Reduzir movimento". A estrutura se baseou no repositório de referência da turma (`mockmerce-app`, semana 07). O que mudou depois de gerar: o modo `reduzido` (a referência não trata o "Reduzir movimento"), a constante `ANIMACOES_ATIVAS`, o `acomodar` das listas e a defesa escrita acima.
- Notificações (Caminho B), mapa de retirada e correção do `pickupService`. Ferramenta: Claude Code, com o repositório de referência da turma (`mockmerce-app`) e a documentação da API como base. O que mudamos depois de gerar: escolhemos o Caminho B no lugar do A da referência, trocamos o token FCM por notificação local a partir de `/push/messages`, e o convite de permissão passou a aparecer depois de favoritar.
- Auxílio na identificação e correção de erros durante a implementação das avaliações
- Verificação do contrato dos endpoints `/reviews`, `/reviews/can-review` e `POST /reviews`

---

## Diário de erro

### Felipe (RM561810) — CP4

**Bug: Criação de produto variável retornando 400 — "Produto SIMPLE exige sku e price"**

1. **O que apareceu:** Ao tentar criar um produto variável pelo app, a API retornou `400 Bad Request` com a mensagem "Produto SIMPLE exige sku e price".
2. **Como investigou:** Abriu o DevTools, aba Network, e inspecionou o payload enviado. Percebeu que o campo `type` não estava no objeto.
3. **Causa:** O hook `useProdutoVariavel` enviava o payload sem o campo `type`, e a API assumia `SIMPLE` por padrão.
4. **O que mudou:** Adicionado `type: 'VARIABLE'` no payload e `type: string` na interface `CriarProdutoVariavelInput`.

---

### Vitor (RM565422) — CP4

**Bug: Token do comprador não persistia ao fechar e reabrir o app**

1. **O que apareceu:** Após login bem-sucedido, fechar e reabrir o app devolvia o usuário para a tela de login.
2. **Como investigou:** Verificou que o token estava salvo apenas em estado React (volátil), destruído quando o app fecha.
3. **Causa:** O token estava em `useState` em vez de `expo-secure-store`.
4. **O que mudou:** Criado o `AuthContext.tsx` com persistência via `SecureStore.setItemAsync` e recuperação na abertura com `SecureStore.getItemAsync`.

---

### Pedro (RM566551) — CP4

**Bug: App travando na inicialização após adicionar novas telas**

1. **O que apareceu:** Após criar as telas de webhook, frete e cadastro de cliente, o app travava na abertura com erro de navegação.
2. **Como investigou:** Leu o stack trace no terminal do Expo — apontava para o navigator tentando renderizar uma tela não registrada.
3. **Causa:** As telas foram criadas mas não registradas no stack navigator do `App.tsx`.
4. **O que mudou:** Adicionadas todas as novas rotas no navigator.

---

### João (RM565139) — CP4

**Bug: Pagamento recusado causava crash em vez de exibir mensagem de erro**

1. **O que apareceu:** Ao simular pagamento recusado com `simulate: "decline"`, o app quebrava com erro não tratado.
2. **Como investigou:** Testou o fluxo e leu o erro no console do Expo.
3. **Causa:** O `onError` do hook de pagamento não tratava o caso de recusa — o erro era propagado sem captura.
4. **O que mudou:** Adicionado tratamento específico para pagamento recusado, exibindo mensagem explicativa e mantendo o pedido em PENDING.

---

## Limitações conhecidas

- As missões "Tratar pagamento recusado", "Receber webhook" e "Reembolsar pedido" foram implementadas no código mas não registradas no painel até o momento da entrega
- O fluxo de cadastro e login não funciona na versão web (`npx expo start --web`) por limitação do `expo-secure-store`, que só opera em Android e iOS