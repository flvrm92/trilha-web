# Guia 3: HTML e CSS

> **Objetivo:** dominar a construção da interface de aplicações web: estruturar páginas com HTML semântico e acessível, estilizá-las com CSS moderno (Flexbox, Grid, responsividade) e conhecer os principais frameworks de estilo.
>
> **Pré-requisitos:** Guias 1 e 2. Você já viu um pouco de HTML na Parte 4 do Guia 2; agora vamos a fundo.

## Sumário

- [Parte 0: Preparando o ambiente](#parte-0-preparando-o-ambiente)
- [Parte 1: Como o navegador monta uma página](#parte-1-como-o-navegador-monta-uma-página)
- [Parte 2: HTML](#parte-2-html)
- [Parte 3: CSS fundamentos](#parte-3-css-fundamentos)
- [Parte 4: Layout com CSS](#parte-4-layout-com-css)
- [Parte 5: Design responsivo](#parte-5-design-responsivo)
- [Parte 6: CSS moderno e organização](#parte-6-css-moderno-e-organização)
- [Parte 7: Frameworks e ferramentas de CSS](#parte-7-frameworks-e-ferramentas-de-css)
- [Parte 8: HTML e CSS no Angular](#parte-8-html-e-css-no-angular)
- [Glossário](#glossário)
- [Para continuar estudando](#para-continuar-estudando)

---

## Parte 0: Preparando o ambiente

### Ferramentas deste guia

| Ferramenta | Para quê | Obrigatória? |
|-----------|----------|--------------|
| **Visual Studio Code** | Escrever HTML e CSS | Sim |
| **Extensão Live Server** | Ver a página atualizar a cada vez que você salva | Recomendada |
| **Navegadores** | Chrome ou Edge, e de preferência também o Firefox | Sim |

Para HTML e CSS você não precisa instalar nenhum compilador ou servidor: um editor e um navegador bastam.

### Configurando o VS Code para HTML e CSS

Se você ainda não instalou o VS Code, veja a Parte 0 do Guia 1 (`winget install Microsoft.VisualStudioCode`).

**Extensões recomendadas** (**Ctrl+Shift+X**):

| Extensão | Para quê |
|----------|----------|
| **Live Server** | Clique em **Go Live** na barra inferior e a página abre no navegador, recarregando sozinha a cada vez que você salva |
| **Prettier - Code formatter** | Formata e indenta o HTML e o CSS automaticamente |
| **IntelliSense for CSS class names in HTML** | Autocompleta nomes de classes CSS no HTML |

**Configurações úteis** (**Ctrl+,** e pesquise pelo nome):

- **Format On Save:** formata o arquivo ao salvar.
- **Linked Editing:** ao renomear uma tag de abertura, a de fechamento muda junto.

**Emmet** já vem embutido no VS Code e acelera muito a escrita de HTML. Digite a abreviação e pressione **Tab**:

| Você digita | Resultado |
|-------------|-----------|
| `!` | Estrutura completa de um documento HTML |
| `ul>li*3` | Uma lista com três itens |
| `nav>a.link*4` | Um `<nav>` com quatro links com a classe `link` |
| `div.cartao>h2+p` | Um `<div class="cartao">` com um título e um parágrafo |

### Navegadores e DevTools

Instale pelo menos um navegador baseado em Chromium (**Chrome** ou **Edge**, que já vem no Windows) e, se possível, o **Firefox**: cada navegador renderiza alguns detalhes de forma diferente, e é bom testar em mais de um.

```bash
winget install Mozilla.Firefox
winget install Google.Chrome
```

Pressione **F12** em qualquer página para abrir as **ferramentas do desenvolvedor**. Neste guia você vai usar principalmente:

- **Elements (Elementos):** inspecionar e editar HTML e CSS ao vivo.
- **Computed (Calculado):** ver o box model e os valores finais de cada propriedade.
- **Device Toolbar (Ctrl+Shift+M):** simular telas de celular e tablet.
- **Lighthouse:** auditar acessibilidade e desempenho.

### Organizando a pasta de estudos

Crie uma pasta para os exercícios deste guia com esta estrutura:

```
estudos-html-css/
├── index.html
├── css/
│   └── estilos.css
└── imagens/
```

Abra a pasta no VS Code (`code estudos-html-css`), crie o `index.html`, digite `!` + **Tab** e clique em **Go Live**. Pronto: seu ambiente está funcionando.

---

## Parte 1: Como o navegador monta uma página

Quando você digita um endereço e aperta Enter:

1. O navegador descobre o IP do servidor (DNS) e faz uma requisição HTTP (Guia 1, Parte 4).
2. O servidor devolve um arquivo **HTML**.
3. O navegador lê o HTML e monta a árvore **DOM** (Guia 2, Parte 4).
4. Ao encontrar `<link>` para CSS e `<script>` para JavaScript, baixa esses arquivos.
5. Lê o CSS e monta a árvore de estilos (**CSSOM**).
6. Combina DOM + CSSOM, calcula o tamanho e a posição de cada elemento (**layout**) e desenha na tela (**paint**).
7. O JavaScript pode alterar o DOM e o CSS a qualquer momento, e o navegador redesenha o que mudou.

```
HTML ──► DOM ──┐
               ├──► Árvore de renderização ──► Layout ──► Paint ──► 🖥️
CSS ──► CSSOM ─┘
```

Entender esse fluxo ajuda a saber por que, por exemplo, scripts pesados no `<head>` sem `defer` atrasam a exibição da página.

---

## Parte 2: HTML

### 2.1 O que é HTML

**HTML** (*HyperText Markup Language*) é uma **linguagem de marcação**, não de programação: não tem variáveis, laços ou decisões. Ela descreve a **estrutura** e o **significado** do conteúdo usando **elementos** (tags).

```html
<p class="destaque">Este é um parágrafo.</p>
```

```
<p class="destaque">  Este é um parágrafo.  </p>
 │   └─ atributo       └─ conteúdo            └─ tag de fechamento
 └─ tag de abertura
```

Alguns elementos não têm conteúdo nem fechamento (*void elements*): `<img>`, `<br>`, `<input>`, `<meta>`, `<link>`, `<hr>`.

### 2.2 Estrutura básica de um documento

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Loja online de produtos de informática">
  <title>Minha Loja</title>
  <link rel="stylesheet" href="estilos.css">
  <link rel="icon" href="favicon.ico">
</head>
<body>
  <h1>Bem-vindo à Minha Loja</h1>
  <p>O melhor lugar para comprar.</p>
  <script src="app.js" defer></script>
</body>
</html>
```

| Parte | Função |
|-------|--------|
| `<!DOCTYPE html>` | Diz ao navegador que é HTML5 |
| `<html lang="pt-BR">` | Elemento raiz; o idioma ajuda leitores de tela e tradutores |
| `<head>` | Metadados: não aparecem na página |
| `<meta charset="UTF-8">` | Permite acentos e caracteres especiais |
| `<meta name="viewport">` | Essencial para a página funcionar bem no celular |
| `<title>` | Texto da aba e dos resultados de busca |
| `<body>` | Tudo que aparece na tela |

> **Dica do VS Code:** num arquivo `.html` vazio, digite `!` e pressione Tab para gerar essa estrutura.

### 2.3 Texto

```html
<h1>Título principal (apenas um por página)</h1>
<h2>Seção</h2>
<h3>Subseção</h3>
<!-- vai até h6 -->

<p>Um parágrafo com <strong>importância forte</strong> e <em>ênfase</em>.</p>
<p>Uma linha<br>quebrada.</p>
<p>Texto <mark>marcado</mark>, <small>letra miúda</small> e <code>código</code>.</p>

<blockquote cite="https://exemplo.com">
  Uma citação longa.
</blockquote>

<hr>   <!-- separação temática -->

<!-- Isto é um comentário: não aparece na página -->
```

> Não escolha um título pelo tamanho. `<h1>` a `<h6>` definem a **hierarquia** do conteúdo, como o sumário de um livro. O tamanho visual se ajusta com CSS. Não pule níveis (de `<h2>` direto para `<h4>`).

### 2.4 Links e imagens

```html
<!-- Link para outro site -->
<a href="https://developer.mozilla.org" target="_blank" rel="noopener">MDN</a>

<!-- Link para outra página do mesmo site -->
<a href="/contato.html">Contato</a>

<!-- Link para uma seção da mesma página -->
<a href="#precos">Ver preços</a>
<section id="precos">...</section>

<!-- E-mail e telefone -->
<a href="mailto:contato@loja.com">Fale conosco</a>
<a href="tel:+5581999999999">Ligue</a>

<!-- Imagem -->
<img src="imagens/notebook.jpg" alt="Notebook prateado aberto sobre uma mesa" width="400" height="300">
```

O atributo **`alt`** é obrigatório: descreve a imagem para quem usa leitor de tela e aparece se a imagem não carregar. Se a imagem for puramente decorativa, use `alt=""`.

**Caminhos de arquivos:**

| Caminho | Significado |
|---------|-------------|
| `foto.jpg` | Na mesma pasta |
| `imagens/foto.jpg` | Na subpasta `imagens` |
| `../foto.jpg` | Na pasta acima |
| `/imagens/foto.jpg` | A partir da raiz do site |

**Imagens com legenda e responsivas:**

```html
<figure>
  <picture>
    <source srcset="foto-grande.webp" media="(min-width: 800px)">
    <img src="foto-pequena.jpg" alt="Vista da praia de Boa Viagem" loading="lazy">
  </picture>
  <figcaption>Praia de Boa Viagem, Recife.</figcaption>
</figure>
```

`loading="lazy"` só carrega a imagem quando ela está perto de aparecer na tela.

### 2.5 Listas

```html
<!-- Não ordenada -->
<ul>
  <li>Arroz</li>
  <li>Feijão</li>
</ul>

<!-- Ordenada -->
<ol>
  <li>Ferver a água</li>
  <li>Adicionar o macarrão</li>
</ol>

<!-- De definições -->
<dl>
  <dt>HTML</dt>
  <dd>Linguagem de marcação</dd>
  <dt>CSS</dt>
  <dd>Linguagem de estilos</dd>
</dl>
```

Menus de navegação costumam ser listas (`<ul>`) dentro de um `<nav>`.

### 2.6 Tabelas

Use tabelas **apenas para dados tabulares**, nunca para fazer layout.

```html
<table>
  <caption>Produtos em estoque</caption>
  <thead>
    <tr>
      <th scope="col">Produto</th>
      <th scope="col">Preço</th>
      <th scope="col">Estoque</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Notebook</td>
      <td>R$ 4.500,00</td>
      <td>12</td>
    </tr>
    <tr>
      <td>Mouse</td>
      <td>R$ 80,00</td>
      <td>150</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">Total de itens</td>
      <td>162</td>
    </tr>
  </tfoot>
</table>
```

Repare como a tabela HTML se parece com uma tabela de banco de dados (Guia 4): colunas, linhas e um cabeçalho.

### 2.7 HTML semântico

**Semântica** significa usar o elemento que descreve o **significado** do conteúdo, não apenas a aparência.

```html
<!-- Ruim: "div soup", nada tem significado -->
<div class="cabecalho">
  <div class="menu">...</div>
</div>
<div class="conteudo">
  <div class="artigo">...</div>
</div>
<div class="rodape">...</div>

<!-- Bom: semântico -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
  <aside>...</aside>
</main>
<footer>...</footer>
```

| Elemento | Significado |
|----------|-------------|
| `<header>` | Cabeçalho da página ou de uma seção |
| `<nav>` | Bloco de navegação principal |
| `<main>` | Conteúdo principal (apenas um por página) |
| `<article>` | Conteúdo independente (post, notícia, cartão de produto) |
| `<section>` | Seção temática, geralmente com um título |
| `<aside>` | Conteúdo relacionado, mas secundário (barra lateral) |
| `<footer>` | Rodapé da página ou de uma seção |
| `<div>` | Bloco **sem** significado (use só para agrupar visualmente) |
| `<span>` | Trecho de texto **sem** significado |

**Por que importa?**
- **Acessibilidade:** leitores de tela permitem pular direto para o `<main>` ou o `<nav>`.
- **SEO:** mecanismos de busca entendem melhor o conteúdo.
- **Manutenção:** o código fica muito mais legível.

**Exemplo de página completa:**

```html
<body>
  <header>
    <a href="/" class="logo">Minha Loja</a>
    <nav aria-label="Principal">
      <ul>
        <li><a href="/">Início</a></li>
        <li><a href="/produtos">Produtos</a></li>
        <li><a href="/contato">Contato</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <h1>Ofertas da semana</h1>
      <article class="produto">
        <img src="notebook.jpg" alt="Notebook">
        <h2>Notebook Pro</h2>
        <p>R$ 4.500,00</p>
        <button type="button">Comprar</button>
      </article>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Minha Loja</p>
  </footer>
</body>
```

### 2.8 Formulários

Formulários são o principal meio de o usuário enviar dados, e estão no centro de toda aplicação web.

```html
<form action="/api/cadastro" method="post">
  <fieldset>
    <legend>Dados pessoais</legend>

    <label for="nome">Nome completo</label>
    <input type="text" id="nome" name="nome" required minlength="3" autocomplete="name">

    <label for="email">E-mail</label>
    <input type="email" id="email" name="email" required placeholder="voce@exemplo.com">

    <label for="nascimento">Data de nascimento</label>
    <input type="date" id="nascimento" name="nascimento">

    <label for="senha">Senha</label>
    <input type="password" id="senha" name="senha" required minlength="8">
  </fieldset>

  <fieldset>
    <legend>Preferências</legend>

    <label for="estado">Estado</label>
    <select id="estado" name="estado">
      <option value="">Selecione...</option>
      <option value="PE">Pernambuco</option>
      <option value="SP">São Paulo</option>
    </select>

    <p>Como nos conheceu?</p>
    <input type="radio" id="google" name="origem" value="google">
    <label for="google">Google</label>
    <input type="radio" id="amigo" name="origem" value="amigo">
    <label for="amigo">Indicação</label>

    <input type="checkbox" id="newsletter" name="newsletter">
    <label for="newsletter">Quero receber novidades</label>

    <label for="obs">Observações</label>
    <textarea id="obs" name="obs" rows="4"></textarea>
  </fieldset>

  <button type="submit">Cadastrar</button>
  <button type="reset">Limpar</button>
</form>
```

**Tipos de `<input>` mais usados:**

| Tipo | Uso |
|------|-----|
| `text` | Texto livre |
| `email` | E-mail (valida o formato; teclado com @ no celular) |
| `password` | Senha (oculta os caracteres) |
| `number` | Números (`min`, `max`, `step`) |
| `tel` | Telefone (teclado numérico no celular) |
| `date`, `time`, `datetime-local` | Datas e horas com seletor nativo |
| `checkbox` | Várias opções independentes |
| `radio` | Uma opção entre várias (mesmo `name`) |
| `file` | Envio de arquivos |
| `search`, `url`, `color`, `range` | Busca, URL, cor, controle deslizante |

**Validação nativa:** `required`, `minlength`, `maxlength`, `min`, `max`, `pattern` (expressão regular). O navegador impede o envio se as regras não forem cumpridas.

> **Sempre** ligue cada `<label>` ao seu campo com `for` igual ao `id` do campo. Clicar no texto passa a focar o campo, e leitores de tela anunciam o nome correto.

### 2.9 Acessibilidade (a11y)

Acessibilidade é garantir que **todas as pessoas** consigam usar o site, inclusive pessoas cegas, com baixa visão, daltonismo, deficiências motoras ou cognitivas. No Brasil, a Lei Brasileira de Inclusão (Lei 13.146/2015) exige acessibilidade em sites.

**Checklist básico:**

- [ ] HTML semântico (`<button>` para ações, `<a>` para navegação, nunca `<div onclick>`).
- [ ] Toda imagem informativa tem `alt` descritivo.
- [ ] Todo campo de formulário tem `<label>`.
- [ ] Hierarquia de títulos correta.
- [ ] Tudo funciona só com o teclado (Tab, Shift+Tab, Enter, Espaço).
- [ ] O foco do teclado é visível (não remova o `outline` sem substituir).
- [ ] Contraste suficiente entre texto e fundo (mínimo de 4,5:1 para texto normal).
- [ ] A informação não depende só de cor ("campos em vermelho são obrigatórios" não funciona para daltônicos).
- [ ] O atributo `lang` está definido.

**ARIA** (*Accessible Rich Internet Applications*) são atributos que complementam a semântica quando o HTML não basta:

```html
<button aria-label="Fechar janela">✕</button>
<nav aria-label="Navegação principal">...</nav>
<div role="alert">Erro ao salvar o formulário.</div>
<button aria-expanded="false" aria-controls="menu">Menu</button>
```

> A primeira regra do ARIA é: **se existe um elemento HTML nativo que faz o que você precisa, use-o**. `<button>` é sempre melhor que `<div role="button">`.

**Ferramentas:** a aba **Lighthouse** do DevTools, a extensão **axe DevTools** e testar a página navegando só com o teclado.

### 2.10 Outros elementos úteis

```html
<!-- Expandir/recolher sem JavaScript -->
<details>
  <summary>Política de trocas</summary>
  <p>Você tem 7 dias para trocar o produto.</p>
</details>

<!-- Caixa de diálogo nativa -->
<dialog id="modal">
  <p>Produto adicionado ao carrinho!</p>
  <form method="dialog"><button>OK</button></form>
</dialog>

<!-- Vídeo e áudio -->
<video src="apresentacao.mp4" controls width="640"></video>
<audio src="musica.mp3" controls></audio>

<!-- Data legível por máquinas -->
<time datetime="2026-11-17">17 de novembro</time>

<!-- Barra de progresso -->
<progress value="70" max="100">70%</progress>
```

**Entidades HTML** (caracteres especiais): `&lt;` (<), `&gt;` (>), `&amp;` (&), `&copy;` (©), `&nbsp;` (espaço que não quebra linha).

### Exercícios da Parte 2

1. Crie uma página de currículo pessoal usando apenas HTML semântico: cabeçalho com seu nome, seções de formação, experiência e habilidades, e um rodapé com contatos.
2. Crie uma página de receita com lista de ingredientes (`<ul>`), modo de preparo (`<ol>`), uma imagem com legenda e uma tabela nutricional.
3. Crie um formulário de cadastro de produto com nome, descrição, preço, categoria (select), "em promoção" (checkbox) e foto (file). Use validação nativa.
4. Navegue pelas páginas que você criou usando apenas o teclado. Rode o Lighthouse e corrija os problemas de acessibilidade apontados.
5. Pegue um site que você usa e, pelo DevTools (aba Elements), identifique quais elementos semânticos ele usa.

---

## Parte 3: CSS fundamentos

### 3.1 O que é CSS

**CSS** (*Cascading Style Sheets*) define a **aparência** do HTML: cores, fontes, espaçamentos, tamanhos, posições, animações.

**Anatomia de uma regra:**

```css
seletor {
  propriedade: valor;
  outra-propriedade: valor;
}
```

```css
h1 {
  color: navy;
  font-size: 2rem;
}
```

### 3.2 Três formas de incluir CSS

```html
<!-- 1. Arquivo externo (a forma recomendada) -->
<link rel="stylesheet" href="estilos.css">

<!-- 2. Interno, no <head> -->
<style>
  p { color: gray; }
</style>

<!-- 3. Inline, no elemento (evite) -->
<p style="color: red;">Texto vermelho</p>
```

O arquivo externo separa estrutura de aparência e pode ser reaproveitado por todas as páginas.

### 3.3 Seletores

```css
/* Elemento */
p { }

/* Classe (o mais usado) */
.destaque { }

/* ID (único na página; evite para estilos) */
#cabecalho { }

/* Vários seletores */
h1, h2, h3 { }

/* Descendente: qualquer <a> dentro de <nav> */
nav a { }

/* Filho direto */
ul > li { }

/* Irmão imediatamente seguinte */
h2 + p { }

/* Atributo */
input[type="email"] { }
a[href^="https"] { }      /* começa com */

/* Universal */
* { }

/* Elemento com duas classes */
.botao.primario { }
```

**Pseudo-classes** (estados e posições):

```css
a:hover { }              /* mouse em cima */
button:active { }        /* sendo clicado */
input:focus { }          /* com foco */
input:focus-visible { }  /* foco vindo do teclado */
input:invalid { }        /* não passou na validação */
input:disabled { }
input:checked { }
li:first-child { }
li:last-child { }
li:nth-child(odd) { }    /* ímpares: ótimo para "zebrar" tabelas */
li:nth-child(3n) { }     /* a cada 3 */
p:not(.especial) { }
.cartao:has(img) { }     /* cartão que contém uma imagem */
```

**Pseudo-elementos** (partes de um elemento):

```css
p::first-line { }
p::first-letter { }
.obrigatorio::after { content: " *"; color: red; }
::placeholder { color: #999; }
::selection { background: yellow; }
```

### 3.4 A cascata, a especificidade e a herança

Quando duas regras conflitam, quem ganha? O "C" de CSS (*Cascading*) responde.

**1. Importância e origem:** declarações com `!important` vencem as normais. (Evite `!important`: ele quebra a previsibilidade.)

**2. Especificidade:** o seletor mais específico vence. Pense em três colunas (IDs, classes, elementos):

| Seletor | IDs | Classes / atributos / pseudo-classes | Elementos | Peso |
|---------|-----|------------|-----------|------|
| `p` | 0 | 0 | 1 | 0-0-1 |
| `.texto` | 0 | 1 | 0 | 0-1-0 |
| `p.texto` | 0 | 1 | 1 | 0-1-1 |
| `nav .menu a:hover` | 0 | 2 | 2 | 0-2-2 |
| `#principal` | 1 | 0 | 0 | 1-0-0 |
| `style="..."` (inline) | vence todos os seletores | | | |

Compare coluna por coluna, da esquerda para a direita. Um único ID vence qualquer quantidade de classes.

**3. Ordem:** com especificidade igual, a regra que aparece **por último** vence.

```css
p { color: blue; }
p { color: red; }     /* vence: veio depois */
```

**Herança:** algumas propriedades passam de pai para filho automaticamente, principalmente as de texto (`color`, `font-family`, `font-size`, `line-height`). Propriedades de caixa (`margin`, `padding`, `border`, `width`) **não** são herdadas.

```css
body {
  font-family: system-ui, sans-serif;   /* todos os elementos herdam */
  color: #333;
}
```

> **Estratégia:** use quase só seletores de classe. Mantém a especificidade baixa e uniforme, e as regras ficam previsíveis.

### 3.5 Cores

```css
.exemplos {
  color: red;                         /* nome */
  color: #ff0000;                     /* hexadecimal */
  color: #f00;                        /* hexadecimal curto */
  color: rgb(255, 0, 0);              /* vermelho, verde, azul (0-255) */
  color: rgb(255 0 0 / 50%);          /* com 50% de transparência */
  color: hsl(0 100% 50%);             /* matiz, saturação, luminosidade */
  color: oklch(63% 0.26 29);          /* espaço de cor moderno, perceptualmente uniforme */
  background-color: transparent;
}
```

O **HSL** é intuitivo para criar variações: mantenha a matiz e mude a luminosidade para ter tons mais claros ou escuros da mesma cor.

### 3.6 Unidades de medida

| Unidade | Relativa a | Quando usar |
|---------|------------|-------------|
| `px` | Pixels | Bordas, sombras, detalhes finos |
| `%` | O elemento pai | Larguras fluidas |
| `rem` | Tamanho da fonte do `<html>` (geralmente 16px) | **Fontes e espaçamentos (recomendado)** |
| `em` | Tamanho da fonte do próprio elemento | Espaçamentos proporcionais ao texto |
| `vw` / `vh` | 1% da largura / altura da janela | Seções de tela cheia |
| `dvh` | Altura dinâmica da janela | Tela cheia no celular (considera a barra do navegador) |
| `ch` | Largura do caractere "0" | Limitar largura de texto (`max-width: 65ch`) |
| `fr` | Fração do espaço livre (só no Grid) | Colunas de grid |

Por que `rem` para fontes? Se o usuário aumentar a fonte padrão do navegador (comum entre pessoas com baixa visão), todo o site cresce junto.

### 3.7 Tipografia

```css
body {
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 1rem;
  line-height: 1.6;          /* sem unidade: proporcional ao tamanho da fonte */
  color: #222;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;          /* 400 = normal, 700 = negrito */
  letter-spacing: -0.02em;
}

.texto {
  text-align: center;        /* left, right, center, justify */
  text-transform: uppercase;
  text-decoration: underline;
  max-width: 65ch;           /* linhas muito longas cansam a leitura */
}
```

A lista em `font-family` é uma sequência de alternativas: se a primeira fonte não estiver disponível, o navegador tenta a próxima.

**Usando fontes do Google Fonts:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
```

### 3.8 O Box Model (modelo de caixa)

**Este é o conceito mais importante do CSS.** Todo elemento é uma caixa retangular composta de quatro camadas:

```
┌───────────────────────────────────────┐
│              MARGIN                   │  espaço externo (transparente)
│   ┌───────────────────────────────┐   │
│   │          BORDER               │   │  borda
│   │   ┌───────────────────────┐   │   │
│   │   │       PADDING         │   │   │  espaço interno
│   │   │   ┌───────────────┐   │   │   │
│   │   │   │   CONTENT     │   │   │   │  conteúdo (width × height)
│   │   │   └───────────────┘   │   │   │
│   │   └───────────────────────┘   │   │
│   └───────────────────────────────┘   │
└───────────────────────────────────────┘
```

```css
.caixa {
  width: 300px;
  padding: 20px;                 /* os 4 lados */
  padding: 10px 20px;            /* vertical | horizontal */
  padding: 10px 20px 30px 40px;  /* topo | direita | baixo | esquerda (sentido horário) */
  border: 2px solid #333;        /* espessura | estilo | cor */
  border-radius: 8px;            /* cantos arredondados */
  margin: 0 auto;                /* centraliza horizontalmente um bloco com largura definida */
}
```

**O problema do `box-sizing`:** por padrão, `width` se refere só ao conteúdo. Uma caixa com `width: 300px`, `padding: 20px` e `border: 2px` ocupa na verdade **344px**. Isso confunde todo mundo. A solução, usada em praticamente todo projeto:

```css
*, *::before, *::after {
  box-sizing: border-box;   /* width passa a incluir padding e borda */
}
```

**Colapso de margens:** margens verticais de elementos vizinhos não se somam. Uma margem inferior de 20px seguida de uma margem superior de 30px resulta em 30px de espaço, não 50px.

> **Dica de depuração:** no DevTools, aba Elements, a seção **Computed** mostra o box model de qualquer elemento com as medidas reais.

### 3.9 Display: block, inline e inline-block

| Valor | Comportamento | Exemplos padrão |
|-------|---------------|-----------------|
| `block` | Ocupa a linha inteira; aceita `width`, `height` e margens verticais | `<div>`, `<p>`, `<h1>`, `<section>` |
| `inline` | Fica no fluxo do texto; **ignora** `width`, `height` e margens verticais | `<span>`, `<a>`, `<strong>` |
| `inline-block` | Fica na linha, mas aceita dimensões | `<button>`, `<img>`, `<input>` |
| `none` | Remove o elemento da página | |
| `flex` / `grid` | Ativa os sistemas de layout modernos (Parte 4) | |

```css
.esconder { display: none; }          /* some e não ocupa espaço */
.invisivel { visibility: hidden; }    /* some, mas continua ocupando espaço */
```

### 3.10 Fundos, bordas e sombras

```css
.cartao {
  background-color: #fff;
  background-image: url("textura.png");
  background-image: linear-gradient(135deg, #667eea, #764ba2);
  background-size: cover;           /* cobre a área toda */
  background-position: center;

  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);   /* x | y | desfoque | cor */
}

.texto-destacado {
  text-shadow: 1px 1px 2px rgb(0 0 0 / 30%);
}
```

### 3.11 Overflow

O que acontece quando o conteúdo é maior que a caixa:

```css
.caixa {
  height: 200px;
  overflow: visible;   /* padrão: transborda */
  overflow: hidden;    /* corta */
  overflow: auto;      /* barra de rolagem só se necessário */
}

.texto-curto {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;   /* "Texto muito lon..." */
}
```

### Exercícios da Parte 3

1. Estilize o currículo da Parte 2: escolha uma fonte, uma paleta de 3 cores e ajuste espaçamentos usando `rem`.
2. Crie um botão com três estados visuais: normal, `:hover` e `:focus-visible`. Depois crie variações `.botao-primario`, `.botao-secundario` e `.botao-perigo`.
3. Crie uma tabela "zebrada" (linhas alternadas com `:nth-child`) com destaque na linha sob o mouse.
4. Calcule a especificidade destes seletores e diga qual vence: `ul li a`, `.menu a`, `nav .menu li a`, `#topo a`.
5. Crie dois `<div>` com `width: 200px`, `padding: 20px` e `border: 5px`, um com `box-sizing: content-box` e outro com `border-box`. Meça no DevTools e explique a diferença.

---

## Parte 4: Layout com CSS

### 4.1 Fluxo normal e position

Sem nenhum CSS, os elementos seguem o **fluxo normal**: blocos empilhados de cima para baixo, elementos inline lado a lado. A propriedade `position` tira os elementos desse fluxo.

| Valor | Comportamento |
|-------|---------------|
| `static` | Padrão: segue o fluxo |
| `relative` | Segue o fluxo, mas pode ser deslocado com `top`/`left` a partir da posição original. Também serve de referência para filhos `absolute` |
| `absolute` | Sai do fluxo; posicionado em relação ao ancestral posicionado mais próximo |
| `fixed` | Sai do fluxo; fixo em relação à janela (não rola) |
| `sticky` | Normal até atingir um ponto da rolagem, depois "gruda" |

```css
/* Selo "Promoção" no canto do cartão */
.cartao {
  position: relative;          /* vira a referência */
}
.selo {
  position: absolute;
  top: 10px;
  right: 10px;
}

/* Cabeçalho que gruda no topo ao rolar */
header {
  position: sticky;
  top: 0;
  z-index: 100;                /* fica por cima dos outros elementos */
}

/* Botão de WhatsApp fixo no canto */
.whatsapp {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
```

`z-index` controla qual elemento fica "na frente" quando há sobreposição (só funciona em elementos posicionados ou itens de flex/grid).

### 4.2 Flexbox

O **Flexbox** organiza elementos em **uma dimensão**: uma linha ou uma coluna. É ideal para barras de navegação, alinhar itens, distribuir espaço e centralizar coisas.

```css
.container {
  display: flex;
}
```

Com isso, os filhos diretos viram **itens flex** e se alinham em linha.

```
Eixo principal (main axis) ──────────────►
┌──────────────────────────────────────────┐   │
│ ┌──────┐  ┌──────┐  ┌──────┐             │   │ Eixo cruzado
│ │ item │  │ item │  │ item │             │   │ (cross axis)
│ └──────┘  └──────┘  └──────┘             │   ▼
└──────────────────────────────────────────┘
```

**Propriedades do container:**

```css
.container {
  display: flex;
  flex-direction: row;            /* row | column | row-reverse | column-reverse */
  justify-content: space-between; /* alinhamento no eixo PRINCIPAL */
  align-items: center;            /* alinhamento no eixo CRUZADO */
  flex-wrap: wrap;                /* permite quebrar linha */
  gap: 1rem;                      /* espaço entre os itens */
}
```

**`justify-content`:**

```
flex-start:     [A][B][C]
center:               [A][B][C]
flex-end:                         [A][B][C]
space-between:  [A]          [B]          [C]
space-around:     [A]       [B]       [C]
space-evenly:      [A]      [B]      [C]
```

**`align-items`:** `stretch` (padrão, estica), `flex-start`, `center`, `flex-end`, `baseline`.

**Propriedades dos itens:**

```css
.item {
  flex-grow: 1;       /* quanto cresce para ocupar o espaço livre */
  flex-shrink: 1;     /* quanto encolhe se faltar espaço */
  flex-basis: 200px;  /* tamanho inicial */
  flex: 1;            /* atalho: cresce igualmente */
  align-self: flex-end;   /* alinhamento próprio */
  order: 2;               /* muda a ordem visual (cuidado com acessibilidade) */
}
```

**Receitas comuns:**

```css
/* Centralizar qualquer coisa, na horizontal e na vertical */
.centralizar {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Barra de navegação: logo à esquerda, links à direita */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}
.navbar ul {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

/* Rodapé sempre no fim da página, mesmo com pouco conteúdo */
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
}

/* Cartões que quebram linha */
.cartoes {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.cartoes > * {
  flex: 1 1 250px;   /* cresce, encolhe, mínimo de 250px */
}
```

> **Para praticar:** o jogo [Flexbox Froggy](https://flexboxfroggy.com/#pt-br) ensina Flexbox de forma divertida.

### 4.3 CSS Grid

O **Grid** organiza elementos em **duas dimensões**: linhas **e** colunas ao mesmo tempo. Ideal para o layout geral da página e para grades de cartões.

```css
.grade {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;   /* 3 colunas: fixa + duas que dividem o resto */
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
```

**A unidade `fr`** representa uma fração do espaço livre. `1fr 2fr` significa "a segunda coluna tem o dobro da largura da primeira".

```css
.tres-colunas-iguais {
  grid-template-columns: repeat(3, 1fr);
}

/* Grade responsiva SEM media query: cabem quantas colunas de no mínimo 250px couberem */
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

Essa última linha é uma das mais úteis do CSS: a galeria se adapta sozinha a qualquer tamanho de tela.

**Posicionando itens:**

```css
.destaque {
  grid-column: 1 / 3;     /* da linha 1 até a linha 3 (ocupa 2 colunas) */
  grid-column: span 2;    /* ou: ocupa 2 colunas a partir de onde estiver */
  grid-row: 1 / 3;
}
```

**Áreas nomeadas** (a forma mais legível de montar o layout da página):

```css
.pagina {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "cabecalho cabecalho"
    "lateral   conteudo"
    "rodape    rodape";
  min-height: 100vh;
}

header { grid-area: cabecalho; }
aside  { grid-area: lateral; }
main   { grid-area: conteudo; }
footer { grid-area: rodape; }
```

```
┌──────────────────────────────┐
│          cabecalho           │
├─────────┬────────────────────┤
│         │                    │
│ lateral │     conteudo       │
│         │                    │
├─────────┴────────────────────┤
│           rodape             │
└──────────────────────────────┘
```

> **Para praticar:** o jogo [Grid Garden](https://cssgridgarden.com/#pt-br).

### 4.4 Flexbox ou Grid?

| Use **Flexbox** quando... | Use **Grid** quando... |
|---------------------------|------------------------|
| O layout é em uma direção (linha **ou** coluna) | O layout é em duas direções (linhas **e** colunas) |
| O tamanho do conteúdo define o layout | O layout define onde o conteúdo fica |
| Componentes: navbar, botões, item de formulário | Estrutura da página, galerias, dashboards |

Na prática, você vai usar os dois juntos: Grid para a estrutura geral e Flexbox dentro de cada componente.

### Exercícios da Parte 4

1. Crie uma barra de navegação com Flexbox: logo à esquerda, links no centro e um botão "Entrar" à direita.
2. Crie uma galeria de produtos com Grid usando `repeat(auto-fill, minmax(...))`. Redimensione a janela e observe.
3. Monte o layout de um painel administrativo com `grid-template-areas`: cabeçalho, menu lateral, conteúdo e rodapé.
4. Crie um cartão de produto com selo "Promoção" posicionado no canto superior direito (`position: absolute`).
5. Complete os jogos Flexbox Froggy e Grid Garden.

---

## Parte 5: Design responsivo

### 5.1 O que é

**Design responsivo** é fazer a mesma página funcionar bem em qualquer tela: celular, tablet, notebook, monitor ultrawide. Mais da metade do tráfego da web vem de celulares.

Três ingredientes:
1. A meta tag **viewport** (sem ela, o celular finge ser um monitor grande e encolhe tudo).
2. **Layouts fluidos** (`%`, `fr`, `flex`, `minmax`) em vez de larguras fixas.
3. **Media queries** para ajustes em tamanhos específicos.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 5.2 Media queries

```css
/* Estilos base: valem para todos */
.cartoes {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* A partir de 600px (tablets) */
@media (min-width: 600px) {
  .cartoes {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* A partir de 1024px (desktops) */
@media (min-width: 1024px) {
  .cartoes {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

**Outras condições úteis:**

```css
@media (prefers-color-scheme: dark) { /* o usuário prefere tema escuro */ }
@media (prefers-reduced-motion: reduce) { /* o usuário prefere menos animações */ }
@media (hover: hover) { /* o dispositivo tem mouse */ }
@media print { /* versão para impressão */ }
@media (orientation: landscape) { /* tela na horizontal */ }
```

### 5.3 Mobile first

**Mobile first** significa escrever primeiro o CSS para telas pequenas e usar `min-width` para adicionar complexidade em telas maiores.

Por quê?
- O layout de celular costuma ser mais simples (uma coluna). Começar por ele gera menos código.
- Força a priorizar o conteúdo essencial.
- Celulares, que costumam ter conexões mais lentas, carregam menos regras.

**Breakpoints comuns** (não são regras fixas; ajuste ao seu conteúdo):

| Nome | Largura mínima |
|------|----------------|
| Celular | (base, sem media query) |
| Tablet | 600px – 768px |
| Notebook | 1024px |
| Desktop | 1280px |

### 5.4 Imagens e tipografia fluidas

```css
img {
  max-width: 100%;   /* nunca ultrapassa o container */
  height: auto;      /* mantém a proporção */
  display: block;
}

h1 {
  /* mínimo 1.75rem, ideal 5% da largura da tela, máximo 3rem */
  font-size: clamp(1.75rem, 5vw, 3rem);
}

.container {
  width: min(100% - 2rem, 1200px);   /* no máximo 1200px, com 1rem de margem em cada lado */
  margin-inline: auto;
}
```

### 5.5 Container queries

As media queries olham para o tamanho da **janela**. As **container queries** olham para o tamanho do **elemento pai**. Isso permite componentes que se adaptam ao espaço onde foram colocados, seja numa coluna estreita ou numa área larga.

```css
.area-cartao {
  container-type: inline-size;
}

.cartao {
  display: grid;
  gap: 1rem;
}

@container (min-width: 400px) {
  .cartao {
    grid-template-columns: 150px 1fr;   /* imagem ao lado do texto quando há espaço */
  }
}
```

### 5.6 Testando

No DevTools, clique no ícone de celular/tablet (**Device Toolbar**, Ctrl+Shift+M) para simular diferentes dispositivos. Mas teste também num celular de verdade sempre que puder.

### Exercícios da Parte 5

1. Torne responsiva a página de currículo: uma coluna no celular e duas no desktop (dados pessoais à esquerda, experiência à direita).
2. Crie um menu que, no celular, vira um botão "☰" que abre e fecha a lista de links (use um pouco de JavaScript do Guia 2 ou `<details>`).
3. Adicione um tema escuro automático com `prefers-color-scheme`.
4. Use `clamp()` para que os títulos se ajustem suavemente ao tamanho da tela.

---

## Parte 6: CSS moderno e organização

### 6.1 Variáveis CSS (custom properties)

Defina valores uma vez e reutilize em todo lugar. Mudar a cor principal do site passa a ser uma linha.

```css
:root {
  --cor-primaria: #2563eb;
  --cor-primaria-escura: #1d4ed8;
  --cor-texto: #1f2937;
  --cor-fundo: #ffffff;
  --espaco: 1rem;
  --raio: 8px;
  --sombra: 0 4px 12px rgb(0 0 0 / 10%);
}

.botao {
  background: var(--cor-primaria);
  color: white;
  padding: calc(var(--espaco) / 2) var(--espaco);
  border-radius: var(--raio);
}

.botao:hover {
  background: var(--cor-primaria-escura);
}
```

**Tema escuro com variáveis:**

```css
@media (prefers-color-scheme: dark) {
  :root {
    --cor-texto: #f3f4f6;
    --cor-fundo: #111827;
  }
}

body {
  color: var(--cor-texto);
  background: var(--cor-fundo);
}
```

Diferente das variáveis de pré-processadores (Parte 7), as variáveis CSS existem no navegador: podem ser alteradas por JavaScript e por media queries em tempo real.

### 6.2 Transições

Suavizam a mudança entre dois estados:

```css
.botao {
  background: var(--cor-primaria);
  transform: translateY(0);
  transition: background 0.2s ease, transform 0.2s ease;
}

.botao:hover {
  background: var(--cor-primaria-escura);
  transform: translateY(-2px);
}
```

### 6.3 Transformações e animações

```css
.elemento {
  transform: rotate(45deg);
  transform: scale(1.1);
  transform: translate(10px, 20px);
}

@keyframes aparecer {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.cartao {
  animation: aparecer 0.4s ease-out;
}

@keyframes girar {
  to { transform: rotate(360deg); }
}

.carregando {
  width: 40px;
  height: 40px;
  border: 4px solid #ddd;
  border-top-color: var(--cor-primaria);
  border-radius: 50%;
  animation: girar 1s linear infinite;
}

/* Respeite quem prefere menos movimento */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

> **Desempenho:** anime de preferência `transform` e `opacity`. Animar `width`, `height`, `top` ou `margin` força o navegador a recalcular o layout a cada quadro.

### 6.4 Aninhamento nativo

O CSS moderno permite aninhar regras, como os pré-processadores sempre permitiram:

```css
.cartao {
  padding: 1rem;

  & h2 {
    font-size: 1.25rem;
  }

  &:hover {
    box-shadow: var(--sombra);
  }

  @media (min-width: 600px) {
    padding: 2rem;
  }
}
```

### 6.5 Reset e estilos base

Cada navegador aplica estilos padrão um pouco diferentes. Um **reset** (ou *normalize*) uniformiza o ponto de partida:

```css
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;    /* campos de formulário herdam a fonte da página */
}
```

### 6.6 Organizando o CSS: a metodologia BEM

Em projetos grandes, o CSS vira bagunça rapidamente: nomes conflitam, ninguém sabe se pode apagar uma regra. **BEM** (*Block, Element, Modifier*) é uma convenção de nomes que resolve isso:

- **Bloco:** um componente independente → `.cartao`
- **Elemento:** uma parte do bloco → `.cartao__titulo` (dois sublinhados)
- **Modificador:** uma variação → `.cartao--destaque` (dois hífens)

```html
<article class="cartao cartao--destaque">
  <img class="cartao__imagem" src="..." alt="...">
  <h2 class="cartao__titulo">Notebook</h2>
  <p class="cartao__preco">R$ 4.500,00</p>
  <button class="cartao__botao cartao__botao--desabilitado">Esgotado</button>
</article>
```

```css
.cartao { }
.cartao--destaque { border: 2px solid gold; }
.cartao__titulo { }
.cartao__botao { }
.cartao__botao--desabilitado { opacity: 0.5; }
```

Vantagens: todas as regras têm especificidade baixa e igual (uma classe), e o nome diz exatamente onde a classe é usada.

**Organização de arquivos sugerida:**

```
css/
├── base/        → reset, tipografia, variáveis
├── layout/      → cabeçalho, rodapé, grade da página
├── componentes/ → botões, cartões, formulários
└── utilitarios/ → classes de uma só função (.texto-centro, .oculto)
```

### Exercícios da Parte 6

1. Refatore os estilos que você criou até aqui usando variáveis CSS para todas as cores, espaçamentos e raios.
2. Adicione um botão que alterna entre tema claro e escuro trocando uma classe no `<body>` (JavaScript do Guia 2) e redefinindo as variáveis nessa classe.
3. Crie um indicador de carregamento (spinner) só com CSS.
4. Renomeie as classes do seu cartão de produto seguindo o BEM.

---

## Parte 7: Frameworks e ferramentas de CSS

### 7.1 Por que usar um framework?

Frameworks de CSS oferecem estilos e componentes prontos, consistentes e testados em vários navegadores. Aceleram muito o desenvolvimento, principalmente de sistemas internos e protótipos.

**Mas atenção:** aprenda CSS puro primeiro. Sem entender box model, Flexbox e Grid, você não vai conseguir personalizar nem depurar o framework quando algo sair do esperado.

### 7.2 Bootstrap

O framework mais popular por muitos anos. Baseado em **componentes prontos** e num **sistema de grid de 12 colunas**.

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card">
        <img src="notebook.jpg" class="card-img-top" alt="Notebook">
        <div class="card-body">
          <h5 class="card-title">Notebook Pro</h5>
          <p class="card-text">R$ 4.500,00</p>
          <button class="btn btn-primary">Comprar</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

`col-12 col-md-6 col-lg-4` significa: ocupar 12 de 12 colunas no celular, 6 (metade) em telas médias e 4 (um terço) em telas grandes.

- **Prós:** rápido de aprender, muitos componentes (modais, menus, carrosséis), ótima documentação.
- **Contras:** sites ficam com "cara de Bootstrap"; personalizar exige sobrescrever muitos estilos.

### 7.3 Tailwind CSS

Abordagem **utility-first**: em vez de componentes prontos, oferece milhares de classes pequenas, cada uma com uma única função, que você combina direto no HTML.

```html
<article class="max-w-sm rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition">
  <img class="w-full rounded-lg" src="notebook.jpg" alt="Notebook">
  <h2 class="mt-4 text-xl font-bold text-gray-900">Notebook Pro</h2>
  <p class="text-lg text-blue-600">R$ 4.500,00</p>
  <button class="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 md:w-auto">
    Comprar
  </button>
</article>
```

`md:w-auto` aplica `width: auto` só a partir do breakpoint médio (mobile first).

- **Prós:** design totalmente personalizado; não precisa inventar nomes de classes; o CSS final só inclui as classes usadas.
- **Contras:** HTML fica carregado; curva de aprendizado dos nomes; exige saber CSS para entender o que cada classe faz.

### 7.4 Angular Material

Biblioteca oficial de componentes para Angular, seguindo o **Material Design** do Google. Traz componentes completos e acessíveis: tabelas com paginação e ordenação, formulários, diálogos, menus, datepickers.

```bash
ng add @angular/material
```

```ts
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [MatButtonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Notebook Pro</mat-card-title>
      </mat-card-header>
      <mat-card-content>R$ 4.500,00</mat-card-content>
      <mat-card-actions>
        <button mat-flat-button>Comprar</button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class CartaoMaterial {}
```

Outras bibliotecas populares para Angular: **PrimeNG** e **ng-bootstrap**.

### 7.5 Comparativo

| | CSS puro | Bootstrap | Tailwind | Angular Material |
|--|----------|-----------|----------|------------------|
| Abordagem | Você escreve tudo | Componentes prontos | Classes utilitárias | Componentes Angular |
| Personalização | Total | Média | Total | Média (via temas) |
| Velocidade inicial | Lenta | Rápida | Média | Rápida |
| Curva de aprendizado | CSS | Baixa | Média | Média |
| Ideal para | Aprender, projetos únicos | Protótipos, sistemas internos | Designs próprios | Sistemas corporativos em Angular |

### 7.6 Pré-processadores: Sass/SCSS

**Sass** é uma linguagem que estende o CSS e é compilada para CSS (lembra da transpilação do Guia 2?). A sintaxe **SCSS** é a mais usada e é um superconjunto do CSS.

```scss
// _variaveis.scss
$cor-primaria: #2563eb;
$breakpoint-md: 768px;

// _mixins.scss
@mixin tablet {
  @media (min-width: $breakpoint-md) { @content; }
}

// cartao.scss
@use 'variaveis' as *;
@use 'mixins' as *;

.cartao {
  padding: 1rem;

  &__titulo {               // gera .cartao__titulo
    color: $cor-primaria;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @include tablet {
    padding: 2rem;
  }
}
```

Recursos: variáveis, aninhamento, mixins (blocos reutilizáveis), funções, divisão em arquivos parciais. O Angular suporta SCSS nativamente (escolha "SCSS" ao criar o projeto). Com o CSS moderno ganhando variáveis e aninhamento, o Sass ficou menos indispensável, mas ainda é muito usado no mercado.

### Exercícios da Parte 7

1. Recrie a galeria de produtos da Parte 4 usando Bootstrap.
2. Recrie a mesma galeria usando Tailwind (use o CDN de testes: https://tailwindcss.com/docs/installation/play-cdn).
3. Compare as três versões (CSS puro, Bootstrap, Tailwind): qual foi mais rápida de fazer? Qual ficou mais fácil de ler? Qual ficou mais parecida com o que você imaginou?

---

## Parte 8: HTML e CSS no Angular

### 8.1 Templates são HTML com superpoderes

Tudo o que você aprendeu neste guia vale dentro dos templates Angular (Guia 2, Parte 6). O Angular acrescenta data binding e controle de fluxo:

```html
<article class="cartao" [class.cartao--esgotado]="produto().estoque === 0">
  <img class="cartao__imagem" [src]="produto().foto" [alt]="produto().nome">
  <h2 class="cartao__titulo">{{ produto().nome }}</h2>
  <button
    type="button"
    class="cartao__botao"
    [disabled]="produto().estoque === 0"
    [attr.aria-label]="'Adicionar ' + produto().nome + ' ao carrinho'"
    (click)="comprar()">
    Comprar
  </button>
</article>
```

**Classes e estilos dinâmicos:**

```html
<div [class.ativo]="estaAtivo()">...</div>
<div [class]="{ ativo: estaAtivo(), erro: temErro() }">...</div>
<div [style.width.%]="progresso()">...</div>
```

### 8.2 Encapsulamento de estilos

Por padrão, o CSS de um componente Angular **só afeta aquele componente**. O Angular faz isso adicionando atributos únicos aos elementos e reescrevendo os seletores.

```css
/* cartao-produto.css: só afeta o CartaoProduto */
h2 {
  color: navy;    /* não muda os <h2> de outros componentes */
}

:host {
  display: block;    /* estiliza o próprio elemento <app-cartao-produto> */
}

:host(.destaque) {
  border: 2px solid gold;
}
```

Isso resolve boa parte dos problemas que o BEM resolve. Estilos globais (reset, variáveis, tipografia) ficam no `src/styles.css`.

### 8.3 Onde colocar cada estilo

| Onde | O quê |
|------|-------|
| `src/styles.css` | Reset, variáveis CSS, tipografia base, classes utilitárias |
| `componente.css` | Estilos específicos do componente |
| Framework (Material, Tailwind) | Componentes e utilitários prontos |

### Exercícios da Parte 8

1. Aplique os estilos deste guia à aplicação **Minha Loja** do Guia 2: variáveis CSS globais, cartões com Grid responsivo e um cabeçalho com Flexbox.
2. Crie um componente `Botao` reutilizável com input `variante` (`'primario' | 'secundario' | 'perigo'`) que muda as classes aplicadas.
3. Rode o Lighthouse na sua aplicação Angular e atinja nota acima de 90 em acessibilidade.

---

## Glossário

| Termo | Significado |
|-------|-------------|
| Acessibilidade (a11y) | Prática de tornar o site utilizável por todas as pessoas |
| ARIA | Atributos que complementam a semântica para tecnologias assistivas |
| BEM | Convenção de nomes de classes: Bloco, Elemento, Modificador |
| Box model | Modelo de caixa: conteúdo, padding, borda e margem |
| Breakpoint | Largura de tela em que o layout muda |
| Cascata | Regras que decidem qual declaração CSS vence um conflito |
| Especificidade | "Peso" de um seletor CSS |
| Flexbox | Sistema de layout em uma dimensão |
| Grid | Sistema de layout em duas dimensões |
| Media query | Regra CSS aplicada só sob certas condições (largura, tema...) |
| Mobile first | Estratégia de escrever o CSS começando pelas telas pequenas |
| Semântica | Uso de elementos HTML pelo significado do conteúdo |
| Viewport | Área visível da página no navegador |

## Para continuar estudando

- **MDN Web Docs (em português):** https://developer.mozilla.org/pt-BR/docs/Web/HTML e https://developer.mozilla.org/pt-BR/docs/Web/CSS
- **web.dev (Google):** cursos gratuitos *Learn HTML*, *Learn CSS*, *Learn Responsive Design* e *Learn Accessibility*: https://web.dev/learn
- **CSS-Tricks:** os guias completos de Flexbox e Grid são referência: https://css-tricks.com
- **Jogos:** Flexbox Froggy, Grid Garden, CSS Diner (seletores): https://flukeout.github.io
- **Inspiração e desafios:** https://www.frontendmentor.io traz layouts profissionais para você reproduzir.
- **Can I Use:** https://caniuse.com mostra quais navegadores suportam cada recurso.

**Próximo passo:** [Guia 4: SQL com SQL Server](04-sql-server.md)
