# Trilha Web

Trilha de estudos para quem está começando no desenvolvimento de software, com foco em aplicações web. São quatro guias em sequência e um desafio final, publicados como um site estático em que o estudante marca os tópicos estudados e acompanha o próprio progresso.

| # | Guia | Foco |
|---|------|------|
| 1 | [C# e .NET](guias/01-csharp-dotnet.md) | Lógica de programação, algoritmos, fundamentos, padrões de projeto e APIs |
| 2 | [JavaScript, TypeScript e Angular](guias/02-javascript-typescript-angular.md) | Lógica com JS, compilada x interpretada, a linguagem na web, TypeScript e Angular |
| 3 | [HTML e CSS](guias/03-html-css.md) | Estrutura de páginas, estilos, layout, responsividade e frameworks CSS |
| 4 | [SQL com SQL Server](guias/04-sql-server.md) | Tabelas, chaves primárias e estrangeiras, relacionamentos, índices e consultas |
| ★ | [Desafio final](guias/05-desafio-final.md) | Sistema de locação de instrumentos musicais com Angular, .NET Web API e SQL Server |

Cada guia começa com a instalação das ferramentas necessárias (.NET SDK, Visual Studio Community, VS Code, Node.js, Angular CLI, SQL Server e SQL Server Management Studio).

## Como as peças se encaixam

```
┌─────────────────────────────┐
│  NAVEGADOR (Front-end)      │  HTML + CSS + JavaScript/TypeScript (Angular)
│  O que o usuário vê         │  → Guias 2 e 3
└──────────────┬──────────────┘
               │  HTTP (JSON)
┌──────────────▼──────────────┐
│  SERVIDOR (Back-end / API)  │  C# + ASP.NET Core
│  Regras de negócio          │  → Guia 1
└──────────────┬──────────────┘
               │  SQL
┌──────────────▼──────────────┐
│  BANCO DE DADOS             │  SQL Server
│  Onde os dados ficam        │  → Guia 4
└─────────────────────────────┘
```

## O site

O site lê os arquivos Markdown da pasta `guias/` direto no navegador. **Para alterar o conteúdo, edite os `.md`**: o site se atualiza sozinho, sem etapa de build.

- Cada `## Parte` de um guia vira um **módulo**, e cada `### tópico` vira um item que pode ser marcado como estudado. Um módulo sem subtópicos conta como um tópico único.
- As seções **Sumário**, **Glossário** e **Para continuar estudando** não entram na contagem.
- Quando todos os tópicos de um guia são marcados, o guia fica **concluído** e o site mostra uma celebração. Ao concluir os quatro guias, o estudante é convidado para o desafio final.
- Todo o progresso fica no `localStorage` do navegador (chave `trilha-web:progresso:v1`). Não há banco de dados nem login.
- O site tem tema claro e escuro: segue o sistema por padrão e lembra a escolha feita no botão do topo.

> Os identificadores dos tópicos são gerados a partir do texto dos títulos `###`. Se você renomear um título, o progresso já salvo naquele tópico deixa de ser reconhecido.

### Estrutura

```
├── index.html            ← página única do site
├── assets/
│   ├── css/styles.css    ← tema, layout e componentes
│   └── js/app.js         ← leitura dos guias, rotas e progresso
├── guias/                ← o conteúdo (fonte única)
│   ├── 01-csharp-dotnet.md
│   ├── 02-javascript-typescript-angular.md
│   ├── 03-html-css.md
│   ├── 04-sql-server.md
│   └── 05-desafio-final.md
└── README.md
```

Bibliotecas carregadas por CDN, com versão fixa: [marked](https://marked.js.org) (Markdown → HTML) e [highlight.js](https://highlightjs.org) (destaque de sintaxe). Fontes do Google Fonts: Bricolage Grotesque, Atkinson Hyperlegible Next e Atkinson Hyperlegible Mono.

### Rodando localmente

O navegador bloqueia a leitura dos `.md` quando o `index.html` é aberto direto do disco (`file://`), então use um servidor local. Qualquer uma destas opções funciona:

```bash
npx serve .                      # Node.js
python -m http.server 8000       # Python
```

Ou, no VS Code, clique com o botão direito no `index.html` → **Open with Live Server**.

### Publicando na Vercel

O site é estático e não precisa de configuração.

**Pelo painel (recomendado):**
1. Envie esta pasta para um repositório no GitHub.
2. Em https://vercel.com, clique em **Add New → Project** e importe o repositório.
3. Em **Framework Preset**, escolha **Other**. Deixe **Build Command** e **Output Directory** vazios.
4. Clique em **Deploy**. A cada `git push`, a Vercel publica a nova versão.

**Pelo terminal:**

```bash
npx vercel          # primeira publicação (cria o projeto)
npx vercel --prod   # publica em produção
```

Funciona do mesmo jeito em outros serviços de hospedagem estática gratuitos, como Netlify, Cloudflare Pages e GitHub Pages.

## Dicas para estudar

1. **Digite o código, não copie.** O aprendizado vem dos erros de digitação e de lógica que você vai cometer e corrigir.
2. **Faça os exercícios.** Cada parte dos guias termina com exercícios. Marque o tópico de exercícios só depois de tentar resolvê-los.
3. **Erre sem medo.** Mensagens de erro são informação, não punição. Leia a mensagem inteira antes de pesquisar.
4. **Estude um pouco todo dia.** Uma hora por dia rende mais que sete horas no domingo.
5. **Construa algo seu.** O desafio final existe para isso: é o primeiro projeto do seu portfólio.
