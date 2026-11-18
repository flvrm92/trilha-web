# Desafio final: Sistema de locação de instrumentos musicais

> **Objetivo:** construir, sozinho e do zero, uma aplicação web completa que use tudo o que você estudou: um banco de dados no **SQL Server**, uma **Web API em .NET com C#** e um front-end em **Angular** com HTML e CSS bem feitos.
>
> Este desafio não traz o código pronto. Cada etapa diz **o que** construir, dá dicas de **como** e aponta para a parte dos guias onde o assunto foi explicado. Algumas etapas têm uma solução possível escondida: tente resolver antes de abrir.

## Sumário

- [Etapa 0: Entendendo o desafio](#etapa-0-entendendo-o-desafio)
- [Etapa 1: Banco de dados com SQL Server](#etapa-1-banco-de-dados-com-sql-server)
- [Etapa 2: Web API com .NET e C#](#etapa-2-web-api-com-net-e-c)
- [Etapa 3: Front-end com Angular](#etapa-3-front-end-com-angular)
- [Etapa 4: Entrega](#etapa-4-entrega)

---

## Etapa 0: Entendendo o desafio

### O cenário

A **Afinado**, uma pequena loja de música do seu bairro, aluga instrumentos para estudantes, bandas e eventos. Hoje o controle é feito num caderno: ninguém sabe ao certo quais instrumentos estão disponíveis, quem está com o violão desde o mês passado ou quanto cobrar na devolução.

Você foi contratado para criar um sistema web simples, usado pelo balcão da loja, que resolva esses três problemas.

### O que precisa ser entregue

Estes são os **requisitos funcionais** (RF), ou seja, o que o sistema precisa fazer:

| Código | Requisito |
|--------|-----------|
| **RF01** | Cadastrar, listar, editar e excluir **instrumentos** |
| **RF02** | Cada instrumento pertence a uma **categoria** (cordas, sopro, percussão, teclas...) |
| **RF03** | Filtrar a lista de instrumentos por nome, categoria e situação (disponível, locado, em manutenção) |
| **RF04** | Cadastrar e listar **clientes** |
| **RF05** | Registrar uma **locação**: qual cliente levou qual instrumento, quando e até quando |
| **RF06** | Registrar a **devolução**, calculando o valor a pagar |
| **RF07** | Listar as locações em andamento, destacando as **atrasadas** |

E estas são as **regras de negócio** (RN), que o sistema precisa garantir:

| Código | Regra |
|--------|-------|
| **RN01** | Só é possível alugar um instrumento com situação **Disponível** |
| **RN02** | Ao ser alugado, o instrumento passa para **Locado**; ao ser devolvido, volta para **Disponível** |
| **RN03** | O valor da locação é `dias × valor da diária`, contando no mínimo 1 dia |
| **RN04** | O valor da diária fica registrado na locação: se o preço do instrumento mudar depois, as locações antigas não mudam |
| **RN05** | Não é possível excluir um instrumento que já foi alugado alguma vez (ele pode ser marcado como inativo) |
| **RN06** | O número de série do instrumento e o CPF do cliente são únicos |

> **Comece pequeno.** Se o desafio parecer grande demais, faça primeiro só o RF01 e o RF02 (o cadastro de instrumentos) passando pelas três camadas: banco, API e tela. Depois volte para os outros requisitos. Um sistema pequeno que funciona vale mais que um grande pela metade.

### Arquitetura da solução

```
┌────────────────────────┐   HTTP + JSON   ┌──────────────────────────┐   SQL   ┌──────────────┐
│  Angular               │ ──────────────► │  ASP.NET Core Web API    │ ──────► │  SQL Server  │
│  localhost:4200        │ ◄────────────── │  localhost:5000          │ ◄────── │  AfinadoDb   │
│  Guias 3 e 4           │                 │  Guia 1                  │         │  Guia 5      │
└────────────────────────┘                 └──────────────────────────┘         └──────────────┘
```

Estrutura de pastas sugerida para o repositório:

```
afinado/
├── banco/
│   ├── 01-criar-tabelas.sql
│   └── 02-dados-iniciais.sql
├── api/
│   └── Afinado.Api/          ← projeto ASP.NET Core
├── web/
│   └── afinado-web/          ← projeto Angular
└── README.md                 ← como rodar o projeto
```

### Preparando o ambiente

Antes de começar, confira se tudo está instalado. Cada item foi explicado na Parte 0 do guia indicado:

- [ ] .NET SDK (LTS): `dotnet --version` (Guia 1)
- [ ] Visual Studio Community ou VS Code com C# Dev Kit (Guia 1)
- [ ] Node.js (LTS): `node --version` (Guia 3)
- [ ] Angular CLI: `ng version` (Guia 3)
- [ ] SQL Server em execução e SSMS conectando em `localhost` (Guia 5)
- [ ] Git: `git --version` (Guia 2)

Crie a pasta `afinado`, rode `git init` dentro dela e faça um commit ao final de cada etapa (o fluxo de trabalho está no Guia 2, Parte 3). Se quiser praticar branches, crie uma branch por etapa e faça o merge na `main` quando ela estiver pronta.

---

## Etapa 1: Banco de dados com SQL Server

> Revise: Guia 5, Partes 1 a 3 (tabelas, chaves, relacionamentos) e Parte 8 (índices).

### Modelando as entidades

O sistema tem quatro entidades. Antes de escrever SQL, desenhe o **DER** (no papel ou em https://dbdiagram.io) e responda: qual é a cardinalidade de cada relacionamento e de que lado fica cada chave estrangeira?

**Categorias:** Id, Nome (único).

**Instrumentos:** Id, Nome, Marca, Modelo, NumeroSerie (único), CategoriaId, ValorDiaria, Conservacao (Novo, Bom, Regular), Situacao (Disponivel, Locado, Manutencao), Ativo, Observacoes, CriadoEm.

**Clientes:** Id, Nome, Cpf (único), Email, Telefone, CriadoEm.

**Locacoes:** Id, InstrumentoId, ClienteId, DataRetirada, DataPrevistaDevolucao, DataDevolucao (nula enquanto não devolvido), ValorDiaria (cópia do valor no momento da locação, RN04), ValorTotal (preenchido na devolução).

<details>
<summary>Ver o DER esperado</summary>

```
Categorias (1) ────< (N) Instrumentos (1) ────< (N) Locacoes (N) >──── (1) Clientes
```

- Uma categoria tem muitos instrumentos: a FK `CategoriaId` fica em `Instrumentos`.
- Um instrumento aparece em muitas locações ao longo do tempo, e um cliente faz muitas locações: as FKs `InstrumentoId` e `ClienteId` ficam em `Locacoes`.
- `Locacoes` funciona como uma tabela associativa entre `Clientes` e `Instrumentos`, com atributos próprios (datas e valores).

</details>

### Criando as tabelas

Escreva o script `banco/01-criar-tabelas.sql` que cria o banco `AfinadoDb` e as quatro tabelas, com:

- Chaves primárias `INT IDENTITY` com nomes explícitos (`PK_Instrumentos`).
- Chaves estrangeiras com nomes explícitos (`FK_Instrumentos_Categorias`).
- `UNIQUE` em `Categorias.Nome`, `Instrumentos.NumeroSerie` e `Clientes.Cpf`.
- `CHECK` para garantir `ValorDiaria > 0` e que `Situacao` e `Conservacao` só aceitem os valores listados.
- `CHECK` para garantir que `DataPrevistaDevolucao` seja posterior a `DataRetirada`.
- Tipos adequados: `DECIMAL(10,2)` para dinheiro, `NVARCHAR` para textos, `CHAR(11)` para CPF, `DATE` ou `DATETIME2` para datas.

<details>
<summary>Ver a tabela Instrumentos como exemplo</summary>

```sql
CREATE TABLE Instrumentos (
    Id           INT IDENTITY(1,1) CONSTRAINT PK_Instrumentos PRIMARY KEY,
    Nome         NVARCHAR(100) NOT NULL,
    Marca        NVARCHAR(60)  NOT NULL,
    Modelo       NVARCHAR(60)  NULL,
    NumeroSerie  NVARCHAR(50)  NOT NULL CONSTRAINT UQ_Instrumentos_NumeroSerie UNIQUE,
    CategoriaId  INT NOT NULL CONSTRAINT FK_Instrumentos_Categorias REFERENCES Categorias (Id),
    ValorDiaria  DECIMAL(10,2) NOT NULL CONSTRAINT CK_Instrumentos_ValorDiaria CHECK (ValorDiaria > 0),
    Conservacao  NVARCHAR(10)  NOT NULL CONSTRAINT CK_Instrumentos_Conservacao
                 CHECK (Conservacao IN ('Novo', 'Bom', 'Regular')),
    Situacao     NVARCHAR(12)  NOT NULL CONSTRAINT DF_Instrumentos_Situacao DEFAULT 'Disponivel'
                 CONSTRAINT CK_Instrumentos_Situacao CHECK (Situacao IN ('Disponivel', 'Locado', 'Manutencao')),
    Ativo        BIT NOT NULL CONSTRAINT DF_Instrumentos_Ativo DEFAULT 1,
    Observacoes  NVARCHAR(500) NULL,
    CriadoEm     DATETIME2 NOT NULL CONSTRAINT DF_Instrumentos_CriadoEm DEFAULT SYSDATETIME()
);
```

As outras três tabelas seguem o mesmo padrão. Agora é com você.

</details>

### Índices e integridade extra

Crie índices para as consultas que o sistema vai fazer com frequência:

1. Índices nas chaves estrangeiras: `Instrumentos.CategoriaId`, `Locacoes.InstrumentoId`, `Locacoes.ClienteId`.
2. Um índice em `Instrumentos.Situacao`, usado pelo filtro da tela.
3. **Desafio de modelagem:** como impedir, **no próprio banco**, que o mesmo instrumento tenha duas locações em andamento ao mesmo tempo?

<details>
<summary>Ver a dica do item 3</summary>

Um **índice único filtrado** (Guia 5, seção 8.4) resolve: ele garante a unicidade só nas linhas que satisfazem o filtro.

```sql
CREATE UNIQUE INDEX UX_Locacoes_InstrumentoEmAndamento
    ON Locacoes (InstrumentoId)
    WHERE DataDevolucao IS NULL;
```

Um instrumento pode ter várias locações devolvidas, mas só uma sem data de devolução.

</details>

### Dados iniciais e consultas de verificação

Escreva `banco/02-dados-iniciais.sql` com pelo menos 4 categorias, 10 instrumentos, 5 clientes e 4 locações (2 devolvidas e 2 em andamento, uma delas atrasada).

Depois, escreva e execute estas consultas para validar o modelo:

1. Instrumentos disponíveis, com o nome da categoria, do mais barato para o mais caro.
2. Locações em andamento com o nome do cliente, o instrumento e quantos dias faltam (ou quantos dias de atraso).
3. Faturamento total por categoria, considerando só as locações devolvidas.
4. Os três instrumentos mais alugados.
5. Tente inserir uma segunda locação em andamento para um instrumento já locado e confira se o banco recusa.

---

## Etapa 2: Web API com .NET e C#

> Revise: Guia 1, Parte 3 (SOLID, injeção de dependência) e Parte 4 inteira (ASP.NET Core, EF Core, CORS).

### Criando o projeto

```bash
cd afinado/api
dotnet new webapi -n Afinado.Api --use-controllers
cd Afinado.Api
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
```

Organize o projeto em pastas: `Models/` (entidades), `DTOs/`, `Data/` (DbContext), `Services/` (regras de negócio) e `Controllers/`.

Configure a connection string no `appsettings.Development.json`, apontando para o `AfinadoDb`.

> **Banco primeiro ou código primeiro?** Você já criou as tabelas com SQL na Etapa 1, então mapeie as entidades para as tabelas existentes (**database first**). Se preferir, apague o banco e deixe as **migrations** do EF Core criarem as tabelas a partir das classes (**code first**). Os dois caminhos são válidos; escolha um e siga até o fim.

### Entidades e DbContext

Crie as classes `Categoria`, `Instrumento`, `Cliente` e `Locacao` com propriedades de navegação para os relacionamentos, e o `AfinadoContext` com um `DbSet` para cada uma.

Dicas:
- Use `enum` em C# para `Situacao` e `Conservacao`, e configure o EF Core para gravá-los como texto: `.HasConversion<string>()`.
- Configure a precisão dos campos decimais: `.HasPrecision(10, 2)`.
- Registre o contexto no `Program.cs` com `AddDbContext`.

### Endpoints de instrumentos e categorias

Implemente estes endpoints, sempre com DTOs de entrada e de saída (nunca exponha a entidade diretamente):

| Método | Rota | Descrição | Sucesso |
|--------|------|-----------|---------|
| `GET` | `/api/categorias` | Lista as categorias | `200` |
| `GET` | `/api/instrumentos?busca=&categoriaId=&situacao=` | Lista com filtros opcionais | `200` |
| `GET` | `/api/instrumentos/{id}` | Detalhe de um instrumento | `200` ou `404` |
| `POST` | `/api/instrumentos` | Cadastra | `201` |
| `PUT` | `/api/instrumentos/{id}` | Atualiza | `204` ou `404` |
| `DELETE` | `/api/instrumentos/{id}` | Exclui (ou inativa, pela RN05) | `204`, `404` ou `409` |

Regras:
- Valide a entrada com atributos (`[Required]`, `[StringLength]`, `[Range]`).
- Número de série repetido deve devolver `409 Conflict` com uma mensagem clara (RN06).
- O controller só recebe a requisição e devolve a resposta; as regras ficam num `InstrumentoService` injetado por uma interface `IInstrumentoService`.

### Endpoints de clientes e locações

| Método | Rota | Descrição | Sucesso |
|--------|------|-----------|---------|
| `GET` | `/api/clientes` | Lista os clientes | `200` |
| `POST` | `/api/clientes` | Cadastra um cliente | `201` ou `409` |
| `GET` | `/api/locacoes?emAndamento=true` | Lista as locações, indicando as atrasadas | `200` |
| `POST` | `/api/locacoes` | Registra uma locação | `201`, `404` ou `409` |
| `POST` | `/api/locacoes/{id}/devolucao` | Registra a devolução e calcula o valor | `200`, `404` ou `409` |

O `POST /api/locacoes` precisa, **numa única transação**:
1. Conferir se o instrumento e o cliente existem (`404` se não).
2. Conferir se o instrumento está `Disponivel` (`409` se não, RN01).
3. Criar a locação copiando o `ValorDiaria` atual do instrumento (RN04).
4. Mudar a situação do instrumento para `Locado` (RN02).

A devolução faz o caminho inverso e calcula `ValorTotal` (RN03). Lembre-se: um único `SaveChangesAsync()` já roda dentro de uma transação.

<details>
<summary>Ver uma ideia para o cálculo do valor</summary>

```csharp
public static decimal CalcularValor(DateTime retirada, DateTime devolucao, decimal valorDiaria)
{
    var dias = (int)Math.Ceiling((devolucao - retirada).TotalDays);
    return Math.Max(dias, 1) * valorDiaria;
}
```

Esse método não depende de banco nem de HTTP, então é perfeito para testes unitários (Guia 1, seção 3.7). Escreva testes para: devolução no mesmo dia, exatamente 3 dias depois e 3 dias e 1 hora depois.

</details>

### CORS, erros e documentação

- Configure o **CORS** para aceitar `http://localhost:4200` (Guia 1, seção 4.12). Sem isso, o Angular não consegue chamar a API.
- Ative o tratamento global de erros com `AddProblemDetails()` e `UseExceptionHandler()`.
- Ative a documentação OpenAPI e uma interface visual (Scalar ou Swagger UI).
- Crie um arquivo `Afinado.Api.http` com uma requisição para cada endpoint e teste todos, inclusive os casos de erro (`404`, `409`, `400`).

---

## Etapa 3: Front-end com Angular

> Revise: Guia 3, Parte 6 (Angular) e Guia 4 inteiro (HTML semântico, Flexbox, Grid, responsividade).

### Criando o projeto e a estrutura

```bash
cd afinado/web
ng new afinado-web --style=css
cd afinado-web
ng serve -o
```

Estrutura sugerida:

```
src/app/
├── models/          ← interfaces TypeScript (Instrumento, Cliente, Locacao...)
├── services/        ← InstrumentoService, ClienteService, LocacaoService
├── pages/
│   ├── instrumentos/        ← lista e formulário
│   ├── clientes/
│   └── locacoes/
└── shared/          ← componentes reutilizáveis (cabeçalho, badge de situação)
```

Configure `provideHttpClient()` no `app.config.ts` e crie um arquivo de ambiente com a URL da API (Guia 3, seção 6.15).

### Rotas e layout

Crie as rotas:

| Rota | Tela |
|------|------|
| `/instrumentos` | Lista de instrumentos (página inicial) |
| `/instrumentos/novo` | Cadastro |
| `/instrumentos/:id/editar` | Edição |
| `/clientes` | Lista e cadastro de clientes |
| `/locacoes` | Locações em andamento e botão de nova locação |

Monte o layout com HTML semântico: um `<header>` com o nome da loja e um `<nav>` com links para as três áreas, e um `<main>` com o `<router-outlet />`. Use Flexbox no cabeçalho e variáveis CSS para as cores (Guia 4, Parte 6).

### Lista de instrumentos

A tela principal do sistema. Ela deve:

- Mostrar os instrumentos em **cartões** organizados com CSS Grid: `repeat(auto-fill, minmax(260px, 1fr))` (Guia 4, seção 4.3).
- Exibir em cada cartão: nome, marca, categoria, valor da diária formatado em reais (pipe `currency`) e um **badge colorido** com a situação.
- Ter filtros por nome (campo de texto), categoria (`<select>`) e situação.
- Ter botões de **editar** e **excluir** em cada cartão, com confirmação antes de excluir.
- Mostrar uma mensagem útil quando a lista estiver vazia ("Nenhum instrumento encontrado. Cadastre o primeiro.") e quando a API estiver fora do ar.

> **Acessibilidade:** a situação não pode ser indicada só pela cor do badge (Guia 4, seção 2.9). Escreva também o texto: "Disponível", "Locado", "Em manutenção".

### Formulário de instrumento

Uma única tela serve para cadastrar e editar: se a rota tiver `:id`, carregue o instrumento e preencha o formulário.

- Use **formulários reativos** com validação (Guia 3, seção 6.12).
- Campos: nome, marca, modelo, número de série, categoria (`<select>` carregado da API), valor da diária, conservação e observações.
- Cada campo com `<label>` ligado ao `id` do campo.
- Mensagens de erro abaixo de cada campo inválido.
- Botão **Salvar** desabilitado enquanto o formulário for inválido.
- Se a API devolver `409` (número de série repetido), mostre a mensagem no formulário.
- Depois de salvar, volte para a lista.

### Clientes e locações

**Clientes:** uma tela com a lista e um formulário simples de cadastro (nome, CPF, e-mail, telefone).

**Locações:**
- Lista das locações em andamento com cliente, instrumento, data de retirada e data prevista. Destaque as **atrasadas** com uma classe CSS e o texto "Atrasada há X dias".
- Formulário de **nova locação**: escolha o cliente, um instrumento **entre os disponíveis** e a data prevista de devolução. Mostre uma prévia do valor estimado enquanto o usuário escolhe as datas (um `computed` com signals resolve).
- Botão **Registrar devolução** em cada linha, que chama a API e mostra o valor a pagar.

### Acabamento visual

- **Responsivo:** use a Device Toolbar (Ctrl+Shift+M) e garanta que todas as telas funcionem em 360px de largura (Guia 4, Parte 5).
- **Tema claro e escuro** com variáveis CSS e `prefers-color-scheme` (Guia 4, seção 6.1).
- **Estados de carregamento:** mostre um indicador enquanto a API responde.
- **Lighthouse:** rode a auditoria e chegue a 90 ou mais em acessibilidade.

---

## Etapa 4: Entrega

### Checklist de aceite

Antes de considerar o desafio concluído, teste este roteiro do começo ao fim:

- [ ] Cadastro um instrumento novo e ele aparece na lista como **Disponível**.
- [ ] Tento cadastrar outro com o mesmo número de série e vejo uma mensagem de erro clara.
- [ ] Edito o valor da diária e a lista mostra o valor novo.
- [ ] Filtro a lista por categoria, por situação e por nome.
- [ ] Cadastro um cliente.
- [ ] Registro uma locação e o instrumento passa a aparecer como **Locado**.
- [ ] O instrumento locado **não** aparece entre as opções de uma nova locação.
- [ ] Registro a devolução, vejo o valor calculado e o instrumento volta a ficar **Disponível**.
- [ ] Tento excluir um instrumento que já foi alugado e o sistema impede (ou inativa).
- [ ] Desligo a API e a tela mostra uma mensagem em vez de quebrar.
- [ ] Uso o sistema no tamanho de um celular sem rolagem horizontal.
- [ ] Navego por todas as telas usando só o teclado.

### Publicando o código no GitHub

1. Crie um arquivo `.gitignore` na raiz com `bin/`, `obj/`, `node_modules/`, `.angular/` e `dist/` (ou gere um com `dotnet new gitignore` dentro da pasta `api`).
2. Confira que nenhuma senha ou connection string de produção foi commitada.
3. Escreva o `README.md` do projeto com:
   - Uma descrição do sistema e uma captura de tela.
   - As tecnologias usadas.
   - O passo a passo para rodar: executar os scripts SQL, configurar a connection string, `dotnet run` na API e `ng serve` no front-end.
4. Crie um repositório no GitHub e envie o código (revise a Parte 5 do Guia 2):

```bash
git add .
git commit -m "Sistema de locação de instrumentos Afinado"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/afinado.git
git push -u origin main
```

Esse repositório é o primeiro item do seu **portfólio**. Coloque o link no seu currículo e no LinkedIn.

### Desafios extras

Terminou? Escolha um ou mais para ir além:

1. **Paginação** na lista de instrumentos, na API e na tela.
2. **Histórico do instrumento:** uma tela com todas as locações de um instrumento e o total que ele já faturou.
3. **Relatórios:** uma página com o faturamento do mês, os instrumentos mais alugados e os melhores clientes (use as consultas da Etapa 1 com Dapper ou views).
4. **Multa por atraso:** acrescente uma regra de 20% a mais na diária para os dias de atraso, com testes unitários.
5. **Fotos dos instrumentos:** upload de imagem na API e exibição nos cartões.
6. **Login:** autenticação com JWT, com dois perfis: atendente (registra locações) e gerente (cadastra instrumentos e vê relatórios).
7. **Testes automatizados:** testes xUnit para os serviços da API e testes de componentes no Angular.
8. **Publicação:** publique o front-end na Vercel e a API num serviço gratuito de hospedagem, com um banco na nuvem.

**Parabéns por chegar até aqui.** Se você concluiu este desafio, já passou por todo o ciclo de uma aplicação web profissional: modelagem de dados, back-end, front-end e entrega.
