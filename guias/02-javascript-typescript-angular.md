# Guia 2: JavaScript, TypeScript e Angular

> **Objetivo:** reforçar a lógica de programação com uma segunda linguagem, entender a diferença entre linguagens compiladas e interpretadas, conhecer o JavaScript a fundo e como ele dá vida às páginas web, e terminar construindo aplicações com TypeScript e Angular.
>
> **Pré-requisito:** Guia 1 (C#). Muitos conceitos (variáveis, laços, funções, classes, async) já foram vistos lá; aqui focamos no que é diferente.

## Sumário

- [Parte 0: O que é JavaScript e preparando o ambiente](#parte-0-o-que-é-javascript-e-preparando-o-ambiente)
- [Parte 1: Lógica de programação com JavaScript](#parte-1-lógica-de-programação-com-javascript)
- [Parte 2: Linguagens compiladas x interpretadas](#parte-2-linguagens-compiladas-x-interpretadas)
- [Parte 3: A linguagem JavaScript a fundo](#parte-3-a-linguagem-javascript-a-fundo)
- [Parte 4: JavaScript na web](#parte-4-javascript-na-web)
- [Parte 5: TypeScript](#parte-5-typescript)
- [Parte 6: Angular](#parte-6-angular)
- [Glossário](#glossário)
- [Para continuar estudando](#para-continuar-estudando)

---

## Parte 0: O que é JavaScript e preparando o ambiente

### Um pouco de história

O JavaScript foi criado em **1995** por Brendan Eich, na Netscape, em apenas 10 dias. O objetivo era dar interatividade às páginas web, que até então eram apenas documentos estáticos. Apesar do nome, **JavaScript não tem nada a ver com Java**: o nome foi uma jogada de marketing.

A linguagem é padronizada pela especificação **ECMAScript** (ES). Você vai ver nomes como ES6 (ou ES2015), que trouxe grandes mudanças (`let`, `const`, classes, arrow functions, módulos). Desde então sai uma versão nova por ano.

### Onde o JavaScript roda

| Ambiente | Uso |
|----------|-----|
| **Navegador** | Interatividade em páginas web (o uso original) |
| **Node.js** | Servidores, ferramentas de linha de comando, scripts |
| **Outros** | Apps mobile (React Native, Ionic), desktop (Electron, como o VS Code) |

Hoje o JavaScript é a única linguagem que roda nativamente em todos os navegadores, por isso todo desenvolvedor web precisa conhecê-la.

### Ferramentas deste guia

| Ferramenta | Para quê | Obrigatória? |
|-----------|----------|--------------|
| **Node.js (LTS)** | Executar JavaScript fora do navegador; traz o **npm** | Sim |
| **Visual Studio Code** | Editor de código | Sim |
| **Angular CLI** | Criar e executar projetos Angular | Sim (Parte 6) |
| **Navegador moderno** | Chrome, Edge ou Firefox, com DevTools | Sim |

> Para JavaScript, TypeScript e Angular, o **VS Code** é a ferramenta padrão do mercado. O Visual Studio Community funciona, mas não é a melhor escolha para front-end.

### Instalando o Node.js

O **Node.js** executa JavaScript fora do navegador. Junto com ele vem o **npm**, o gerenciador de pacotes que instala o Angular, o TypeScript e milhares de outras bibliotecas.

1. Acesse https://nodejs.org.
2. Baixe a versão **LTS** (não a "Current"). O Angular só oferece suporte oficial às versões LTS.
3. Execute o instalador com as opções padrão. A opção de instalar "ferramentas para módulos nativos" pode ficar desmarcada.

Pelo terminal, no Windows:

```bash
winget install OpenJS.NodeJS.LTS
```

**Confira a instalação** num terminal **novo**:

```bash
node --version    # ex.: v24.x.x
npm --version
```

> **Erro no PowerShell ao rodar `npm` ou `ng`?** Se aparecer uma mensagem sobre "execução de scripts desabilitada neste sistema", libere scripts locais para o seu usuário (só precisa fazer uma vez):
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

- **macOS:** use o instalador do site ou `brew install node`.
- **Linux:** a forma mais prática é o **nvm** (https://github.com/nvm-sh/nvm), que também permite ter várias versões do Node instaladas.

### Configurando o Visual Studio Code

Se você ainda não instalou o VS Code, veja a Parte 0 do Guia 1. Para este guia, instale estas extensões (**Ctrl+Shift+X**):

| Extensão | Para quê |
|----------|----------|
| **ESLint** | Aponta erros e más práticas no código JavaScript/TypeScript |
| **Prettier - Code formatter** | Formata o código automaticamente |
| **Angular Language Service** | Autocompletar e verificação de erros nos templates Angular |
| **Live Server** | Abre páginas HTML num servidor local que recarrega a cada alteração |

Ative a formatação ao salvar: **Ctrl+,** → pesquise **Format On Save** → marque a opção.

### Instalando o Angular CLI

O **Angular CLI** é a ferramenta de linha de comando que cria projetos, gera componentes e executa a aplicação. Você vai usá-lo na Parte 6, mas já pode instalar:

```bash
npm install -g @angular/cli
ng version
```

O `-g` instala o pacote **globalmente**, para que o comando `ng` funcione em qualquer pasta.

### Testando o ambiente

**Opção 1: o console do navegador.** Abra qualquer página, pressione **F12** e vá na aba **Console**. Digite:

```js
console.log("Olá, mundo!");
```

**Opção 2: Node.js.** Crie um arquivo `ola.js` no VS Code com o mesmo conteúdo e rode no terminal integrado (**Ctrl+'**):

```bash
node ola.js
```

Para os exemplos das Partes 1 a 3, use o Node.js. Para a Parte 4, use o navegador.

---

## Parte 1: Lógica de programação com JavaScript

Esta parte revisa a lógica do Guia 1, destacando onde o JavaScript se comporta diferente do C#.

### 1.1 Variáveis

```js
let idade = 25;            // pode ser reatribuída
const nome = "Gabriel";    // não pode ser reatribuída
var antigo = "evite";      // forma antiga, com regras de escopo confusas
```

**Regra prática:** use `const` por padrão. Use `let` só quando precisar reatribuir. Não use `var`.

### 1.2 Tipagem dinâmica

Esta é a **maior diferença** em relação ao C#. Em JavaScript, a variável **não tem tipo**: quem tem tipo é o **valor**. A mesma variável pode guardar um número e depois um texto.

```js
let x = 10;         // number
x = "dez";          // agora string, e está tudo bem para o JS
x = true;           // agora boolean
```

Em C# isso seria erro de compilação. Em JavaScript, só vai dar problema (se der) quando o programa estiver rodando. O TypeScript (Parte 5) existe justamente para trazer de volta a segurança de tipos.

**Tipos primitivos:**

| Tipo | Exemplo | Observação |
|------|---------|------------|
| `number` | `42`, `3.14`, `-7` | Inteiros e decimais são o mesmo tipo |
| `bigint` | `9007199254740993n` | Inteiros enormes |
| `string` | `"texto"`, `'texto'`, `` `texto` `` | Três formas de aspas |
| `boolean` | `true`, `false` | |
| `undefined` | `undefined` | Variável declarada sem valor |
| `null` | `null` | "Nenhum valor", atribuído de propósito |
| `symbol` | `Symbol("id")` | Identificadores únicos (uso avançado) |

Todo o resto (arrays, funções, datas) é **objeto**.

```js
console.log(typeof 42);          // "number"
console.log(typeof "oi");        // "string"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object"  ← bug histórico da linguagem
console.log(typeof [1, 2]);      // "object"
```

### 1.3 Template strings

```js
const produto = "Café";
const preco = 12.5;
console.log(`O ${produto} custa R$ ${preco.toFixed(2)}`);   // crase, não aspas
```

### 1.4 Operadores e a armadilha da coerção

Os operadores aritméticos, relacionais e lógicos são os mesmos do C#. A diferença está na **coerção de tipos**: o JavaScript tenta converter valores automaticamente, às vezes de forma surpreendente.

```js
console.log("5" + 3);     // "53"  ← + com string concatena
console.log("5" - 3);     // 2     ← - converte para número
console.log("5" * "2");   // 10
console.log(true + 1);    // 2
console.log([] + {});     // "[object Object]"
```

**`==` versus `===`:**

```js
console.log(5 == "5");    // true   ← compara depois de converter
console.log(5 === "5");   // false  ← compara valor E tipo
console.log(0 == false);  // true
console.log(0 === false); // false
console.log(null == undefined);  // true
```

> **Regra de ouro:** use **sempre** `===` e `!==`. Esqueça que `==` existe.

**Valores "falsy":** em um `if`, estes valores contam como falso: `false`, `0`, `""` (string vazia), `null`, `undefined`, `NaN`. Todo o resto conta como verdadeiro (inclusive `"0"`, `[]` e `{}`).

```js
const nomeDigitado = "";
if (!nomeDigitado) {
  console.log("Nome é obrigatório");
}
```

**Operadores modernos:**

```js
const usuario = null;
console.log(usuario?.nome);          // undefined, sem erro (optional chaining)
console.log(usuario ?? "Visitante"); // "Visitante" (nullish coalescing)
```

### 1.5 Decisões e laços

A sintaxe de `if`, `else`, `switch`, `for`, `while` e `do...while` é praticamente igual à do C#:

```js
const nota = 8;

if (nota >= 7) {
  console.log("Aprovado");
} else if (nota >= 5) {
  console.log("Recuperação");
} else {
  console.log("Reprovado");
}

for (let i = 1; i <= 5; i++) {
  console.log(`Volta ${i}`);
}
```

**Dois laços diferentes para coleções:**

```js
const frutas = ["maçã", "banana", "uva"];

for (const fruta of frutas) {     // of → percorre os VALORES (use este para arrays)
  console.log(fruta);
}

const pessoa = { nome: "Ana", idade: 30 };
for (const chave in pessoa) {     // in → percorre as CHAVES de um objeto
  console.log(`${chave}: ${pessoa[chave]}`);
}
```

### 1.6 Funções

Há várias formas de criar funções em JavaScript:

```js
// Declaração de função
function somar(a, b) {
  return a + b;
}

// Expressão de função
const subtrair = function (a, b) {
  return a - b;
};

// Arrow function (a mais usada hoje)
const multiplicar = (a, b) => a * b;

// Arrow function com corpo
const dividir = (a, b) => {
  if (b === 0) throw new Error("Divisão por zero");
  return a / b;
};
```

**Parâmetros padrão e rest:**

```js
const saudar = (nome = "visitante") => `Olá, ${nome}!`;
saudar();          // "Olá, visitante!"

const somarTodos = (...numeros) => numeros.reduce((acc, n) => acc + n, 0);
somarTodos(1, 2, 3, 4);   // 10
```

**Funções são valores.** Podem ser guardadas em variáveis, passadas como parâmetro e retornadas de outras funções. Uma função que recebe ou retorna outra função é chamada de **função de ordem superior** (*higher-order function*).

```js
function executarDuasVezes(acao) {
  acao();
  acao();
}
executarDuasVezes(() => console.log("Oi!"));
```

### 1.7 Arrays

```js
const numeros = [5, 3, 8, 1];
numeros.push(10);           // adiciona no fim
numeros.pop();              // remove do fim
numeros.unshift(0);         // adiciona no início
numeros.shift();            // remove do início
console.log(numeros.length);
console.log(numeros.includes(8));   // true
console.log(numeros.indexOf(3));    // 1
```

**Métodos funcionais** (equivalentes ao LINQ do C#; você vai usá-los o tempo todo):

| JavaScript | LINQ (C#) | O que faz |
|------------|-----------|-----------|
| `filter` | `Where` | Filtra elementos |
| `map` | `Select` | Transforma cada elemento |
| `reduce` | `Aggregate` / `Sum` | Reduz a um único valor |
| `find` | `FirstOrDefault` | Primeiro que satisfaz a condição |
| `some` | `Any` | Algum satisfaz? |
| `every` | `All` | Todos satisfazem? |
| `sort` | `OrderBy` | Ordena (altera o array original!) |

```js
const produtos = [
  { nome: "Notebook", preco: 4500, categoria: "Eletrônicos" },
  { nome: "Mouse", preco: 80, categoria: "Eletrônicos" },
  { nome: "Cadeira", preco: 900, categoria: "Móveis" },
];

const caros = produtos.filter(p => p.preco > 500);
const nomes = produtos.map(p => p.nome);
const total = produtos.reduce((soma, p) => soma + p.preco, 0);
const mouse = produtos.find(p => p.nome === "Mouse");
const ordenados = [...produtos].sort((a, b) => a.preco - b.preco);   // copia antes de ordenar
```

### 1.8 Objetos

Em JavaScript você cria objetos diretamente, sem precisar de uma classe:

```js
const carro = {
  marca: "Fiat",
  modelo: "Uno",
  ano: 2010,
  ligar() {
    console.log(`${this.modelo} ligado!`);
  },
};

console.log(carro.marca);       // notação de ponto
console.log(carro["modelo"]);   // notação de colchetes
carro.cor = "vermelho";         // adiciona uma propriedade nova
delete carro.ano;               // remove uma propriedade
carro.ligar();
```

**Desestruturação e spread** (muito usados no Angular e em qualquer código moderno):

```js
const { marca, modelo } = carro;              // extrai propriedades
const [primeiro, segundo] = [10, 20, 30];     // extrai do array

const carroNovo = { ...carro, ano: 2024 };    // copia e sobrescreve
const todos = [...[1, 2], ...[3, 4]];         // [1, 2, 3, 4]
```

### 1.9 Os mesmos algoritmos, outra linguagem

Reescrever algoritmos conhecidos numa linguagem nova é a melhor forma de aprendê-la.

```js
// Busca binária
function buscaBinaria(ordenado, alvo) {
  let inicio = 0;
  let fim = ordenado.length - 1;
  while (inicio <= fim) {
    const meio = Math.floor((inicio + fim) / 2);   // sem Math.floor teríamos decimais!
    if (ordenado[meio] === alvo) return meio;
    if (ordenado[meio] < alvo) inicio = meio + 1;
    else fim = meio - 1;
  }
  return -1;
}

// Palíndromo
const ehPalindromo = texto => {
  const limpo = texto.toLowerCase().replace(/[^a-z]/g, "");
  return limpo === [...limpo].reverse().join("");
};
```

Repare no `Math.floor`: em C#, `7 / 2` entre inteiros dá `3`. Em JavaScript, dá `3.5`, porque só existe o tipo `number`.

### Exercícios da Parte 1

1. Refaça em JavaScript os exercícios 3, 4 (FizzBuzz), 6 e 7 da Parte 1 do Guia 1.
2. Sem rodar, preveja o resultado de cada linha. Depois rode e confira:
   ```js
   console.log("10" + 1);
   console.log("10" - 1);
   console.log(1 + 2 + "3");
   console.log("1" + 2 + 3);
   console.log(0.1 + 0.2 === 0.3);
   console.log([] == false);
   ```
3. Dado um array de alunos `{ nome, nota }`, use `filter`, `map` e `reduce` para: listar os nomes dos aprovados, calcular a média da turma e encontrar o aluno com maior nota.
4. Escreva uma função `contarVogais(texto)`.
5. Escreva uma função `agruparPor(array, chave)` que agrupe objetos por uma propriedade. Exemplo: `agruparPor(produtos, "categoria")`.

---

## Parte 2: Linguagens compiladas x interpretadas

### 2.1 O problema

O processador do computador só entende **código de máquina**: sequências de números binários específicas para cada tipo de processador. Ninguém escreve programas assim. Escrevemos em linguagens de alto nível (C#, JavaScript, Python) e alguém precisa **traduzir**.

Existem duas estratégias principais de tradução.

### 2.2 Linguagens compiladas

Um **compilador** traduz o programa **inteiro, antes da execução**, gerando um arquivo executável.

```
código-fonte ──► COMPILADOR ──► executável ──► roda
              (uma vez, antes)              (muitas vezes)
```

Analogia: traduzir um livro inteiro antes de publicá-lo. Dá trabalho antes, mas o leitor lê rápido, e erros de tradução são achados antes da publicação.

- **Exemplos:** C, C++, Rust, Go.
- **Vantagens:** execução rápida; muitos erros são encontrados antes de rodar (erros de compilação).
- **Desvantagens:** precisa compilar a cada mudança; o executável costuma ser específico de um sistema operacional e processador.

### 2.3 Linguagens interpretadas

Um **interpretador** lê e executa o código **linha a linha, durante a execução**.

```
código-fonte ──► INTERPRETADOR (traduz e executa ao mesmo tempo)
```

Analogia: um intérprete simultâneo numa conferência. Começa na hora, mas cada frase precisa ser traduzida no momento, e um erro só aparece quando aquela frase é dita.

- **Exemplos clássicos:** JavaScript, Python, Ruby, PHP.
- **Vantagens:** começa a rodar imediatamente; o mesmo código roda em qualquer lugar que tenha o interpretador; mais flexível.
- **Desvantagens:** historicamente mais lenta; erros só aparecem quando aquela linha executa.

Exemplo do último ponto em JavaScript:

```js
function calcular(tipo) {
  if (tipo === "raro") {
    return variavelQueNaoExiste * 2;   // erro de digitação
  }
  return 42;
}

console.log(calcular("comum"));   // 42, funciona normalmente
console.log(calcular("raro"));    // ReferenceError, só agora
```

Em C#, esse código nem compilaria. Em JavaScript, o bug pode passar despercebido por meses, até alguém cair no caso "raro".

### 2.4 Na prática, a fronteira é borrada

As linguagens modernas misturam as duas estratégias:

**C# (compilação em duas etapas):**

```
.cs ──► compilador C# ──► IL (bytecode) ──► JIT do .NET ──► código de máquina
       (antes de rodar)                    (durante a execução)
```

**JavaScript moderno (interpretação + compilação JIT):**

Os motores de JavaScript (como o **V8**, usado pelo Chrome e pelo Node.js) começam interpretando o código para iniciar rápido. Enquanto o programa roda, eles observam quais funções são executadas muitas vezes ("código quente") e as **compilam para código de máquina otimizado** em tempo de execução. Isso se chama compilação **JIT** (*Just-In-Time*). É por isso que o JavaScript de hoje é muito mais rápido que o de 2005.

**TypeScript (transpilação):**

```
.ts ──► compilador TypeScript ──► .js ──► motor JavaScript
```

O TypeScript é "compilado" para JavaScript. Quando uma linguagem é traduzida para outra de mesmo nível, chamamos de **transpilação**.

### 2.5 Tipagem estática x dinâmica

Este é um eixo diferente de compilado x interpretado, mas costuma andar junto:

| | Tipagem estática | Tipagem dinâmica |
|--|------------------|------------------|
| **Quando os tipos são verificados** | Antes de rodar | Durante a execução |
| **A variável tem tipo?** | Sim, fixo | Não, só o valor tem |
| **Exemplos** | C#, Java, TypeScript | JavaScript, Python |

E também existe **tipagem forte x fraca**: o quanto a linguagem faz conversões automáticas. O JavaScript é de tipagem **fraca** (`"5" - 3` vira `2`). O Python é dinâmico mas forte (`"5" - 3` dá erro).

### 2.6 Resumo comparativo

| Característica | C# | JavaScript | TypeScript |
|----------------|----|-----------|------------|
| Execução | Compilado para IL + JIT | Interpretado + JIT | Transpilado para JS |
| Tipagem | Estática, forte | Dinâmica, fraca | Estática (só em desenvolvimento) |
| Erros de tipo encontrados | Na compilação | Em execução | Na compilação |
| Onde roda | Runtime .NET | Navegador, Node.js | Onde o JS gerado rodar |

### Exercícios da Parte 2

1. Explique com suas palavras a diferença entre compilador e interpretador, usando uma analogia diferente das deste guia.
2. Escreva em JavaScript uma função com um erro que só aparece em um caminho específico do `if`. Depois escreva o equivalente em C# e veja o compilador reclamar.
3. Pesquise: o que é **AOT** (*Ahead-Of-Time*) e como o Angular e o .NET usam esse conceito?

---

## Parte 3: A linguagem JavaScript a fundo

### 3.1 Escopo

**Escopo** define onde uma variável pode ser acessada.

```js
const global = "visível em todo lugar";

function exemplo() {
  const local = "só dentro da função";
  if (true) {
    const bloco = "só dentro do if";
    var vazado = "var ignora blocos!";
  }
  console.log(vazado);   // funciona: var tem escopo de função
  // console.log(bloco); // ReferenceError: let/const têm escopo de bloco
}
```

Esse comportamento do `var` é um dos motivos para evitá-lo.

### 3.2 Hoisting

O JavaScript "iça" (*hoist*) declarações para o topo do escopo antes de executar.

```js
console.log(soma(2, 3));       // 5 — declarações de função são içadas inteiras
function soma(a, b) { return a + b; }

console.log(x);                // undefined — var é içado, mas sem o valor
var x = 10;

// console.log(y);             // ReferenceError — let/const ficam numa "zona morta"
let y = 20;
```

### 3.3 Closures

Uma **closure** é uma função que "lembra" das variáveis do escopo onde foi criada, mesmo depois que esse escopo terminou.

```js
function criarContador() {
  let contagem = 0;            // variável "privada"
  return () => {
    contagem++;
    return contagem;
  };
}

const contador = criarContador();
console.log(contador());   // 1
console.log(contador());   // 2
console.log(contador());   // 3
// Não há como acessar "contagem" diretamente de fora.
```

Closures estão em todo lugar em JavaScript: em eventos, callbacks e no próprio Angular.

### 3.4 `this`

O valor de `this` depende de **como a função é chamada**, não de onde foi escrita. Isso confunde até desenvolvedores experientes.

```js
const pessoa = {
  nome: "Ana",
  falarNormal() {
    console.log(this.nome);
  },
  falarArrow: () => {
    console.log(this.nome);    // arrow function NÃO tem this próprio
  },
  falarDepois() {
    setTimeout(() => console.log(this.nome), 100);   // arrow herda o this de fora: "Ana"
  },
};

pessoa.falarNormal();   // "Ana"
pessoa.falarArrow();    // undefined

const solta = pessoa.falarNormal;
solta();                // undefined: perdeu o contexto
```

**Regra prática:** use métodos normais em objetos e classes; use arrow functions em callbacks dentro desses métodos.

### 3.5 Protótipos e classes

O JavaScript é orientado a objetos baseado em **protótipos**: cada objeto tem uma ligação com outro objeto (seu protótipo), de onde herda propriedades. As classes (ES6) são uma sintaxe mais amigável sobre esse mecanismo.

```js
class Animal {
  #energia = 100;             // # = campo privado

  constructor(nome) {
    this.nome = nome;
  }

  comer() {
    this.#energia += 10;
    console.log(`${this.nome} comeu. Energia: ${this.#energia}`);
  }

  emitirSom() {
    console.log("...");
  }

  static criarDesconhecido() {   // método da classe, não do objeto
    return new Animal("Desconhecido");
  }
}

class Cachorro extends Animal {
  emitirSom() {                  // sobrescreve (polimorfismo)
    console.log("Au au!");
  }
}

const rex = new Cachorro("Rex");
rex.comer();
rex.emitirSom();
```

Compare com o C# do Guia 1: os conceitos de POO são os mesmos.

### 3.6 Módulos

Módulos permitem dividir o código em arquivos, cada um exportando o que outros podem usar.

```js
// matematica.js
export const PI = 3.14159;
export function areaCirculo(raio) {
  return PI * raio * raio;
}
export default function somar(a, b) {
  return a + b;
}
```

```js
// app.js
import somar, { PI, areaCirculo } from "./matematica.js";
console.log(somar(2, 3), areaCirculo(2));
```

No Node.js, adicione `"type": "module"` ao `package.json` para usar essa sintaxe. Você também vai ver a sintaxe antiga do Node: `require()` e `module.exports` (CommonJS).

### 3.7 Programação assíncrona e o event loop

O JavaScript executa seu código em **uma única thread**: faz uma coisa de cada vez. Se ele parasse para esperar uma resposta da rede, a página inteira congelaria. A solução é o modelo **assíncrono baseado em eventos**.

**Como funciona o event loop (simplificado):**

```
┌─────────────────┐       ┌──────────────────────────┐
│  Call Stack     │       │ APIs do ambiente          │
│  (executando)   │──────►│ (timers, rede, eventos)   │
└────────▲────────┘       └────────────┬─────────────┘
         │                             │ quando termina
         │    ┌─────────────────────┐  │
         └────│  Fila de tarefas    │◄─┘
  event loop  └─────────────────────┘
  (quando a pilha esvazia, pega o próximo da fila)
```

```js
console.log("1");
setTimeout(() => console.log("2"), 0);   // mesmo com 0 ms, vai para a fila
console.log("3");
// Saída: 1, 3, 2
```

**Evolução das formas de lidar com assincronia:**

**1. Callbacks** (antigo; leva ao "callback hell"):

```js
buscarUsuario(1, usuario => {
  buscarPedidos(usuario.id, pedidos => {
    buscarItens(pedidos[0].id, itens => {
      console.log(itens);   // a pirâmide só cresce...
    });
  });
});
```

**2. Promises** (uma "promessa" de um valor futuro):

```js
const promessa = new Promise((resolve, reject) => {
  setTimeout(() => {
    const deuCerto = true;
    if (deuCerto) resolve("Dados carregados");
    else reject(new Error("Falhou"));
  }, 1000);
});

promessa
  .then(resultado => console.log(resultado))
  .catch(erro => console.error(erro.message))
  .finally(() => console.log("Terminou"));
```

Uma Promise está sempre em um de três estados: **pendente**, **resolvida** (*fulfilled*) ou **rejeitada** (*rejected*).

**3. async/await** (a forma moderna; mesma ideia do C#):

```js
async function carregarDados() {
  try {
    const usuario = await buscarUsuario(1);
    const pedidos = await buscarPedidos(usuario.id);
    const itens = await buscarItens(pedidos[0].id);
    console.log(itens);
  } catch (erro) {
    console.error("Erro:", erro.message);
  }
}
```

**Executando em paralelo:**

```js
const [usuarios, produtos] = await Promise.all([
  fetch("/api/usuarios").then(r => r.json()),
  fetch("/api/produtos").then(r => r.json()),
]);
```

### 3.8 Tratamento de erros

```js
function dividir(a, b) {
  if (b === 0) throw new Error("Divisão por zero");
  return a / b;
}

try {
  dividir(10, 0);
} catch (erro) {
  console.error(erro.message);
} finally {
  console.log("Sempre executa");
}
```

### 3.9 Imutabilidade

Muitos bugs vêm de alterar um objeto que outra parte do código também está usando (lembra dos tipos por referência do Guia 1?). Em JavaScript moderno, e especialmente em Angular, prefira **criar cópias** em vez de alterar:

```js
const lista = [1, 2, 3];
const novaLista = [...lista, 4];                     // em vez de lista.push(4)

const usuario = { nome: "Ana", idade: 30 };
const atualizado = { ...usuario, idade: 31 };        // em vez de usuario.idade = 31

const semDois = lista.filter(n => n !== 2);          // em vez de splice
```

### Exercícios da Parte 3

1. Crie uma função `criarBanco()` que use closure para manter um saldo privado e retorne funções `depositar`, `sacar` e `verSaldo`.
2. Reescreva a hierarquia `Funcionario` → `Gerente`, `Desenvolvedor` do Guia 1 usando classes JavaScript.
3. Crie uma função `esperar(ms)` que retorne uma Promise resolvida depois de `ms` milissegundos. Use-a com `await` para imprimir "1", "2" e "3" com um segundo de intervalo.
4. Preveja a ordem de saída e depois confira:
   ```js
   console.log("A");
   setTimeout(() => console.log("B"), 0);
   Promise.resolve().then(() => console.log("C"));
   console.log("D");
   ```
   Dica: pesquise sobre **microtasks**.
5. Divida o exercício 1 em dois módulos: `banco.js` (exporta `criarBanco`) e `app.js` (usa).

---

## Parte 4: JavaScript na web

### 4.1 O papel de cada linguagem no navegador

| Linguagem | Papel | Analogia com uma casa |
|-----------|-------|-----------------------|
| **HTML** | Estrutura e conteúdo | Paredes, portas, cômodos |
| **CSS** | Aparência | Pintura, decoração |
| **JavaScript** | Comportamento | Eletricidade, interruptores, campainha |

O HTML e o CSS são aprofundados no Guia 3. Aqui você só precisa do básico de HTML para ver o JavaScript funcionando.

### 4.2 Incluindo JavaScript numa página

Crie `index.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Meu primeiro script</title>
  <script src="app.js" defer></script>
</head>
<body>
  <h1 id="titulo">Olá!</h1>
  <button id="botao">Clique aqui</button>
</body>
</html>
```

E `app.js`:

```js
console.log("O script carregou!");
```

O atributo `defer` faz o script rodar só depois que o HTML for carregado. Abra o `index.html` no navegador (ou use a extensão **Live Server** do VS Code) e veja o console (F12).

### 4.3 O DOM

O **DOM** (*Document Object Model*) é a representação da página HTML como uma **árvore de objetos** que o JavaScript pode ler e alterar.

```
document
└── html
    ├── head
    │   └── title
    └── body
        ├── h1#titulo
        └── button#botao
```

**Selecionando elementos:**

```js
const titulo = document.getElementById("titulo");
const botao = document.querySelector("#botao");          // seletor CSS
const paragrafos = document.querySelectorAll("p");       // todos os <p>
const itens = document.querySelectorAll(".item");        // todos com class="item"
```

**Alterando elementos:**

```js
titulo.textContent = "Novo título";        // altera o texto
titulo.style.color = "blue";               // altera o estilo
titulo.classList.add("destaque");          // adiciona uma classe CSS
titulo.classList.toggle("escondido");      // liga/desliga uma classe
titulo.setAttribute("data-id", "42");      // altera um atributo
```

**Criando e removendo elementos:**

```js
const lista = document.querySelector("#lista");
const item = document.createElement("li");
item.textContent = "Novo item";
lista.appendChild(item);

item.remove();
```

> **Segurança:** evite `elemento.innerHTML = textoDoUsuario`. Se o texto contiver HTML ou `<script>`, ele será executado. Isso é uma falha chamada **XSS** (*Cross-Site Scripting*). Use `textContent` para texto vindo do usuário.

### 4.4 Eventos

Eventos são ações que acontecem na página: cliques, teclas, envio de formulário, rolagem.

```js
const botao = document.querySelector("#botao");

botao.addEventListener("click", () => {
  alert("Você clicou!");
});

const campo = document.querySelector("#nome");
campo.addEventListener("input", evento => {
  console.log("Digitado:", evento.target.value);
});

const form = document.querySelector("form");
form.addEventListener("submit", evento => {
  evento.preventDefault();   // impede o recarregamento da página
  console.log("Formulário enviado");
});
```

| Evento | Quando dispara |
|--------|----------------|
| `click` | Clique |
| `input` | Valor de um campo muda |
| `change` | Campo perde o foco após mudar |
| `submit` | Formulário é enviado |
| `keydown` / `keyup` | Tecla pressionada / solta |
| `mouseover` / `mouseout` | Mouse entra / sai do elemento |
| `DOMContentLoaded` | HTML terminou de carregar |

**Delegação de eventos:** em vez de colocar um listener em cada item de uma lista, coloque um só no elemento pai. Funciona inclusive para itens adicionados depois.

```js
document.querySelector("#lista").addEventListener("click", e => {
  if (e.target.matches("li")) {
    e.target.classList.toggle("concluido");
  }
});
```

### 4.5 Comunicando com APIs: fetch

O `fetch` faz requisições HTTP direto do navegador. É assim que o front-end conversa com a API C# do Guia 1.

```js
// GET
async function listarProdutos() {
  const resposta = await fetch("http://localhost:5000/api/produtos");
  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}`);
  }
  const produtos = await resposta.json();
  return produtos;
}

// POST
async function criarProduto(produto) {
  const resposta = await fetch("http://localhost:5000/api/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produto),
  });
  return resposta.json();
}
```

> **Atenção:** o `fetch` **não** lança erro para respostas 404 ou 500, só para falhas de rede. Sempre confira `resposta.ok`.

Lembre-se do **CORS** (Guia 1, seção 4.12): a API precisa permitir a origem da sua página.

### 4.6 Armazenamento no navegador

```js
// localStorage: persiste mesmo fechando o navegador
localStorage.setItem("tema", "escuro");
const tema = localStorage.getItem("tema");
localStorage.removeItem("tema");

// Só guarda texto: use JSON para objetos
const tarefas = [{ texto: "Estudar", feito: false }];
localStorage.setItem("tarefas", JSON.stringify(tarefas));
const recuperadas = JSON.parse(localStorage.getItem("tarefas") ?? "[]");
```

O `sessionStorage` funciona igual, mas é apagado quando a aba fecha. Nunca guarde senhas ou dados sensíveis aqui.

### 4.7 Ferramentas do desenvolvedor (DevTools)

Pressione **F12**. As abas mais importantes:

- **Elements:** inspecionar e editar o HTML e o CSS ao vivo.
- **Console:** ver erros e executar JavaScript.
- **Network:** ver todas as requisições HTTP, seus status e respostas. Essencial para depurar chamadas à API.
- **Sources:** colocar **breakpoints** e executar o código passo a passo.
- **Application:** ver o `localStorage`, os cookies e o cache.

Você também pode escrever `debugger;` no código para pausar ali.

### 4.8 Node.js e npm

O **Node.js** roda JavaScript fora do navegador. O **npm** (*Node Package Manager*) é o gerenciador de pacotes, equivalente ao NuGet do .NET.

```bash
npm init -y                 # cria o package.json
npm install lodash          # instala uma dependência
npm install -D typescript   # instala uma dependência só de desenvolvimento
npm run build               # roda um script definido no package.json
npx ng version              # executa um pacote sem instalar globalmente
```

- **package.json:** lista as dependências e os scripts do projeto.
- **package-lock.json:** fixa as versões exatas instaladas. Deve ir para o Git.
- **node_modules/:** onde os pacotes ficam. **Não** vai para o Git (coloque no `.gitignore`).

### 4.9 Por que usar frameworks?

Construir uma aplicação grande manipulando o DOM manualmente fica difícil: é preciso lembrar de atualizar cada parte da tela sempre que um dado muda. **Frameworks** como Angular, React e Vue resolvem isso: você descreve **como a tela deve ficar** para um certo estado, e o framework atualiza o DOM sozinho.

Também trazem organização em componentes, roteamento entre páginas, formulários e comunicação HTTP. Vamos usar o **Angular**, que é escrito em **TypeScript**.

### Exercícios da Parte 4

1. Crie uma página com um contador: botões "+", "−" e "zerar", mostrando o valor na tela.
2. Crie uma lista de tarefas com um campo de texto e um botão "Adicionar". Ao clicar numa tarefa, ela deve ficar riscada. Use delegação de eventos.
3. Salve as tarefas do exercício 2 no `localStorage` para que não se percam ao recarregar a página.
4. Consuma a API pública https://viacep.com.br: o usuário digita um CEP e a página mostra o endereço.
5. Se você fez a API do Guia 1, crie uma página que liste e cadastre produtos usando `fetch`.

---

## Parte 5: TypeScript

### 5.1 O que é e por que usar

**TypeScript** é JavaScript **com tipos**. Foi criado pela Microsoft (pelo mesmo criador do C#, Anders Hejlsberg). Todo código JavaScript válido também é TypeScript válido; o TypeScript só acrescenta a verificação de tipos.

```ts
function somar(a: number, b: number): number {
  return a + b;
}

somar(2, 3);       // ok
somar("2", 3);     // ERRO no editor, antes de rodar:
                   // Argument of type 'string' is not assignable to parameter of type 'number'.
```

Benefícios:
- Erros encontrados enquanto você digita, não em produção.
- Autocompletar muito melhor no editor.
- O código se documenta: os tipos dizem o que cada função espera.
- Refatorações mais seguras.

Os tipos **só existem em desenvolvimento**: o compilador os remove ao gerar o JavaScript.

```bash
npm install -D typescript
npx tsc --init          # cria o tsconfig.json
npx tsc                 # compila .ts → .js
```

### 5.2 Tipos básicos

```ts
let nome: string = "Ana";
let idade: number = 30;
let ativo: boolean = true;
let notas: number[] = [8, 9, 7];
let qualquerCoisa: unknown = 42;     // tipo desconhecido; precisa verificar antes de usar
let tupla: [string, number] = ["Ana", 30];

// Inferência: o TypeScript descobre o tipo sozinho (como o var do C#)
let cidade = "Recife";               // string
```

> Evite o tipo `any`: ele desliga a verificação e você volta a ter JavaScript puro. Se não sabe o tipo, use `unknown`.

### 5.3 Interfaces e type aliases

Descrevem o formato de objetos:

```ts
interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;        // ? = opcional
  readonly criadoEm: Date;   // não pode ser alterado
}

type Status = "pendente" | "pago" | "cancelado";   // union de literais

interface Pedido {
  id: number;
  produtos: Produto[];
  status: Status;
}

const pedido: Pedido = {
  id: 1,
  produtos: [],
  status: "pago",
  // status: "enviado",   // ERRO: não está na lista
};
```

**Union types e narrowing:**

```ts
function formatar(valor: string | number): string {
  if (typeof valor === "number") {
    return valor.toFixed(2);       // aqui o TS sabe que é number
  }
  return valor.toUpperCase();      // aqui o TS sabe que é string
}
```

### 5.4 Funções, classes e generics

```ts
// Funções tipadas
const calcularDesconto = (preco: number, percentual = 10): number =>
  preco * (1 - percentual / 100);

// Classes com modificadores de acesso (como no C#)
class ContaBancaria {
  private saldo = 0;

  constructor(public readonly titular: string) {}   // cria a propriedade automaticamente

  depositar(valor: number): void {
    if (valor <= 0) throw new Error("Valor inválido");
    this.saldo += valor;
  }

  get saldoAtual(): number {
    return this.saldo;
  }
}

// Interfaces implementadas por classes
interface Notificador {
  enviar(destino: string, mensagem: string): void;
}

class NotificadorEmail implements Notificador {
  enviar(destino: string, mensagem: string) {
    console.log(`E-mail para ${destino}: ${mensagem}`);
  }
}

// Generics
function primeiro<T>(lista: T[]): T | undefined {
  return lista[0];
}
const n = primeiro([1, 2, 3]);         // number | undefined
const s = primeiro(["a", "b"]);        // string | undefined
```

Repare como tudo isso se parece com o C# do Guia 1.

### 5.5 Tipos utilitários

```ts
interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

type UsuarioParcial = Partial<Usuario>;             // todos os campos opcionais
type UsuarioPublico = Omit<Usuario, "senha">;       // remove campos
type Credenciais = Pick<Usuario, "email" | "senha">; // escolhe campos
type SomenteLeitura = Readonly<Usuario>;
type Dicionario = Record<string, number>;           // { [chave: string]: number }
```

### Exercícios da Parte 5

1. Converta para TypeScript os exercícios da Parte 3, tipando tudo, sem usar `any`.
2. Crie interfaces `Produto`, `Cliente` e `Pedido`, e uma função `calcularTotal(pedido: Pedido): number`.
3. Crie uma função genérica `agruparPor<T, K extends keyof T>(lista: T[], chave: K)`.
4. Ative `"strict": true` no `tsconfig.json` e corrija todos os erros que aparecerem.

---

## Parte 6: Angular

### 6.1 O que é o Angular

O **Angular** é um framework completo, mantido pelo Google, para construir **SPAs** (*Single Page Applications*): aplicações que carregam uma única página HTML e atualizam o conteúdo dinamicamente, sem recarregar.

Ele traz quase tudo pronto: componentes, roteamento, formulários, cliente HTTP, injeção de dependência e ferramentas de teste. Para quem vem do C# e do ASP.NET Core, a estrutura é familiar: classes, decorators (parecidos com os atributos do C#), injeção de dependência e TypeScript.

### 6.2 Criando o projeto

```bash
npm install -g @angular/cli
ng new minha-loja        # aceite as opções padrão; escolha CSS como estilo
cd minha-loja
ng serve -o              # abre em http://localhost:4200
```

**Estrutura principal:**

```
minha-loja/
├── src/
│   ├── app/
│   │   ├── app.ts              ← componente raiz
│   │   ├── app.html            ← template do componente raiz
│   │   ├── app.css
│   │   ├── app.config.ts       ← configuração (providers)
│   │   └── app.routes.ts       ← rotas
│   ├── index.html
│   ├── main.ts                 ← ponto de entrada
│   └── styles.css              ← estilos globais
├── angular.json
├── package.json
└── tsconfig.json
```

> Os nomes dos arquivos variam um pouco entre versões do Angular (versões antigas usam `app.component.ts`). Os conceitos são os mesmos.

**Comandos úteis do CLI:**

```bash
ng generate component produtos/lista-produtos    # ou: ng g c ...
ng generate service services/produto             # ou: ng g s ...
ng build                                         # gera a versão de produção em dist/
ng test                                          # roda os testes
```

### 6.3 Componentes

Tudo no Angular é um **componente**: um pedaço da tela com seu próprio template (HTML), estilo (CSS) e lógica (TypeScript). Uma tela é uma árvore de componentes.

```
AppComponent
├── CabecalhoComponent
├── ListaProdutosComponent
│   ├── CartaoProdutoComponent
│   ├── CartaoProdutoComponent
│   └── CartaoProdutoComponent
└── RodapeComponent
```

```ts
// cartao-produto.ts
import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
}

@Component({
  selector: 'app-cartao-produto',           // nome da tag HTML
  imports: [CurrencyPipe],
  templateUrl: './cartao-produto.html',
  styleUrl: './cartao-produto.css',
})
export class CartaoProduto {
  produto = input.required<Produto>();      // dado que vem do componente pai
  adicionar = output<Produto>();            // evento enviado ao pai

  comprar() {
    this.adicionar.emit(this.produto());
  }
}
```

```html
<!-- cartao-produto.html -->
<article class="cartao">
  <h3>{{ produto().nome }}</h3>
  <p>{{ produto().preco | currency:'BRL' }}</p>
  <button (click)="comprar()" [disabled]="produto().estoque === 0">
    Adicionar ao carrinho
  </button>
</article>
```

Usando no componente pai:

```html
<app-cartao-produto [produto]="item" (adicionar)="aoAdicionar($event)" />
```

### 6.4 Data binding

**Data binding** é a ligação automática entre os dados da classe e o template.

| Sintaxe | Direção | Exemplo |
|---------|---------|---------|
| `{{ valor }}` | Classe → tela (interpolação) | `<h1>{{ titulo }}</h1>` |
| `[propriedade]="valor"` | Classe → tela (property binding) | `<img [src]="urlFoto">` |
| `(evento)="metodo()"` | Tela → classe (event binding) | `<button (click)="salvar()">` |
| `[(ngModel)]="valor"` | Duas vias | `<input [(ngModel)]="nome">` |

### 6.5 Signals: estado reativo

**Signals** são a forma moderna de guardar estado no Angular. Quando o valor de um signal muda, o Angular atualiza automaticamente todas as partes da tela que o usam.

```ts
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-contador',
  template: `
    <p>Contagem: {{ contagem() }}</p>
    <p>Dobro: {{ dobro() }}</p>
    <button (click)="incrementar()">+1</button>
  `,
})
export class Contador {
  contagem = signal(0);                          // estado
  dobro = computed(() => this.contagem() * 2);   // derivado, recalcula sozinho

  incrementar() {
    this.contagem.update(valor => valor + 1);    // ou: this.contagem.set(10)
  }
}
```

Compare com a Parte 4: lá, você teria que achar o elemento no DOM e alterar o `textContent` manualmente. Aqui você só muda o dado.

### 6.6 Controle de fluxo no template

```html
@if (produtos().length > 0) {
  <ul>
    @for (produto of produtos(); track produto.id) {
      <li>{{ produto.nome }}</li>
    } @empty {
      <li>Nenhum produto</li>
    }
  </ul>
} @else {
  <p>Carregando...</p>
}

@switch (status()) {
  @case ('pago') { <span class="verde">Pago</span> }
  @case ('pendente') { <span class="amarelo">Pendente</span> }
  @default { <span>Desconhecido</span> }
}
```

O `track` no `@for` ajuda o Angular a identificar cada item e atualizar só o que mudou.

> Em projetos mais antigos você vai ver `*ngIf` e `*ngFor` com a mesma função.

### 6.7 Pipes

**Pipes** formatam valores no template:

```html
<p>{{ produto.nome | uppercase }}</p>
<p>{{ produto.preco | currency:'BRL' }}</p>
<p>{{ pedido.data | date:'dd/MM/yyyy' }}</p>
<p>{{ 0.256 | percent }}</p>
```

Para formatos brasileiros, registre o locale `pt-BR` na configuração da aplicação.

### 6.8 Serviços e injeção de dependência

Componentes cuidam da tela. Lógica de negócio, acesso a APIs e estado compartilhado ficam em **serviços**. É o mesmo princípio de responsabilidade única do Guia 1, e a mesma ideia de injeção de dependência do ASP.NET Core.

```ts
// services/carrinho.ts
import { Injectable, signal, computed } from '@angular/core';
import { Produto } from '../cartao-produto/cartao-produto';

@Injectable({ providedIn: 'root' })   // uma instância para toda a aplicação (singleton)
export class CarrinhoService {
  private itens = signal<Produto[]>([]);

  readonly quantidade = computed(() => this.itens().length);
  readonly total = computed(() => this.itens().reduce((s, p) => s + p.preco, 0));

  adicionar(produto: Produto) {
    this.itens.update(lista => [...lista, produto]);   // imutável!
  }

  limpar() {
    this.itens.set([]);
  }
}
```

```ts
// Usando em um componente
import { inject } from '@angular/core';

export class Cabecalho {
  carrinho = inject(CarrinhoService);   // injeção de dependência
}
```

```html
<span>Carrinho: {{ carrinho.quantidade() }} itens</span>
```

### 6.9 Consumindo a API com HttpClient

Agora vamos conectar o Angular à API C# do Guia 1.

**1. Habilite o HttpClient** em `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
};
```

**2. Crie o serviço:**

```ts
// services/produto.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../cartao-produto/cartao-produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/produtos';

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  obter(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  criar(produto: Omit<Produto, 'id'>): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  atualizar(id: number, produto: Omit<Produto, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, produto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**3. Use no componente:**

```ts
// lista-produtos.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { ProdutoService } from '../services/produto';
import { CarrinhoService } from '../services/carrinho';
import { CartaoProduto, Produto } from '../cartao-produto/cartao-produto';

@Component({
  selector: 'app-lista-produtos',
  imports: [CartaoProduto],
  template: `
    @if (erro()) {
      <p class="erro">{{ erro() }}</p>
    }
    @for (p of produtos(); track p.id) {
      <app-cartao-produto [produto]="p" (adicionar)="carrinho.adicionar($event)" />
    } @empty {
      <p>Nenhum produto cadastrado.</p>
    }
  `,
})
export class ListaProdutos implements OnInit {
  private produtoService = inject(ProdutoService);
  carrinho = inject(CarrinhoService);

  produtos = signal<Produto[]>([]);
  erro = signal('');

  ngOnInit() {          // executado quando o componente é criado
    this.produtoService.listar().subscribe({
      next: lista => this.produtos.set(lista),
      error: () => this.erro.set('Não foi possível carregar os produtos.'),
    });
  }
}
```

### 6.10 Observables e RxJS (o básico)

O `HttpClient` devolve um **Observable**, da biblioteca **RxJS**. Um Observable é parecido com uma Promise, mas pode emitir **vários valores ao longo do tempo** e só executa quando alguém se **inscreve** (`subscribe`).

| | Promise | Observable |
|--|---------|------------|
| Quantidade de valores | Um | Zero, um ou vários |
| Começa a executar | Na criação | Quando alguém faz `subscribe` |
| Pode ser cancelado | Não | Sim (`unsubscribe`) |

**Operadores** transformam o fluxo de dados:

```ts
import { map, filter, debounceTime } from 'rxjs';

this.produtoService.listar().pipe(
  map(lista => lista.filter(p => p.estoque > 0)),   // só os que têm estoque
).subscribe(disponiveis => this.produtos.set(disponiveis));
```

Para converter um Observable em signal diretamente:

```ts
import { toSignal } from '@angular/core/rxjs-interop';

produtos = toSignal(inject(ProdutoService).listar(), { initialValue: [] });
```

O RxJS é grande. Para começar, entenda `subscribe`, `pipe`, `map`, `filter` e `switchMap`.

### 6.11 Rotas

O roteador mapeia URLs para componentes, permitindo várias "páginas" numa SPA.

```ts
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: 'produtos', component: ListaProdutos },
  { path: 'produtos/novo', component: FormProduto },
  { path: 'produtos/:id', component: DetalheProduto },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then(m => m.Admin),   // carregamento sob demanda
  },
  { path: '**', component: PaginaNaoEncontrada },
];
```

```html
<!-- app.html -->
<nav>
  <a routerLink="/produtos" routerLinkActive="ativo">Produtos</a>
  <a routerLink="/produtos/novo" routerLinkActive="ativo">Novo produto</a>
</nav>

<main>
  <router-outlet />   <!-- aqui aparece o componente da rota atual -->
</main>
```

Lendo parâmetros da rota (`/produtos/5`):

```ts
import { ActivatedRoute, Router } from '@angular/router';

export class DetalheProduto {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // carregar o produto...
  }

  voltar() {
    this.router.navigate(['/produtos']);
  }
}
```

Lembre-se de importar `RouterLink`, `RouterLinkActive` e `RouterOutlet` no componente que usa essas diretivas.

### 6.12 Formulários reativos

```ts
// form-produto.ts
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutoService } from '../services/produto';

@Component({
  selector: 'app-form-produto',
  imports: [ReactiveFormsModule],
  templateUrl: './form-produto.html',
})
export class FormProduto {
  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    preco: [0, [Validators.required, Validators.min(0.01)]],
    estoque: [0, [Validators.required, Validators.min(0)]],
  });

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.produtoService.criar(this.form.getRawValue()).subscribe(() => {
      this.router.navigate(['/produtos']);
    });
  }
}
```

```html
<!-- form-produto.html -->
<form [formGroup]="form" (ngSubmit)="salvar()">
  <label for="nome">Nome</label>
  <input id="nome" formControlName="nome">
  @if (form.controls.nome.touched && form.controls.nome.hasError('required')) {
    <small class="erro">O nome é obrigatório.</small>
  }

  <label for="preco">Preço</label>
  <input id="preco" type="number" step="0.01" formControlName="preco">
  @if (form.controls.preco.touched && form.controls.preco.invalid) {
    <small class="erro">Informe um preço maior que zero.</small>
  }

  <label for="estoque">Estoque</label>
  <input id="estoque" type="number" formControlName="estoque">

  <button type="submit" [disabled]="form.invalid">Salvar</button>
</form>
```

> **Valide nos dois lados.** A validação no front-end melhora a experiência do usuário. A validação no back-end (Guia 1, seção 4.7) garante a segurança, porque qualquer pessoa pode chamar a API sem passar pelo seu formulário.

### 6.13 Ciclo de vida dos componentes

| Hook | Quando |
|------|--------|
| `constructor` | Quando a classe é criada (use só para injeção) |
| `ngOnInit` | Depois que os inputs foram recebidos. Bom lugar para carregar dados |
| `ngOnChanges` | Quando um input muda |
| `ngAfterViewInit` | Depois que o template foi renderizado |
| `ngOnDestroy` | Antes de o componente ser destruído. Limpe recursos aqui |

### 6.14 Interceptors

Um **interceptor** age sobre todas as requisições HTTP, como um middleware do ASP.NET Core do lado do cliente. Uso típico: adicionar o token JWT.

```ts
// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};

// app.config.ts
provideHttpClient(withInterceptors([authInterceptor]))
```

### 6.15 Ambientes e build

Não deixe a URL da API fixa no código. Crie arquivos de ambiente:

```bash
ng generate environments
```

```ts
// src/environments/environment.development.ts
export const environment = { apiUrl: 'http://localhost:5000/api' };

// src/environments/environment.ts
export const environment = { apiUrl: 'https://minha-api.com/api' };
```

```bash
ng build    # gera os arquivos otimizados em dist/, prontos para publicar
```

### Exercícios da Parte 6

1. Crie o componente `Contador` com signals, com botões de incremento, decremento e zerar, e um `computed` que diz se o número é par ou ímpar.
2. Refaça a lista de tarefas da Parte 4 em Angular, com um serviço que guarde as tarefas em um signal e persista no `localStorage`.
3. Crie a aplicação **Minha Loja** conectada à API do Guia 1, com:
   - rota `/produtos` (listagem);
   - rota `/produtos/novo` (formulário reativo de cadastro);
   - rota `/produtos/:id` (detalhe, com botões de editar e excluir);
   - um carrinho no cabeçalho, usando um serviço compartilhado.
4. Adicione um campo de busca que filtra os produtos pelo nome enquanto o usuário digita (dica: `computed` ou `debounceTime`).
5. Mostre uma mensagem amigável quando a API estiver fora do ar.
6. **Desafio:** adicione uma tela de login que obtém um JWT da API e um interceptor que envia o token.

---

## Glossário

| Termo | Significado |
|-------|-------------|
| Arrow function | Sintaxe curta de função: `(x) => x * 2` |
| Callback | Função passada como parâmetro para ser chamada depois |
| Closure | Função que lembra das variáveis do escopo onde foi criada |
| Coerção | Conversão automática de tipos |
| Componente | Bloco reutilizável de interface (template + estilo + lógica) |
| DOM | Representação da página como árvore de objetos |
| Event loop | Mecanismo que executa tarefas assíncronas em JavaScript |
| Interpretador | Programa que lê e executa código durante a execução |
| JIT | Compilação durante a execução (*Just-In-Time*) |
| Observable | Fluxo de valores ao longo do tempo (RxJS) |
| Promise | Objeto que representa um valor futuro |
| Signal | Valor reativo do Angular que notifica mudanças |
| SPA | Aplicação de página única |
| Transpilação | Tradução de uma linguagem para outra de mesmo nível |

## Para continuar estudando

- **MDN Web Docs (em português):** https://developer.mozilla.org/pt-BR/docs/Web/JavaScript, a melhor referência de JavaScript.
- **javascript.info:** https://javascript.info, tutorial completo e moderno.
- **Documentação do TypeScript:** https://www.typescriptlang.org/docs
- **Documentação do Angular:** https://angular.dev, com tutoriais interativos.
- **Livros:** *Eloquent JavaScript* (Marijn Haverbeke, gratuito online); série *You Don't Know JS* (Kyle Simpson, gratuita no GitHub).

**Próximo passo:** [Guia 3: HTML e CSS](03-html-css.md)
