# Guia 4: SQL com SQL Server

> **Objetivo:** entender como os dados de uma aplicação são guardados e consultados. Você vai aprender o que são bancos de dados relacionais, tabelas, chaves primárias e estrangeiras, relacionamentos, índices, e escrever consultas SQL no SQL Server, terminando com a ligação entre o banco e a API do Guia 1.
>
> **Pré-requisitos:** Guias 1 a 3. O exemplo da loja que usamos nos guias anteriores continua aqui.

## Sumário

- [Parte 0: Bancos de dados e preparação do ambiente](#parte-0-bancos-de-dados-e-preparação-do-ambiente)
- [Parte 1: Tabelas e tipos de dados](#parte-1-tabelas-e-tipos-de-dados)
- [Parte 2: Chaves e restrições](#parte-2-chaves-e-restrições)
- [Parte 3: Relacionamentos](#parte-3-relacionamentos)
- [Parte 4: Manipulando dados (DML)](#parte-4-manipulando-dados-dml)
- [Parte 5: Consultando dados](#parte-5-consultando-dados)
- [Parte 6: Juntando tabelas (JOIN)](#parte-6-juntando-tabelas-join)
- [Parte 7: Normalização](#parte-7-normalização)
- [Parte 8: Índices e desempenho](#parte-8-índices-e-desempenho)
- [Parte 9: Recursos avançados](#parte-9-recursos-avançados)
- [Parte 10: O banco e a aplicação](#parte-10-o-banco-e-a-aplicação)
- [Glossário](#glossário)
- [Para continuar estudando](#para-continuar-estudando)

---

## Parte 0: Bancos de dados e preparação do ambiente

### 0.1 Por que precisamos de um banco de dados?

Até agora, os dados dos nossos programas viviam na memória (uma `List<Produto>` no C#, um array no JavaScript) e sumiam quando o programa fechava. O `localStorage` do Guia 2 guarda dados, mas só no navegador de um usuário.

Uma aplicação real precisa guardar dados de forma:
- **Persistente:** sobrevivem a desligamentos.
- **Compartilhada:** milhares de usuários acessam os mesmos dados ao mesmo tempo.
- **Consistente:** um pedido não pode apontar para um cliente que não existe.
- **Segura:** cada usuário vê só o que pode ver.
- **Eficiente:** encontrar um registro entre milhões em milissegundos.

Um **banco de dados** é um conjunto organizado de dados. Um **SGBD** (Sistema Gerenciador de Banco de Dados) é o software que guarda, protege e consulta esses dados. O **SQL Server**, da Microsoft, é um SGBD.

### 0.2 Bancos relacionais

Num banco **relacional**, os dados ficam em **tabelas** (como planilhas), e as tabelas se **relacionam** entre si por meio de chaves.

```
Clientes                           Pedidos
┌────┬────────┬──────────────┐     ┌────┬───────────┬────────────┬─────────┐
│ Id │ Nome   │ Email        │     │ Id │ ClienteId │ Data       │ Total   │
├────┼────────┼──────────────┤     ├────┼───────────┼────────────┼─────────┤
│ 1  │ Ana    │ ana@ex.com   │◄────│ 10 │ 1         │ 2026-11-01 │ 4580.00 │
│ 2  │ Bruno  │ bruno@ex.com │◄─┐  │ 11 │ 2         │ 2026-11-03 │ 900.00  │
└────┴────────┴──────────────┘  └──│ 12 │ 2         │ 2026-11-05 │ 80.00   │
                                   └────┴───────────┴────────────┴─────────┘
```

Exemplos de bancos relacionais: **SQL Server**, PostgreSQL, MySQL, Oracle, SQLite.

Também existem bancos **não relacionais** (NoSQL), como MongoDB (documentos JSON) e Redis (chave-valor). São úteis em cenários específicos, mas os relacionais continuam sendo a base da maioria dos sistemas, e aprender SQL é obrigatório para qualquer desenvolvedor.

### 0.3 O que é SQL

**SQL** (*Structured Query Language*, pronuncia-se "ésse-quê-éle" ou "sequel") é a linguagem padrão para conversar com bancos relacionais. É uma linguagem **declarativa**: você diz **o que** quer, não **como** buscar. O banco decide o melhor caminho.

```sql
SELECT Nome, Email FROM Clientes WHERE Cidade = 'Recife';
```

Compare com o C#, onde você escreveria o laço que percorre a lista. O LINQ do Guia 1 foi inspirado no SQL.

Cada SGBD tem seu "dialeto" de SQL. O do SQL Server se chama **T-SQL** (Transact-SQL). O básico é igual em todos os bancos.

**Categorias de comandos SQL:**

| Sigla | Nome | Comandos | Para quê |
|-------|------|----------|----------|
| **DDL** | Data Definition Language | `CREATE`, `ALTER`, `DROP` | Definir a estrutura (tabelas, índices) |
| **DML** | Data Manipulation Language | `INSERT`, `UPDATE`, `DELETE` | Alterar os dados |
| **DQL** | Data Query Language | `SELECT` | Consultar os dados |
| **DCL** | Data Control Language | `GRANT`, `REVOKE` | Controlar permissões |
| **TCL** | Transaction Control Language | `BEGIN TRAN`, `COMMIT`, `ROLLBACK` | Controlar transações |

### 0.4 Ferramentas deste guia

| Ferramenta | Para quê | Obrigatória? |
|-----------|----------|--------------|
| **SQL Server** (edição Developer ou Express) | O servidor de banco de dados em si | Sim |
| **SQL Server Management Studio (SSMS)** | Interface gráfica para escrever consultas e administrar o banco (só Windows) | Recomendado |
| **Extensão SQL Server (mssql) do VS Code** | Alternativa ao SSMS, funciona em qualquer sistema | Opcional |
| **Docker** | Alternativa para rodar o SQL Server em macOS e Linux | Opcional |

O **SQL Server** é o motor que guarda os dados e roda em segundo plano como um serviço do Windows. O **SSMS** é só a "janela" para conversar com ele. Você precisa instalar os dois.

### 0.5 Instalando o SQL Server

Existem duas edições gratuitas:

| Edição | Limites | Quando usar |
|--------|---------|-------------|
| **Developer** | Nenhum: tem todos os recursos da edição Enterprise | Estudo e desenvolvimento (**não** pode ser usada em produção) |
| **Express** | Bancos de até 10 GB, uso limitado de memória e processador | Computadores mais modestos, pequenas aplicações em produção |

**Passo a passo (Windows):**

1. Acesse https://www.microsoft.com/sql-server/sql-server-downloads.
2. Baixe a edição **Developer** (ou **Express**).
3. Execute o instalador e escolha o tipo **Básico** (*Basic*). Ele instala com as configurações recomendadas.
4. Aceite os termos de licença, escolha a pasta e aguarde.
5. No fim, anote o **nome da instância** mostrado na tela:
   - Developer: normalmente `MSSQLSERVER` (instância padrão), e você conecta em `localhost`.
   - Express: normalmente `SQLEXPRESS`, e você conecta em `localhost\SQLEXPRESS`.
6. A tela final oferece um botão **Instalar SSMS**, que leva à próxima etapa.

> O tipo **Personalizado** (*Custom*) permite escolher a autenticação. Se usá-lo, selecione **Modo Misto** (*Mixed Mode*) e defina uma senha para o usuário `sa`. No tipo Básico, só a autenticação do Windows é habilitada, o que basta para estudar.

**O SQL Server está rodando?** Ele é um serviço do Windows. Abra o menu Iniciar, digite **Serviços** (`services.msc`) e procure **SQL Server (MSSQLSERVER)** ou **SQL Server (SQLEXPRESS)**: o status deve ser **Em execução**. Se o computador ficar lento, você pode mudar a inicialização para **Manual** e iniciar o serviço só quando for estudar.

### 0.6 Instalando o SQL Server Management Studio (SSMS)

1. Acesse https://learn.microsoft.com/sql/ssms/install/install e baixe a versão mais recente do SSMS.
2. Execute o instalador. Ele usa o mesmo **Visual Studio Installer** do Guia 1; mantenha as opções padrão e clique em **Instalar**.
3. Abra o **SQL Server Management Studio** pelo menu Iniciar.

**Conectando pela primeira vez**, a janela **Conectar ao Servidor** pede:

| Campo | Valor |
|-------|-------|
| **Tipo de servidor** | Mecanismo de Banco de Dados (*Database Engine*) |
| **Nome do servidor** | `localhost` (Developer) ou `localhost\SQLEXPRESS` (Express) |
| **Autenticação** | Autenticação do Windows |
| **Criptografar** | Obrigatório (padrão) |
| **Confiar no certificado do servidor** | **Marcado** (necessário em instalações locais) |

Clique em **Conectar**. No painel **Pesquisador de Objetos** (*Object Explorer*), à esquerda, você verá o servidor, as pastas **Bancos de Dados**, **Segurança** e outras.

> **Erro "o certificado não é confiável"?** Volte à janela de conexão e marque **Confiar no certificado do servidor**. **Erro "servidor não encontrado"?** Confira se o serviço está em execução e se o nome da instância está correto.

**Usando o SSMS:**
- Clique em **Nova Consulta** (*New Query*), digite o comando e pressione **F5** (ou **Ctrl+E**) para executar.
- Selecionar um trecho antes de pressionar F5 executa **só aquele trecho**.
- A lista no alto da janela mostra **em qual banco** a consulta vai rodar. Confira sempre antes de executar comandos que alteram dados.
- **Ctrl+R** mostra ou esconde o painel de resultados.

### 0.7 Alternativas: Docker e VS Code

**SQL Server no Docker** (funciona em Windows, Linux e Mac com processador Intel/AMD):

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=SuaSenha!Forte123" \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

Conecte em `localhost,1433` com o usuário `sa` e a senha definida (que precisa ter letras maiúsculas, minúsculas, números e símbolos).

**Extensão SQL Server (mssql) para VS Code:** instale pelo painel de extensões (**Ctrl+Shift+X**), clique no ícone do SQL Server na barra lateral, adicione uma conexão com os mesmos dados da tabela acima e execute consultas em arquivos `.sql` com **Ctrl+Shift+E**. É uma boa opção para macOS e Linux, onde o SSMS não existe.

### 0.8 Criando o banco

```sql
CREATE DATABASE LojaDb;
GO

USE LojaDb;   -- passa a usar este banco nos próximos comandos
GO
```

`GO` não é SQL: é um separador de lotes entendido pelo SSMS. Use-o entre comandos que precisam executar em sequência, como criar um banco e depois usá-lo.

Comentários em SQL:

```sql
-- comentário de uma linha
/* comentário
   de várias linhas */
```

---

## Parte 1: Tabelas e tipos de dados

### 1.1 Anatomia de uma tabela

```
                   Colunas (campos / atributos)
              ┌──────────┬──────────┬───────────┐
              │ Id       │ Nome     │ Preco     │  ← cabeçalho: nome e tipo de cada coluna
              ├──────────┼──────────┼───────────┤
Linhas     →  │ 1        │ Notebook │ 4500.00   │
(registros /  │ 2        │ Mouse    │ 80.00     │
 tuplas)      │ 3        │ Cadeira  │ 900.00    │
              └──────────┴──────────┴───────────┘
```

- **Tabela:** representa um tipo de "coisa" (entidade): clientes, produtos, pedidos. Equivale a uma classe no C#.
- **Coluna:** uma característica, com um tipo definido. Equivale a uma propriedade.
- **Linha:** uma ocorrência concreta. Equivale a um objeto.

### 1.2 Tipos de dados no SQL Server

| Categoria | Tipo | Uso | Equivalente em C# |
|-----------|------|-----|-------------------|
| Inteiros | `TINYINT` | 0 a 255 | `byte` |
| | `SMALLINT` | ±32 mil | `short` |
| | `INT` | ±2,1 bilhões (**o mais usado**) | `int` |
| | `BIGINT` | Números enormes | `long` |
| Decimais | `DECIMAL(p, s)` | Valores exatos: `DECIMAL(10,2)` = 10 dígitos, 2 após a vírgula. **Use para dinheiro** | `decimal` |
| | `FLOAT` | Aproximados (científicos) | `double` |
| Texto | `VARCHAR(n)` | Texto de tamanho variável, até `n` caracteres | `string` |
| | `NVARCHAR(n)` | Igual, mas com Unicode (acentos, emojis, outros alfabetos). **Prefira este** | `string` |
| | `CHAR(n)` | Tamanho fixo (siglas: `CHAR(2)` para UF) | `string` |
| | `NVARCHAR(MAX)` | Textos longos (até 2 GB) | `string` |
| Data e hora | `DATE` | Só data | `DateOnly` |
| | `TIME` | Só hora | `TimeOnly` |
| | `DATETIME2` | Data e hora com precisão (**prefira a `DATETIME`**) | `DateTime` |
| | `DATETIMEOFFSET` | Data e hora com fuso horário | `DateTimeOffset` |
| Lógico | `BIT` | 0, 1 ou NULL | `bool` |
| Identificador | `UNIQUEIDENTIFIER` | GUID | `Guid` |
| Binário | `VARBINARY(MAX)` | Arquivos, imagens | `byte[]` |

**Escolher o tipo certo importa:** ele valida os dados (não dá para guardar "abc" num `INT`), define quanto espaço ocupa e afeta o desempenho.

### 1.3 NULL

`NULL` significa **ausência de valor** ("não sei" ou "não se aplica"). Não é zero nem texto vazio.

```sql
-- NULL nunca é igual a nada, nem a outro NULL
SELECT * FROM Clientes WHERE Telefone = NULL;      -- ERRADO: não retorna nada
SELECT * FROM Clientes WHERE Telefone IS NULL;     -- CERTO
SELECT * FROM Clientes WHERE Telefone IS NOT NULL;
```

Ao criar uma coluna, defina se ela aceita `NULL` ou é `NOT NULL` (obrigatória).

### 1.4 CREATE TABLE

```sql
CREATE TABLE Categorias (
    Id   INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(50) NOT NULL
);

CREATE TABLE Produtos (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    Nome        NVARCHAR(100) NOT NULL,
    Descricao   NVARCHAR(500) NULL,
    Preco       DECIMAL(10,2) NOT NULL,
    Estoque     INT NOT NULL DEFAULT 0,
    Ativo       BIT NOT NULL DEFAULT 1,
    CriadoEm    DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

- `IDENTITY(1,1)`: o banco gera o valor automaticamente, começando em 1 e somando 1 a cada linha.
- `DEFAULT`: valor usado quando nenhum for informado.
- `SYSDATETIME()`: função que retorna a data e hora atuais.

### 1.5 ALTER e DROP

```sql
-- Adicionar uma coluna
ALTER TABLE Produtos ADD Peso DECIMAL(6,3) NULL;

-- Alterar o tipo de uma coluna
ALTER TABLE Produtos ALTER COLUMN Nome NVARCHAR(150) NOT NULL;

-- Remover uma coluna
ALTER TABLE Produtos DROP COLUMN Peso;

-- Apagar a tabela inteira (estrutura E dados!)
DROP TABLE Produtos;

-- Apagar todos os dados, mantendo a estrutura
TRUNCATE TABLE Produtos;
```

> ⚠️ `DROP` e `TRUNCATE` não pedem confirmação e não têm "desfazer". Em produção, um `DROP TABLE` errado pode custar um emprego. Sempre confira em qual banco você está conectado antes de executar.

### 1.6 Convenções de nomes

Não há regra única, mas escolha uma e seja consistente. Uma convenção comum em projetos .NET:

- Tabelas no plural, em PascalCase: `Clientes`, `ItensPedido`.
- Colunas em PascalCase: `DataNascimento`, `PrecoUnitario`.
- Chave primária chamada `Id`.
- Chave estrangeira com o nome da tabela referenciada no singular + `Id`: `ClienteId`, `CategoriaId`.
- Evite espaços, acentos e palavras reservadas (`User`, `Order`, `Date`) nos nomes.

### Exercícios da Parte 1

1. Crie o banco `EscolaDb`.
2. Crie a tabela `Alunos` com: Id (gerado automaticamente), Nome (obrigatório, até 100 caracteres), Email (até 150), DataNascimento (data), Ativo (padrão verdadeiro) e DataCadastro (padrão: agora).
3. Adicione a coluna `Telefone` à tabela `Alunos`.
4. Para cada informação, escolha o tipo mais adequado: CPF, sigla do estado, salário, quantidade em estoque, descrição longa de um produto, se o e-mail foi confirmado, horário de abertura de uma loja.

---

## Parte 2: Chaves e restrições

**Restrições** (*constraints*) são regras que o banco faz cumprir. Elas garantem a **integridade** dos dados, ou seja, que os dados façam sentido. Mesmo que a aplicação tenha um bug, o banco recusa dados inválidos.

### 2.1 Chave primária (PRIMARY KEY)

A **chave primária** identifica **cada linha de forma única**. É como o CPF de uma pessoa: não existem duas iguais, e toda pessoa tem uma.

Regras:
- **Única:** não pode haver duas linhas com o mesmo valor.
- **Não nula:** toda linha precisa ter.
- **Uma por tabela** (mas pode ser composta por mais de uma coluna).
- **Imutável:** não deve mudar depois de criada.

```sql
CREATE TABLE Clientes (
    Id    INT IDENTITY(1,1) NOT NULL,
    Nome  NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    CONSTRAINT PK_Clientes PRIMARY KEY (Id)   -- forma com nome explícito
);
```

Dar nome às restrições (`PK_Clientes`) facilita entender mensagens de erro e alterar a restrição depois.

**Chave natural x chave substituta:**

| Tipo | Exemplo | Prós | Contras |
|------|---------|------|---------|
| **Natural** (um dado real) | CPF, ISBN, placa do carro | Tem significado | Pode mudar, pode não existir (estrangeiros não têm CPF), costuma ser texto (mais lenta) |
| **Substituta** (*surrogate*) | `Id INT IDENTITY` ou `GUID` | Nunca muda, pequena, rápida | Não tem significado de negócio |

**Recomendação:** use uma chave substituta (`Id INT IDENTITY`) como chave primária, e garanta que as chaves naturais sejam únicas com `UNIQUE` (próxima seção).

**Chave primária composta** (mais de uma coluna):

```sql
CREATE TABLE AlunosTurmas (
    AlunoId INT NOT NULL,
    TurmaId INT NOT NULL,
    CONSTRAINT PK_AlunosTurmas PRIMARY KEY (AlunoId, TurmaId)
    -- a COMBINAÇÃO é única: o mesmo aluno não entra duas vezes na mesma turma
);
```

### 2.2 UNIQUE

Garante que não haja valores repetidos numa coluna, sem ser a chave primária. Uma tabela pode ter várias restrições `UNIQUE`.

```sql
ALTER TABLE Clientes ADD CONSTRAINT UQ_Clientes_Email UNIQUE (Email);
```

Agora, tentar cadastrar dois clientes com o mesmo e-mail gera um erro. Na API do Guia 1, você pode capturar esse erro e devolver `409 Conflict`.

### 2.3 Chave estrangeira (FOREIGN KEY)

A **chave estrangeira** é uma coluna que **aponta para a chave primária de outra tabela**. É ela que cria o relacionamento e garante a **integridade referencial**: não é possível apontar para algo que não existe.

```sql
CREATE TABLE Pedidos (
    Id        INT IDENTITY(1,1) NOT NULL,
    ClienteId INT NOT NULL,
    Data      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Status    NVARCHAR(20) NOT NULL DEFAULT 'Pendente',
    CONSTRAINT PK_Pedidos PRIMARY KEY (Id),
    CONSTRAINT FK_Pedidos_Clientes FOREIGN KEY (ClienteId) REFERENCES Clientes (Id)
);
```

```
Clientes                  Pedidos
┌────────────┐            ┌──────────────────┐
│ Id (PK)    │◄───────────│ ClienteId (FK)   │
│ Nome       │            │ Id (PK)          │
│ Email      │            │ Data             │
└────────────┘            └──────────────────┘
```

O que a chave estrangeira impede:

```sql
-- Supondo que não existe cliente com Id 999:
INSERT INTO Pedidos (ClienteId) VALUES (999);
-- ERRO: The INSERT statement conflicted with the FOREIGN KEY constraint "FK_Pedidos_Clientes"

-- Supondo que o cliente 1 tem pedidos:
DELETE FROM Clientes WHERE Id = 1;
-- ERRO: The DELETE statement conflicted with the REFERENCE constraint "FK_Pedidos_Clientes"
```

Sem essa restrição, você teria **registros órfãos**: pedidos de clientes que não existem mais.

**Ações em cascata** (o que fazer quando o registro "pai" é excluído ou alterado):

```sql
CONSTRAINT FK_ItensPedido_Pedidos FOREIGN KEY (PedidoId)
    REFERENCES Pedidos (Id)
    ON DELETE CASCADE      -- excluir o pedido exclui seus itens
```

| Opção | Ao excluir o pai... |
|-------|---------------------|
| `NO ACTION` (padrão) | Impede a exclusão se houver filhos |
| `CASCADE` | Exclui os filhos junto |
| `SET NULL` | Coloca `NULL` na chave estrangeira dos filhos |
| `SET DEFAULT` | Coloca o valor padrão na chave estrangeira dos filhos |

> Use `CASCADE` com cuidado. Faz sentido para itens de um pedido (não existem sem o pedido), mas seria um desastre entre clientes e pedidos: excluir um cliente apagaria todo o histórico de vendas.

### 2.4 CHECK

Valida uma condição em cada linha:

```sql
ALTER TABLE Produtos ADD CONSTRAINT CK_Produtos_Preco CHECK (Preco > 0);
ALTER TABLE Produtos ADD CONSTRAINT CK_Produtos_Estoque CHECK (Estoque >= 0);
ALTER TABLE Pedidos ADD CONSTRAINT CK_Pedidos_Status
    CHECK (Status IN ('Pendente', 'Pago', 'Enviado', 'Entregue', 'Cancelado'));
```

### 2.5 NOT NULL e DEFAULT

Também são restrições: `NOT NULL` torna a coluna obrigatória e `DEFAULT` define um valor quando nenhum é informado. Você já os usou na Parte 1.

### 2.6 Resumo das restrições

| Restrição | Garante que... |
|-----------|----------------|
| `PRIMARY KEY` | Cada linha tem um identificador único e não nulo |
| `FOREIGN KEY` | O valor existe na tabela referenciada |
| `UNIQUE` | Não há valores repetidos na coluna |
| `CHECK` | O valor satisfaz uma condição |
| `NOT NULL` | A coluna sempre tem valor |
| `DEFAULT` | Há um valor padrão quando nenhum é informado |

> **Valide em todas as camadas.** No front-end (Guia 2) para dar retorno rápido ao usuário, na API (Guia 1) para aplicar as regras de negócio, e no banco como a última linha de defesa.

### Exercícios da Parte 2

1. Adicione ao `EscolaDb` uma restrição `UNIQUE` no e-mail dos alunos.
2. Crie a tabela `Cursos` (Id, Nome único, CargaHoraria maior que zero).
3. Crie a tabela `Turmas` com chave estrangeira para `Cursos`, um `Semestre` (ex.: `'2026.2'`) e uma restrição `CHECK` que garanta `VagasTotais` entre 1 e 60.
4. Tente inserir uma turma com um `CursoId` que não existe. Leia a mensagem de erro com atenção.
5. Explique por que `CPF` é uma boa candidata a `UNIQUE`, mas talvez não a chave primária.

---

## Parte 3: Relacionamentos

### 3.1 Tipos de relacionamento

Existem três tipos, definidos pela **cardinalidade**: quantos registros de um lado se relacionam com quantos do outro.

#### Um para um (1:1)

Cada registro de A se relaciona com no máximo um registro de B, e vice-versa.

**Exemplo:** um `Usuario` tem um `Perfil` com dados opcionais (foto, biografia).

```sql
CREATE TABLE Usuarios (
    Id    INT IDENTITY PRIMARY KEY,
    Login NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Perfis (
    UsuarioId INT PRIMARY KEY,               -- a PK é também a FK
    Biografia NVARCHAR(500),
    FotoUrl   NVARCHAR(300),
    CONSTRAINT FK_Perfis_Usuarios FOREIGN KEY (UsuarioId) REFERENCES Usuarios (Id)
);
```

É o relacionamento menos comum. Muitas vezes os dados poderiam estar na mesma tabela; separa-se por organização, segurança ou desempenho.

#### Um para muitos (1:N)

Cada registro de A se relaciona com **vários** de B, mas cada B pertence a **um único** A. É o relacionamento **mais comum**.

**Exemplos:** uma categoria tem muitos produtos; um cliente faz muitos pedidos.

**Regra:** a chave estrangeira fica sempre do lado **"muitos"**.

```sql
ALTER TABLE Produtos ADD CategoriaId INT NULL;
ALTER TABLE Produtos ADD CONSTRAINT FK_Produtos_Categorias
    FOREIGN KEY (CategoriaId) REFERENCES Categorias (Id);
```

```
Categorias (1) ──────< (N) Produtos
```

Por que do lado "muitos"? Se a chave ficasse em `Categorias`, uma categoria precisaria de várias colunas (`ProdutoId1`, `ProdutoId2`, ...), o que não funciona.

#### Muitos para muitos (N:N)

Cada registro de A se relaciona com vários de B, **e** cada B com vários de A.

**Exemplos:** um pedido tem vários produtos, e um produto aparece em vários pedidos. Um aluno cursa várias turmas, e uma turma tem vários alunos.

Bancos relacionais **não representam N:N diretamente**. A solução é uma **tabela associativa** (também chamada de tabela de junção, intermediária ou ponte), que transforma o N:N em dois 1:N:

```
Pedidos (1) ──< (N) ItensPedido (N) >── (1) Produtos
```

```sql
CREATE TABLE ItensPedido (
    PedidoId      INT NOT NULL,
    ProdutoId     INT NOT NULL,
    Quantidade    INT NOT NULL CHECK (Quantidade > 0),
    PrecoUnitario DECIMAL(10,2) NOT NULL,   -- o preço NO MOMENTO da compra
    CONSTRAINT PK_ItensPedido PRIMARY KEY (PedidoId, ProdutoId),
    CONSTRAINT FK_ItensPedido_Pedidos FOREIGN KEY (PedidoId)
        REFERENCES Pedidos (Id) ON DELETE CASCADE,
    CONSTRAINT FK_ItensPedido_Produtos FOREIGN KEY (ProdutoId)
        REFERENCES Produtos (Id)
);
```

Repare que a tabela associativa pode ter **atributos próprios** do relacionamento: `Quantidade` e `PrecoUnitario` não pertencem nem ao pedido nem ao produto, mas à combinação dos dois.

> **Por que guardar `PrecoUnitario` se o produto já tem preço?** Porque o preço do produto muda com o tempo. O pedido precisa registrar quanto o cliente pagou **naquele dia**. Esse é um exemplo de decisão de modelagem baseada em regra de negócio.

### 3.2 Diagrama Entidade-Relacionamento (DER)

Antes de criar tabelas, modelamos os dados num diagrama. A notação mais usada é a **pé de galinha** (*crow's foot*):

```
  ──┼──     exatamente um
  ──○┼─     zero ou um
  ──┼<      um ou muitos
  ──○<      zero ou muitos
```

**O modelo completo da loja:**

```
┌──────────────┐          ┌──────────────────┐          ┌──────────────┐
│  Categorias  │          │    Produtos      │          │  Fornecedores│
├──────────────┤          ├──────────────────┤          ├──────────────┤
│ PK Id        │┼───────○<│ PK Id            │>○──────┼│ PK Id        │
│    Nome      │          │    Nome          │          │    Nome      │
└──────────────┘          │    Preco         │          │    Cnpj      │
                          │    Estoque       │          └──────────────┘
                          │ FK CategoriaId   │
                          │ FK FornecedorId  │
                          └────────┬─────────┘
                                   ┼
                                   │
                                   ○
                                   ^
┌──────────────┐          ┌────────┴─────────┐
│   Clientes   │          │   ItensPedido    │
├──────────────┤          ├──────────────────┤
│ PK Id        │          │ PK,FK PedidoId   │
│    Nome      │          │ PK,FK ProdutoId  │
│    Email     │          │    Quantidade    │
│    Cidade    │          │    PrecoUnitario │
└──────┬───────┘          └────────┬─────────┘
       ┼                           ^
       │                           ┼  (todo pedido tem ao menos um item)
       ○                           │
       ^                           ┼
┌──────┴───────────────────────────┴─┐
│              Pedidos               │
├────────────────────────────────────┤
│ PK Id                              │
│ FK ClienteId                       │
│    Data                            │
│    Status                          │
└────────────────────────────────────┘
```

Lendo: "uma categoria tem zero ou muitos produtos; cada produto pertence a uma categoria"; "um cliente faz zero ou muitos pedidos"; "um pedido tem um ou muitos itens".

**Ferramentas para desenhar:** https://dbdiagram.io, https://draw.io, ou o próprio SSMS (pasta *Database Diagrams*).

### 3.3 Script completo da loja

Este é o script que usaremos no resto do guia. Execute-o inteiro no SSMS:

```sql
USE master;
GO
DROP DATABASE IF EXISTS LojaDb;
GO
CREATE DATABASE LojaDb;
GO
USE LojaDb;
GO

CREATE TABLE Categorias (
    Id   INT IDENTITY(1,1) CONSTRAINT PK_Categorias PRIMARY KEY,
    Nome NVARCHAR(50) NOT NULL CONSTRAINT UQ_Categorias_Nome UNIQUE
);

CREATE TABLE Clientes (
    Id       INT IDENTITY(1,1) CONSTRAINT PK_Clientes PRIMARY KEY,
    Nome     NVARCHAR(100) NOT NULL,
    Email    NVARCHAR(150) NOT NULL CONSTRAINT UQ_Clientes_Email UNIQUE,
    Cidade   NVARCHAR(80)  NULL,
    Uf       CHAR(2)       NULL,
    CriadoEm DATETIME2     NOT NULL CONSTRAINT DF_Clientes_CriadoEm DEFAULT SYSDATETIME()
);

CREATE TABLE Produtos (
    Id          INT IDENTITY(1,1) CONSTRAINT PK_Produtos PRIMARY KEY,
    Nome        NVARCHAR(100) NOT NULL,
    Preco       DECIMAL(10,2) NOT NULL CONSTRAINT CK_Produtos_Preco CHECK (Preco > 0),
    Estoque     INT NOT NULL CONSTRAINT DF_Produtos_Estoque DEFAULT 0
                             CONSTRAINT CK_Produtos_Estoque CHECK (Estoque >= 0),
    CategoriaId INT NOT NULL CONSTRAINT FK_Produtos_Categorias REFERENCES Categorias (Id)
);

CREATE TABLE Pedidos (
    Id        INT IDENTITY(1,1) CONSTRAINT PK_Pedidos PRIMARY KEY,
    ClienteId INT NOT NULL CONSTRAINT FK_Pedidos_Clientes REFERENCES Clientes (Id),
    Data      DATETIME2 NOT NULL CONSTRAINT DF_Pedidos_Data DEFAULT SYSDATETIME(),
    Status    NVARCHAR(20) NOT NULL CONSTRAINT DF_Pedidos_Status DEFAULT 'Pendente'
              CONSTRAINT CK_Pedidos_Status CHECK (Status IN ('Pendente','Pago','Enviado','Entregue','Cancelado'))
);

CREATE TABLE ItensPedido (
    PedidoId      INT NOT NULL CONSTRAINT FK_ItensPedido_Pedidos REFERENCES Pedidos (Id) ON DELETE CASCADE,
    ProdutoId     INT NOT NULL CONSTRAINT FK_ItensPedido_Produtos REFERENCES Produtos (Id),
    Quantidade    INT NOT NULL CONSTRAINT CK_ItensPedido_Quantidade CHECK (Quantidade > 0),
    PrecoUnitario DECIMAL(10,2) NOT NULL,
    CONSTRAINT PK_ItensPedido PRIMARY KEY (PedidoId, ProdutoId)
);
GO

-- Dados de exemplo
INSERT INTO Categorias (Nome) VALUES
    (N'Eletrônicos'), (N'Móveis'), (N'Livros'), (N'Esportes');

INSERT INTO Clientes (Nome, Email, Cidade, Uf) VALUES
    (N'Ana Souza',      'ana@exemplo.com',     N'Recife',         'PE'),
    (N'Bruno Lima',     'bruno@exemplo.com',   N'São Paulo',      'SP'),
    (N'Carla Mendes',   'carla@exemplo.com',   N'Recife',         'PE'),
    (N'Diego Rocha',    'diego@exemplo.com',   N'Belo Horizonte', 'MG'),
    (N'Elisa Ferreira', 'elisa@exemplo.com',   NULL,              NULL);

INSERT INTO Produtos (Nome, Preco, Estoque, CategoriaId) VALUES
    (N'Notebook Pro',        4500.00, 12, 1),
    (N'Mouse sem fio',         80.00, 150, 1),
    (N'Teclado mecânico',     350.00, 40, 1),
    (N'Cadeira ergonômica',   900.00, 8,  2),
    (N'Mesa de escritório',  1200.00, 5,  2),
    (N'Código Limpo',          95.00, 30, 3),
    (N'Entendendo Algoritmos', 70.00, 25, 3),
    (N'Bola de futebol',      120.00, 0,  4);

INSERT INTO Pedidos (ClienteId, Data, Status) VALUES
    (1, '2026-10-01', 'Entregue'),
    (2, '2026-10-05', 'Entregue'),
    (1, '2026-10-20', 'Enviado'),
    (3, '2026-11-02', 'Pago'),
    (2, '2026-11-10', 'Pendente'),
    (4, '2026-11-12', 'Cancelado');

INSERT INTO ItensPedido (PedidoId, ProdutoId, Quantidade, PrecoUnitario) VALUES
    (1, 1, 1, 4500.00), (1, 2, 1, 80.00),
    (2, 4, 1, 900.00),
    (3, 6, 2, 95.00),   (3, 7, 1, 70.00),
    (4, 3, 1, 350.00),  (4, 2, 2, 80.00),
    (5, 5, 1, 1200.00),
    (6, 8, 3, 120.00);
GO
```

O `N` antes das strings (`N'Eletrônicos'`) indica texto Unicode, necessário para colunas `NVARCHAR` com acentos.

### Exercícios da Parte 3

1. Classifique cada relacionamento como 1:1, 1:N ou N:N, e diga onde fica a chave estrangeira:
   - Pessoa e CPF
   - Autor e Livro
   - Time e Jogador
   - Médico e Paciente (considerando consultas)
   - Post e Comentário
2. No `EscolaDb`, crie a tabela associativa `Matriculas` entre `Alunos` e `Turmas`, com `DataMatricula` e `NotaFinal` (pode ser nula).
3. Desenhe o DER de um sistema de biblioteca: livros, autores (um livro pode ter vários autores), usuários e empréstimos.
4. Crie as tabelas do exercício 3 com todas as chaves e restrições.

---

## Parte 4: Manipulando dados (DML)

### 4.1 INSERT

```sql
-- Uma linha (sempre liste as colunas)
INSERT INTO Clientes (Nome, Email, Cidade, Uf)
VALUES (N'Fábio Alves', 'fabio@exemplo.com', N'Olinda', 'PE');

-- Várias linhas
INSERT INTO Categorias (Nome) VALUES (N'Games'), (N'Brinquedos');

-- Descobrir o Id gerado
INSERT INTO Categorias (Nome) VALUES (N'Jardinagem');
SELECT SCOPE_IDENTITY() AS NovoId;

-- Ou devolver as colunas inseridas
INSERT INTO Categorias (Nome)
OUTPUT INSERTED.Id, INSERTED.Nome
VALUES (N'Pet Shop');

-- Inserir a partir de uma consulta (ex.: copiar clientes de PE para uma tabela de backup)
CREATE TABLE ClientesBackup (Nome NVARCHAR(100), Email NVARCHAR(150));
INSERT INTO ClientesBackup (Nome, Email)
SELECT Nome, Email FROM Clientes WHERE Uf = 'PE';
```

> Liste sempre as colunas no `INSERT`. `INSERT INTO Clientes VALUES (...)` quebra no dia em que alguém adicionar uma coluna à tabela.

### 4.2 UPDATE

```sql
-- Atualizar um registro
UPDATE Produtos
SET Preco = 4299.90, Estoque = 10
WHERE Id = 1;

-- Atualizar vários: aumento de 10% nos móveis
UPDATE Produtos
SET Preco = Preco * 1.10
WHERE CategoriaId = 2;
```

### 4.3 DELETE

```sql
DELETE FROM Clientes WHERE Id = 6;
```

> ⚠️ **O erro mais famoso do SQL:** um `UPDATE` ou `DELETE` **sem `WHERE`** afeta **todas as linhas** da tabela.
>
> ```sql
> DELETE FROM Clientes;          -- apaga TODOS os clientes
> UPDATE Produtos SET Preco = 0; -- zera o preço de TODOS os produtos
> ```
>
> **Hábito de segurança:** antes de um `UPDATE` ou `DELETE`, escreva um `SELECT` com o mesmo `WHERE` e confira quais linhas serão afetadas. Só depois troque o `SELECT` pelo comando.

### 4.4 Exclusão lógica (soft delete)

Em muitos sistemas, os dados não são realmente apagados: marca-se o registro como inativo. Isso preserva o histórico e permite recuperar exclusões acidentais.

```sql
ALTER TABLE Clientes ADD Ativo BIT NOT NULL DEFAULT 1;

-- "Excluir"
UPDATE Clientes SET Ativo = 0 WHERE Id = 5;

-- As consultas passam a filtrar
SELECT * FROM Clientes WHERE Ativo = 1;
```

### 4.5 Transações

Uma **transação** agrupa vários comandos numa unidade indivisível: ou **todos** acontecem, ou **nenhum** acontece.

Exemplo clássico: uma transferência bancária tira dinheiro de uma conta e coloca em outra. Se o sistema cair entre as duas operações, o dinheiro não pode sumir.

```sql
BEGIN TRY
    BEGIN TRANSACTION;

    -- Cria o pedido
    INSERT INTO Pedidos (ClienteId, Status) VALUES (3, 'Pendente');
    DECLARE @PedidoId INT = SCOPE_IDENTITY();

    -- Adiciona o item
    INSERT INTO ItensPedido (PedidoId, ProdutoId, Quantidade, PrecoUnitario)
    VALUES (@PedidoId, 4, 2, 900.00);

    -- Baixa o estoque (falha pelo CHECK se o estoque ficar negativo)
    UPDATE Produtos SET Estoque = Estoque - 2 WHERE Id = 4;

    COMMIT;          -- confirma tudo
END TRY
BEGIN CATCH
    ROLLBACK;        -- desfaz tudo
    PRINT 'Erro: ' + ERROR_MESSAGE();
END CATCH;
```

**Propriedades ACID** das transações:

| Letra | Propriedade | Significado |
|-------|-------------|-------------|
| **A** | Atomicidade | Tudo ou nada |
| **C** | Consistência | O banco vai de um estado válido para outro estado válido (restrições respeitadas) |
| **I** | Isolamento | Transações simultâneas não interferem entre si |
| **D** | Durabilidade | Depois do `COMMIT`, os dados não se perdem, mesmo se o servidor cair |

> O `SaveChanges()` do Entity Framework (Guia 1) executa todas as alterações pendentes dentro de uma transação automaticamente.

### Exercícios da Parte 4

1. Cadastre três alunos, dois cursos e duas turmas no `EscolaDb`.
2. Matricule os alunos nas turmas.
3. Atualize a nota final de um aluno. Antes, faça o `SELECT` de conferência.
4. Escreva uma transação que matricule um aluno numa turma e diminua `VagasDisponiveis` (crie essa coluna), desfazendo tudo se não houver vagas.
5. Implemente exclusão lógica na tabela `Alunos`.

---

## Parte 5: Consultando dados

O `SELECT` é o comando que você mais vai escrever na vida.

### 5.1 SELECT básico

```sql
-- Todas as colunas (bom para explorar; evite em código de produção)
SELECT * FROM Produtos;

-- Colunas específicas
SELECT Nome, Preco FROM Produtos;

-- Apelidos (alias) e cálculos
SELECT
    Nome AS Produto,
    Preco,
    Preco * 0.9 AS PrecoComDesconto,
    Preco * Estoque AS ValorEmEstoque
FROM Produtos;

-- Valores distintos
SELECT DISTINCT Cidade FROM Clientes;

-- Primeiras N linhas
SELECT TOP 3 Nome, Preco FROM Produtos ORDER BY Preco DESC;
```

### 5.2 WHERE: filtrando linhas

```sql
SELECT * FROM Produtos WHERE Preco > 500;
SELECT * FROM Produtos WHERE CategoriaId = 1 AND Estoque > 0;
SELECT * FROM Clientes WHERE Uf = 'PE' OR Uf = 'SP';
SELECT * FROM Produtos WHERE NOT CategoriaId = 3;

-- Intervalo (inclusivo)
SELECT * FROM Produtos WHERE Preco BETWEEN 100 AND 1000;

-- Lista de valores
SELECT * FROM Clientes WHERE Uf IN ('PE', 'SP', 'MG');

-- Padrões de texto: % = qualquer sequência, _ = um caractere
SELECT * FROM Produtos WHERE Nome LIKE N'Note%';      -- começa com "Note"
SELECT * FROM Produtos WHERE Nome LIKE N'%sem fio%';  -- contém "sem fio"
SELECT * FROM Clientes WHERE Email LIKE '%@exemplo.com';

-- Nulos
SELECT * FROM Clientes WHERE Cidade IS NULL;

-- Datas
SELECT * FROM Pedidos WHERE Data >= '2026-11-01';
```

**Ordem de precedência:** `NOT`, depois `AND`, depois `OR`. Use parênteses para deixar claro:

```sql
-- Produtos da categoria 1 OU 2 que têm estoque
SELECT * FROM Produtos
WHERE (CategoriaId = 1 OR CategoriaId = 2) AND Estoque > 0;
```

### 5.3 ORDER BY: ordenando

```sql
SELECT Nome, Preco FROM Produtos ORDER BY Preco;               -- crescente (ASC é o padrão)
SELECT Nome, Preco FROM Produtos ORDER BY Preco DESC;          -- decrescente
SELECT Nome, Cidade FROM Clientes ORDER BY Cidade, Nome;       -- por cidade, depois por nome
```

Sem `ORDER BY`, o banco **não garante** nenhuma ordem nos resultados.

### 5.4 Paginação

```sql
-- Página 2, com 3 itens por página
SELECT Id, Nome, Preco
FROM Produtos
ORDER BY Nome
OFFSET 3 ROWS            -- pula (página - 1) * tamanho
FETCH NEXT 3 ROWS ONLY;  -- pega "tamanho" linhas
```

É exatamente isso que a paginação da API (Guia 1, Parte 4) faz por baixo dos panos.

### 5.5 Funções úteis

```sql
-- Texto
SELECT
    UPPER(Nome)               AS Maiusculo,
    LOWER(Email)              AS Minusculo,
    LEN(Nome)                 AS Tamanho,
    LEFT(Nome, 3)             AS TresPrimeiras,
    SUBSTRING(Nome, 1, 5)     AS Trecho,
    REPLACE(Nome, ' ', '_')   AS SemEspacos,
    TRIM('  texto  ')         AS SemEspacosNasPontas,
    CONCAT(Nome, ' - ', Cidade) AS NomeCidade
FROM Clientes;

-- Números
SELECT ROUND(123.456, 2), CEILING(4.1), FLOOR(4.9), ABS(-10);

-- Datas
SELECT
    GETDATE()                            AS Agora,
    YEAR(Data)                           AS Ano,
    MONTH(Data)                          AS Mes,
    DATEADD(DAY, 7, Data)                AS UmaSemanaDepois,
    DATEDIFF(DAY, Data, GETDATE())       AS DiasDesdeOPedido,
    FORMAT(Data, 'dd/MM/yyyy')           AS DataFormatada
FROM Pedidos;

-- Tratando nulos
SELECT Nome, ISNULL(Cidade, N'Não informada') AS Cidade FROM Clientes;
SELECT Nome, COALESCE(Cidade, Uf, N'?') AS Local FROM Clientes;   -- primeiro não nulo

-- Condicional
SELECT
    Nome,
    Preco,
    CASE
        WHEN Preco < 100  THEN N'Barato'
        WHEN Preco < 1000 THEN N'Médio'
        ELSE N'Caro'
    END AS Faixa
FROM Produtos;
```

### 5.6 Funções de agregação

Agregações resumem várias linhas em um único valor:

```sql
SELECT
    COUNT(*)        AS TotalProdutos,
    COUNT(CategoriaId) AS ComCategoria,   -- COUNT(coluna) ignora NULLs
    SUM(Estoque)    AS UnidadesEmEstoque,
    AVG(Preco)      AS PrecoMedio,
    MIN(Preco)      AS MaisBarato,
    MAX(Preco)      AS MaisCaro
FROM Produtos;
```

### 5.7 GROUP BY e HAVING

`GROUP BY` agrupa linhas com o mesmo valor e aplica a agregação **em cada grupo**:

```sql
-- Quantidade de produtos e preço médio por categoria
SELECT
    CategoriaId,
    COUNT(*)   AS Quantidade,
    AVG(Preco) AS PrecoMedio
FROM Produtos
GROUP BY CategoriaId;

-- Clientes por estado
SELECT Uf, COUNT(*) AS Clientes
FROM Clientes
GROUP BY Uf
ORDER BY Clientes DESC;
```

> **Regra:** toda coluna no `SELECT` que não está dentro de uma função de agregação precisa estar no `GROUP BY`.

`HAVING` filtra **grupos** (depois da agregação), enquanto `WHERE` filtra **linhas** (antes):

```sql
-- Categorias com mais de um produto em estoque e preço médio acima de 100
SELECT CategoriaId, COUNT(*) AS Quantidade, AVG(Preco) AS PrecoMedio
FROM Produtos
WHERE Estoque > 0              -- filtra linhas antes de agrupar
GROUP BY CategoriaId
HAVING COUNT(*) > 1            -- filtra grupos depois de agrupar
ORDER BY PrecoMedio DESC;
```

### 5.8 A ordem de execução de um SELECT

Escrevemos o `SELECT` numa ordem, mas o banco executa em outra. Entender isso explica muitos erros:

| Ordem em que **escrevemos** | Ordem em que o banco **executa** |
|----|----|
| 1. `SELECT` | 1. `FROM` / `JOIN` (de onde vêm os dados) |
| 2. `FROM` | 2. `WHERE` (filtra linhas) |
| 3. `WHERE` | 3. `GROUP BY` (agrupa) |
| 4. `GROUP BY` | 4. `HAVING` (filtra grupos) |
| 5. `HAVING` | 5. `SELECT` (escolhe e calcula colunas) |
| 6. `ORDER BY` | 6. `ORDER BY` (ordena) |
| | 7. `OFFSET` / `FETCH` / `TOP` |

Por isso não dá para usar no `WHERE` um alias criado no `SELECT` (o `WHERE` executa antes), mas dá para usar no `ORDER BY`.

### 5.9 Subconsultas

Uma consulta dentro de outra:

```sql
-- Produtos mais caros que a média
SELECT Nome, Preco
FROM Produtos
WHERE Preco > (SELECT AVG(Preco) FROM Produtos);

-- Clientes que nunca fizeram pedido
SELECT Nome
FROM Clientes
WHERE Id NOT IN (SELECT ClienteId FROM Pedidos);

-- Mesma ideia com EXISTS (geralmente mais eficiente)
SELECT c.Nome
FROM Clientes c
WHERE NOT EXISTS (SELECT 1 FROM Pedidos p WHERE p.ClienteId = c.Id);
```

### Exercícios da Parte 5

Use o banco `LojaDb`:

1. Liste nome e preço dos produtos com estoque zerado.
2. Liste os clientes de Pernambuco em ordem alfabética.
3. Liste os produtos cujo nome contém a letra "a", do mais caro para o mais barato.
4. Mostre o valor total em estoque (preço × estoque) de toda a loja.
5. Mostre quantos pedidos existem em cada status.
6. Mostre a quantidade de produtos por categoria, apenas das categorias com 2 ou mais produtos.
7. Liste os produtos com uma coluna "Situação": "Esgotado" se estoque = 0, "Últimas unidades" se estoque < 10, "Disponível" nos demais casos.
8. Liste os pedidos feitos em novembro de 2026.
9. Liste os produtos que nunca foram vendidos.

---

## Parte 6: Juntando tabelas (JOIN)

Os dados ficam espalhados em várias tabelas (Parte 7 explica o porquê). O `JOIN` **combina** linhas de tabelas diferentes com base no relacionamento entre elas.

### 6.1 INNER JOIN

Retorna apenas as linhas que têm **correspondência nas duas tabelas**.

```sql
-- Produtos com o nome da categoria
SELECT
    p.Nome  AS Produto,
    c.Nome  AS Categoria,
    p.Preco
FROM Produtos p                         -- "p" é um alias para a tabela
INNER JOIN Categorias c ON c.Id = p.CategoriaId;
```

O `ON` diz como as tabelas se ligam: chave estrangeira = chave primária.

```
   Produtos         Categorias
  ┌─────────┐      ┌─────────┐
  │       ┌─┼──────┼─┐       │
  │       │█│██████│█│       │     INNER JOIN: só a interseção
  │       └─┼──────┼─┘       │
  └─────────┘      └─────────┘
```

### 6.2 LEFT JOIN

Retorna **todas** as linhas da tabela da esquerda, e as correspondentes da direita. Quando não há correspondência, as colunas da direita vêm como `NULL`.

```sql
-- Todos os clientes, com seus pedidos (se tiverem)
SELECT c.Nome, p.Id AS PedidoId, p.Data
FROM Clientes c
LEFT JOIN Pedidos p ON p.ClienteId = c.Id
ORDER BY c.Nome;
```

A cliente Elisa aparece com `PedidoId` e `Data` nulos, porque não fez pedidos. Com `INNER JOIN`, ela não apareceria.

```
  ┌─────────┐      ┌─────────┐
  │█████████┼──────┼─┐       │
  │█████████│██████│█│       │     LEFT JOIN: toda a esquerda + interseção
  │█████████┼──────┼─┘       │
  └─────────┘      └─────────┘
```

**Encontrando registros sem correspondência** (o uso mais clássico do LEFT JOIN):

```sql
-- Clientes que nunca compraram
SELECT c.Nome
FROM Clientes c
LEFT JOIN Pedidos p ON p.ClienteId = c.Id
WHERE p.Id IS NULL;
```

### 6.3 RIGHT JOIN e FULL JOIN

- **RIGHT JOIN:** o espelho do LEFT JOIN (todas as linhas da direita). Na prática, quase sempre se reescreve como LEFT JOIN invertendo as tabelas.
- **FULL OUTER JOIN:** todas as linhas das duas tabelas, com `NULL` onde não há correspondência.

| JOIN | Retorna |
|------|---------|
| `INNER JOIN` | Só o que combina nas duas |
| `LEFT JOIN` | Tudo da esquerda + o que combina da direita |
| `RIGHT JOIN` | Tudo da direita + o que combina da esquerda |
| `FULL JOIN` | Tudo das duas |
| `CROSS JOIN` | Todas as combinações possíveis (produto cartesiano) |

### 6.4 Juntando várias tabelas

```sql
-- Detalhe completo dos pedidos: cliente, produto, categoria, quantidade e subtotal
SELECT
    pe.Id                              AS Pedido,
    pe.Data,
    cl.Nome                            AS Cliente,
    pr.Nome                            AS Produto,
    ca.Nome                            AS Categoria,
    ip.Quantidade,
    ip.PrecoUnitario,
    ip.Quantidade * ip.PrecoUnitario   AS Subtotal
FROM Pedidos pe
INNER JOIN Clientes    cl ON cl.Id = pe.ClienteId
INNER JOIN ItensPedido ip ON ip.PedidoId = pe.Id
INNER JOIN Produtos    pr ON pr.Id = ip.ProdutoId
INNER JOIN Categorias  ca ON ca.Id = pr.CategoriaId
ORDER BY pe.Id;
```

Siga o caminho do DER: Pedidos → Clientes, Pedidos → ItensPedido → Produtos → Categorias.

### 6.5 JOIN + GROUP BY: relatórios

É aqui que o SQL mostra seu poder: perguntas de negócio respondidas em poucas linhas.

```sql
-- Total de cada pedido
SELECT
    pe.Id AS Pedido,
    cl.Nome AS Cliente,
    SUM(ip.Quantidade * ip.PrecoUnitario) AS Total
FROM Pedidos pe
INNER JOIN Clientes cl    ON cl.Id = pe.ClienteId
INNER JOIN ItensPedido ip ON ip.PedidoId = pe.Id
GROUP BY pe.Id, cl.Nome
ORDER BY Total DESC;

-- Quanto cada cliente já gastou (excluindo pedidos cancelados), incluindo quem não comprou
SELECT
    cl.Nome,
    COUNT(DISTINCT pe.Id)                              AS Pedidos,
    COALESCE(SUM(ip.Quantidade * ip.PrecoUnitario), 0) AS TotalGasto
FROM Clientes cl
LEFT JOIN Pedidos pe     ON pe.ClienteId = cl.Id AND pe.Status <> 'Cancelado'
LEFT JOIN ItensPedido ip ON ip.PedidoId = pe.Id
GROUP BY cl.Id, cl.Nome
ORDER BY TotalGasto DESC;

-- Faturamento por categoria
SELECT
    ca.Nome AS Categoria,
    SUM(ip.Quantidade)                    AS UnidadesVendidas,
    SUM(ip.Quantidade * ip.PrecoUnitario) AS Faturamento
FROM Categorias ca
INNER JOIN Produtos pr    ON pr.CategoriaId = ca.Id
INNER JOIN ItensPedido ip ON ip.ProdutoId = pr.Id
INNER JOIN Pedidos pe     ON pe.Id = ip.PedidoId
WHERE pe.Status <> 'Cancelado'
GROUP BY ca.Nome
ORDER BY Faturamento DESC;
```

Repare no segundo exemplo: a condição `pe.Status <> 'Cancelado'` está no `ON`, não no `WHERE`. Se estivesse no `WHERE`, os clientes sem pedidos (com `Status` nulo) seriam eliminados, e o `LEFT JOIN` viraria, na prática, um `INNER JOIN`.

### Exercícios da Parte 6

1. Liste todos os produtos com o nome da categoria.
2. Liste todos os pedidos com o nome e a cidade do cliente.
3. Liste as categorias que não têm nenhum produto.
4. Mostre o produto mais vendido (em quantidade).
5. Mostre o faturamento por mês.
6. Mostre o ticket médio (valor médio por pedido) por estado do cliente.
7. Liste os clientes que compraram algum produto da categoria "Livros".
8. No `EscolaDb`, liste cada turma com o nome do curso, a quantidade de alunos matriculados e a média das notas.

---

## Parte 7: Normalização

### 7.1 O problema

Imagine guardar tudo numa única tabela:

| PedidoId | Data | ClienteNome | ClienteEmail | ClienteCidade | Produtos |
|----------|------|-------------|--------------|---------------|----------|
| 1 | 01/10 | Ana Souza | ana@ex.com | Recife | Notebook, Mouse |
| 3 | 20/10 | Ana Souza | ana@ex.com | Recife | Código Limpo, Entendendo Algoritmos |
| 4 | 02/11 | Ana Souza | ana@exemplo.com | Recif | Teclado |

Problemas:
- **Redundância:** os dados da Ana estão repetidos em cada pedido.
- **Anomalia de atualização:** se a Ana mudar de e-mail, é preciso alterar várias linhas. Esqueça uma e os dados ficam inconsistentes (veja a linha do pedido 4).
- **Anomalia de inserção:** não dá para cadastrar um cliente sem um pedido.
- **Anomalia de exclusão:** excluir o único pedido de um cliente apaga o cliente junto.
- **Valores múltiplos:** a coluna `Produtos` guarda uma lista. Como contar quantos notebooks foram vendidos?

**Normalização** é o processo de organizar as tabelas para eliminar esses problemas. Ela segue uma série de **formas normais**.

### 7.2 Primeira Forma Normal (1FN)

> Cada coluna guarda **um único valor atômico**, e não há grupos repetidos.

❌ `Produtos = "Notebook, Mouse"`, ou colunas `Telefone1`, `Telefone2`, `Telefone3`.

✅ Cada produto do pedido vira uma linha em outra tabela (`ItensPedido`). Telefones vão para uma tabela `Telefones` com `ClienteId`.

### 7.3 Segunda Forma Normal (2FN)

> Está na 1FN, e toda coluna que não é chave depende da chave primária **inteira** (vale para chaves compostas).

❌ Em `ItensPedido (PedidoId, ProdutoId, Quantidade, NomeProduto)`, o `NomeProduto` depende só do `ProdutoId`, não do par `(PedidoId, ProdutoId)`.

✅ `NomeProduto` fica na tabela `Produtos`.

### 7.4 Terceira Forma Normal (3FN)

> Está na 2FN, e nenhuma coluna que não é chave depende de **outra coluna que não é chave**.

❌ Em `Pedidos (Id, ClienteId, ClienteNome, ClienteEmail)`, o `ClienteNome` depende do `ClienteId`, não do `Id` do pedido.

✅ Os dados do cliente ficam em `Clientes`; o pedido guarda só o `ClienteId`.

**Resumo para memorizar:** cada coluna deve depender "da chave, da chave inteira, e de nada além da chave".

### 7.5 Desnormalização

Às vezes, de propósito, aceitamos alguma redundância:
- **Desempenho:** guardar o `Total` no pedido evita somar os itens a cada consulta.
- **Histórico:** o `PrecoUnitario` em `ItensPedido` (Parte 3) parece redundante, mas registra o preço do momento da venda. Não é uma falha de normalização, é uma regra de negócio.

Normalize primeiro. Desnormalize só com um motivo claro.

### Exercícios da Parte 7

1. Normalize até a 3FN a tabela abaixo, de um sistema de consultas médicas:

   | ConsultaId | Data | PacienteNome | PacienteCpf | PacienteTelefones | MedicoNome | MedicoCrm | Especialidade | ValorConsulta |
   |---|---|---|---|---|---|---|---|---|

2. Identifique os problemas de normalização de uma planilha que você usa no dia a dia (controle de gastos, notas, estoque) e proponha as tabelas.

---

## Parte 8: Índices e desempenho

### 8.1 O que é um índice

Imagine procurar o assunto "recursão" num livro de 800 páginas sem índice: você teria que folhear página por página. Com o índice remissivo no fim do livro, você encontra a página em segundos.

Um **índice** de banco de dados funciona do mesmo jeito: é uma estrutura auxiliar, ordenada, que permite encontrar linhas sem ler a tabela inteira.

Sem índice, o banco faz um **table scan** (lê todas as linhas, uma busca linear, O(n)). Com índice, faz um **seek** (navega direto até o dado, O(log n)). Lembra da diferença entre busca linear e busca binária do Guia 1? É exatamente isso.

### 8.2 Como funciona: a B-Tree

Os índices do SQL Server são organizados numa estrutura chamada **árvore B** (*B-Tree*), que mantém os valores ordenados e equilibrados:

```
                       ┌───────────────┐
                       │   [M]         │              raiz
                       └──┬─────────┬──┘
               ┌──────────┘         └──────────┐
        ┌──────┴──────┐                 ┌──────┴──────┐
        │  [D]   [H]  │                 │  [R]   [W]  │   nível intermediário
        └─┬────┬────┬─┘                 └─┬────┬────┬─┘
          ▼    ▼    ▼                     ▼    ▼    ▼
        A-C  D-G  H-L                   M-Q  R-V  W-Z      folhas (os dados ou ponteiros)
```

Para achar "Pedro", o banco vai da raiz (`P > M`, direita) ao nível intermediário (`P < R`, esquerda) e chega à folha `M-Q`. Três passos em vez de ler a tabela inteira. Numa tabela de 10 milhões de linhas, uma busca por índice leva cerca de 4 ou 5 leituras.

### 8.3 Índice clusterizado x não clusterizado

| | Clusterizado (*clustered*) | Não clusterizado (*nonclustered*) |
|--|----------------------------|-----------------------------------|
| O que é | Define a **ordem física** das linhas na tabela | Estrutura separada, com ponteiros para as linhas |
| Quantos por tabela | **Apenas um** | Vários (até 999) |
| Analogia | Lista telefônica: os dados já estão em ordem alfabética | Índice remissivo de um livro: aponta para a página |
| Criado automaticamente | Pela `PRIMARY KEY` (por padrão) | Pela restrição `UNIQUE` |

Quando você cria uma `PRIMARY KEY`, o SQL Server cria automaticamente um índice clusterizado nela. Por isso buscas por `Id` são sempre rápidas.

### 8.4 Criando índices

```sql
-- Índice simples: acelera buscas e ordenações por nome
CREATE NONCLUSTERED INDEX IX_Produtos_Nome
    ON Produtos (Nome);

-- Índice em chave estrangeira (o SQL Server NÃO cria automaticamente!)
CREATE INDEX IX_Pedidos_ClienteId ON Pedidos (ClienteId);
CREATE INDEX IX_Produtos_CategoriaId ON Produtos (CategoriaId);
CREATE INDEX IX_ItensPedido_ProdutoId ON ItensPedido (ProdutoId);

-- Índice único
CREATE UNIQUE INDEX UX_Clientes_Email ON Clientes (Email);

-- Índice composto: a ORDEM das colunas importa
CREATE INDEX IX_Pedidos_ClienteId_Data ON Pedidos (ClienteId, Data);

-- Índice de cobertura: INCLUDE guarda colunas extras na folha do índice,
-- evitando ir à tabela para buscá-las
CREATE INDEX IX_Produtos_CategoriaId_Cobertura
    ON Produtos (CategoriaId)
    INCLUDE (Nome, Preco);

-- Índice filtrado: só para parte das linhas
CREATE INDEX IX_Pedidos_Pendentes
    ON Pedidos (Data)
    WHERE Status = 'Pendente';

-- Remover
DROP INDEX IX_Produtos_Nome ON Produtos;
```

**A ordem das colunas num índice composto:** o índice `(ClienteId, Data)` funciona como uma lista telefônica ordenada por sobrenome e depois por nome. Ele ajuda em buscas por `ClienteId` e por `ClienteId + Data`, mas **não** ajuda numa busca só por `Data` (seria como procurar todos os "Joãos" numa lista ordenada por sobrenome).

### 8.5 Quando criar índices

**Crie índices em colunas que aparecem com frequência em:**
- `WHERE` (filtros)
- `JOIN ... ON` (principalmente chaves estrangeiras)
- `ORDER BY` e `GROUP BY`

**Índices não são de graça:**
- Ocupam espaço em disco.
- **Deixam `INSERT`, `UPDATE` e `DELETE` mais lentos**, porque cada índice também precisa ser atualizado.
- Índices demais confundem o otimizador e desperdiçam recursos.

**Evite índices em:**
- Tabelas muito pequenas (o table scan já é rápido).
- Colunas com poucos valores distintos, como `BIT` ou `Sexo` (baixa **seletividade**: o índice não elimina linhas suficientes).
- Colunas que mudam o tempo todo.

### 8.6 Consultas que não aproveitam índices

Mesmo com índice, algumas formas de escrever a consulta impedem o banco de usá-lo:

```sql
-- ❌ Função na coluna: o banco precisa calcular para cada linha
SELECT * FROM Pedidos WHERE YEAR(Data) = 2026;
-- ✅ Intervalo direto na coluna
SELECT * FROM Pedidos WHERE Data >= '2026-01-01' AND Data < '2027-01-01';

-- ❌ Curinga no início: não dá para usar a ordem do índice
SELECT * FROM Produtos WHERE Nome LIKE '%book';
-- ✅ Curinga no fim usa o índice
SELECT * FROM Produtos WHERE Nome LIKE 'Note%';

-- ❌ Operação sobre a coluna
SELECT * FROM Produtos WHERE Preco * 1.1 > 1000;
-- ✅ Operação sobre a constante
SELECT * FROM Produtos WHERE Preco > 1000 / 1.1;
```

### 8.7 Plano de execução

O **plano de execução** mostra como o SQL Server decidiu executar sua consulta. No SSMS, pressione **Ctrl+M** (*Include Actual Execution Plan*) antes de executar.

Procure por:
- **Index Seek:** ótimo, usou o índice para ir direto aos dados.
- **Index Scan / Table Scan / Clustered Index Scan:** leu o índice ou a tabela inteira. Em tabelas grandes, é um sinal de alerta.
- **Key Lookup:** achou no índice, mas precisou voltar à tabela buscar outras colunas. Um `INCLUDE` pode resolver.
- **Avisos de índice ausente** (*Missing Index*): o SSMS sugere índices que ajudariam.

Também é útil medir:

```sql
SET STATISTICS IO ON;    -- mostra quantas páginas foram lidas
SET STATISTICS TIME ON;  -- mostra o tempo gasto
```

### 8.8 Boas práticas de desempenho

- Selecione só as colunas necessárias (evite `SELECT *`).
- Pagine resultados grandes.
- Crie índices nas chaves estrangeiras.
- Use os tipos de dados corretos e com o menor tamanho adequado.
- Cuidado com o **problema N+1** em ORMs: buscar 100 pedidos e depois fazer uma consulta para cada um buscar o cliente gera 101 consultas. No EF Core, use `Include` (Guia 1, seção 4.8) para gerar um único JOIN.

### Exercícios da Parte 8

1. Liste os índices existentes no `LojaDb`:
   ```sql
   SELECT t.name AS Tabela, i.name AS Indice, i.type_desc AS Tipo
   FROM sys.indexes i
   JOIN sys.tables t ON t.object_id = i.object_id
   WHERE i.name IS NOT NULL
   ORDER BY t.name;
   ```
2. Crie índices em todas as chaves estrangeiras do `LojaDb`.
3. Gere uma tabela grande para testar:
   ```sql
   CREATE TABLE Logs (Id INT IDENTITY PRIMARY KEY, Usuario NVARCHAR(50), Acao NVARCHAR(50), Data DATETIME2);

   INSERT INTO Logs (Usuario, Acao, Data)
   SELECT TOP 500000
       CONCAT('usuario', ABS(CHECKSUM(NEWID())) % 1000),
       CHOOSE(ABS(CHECKSUM(NEWID())) % 3 + 1, 'login', 'logout', 'compra'),
       DATEADD(MINUTE, -ABS(CHECKSUM(NEWID())) % 525600, SYSDATETIME())
   FROM sys.all_objects a CROSS JOIN sys.all_objects b;
   ```
   Execute `SELECT * FROM Logs WHERE Usuario = 'usuario42'` com o plano de execução e `STATISTICS IO` ligados. Crie um índice em `Usuario` e compare.
4. Reescreva a consulta `WHERE YEAR(Data) = 2026 AND MONTH(Data) = 11` para que ela possa usar um índice em `Data`.

---

## Parte 9: Recursos avançados

### 9.1 Views

Uma **view** é uma consulta salva com um nome, que pode ser usada como se fosse uma tabela. Simplifica consultas complexas e pode esconder colunas sensíveis.

```sql
CREATE VIEW vw_PedidosResumo AS
SELECT
    pe.Id AS PedidoId,
    pe.Data,
    pe.Status,
    cl.Nome AS Cliente,
    SUM(ip.Quantidade * ip.PrecoUnitario) AS Total
FROM Pedidos pe
INNER JOIN Clientes cl    ON cl.Id = pe.ClienteId
INNER JOIN ItensPedido ip ON ip.PedidoId = pe.Id
GROUP BY pe.Id, pe.Data, pe.Status, cl.Nome;
GO

SELECT * FROM vw_PedidosResumo WHERE Total > 500 ORDER BY Data;
```

### 9.2 Stored procedures

Uma **stored procedure** é um bloco de código T-SQL salvo no banco, com parâmetros, que pode conter vários comandos, variáveis, condições e transações.

```sql
CREATE OR ALTER PROCEDURE sp_RegistrarVenda
    @ClienteId  INT,
    @ProdutoId  INT,
    @Quantidade INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Preco DECIMAL(10,2), @Estoque INT;

    SELECT @Preco = Preco, @Estoque = Estoque
    FROM Produtos WHERE Id = @ProdutoId;

    IF @Preco IS NULL
        THROW 50001, 'Produto não encontrado.', 1;

    IF @Estoque < @Quantidade
        THROW 50002, 'Estoque insuficiente.', 1;

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO Pedidos (ClienteId, Status) VALUES (@ClienteId, 'Pago');
        DECLARE @PedidoId INT = SCOPE_IDENTITY();

        INSERT INTO ItensPedido (PedidoId, ProdutoId, Quantidade, PrecoUnitario)
        VALUES (@PedidoId, @ProdutoId, @Quantidade, @Preco);

        UPDATE Produtos SET Estoque = Estoque - @Quantidade WHERE Id = @ProdutoId;

        COMMIT;
        SELECT @PedidoId AS PedidoId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        THROW;
    END CATCH
END;
GO

EXEC sp_RegistrarVenda @ClienteId = 1, @ProdutoId = 2, @Quantidade = 3;
```

> **Onde colocar a regra de negócio?** Em sistemas modernos com ORM, a tendência é manter as regras na aplicação (C#), que é mais fácil de testar e versionar. Stored procedures ainda são muito usadas em sistemas legados e em operações pesadas de dados. Você vai encontrar as duas abordagens no mercado.

### 9.3 Functions

Retornam um valor (escalar) ou uma tabela:

```sql
CREATE OR ALTER FUNCTION fn_TotalPedido (@PedidoId INT)
RETURNS DECIMAL(12,2)
AS
BEGIN
    RETURN (
        SELECT COALESCE(SUM(Quantidade * PrecoUnitario), 0)
        FROM ItensPedido WHERE PedidoId = @PedidoId
    );
END;
GO

SELECT Id, dbo.fn_TotalPedido(Id) AS Total FROM Pedidos;
```

### 9.4 Triggers

Um **trigger** executa automaticamente quando ocorre um `INSERT`, `UPDATE` ou `DELETE`. Útil para auditoria:

```sql
CREATE TABLE HistoricoPrecos (
    Id          INT IDENTITY PRIMARY KEY,
    ProdutoId   INT NOT NULL,
    PrecoAntigo DECIMAL(10,2),
    PrecoNovo   DECIMAL(10,2),
    AlteradoEm  DATETIME2 DEFAULT SYSDATETIME()
);
GO

CREATE OR ALTER TRIGGER trg_Produtos_HistoricoPreco
ON Produtos
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO HistoricoPrecos (ProdutoId, PrecoAntigo, PrecoNovo)
    SELECT d.Id, d.Preco, i.Preco
    FROM deleted d                       -- valores antes da alteração
    INNER JOIN inserted i ON i.Id = d.Id -- valores depois da alteração
    WHERE d.Preco <> i.Preco;
END;
```

> Use triggers com moderação: são "invisíveis" para quem lê o código da aplicação e podem causar comportamentos difíceis de depurar.

### 9.5 CTEs (Common Table Expressions)

Uma **CTE** dá nome a uma subconsulta temporária, deixando consultas complexas mais legíveis:

```sql
WITH TotaisPorCliente AS (
    SELECT
        pe.ClienteId,
        SUM(ip.Quantidade * ip.PrecoUnitario) AS Total
    FROM Pedidos pe
    INNER JOIN ItensPedido ip ON ip.PedidoId = pe.Id
    WHERE pe.Status <> 'Cancelado'
    GROUP BY pe.ClienteId
)
SELECT c.Nome, t.Total
FROM TotaisPorCliente t
INNER JOIN Clientes c ON c.Id = t.ClienteId
WHERE t.Total > (SELECT AVG(Total) FROM TotaisPorCliente);   -- clientes acima da média
```

### 9.6 Funções de janela (window functions)

Calculam valores sobre um conjunto de linhas relacionadas **sem agrupar** o resultado:

```sql
SELECT
    Nome,
    CategoriaId,
    Preco,
    ROW_NUMBER() OVER (ORDER BY Preco DESC)                          AS PosicaoGeral,
    RANK()       OVER (PARTITION BY CategoriaId ORDER BY Preco DESC) AS PosicaoNaCategoria,
    AVG(Preco)   OVER (PARTITION BY CategoriaId)                     AS MediaDaCategoria
FROM Produtos;

-- O produto mais caro de cada categoria
WITH Ranking AS (
    SELECT Nome, CategoriaId, Preco,
           ROW_NUMBER() OVER (PARTITION BY CategoriaId ORDER BY Preco DESC) AS Posicao
    FROM Produtos
)
SELECT * FROM Ranking WHERE Posicao = 1;
```

### 9.7 Segurança e permissões

```sql
-- Criar um login (no servidor) e um usuário (no banco) para a aplicação
CREATE LOGIN app_loja WITH PASSWORD = 'Uma$enhaForte2026!';
GO
USE LojaDb;
CREATE USER app_loja FOR LOGIN app_loja;

-- Dar só as permissões necessárias
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO app_loja;
GRANT EXECUTE ON sp_RegistrarVenda TO app_loja;
```

**Princípio do menor privilégio:** a aplicação deve se conectar com um usuário que tem só as permissões de que precisa. Nunca use o `sa` na aplicação.

### Exercícios da Parte 9

1. Crie uma view `vw_ProdutosCompletos` com produto, categoria, preço, estoque e situação do estoque.
2. Crie uma stored procedure `sp_MatricularAluno` no `EscolaDb` que valide se há vagas e se o aluno já não está matriculado.
3. Usando funções de janela, mostre o ranking de clientes por valor gasto.
4. Crie um trigger que impeça a exclusão de clientes que têm pedidos, com uma mensagem amigável.

---

## Parte 10: O banco e a aplicação

### 10.1 Juntando as peças

```
Angular (Guia 2)        API ASP.NET Core (Guia 1)          SQL Server (Guia 4)
┌──────────────┐  HTTP  ┌──────────────────────────┐  SQL  ┌──────────────┐
│ HttpClient   │──────► │ Controller → Service     │─────► │ Tabelas      │
│              │  JSON  │      → EF Core / Dapper  │       │ Índices      │
└──────────────┘ ◄───── └──────────────────────────┘ ◄──── └──────────────┘
```

### 10.2 Conexão

A aplicação se conecta ao banco por uma **connection string**:

```
Server=localhost;Database=LojaDb;Trusted_Connection=True;TrustServerCertificate=True
```

| Parte | Significado |
|-------|-------------|
| `Server` | Endereço do servidor (`localhost`, `.\SQLEXPRESS`, `localhost,1433`) |
| `Database` | Nome do banco |
| `Trusted_Connection=True` | Usa o usuário do Windows |
| `User Id=...;Password=...` | Alternativa: usuário e senha do SQL Server |
| `TrustServerCertificate=True` | Aceita certificado local (só em desenvolvimento) |

### 10.3 Três formas de acessar o banco no .NET

**1. ADO.NET** (a base, de mais baixo nível):

```csharp
using Microsoft.Data.SqlClient;

await using var conexao = new SqlConnection(connectionString);
await conexao.OpenAsync();

var cmd = new SqlCommand("SELECT Id, Nome, Preco FROM Produtos WHERE Preco > @precoMin", conexao);
cmd.Parameters.AddWithValue("@precoMin", 100m);

await using var leitor = await cmd.ExecuteReaderAsync();
while (await leitor.ReadAsync())
{
    Console.WriteLine($"{leitor.GetInt32(0)} - {leitor.GetString(1)} - {leitor.GetDecimal(2)}");
}
```

**2. Dapper** (micro-ORM: você escreve o SQL, ele mapeia o resultado para objetos):

```csharp
using Dapper;

var produtos = await conexao.QueryAsync<Produto>(
    "SELECT Id, Nome, Preco FROM Produtos WHERE CategoriaId = @categoriaId",
    new { categoriaId = 1 });
```

**3. Entity Framework Core** (ORM completo, visto no Guia 1, seção 4.8): você escreve LINQ e ele gera o SQL.

```csharp
var produtos = await _db.Produtos
    .Where(p => p.CategoriaId == 1)
    .OrderBy(p => p.Nome)
    .ToListAsync();
```

O EF Core gera algo como:

```sql
SELECT [p].[Id], [p].[Nome], [p].[Preco], [p].[Estoque], [p].[CategoriaId]
FROM [Produtos] AS [p]
WHERE [p].[CategoriaId] = 1
ORDER BY [p].[Nome]
```

Agora que você conhece SQL, consegue entender (e otimizar) o que o ORM está fazendo. Para ver o SQL gerado, ative os logs:

```csharp
options.UseSqlServer(connectionString).LogTo(Console.WriteLine, LogLevel.Information);
```

| | ADO.NET | Dapper | EF Core |
|--|---------|--------|---------|
| Você escreve SQL? | Sim | Sim | Não (LINQ) |
| Mapeamento para objetos | Manual | Automático | Automático |
| Migrations, controle de alterações | Não | Não | Sim |
| Desempenho | Máximo | Muito alto | Alto |
| Produtividade | Baixa | Média | Alta |

### 10.4 SQL Injection: o perigo número um

**Nunca** monte SQL concatenando texto vindo do usuário:

```csharp
// ❌ NUNCA FAÇA ISSO
var sql = "SELECT * FROM Clientes WHERE Email = '" + emailDigitado + "'";
```

Se o usuário digitar `' OR '1'='1`, a consulta vira:

```sql
SELECT * FROM Clientes WHERE Email = '' OR '1'='1'
```

E retorna **todos** os clientes. Com `'; DROP TABLE Clientes; --`, apaga a tabela. Isso se chama **SQL Injection** e é, há décadas, uma das falhas de segurança mais exploradas do mundo.

**A solução é sempre usar parâmetros:**

```csharp
// ✅ ADO.NET
cmd.Parameters.AddWithValue("@email", emailDigitado);

// ✅ Dapper
conexao.QueryAsync<Cliente>("SELECT * FROM Clientes WHERE Email = @email", new { email = emailDigitado });

// ✅ EF Core (LINQ já é parametrizado)
_db.Clientes.Where(c => c.Email == emailDigitado);
```

Com parâmetros, o valor é tratado sempre como **dado**, nunca como parte do comando.

### 10.5 Migrations: versionando o banco

Assim como o código fica no Git, a estrutura do banco também precisa de controle de versão. As **migrations** do EF Core (Guia 1) registram cada alteração no esquema em arquivos C#:

```bash
dotnet ef migrations add AdicionarTabelaFornecedores
dotnet ef database update
dotnet ef migrations script   # gera o SQL para revisar ou aplicar em produção
```

Assim, toda a equipe e todos os ambientes (desenvolvimento, testes, produção) ficam com a mesma estrutura de banco.

### Exercícios da Parte 10

1. Na API do Guia 1, ative os logs do EF Core e observe o SQL gerado por cada endpoint.
2. Crie um endpoint de relatório `GET /api/relatorios/faturamento-por-categoria` usando Dapper e a consulta da seção 6.5.
3. Escreva um pequeno programa console vulnerável a SQL Injection, explore a falha e depois corrija com parâmetros.
4. **Desafio final:** encare o [sistema de locação de instrumentos musicais](05-desafio-final.md), com banco modelado por você, API em ASP.NET Core e front-end em Angular.

---

## Glossário

| Termo | Significado |
|-------|-------------|
| ACID | Atomicidade, Consistência, Isolamento e Durabilidade: garantias das transações |
| Cardinalidade | Quantos registros de uma tabela se relacionam com quantos de outra |
| Chave estrangeira (FK) | Coluna que referencia a chave primária de outra tabela |
| Chave primária (PK) | Coluna (ou colunas) que identifica cada linha de forma única |
| Constraint | Regra que o banco faz cumprir sobre os dados |
| DDL / DML / DQL | Comandos de definição, manipulação e consulta de dados |
| DER | Diagrama Entidade-Relacionamento |
| Índice | Estrutura auxiliar que acelera buscas |
| Integridade referencial | Garantia de que chaves estrangeiras apontam para registros existentes |
| JOIN | Combinação de linhas de várias tabelas |
| Normalização | Organização das tabelas para eliminar redundâncias e anomalias |
| ORM | Ferramenta que mapeia objetos para tabelas |
| SGBD | Sistema Gerenciador de Banco de Dados |
| SQL Injection | Ataque que insere comandos SQL por meio de dados do usuário |
| T-SQL | Dialeto de SQL do SQL Server |
| Tabela associativa | Tabela que resolve um relacionamento N:N |
| Transação | Conjunto de operações executadas como uma unidade indivisível |
| View | Consulta salva que se comporta como uma tabela |

## Para continuar estudando

- **Documentação do T-SQL:** https://learn.microsoft.com/sql/t-sql
- **Microsoft Learn:** trilha *Introdução ao Transact-SQL* (gratuita, em português).
- **SQLBolt:** https://sqlbolt.com, exercícios interativos no navegador.
- **Use The Index, Luke:** https://use-the-index-luke.com/pt, tudo sobre índices e desempenho, em português.
- **Prática:** https://www.hackerrank.com/domains/sql e https://leetcode.com/problemset/database
- **Livro:** *Sistemas de Banco de Dados* (Elmasri e Navathe), o clássico acadêmico.

---

**Fim dos guias.** Agora é hora do [Desafio final: sistema de locação de instrumentos musicais](05-desafio-final.md), que une os quatro guias num projeto completo.
