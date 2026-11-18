# Guia 1: C# e .NET

> **Objetivo:** aprender a pensar como programador usando C#. Começamos pela lógica e pelos algoritmos, passamos pelos fundamentos da programação orientada a objetos, entendemos padrões de projeto e terminamos construindo uma API web com ASP.NET Core.

## Sumário

- [Parte 0: Preparando o ambiente](#parte-0-preparando-o-ambiente)
- [Parte 1: Lógica de programação e algoritmos](#parte-1-lógica-de-programação-e-algoritmos)
- [Parte 2: Conceitos fundamentais da programação](#parte-2-conceitos-fundamentais-da-programação)
- [Parte 3: Princípios, padrões e design](#parte-3-princípios-padrões-e-design)
- [Parte 4: APIs com ASP.NET Core](#parte-4-apis-com-aspnet-core)
- [Glossário](#glossário)
- [Para continuar estudando](#para-continuar-estudando)

---

## Parte 0: Preparando o ambiente

### O que é C# e o que é .NET?

- **C#** (lê-se "C sharp") é uma **linguagem de programação**: um conjunto de regras para escrever instruções que o computador entende.
- **.NET** é a **plataforma**: o conjunto de ferramentas, bibliotecas e o ambiente de execução (*runtime*) que roda programas escritos em C#.

Uma analogia: C# é o idioma, o .NET é o país inteiro onde esse idioma é falado, com estradas, lojas e serviços prontos para você usar.

### Como um programa C# é executado

C# é uma linguagem **compilada**. Você escreve o código-fonte, um programa chamado **compilador** traduz esse código para uma linguagem intermediária (IL), e o runtime do .NET transforma a IL em código de máquina na hora de executar.

```
Seu código (.cs) ──► Compilador ──► IL (.dll) ──► Runtime .NET (JIT) ──► Código de máquina
```

Você vai ver a diferença entre linguagens compiladas e interpretadas com mais calma no Guia 2.

### Ferramentas deste guia

| Ferramenta | Para quê | Obrigatória? |
|-----------|----------|--------------|
| **.NET SDK** | Compilar e executar programas C# | Sim |
| **Visual Studio Community** | IDE completa para C# e .NET (só Windows) | Escolha esta **ou** o VS Code |
| **Visual Studio Code** | Editor leve, usado em todos os guias | Recomendado |
| **Git** | Controle de versão do seu código | Recomendado |

> **Dica para Windows:** o **winget** (gerenciador de pacotes que já vem no Windows 10 e 11) instala tudo pelo terminal. Abra o **PowerShell** ou o **Terminal** e use os comandos `winget` indicados abaixo. Se preferir, baixe os instaladores pelos sites oficiais.

### Instalando o .NET SDK

O **SDK** (*Software Development Kit*) traz o compilador, o runtime e a ferramenta de linha de comando `dotnet`.

1. Acesse https://dotnet.microsoft.com/download.
2. Escolha a versão marcada como **LTS** (*Long Term Support*, suporte de 3 anos). Prefira sempre a LTS para estudar e para projetos reais.
3. Baixe o instalador do **SDK** (não apenas o *Runtime*) para o seu sistema e execute-o com as opções padrão.

Pelo terminal, no Windows:

```bash
winget install Microsoft.DotNet.SDK.10
```

> O número no fim do comando é a versão. Se uma LTS mais nova já tiver saído, troque o número (rode `winget search Microsoft.DotNet.SDK` para ver as disponíveis).

**Confira a instalação** abrindo um terminal **novo**:

```bash
dotnet --version      # mostra a versão do SDK
dotnet --list-sdks    # lista todos os SDKs instalados
```

Se aparecer "comando não encontrado", feche e abra o terminal de novo. Se continuar, reinicie o computador para o `PATH` ser atualizado.

- **macOS:** baixe o instalador `.pkg` no mesmo site, ou use `brew install --cask dotnet-sdk`.
- **Linux:** siga as instruções da sua distribuição em https://learn.microsoft.com/dotnet/core/install/linux.

### Instalando o Visual Studio Community

O **Visual Studio** (não confunda com o VS Code) é uma **IDE** (*Integrated Development Environment*) completa: editor, depurador visual, gerenciador de pacotes, designer de banco de dados e muito mais, tudo integrado. A edição **Community** é gratuita para estudantes, projetos de código aberto e pequenas equipes. Funciona **apenas no Windows**.

1. Acesse https://visualstudio.microsoft.com e baixe o **Visual Studio Community**.
2. Execute o arquivo baixado. Ele abre o **Visual Studio Installer**.
3. Na aba **Cargas de trabalho** (*Workloads*), marque:
   - **Desenvolvimento para ASP.NET e Web** (*ASP.NET and web development*): **obrigatória** para este guia, inclui C#, .NET e APIs.
   - **Armazenamento e processamento de dados** (*Data storage and processing*): opcional, adiciona ferramentas de SQL Server que serão úteis no Guia 4.
4. Clique em **Instalar** e aguarde. O download tem alguns gigabytes.
5. Na primeira abertura, você pode entrar com uma conta Microsoft (opcional) e escolher o tema de cores.

**Criando um projeto no Visual Studio:**
1. **Criar um projeto** → pesquise **Aplicativo de Console** (C#) → Avançar.
2. Dê um nome, escolha a pasta e a versão LTS do .NET → Criar.
3. Pressione **F5** para executar com o depurador ou **Ctrl+F5** para executar sem ele.

Atalhos que valem ouro: **F9** coloca um *breakpoint* (ponto de parada), **F10** executa a próxima linha, **F11** entra no método, **Ctrl+.** mostra sugestões de correção.

> **Mac ou Linux?** O Visual Studio para Mac foi descontinuado. Use o VS Code com a extensão C# Dev Kit (próxima seção).

### Instalando o Visual Studio Code

O **VS Code** é um editor leve, gratuito e multiplataforma. Vamos usá-lo em **todos** os guias da trilha: C#, JavaScript, Angular, HTML, CSS e SQL.

1. Acesse https://code.visualstudio.com e baixe a versão do seu sistema.
2. No instalador do Windows, marque as opções:
   - **Adicionar ao PATH** (permite abrir o VS Code pelo terminal com `code .`).
   - **Adicionar a ação "Abrir com Code"** ao menu de contexto de arquivos e pastas.
3. Conclua a instalação.

Pelo terminal, no Windows:

```bash
winget install Microsoft.VisualStudioCode
```

**Extensões para este guia** (abra o painel de extensões com **Ctrl+Shift+X** e pesquise pelo nome):

| Extensão | Para quê |
|----------|----------|
| **C# Dev Kit** (Microsoft) | Suporte completo a C#: autocompletar, depuração, execução de testes e gerenciamento de projetos. Instala junto a extensão **C#** |
| **Portuguese (Brazil) Language Pack** | Opcional: interface em português |

Para abrir uma pasta de projeto pelo terminal:

```bash
cd MeuProjeto
code .
```

Atalhos úteis: **Ctrl+P** abre arquivos pelo nome, **Ctrl+Shift+P** abre a paleta de comandos, **Ctrl+'** abre o terminal integrado, **F5** inicia a depuração.

### Visual Studio ou VS Code?

| | Visual Studio Community | VS Code |
|--|-------------------------|---------|
| Tipo | IDE completa | Editor com extensões |
| Sistemas | Só Windows | Windows, macOS, Linux |
| Tamanho | Vários GB | Algumas centenas de MB |
| Ponto forte | Depuração e ferramentas visuais para .NET | Leve, serve para qualquer linguagem |
| Quando usar | Projetos .NET grandes no Windows | Todo o resto, e para C# se preferir algo leve |

Não existe resposta errada. Muitos desenvolvedores usam o Visual Studio para o back-end em C# e o VS Code para o front-end em Angular. Escolha um para começar e siga em frente.

### Instalando o Git

O **Git** guarda o histórico do seu código e permite publicar projetos no GitHub. Você vai precisar dele no desafio final.

```bash
winget install Git.Git
git --version
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Primeiro programa

Com o .NET SDK instalado, abra o terminal:

```bash
dotnet --version              # confirma a instalação
dotnet new console -n OlaMundo
cd OlaMundo
dotnet run
```

O arquivo `Program.cs` terá:

```csharp
Console.WriteLine("Olá, mundo!");
```

`Console.WriteLine` escreve um texto na tela e pula uma linha. Parabéns, você acabou de rodar seu primeiro programa.

---

## Parte 1: Lógica de programação e algoritmos

### 1.1 O que é um algoritmo?

Um **algoritmo** é uma sequência finita de passos bem definidos para resolver um problema. Você já usa algoritmos no dia a dia:

**Algoritmo para fazer café:**
1. Ferver a água.
2. Colocar o filtro no suporte.
3. Colocar o pó no filtro.
4. Despejar a água quente sobre o pó.
5. Esperar escorrer.

Programar é escrever algoritmos numa linguagem que o computador entende. O computador não tem bom senso: ele faz **exatamente** o que você mandar, na ordem que você mandar.

> **Exercício mental:** escreva o algoritmo para trocar uma lâmpada. Agora imagine que quem vai executar nunca viu uma lâmpada. Quantos passos você esqueceu?

### 1.2 Variáveis e tipos de dados

Uma **variável** é um espaço na memória com um nome, onde guardamos um valor. Em C#, toda variável tem um **tipo**, que diz que tipo de valor ela aceita.

```csharp
int idade = 25;                  // número inteiro
double altura = 1.75;            // número com casas decimais
decimal salario = 3500.50m;      // decimal de alta precisão (use para dinheiro)
string nome = "Gabriel";         // texto
char inicial = 'G';              // um único caractere
bool estaEstudando = true;       // verdadeiro ou falso
```

| Tipo | Guarda | Exemplo |
|------|--------|---------|
| `int` | Inteiros | `42`, `-7` |
| `long` | Inteiros muito grandes | `9000000000` |
| `double` | Decimais (ponto flutuante) | `3.14` |
| `decimal` | Decimais exatos | `19.99m` |
| `string` | Texto | `"Olá"` |
| `char` | Um caractere | `'A'` |
| `bool` | Verdadeiro/falso | `true`, `false` |

**Por que `decimal` para dinheiro?** Porque `double` guarda números de forma aproximada. Teste:

```csharp
Console.WriteLine(0.1 + 0.2);    // 0.30000000000000004
Console.WriteLine(0.1m + 0.2m);  // 0.3
```

**Inferência de tipo com `var`:** o compilador descobre o tipo pelo valor.

```csharp
var cidade = "Recife";   // o compilador sabe que é string
// cidade = 10;          // ERRO: cidade é string, não aceita int
```

**Constantes** são valores que nunca mudam:

```csharp
const double Pi = 3.14159;
```

### 1.3 Entrada e saída

```csharp
Console.Write("Digite seu nome: ");
string? nome = Console.ReadLine();
Console.WriteLine($"Olá, {nome}!");   // interpolação de string com $
```

Para ler números, converta o texto:

```csharp
Console.Write("Digite sua idade: ");
int idade = int.Parse(Console.ReadLine()!);
```

`int.Parse` falha se o usuário digitar letras. A forma segura é `int.TryParse`:

```csharp
if (int.TryParse(Console.ReadLine(), out int idade))
    Console.WriteLine($"Você tem {idade} anos.");
else
    Console.WriteLine("Isso não é um número válido.");
```

### 1.4 Operadores

**Aritméticos:**

```csharp
int a = 10, b = 3;
Console.WriteLine(a + b);   // 13
Console.WriteLine(a - b);   // 7
Console.WriteLine(a * b);   // 30
Console.WriteLine(a / b);   // 3   ← divisão entre inteiros descarta o resto
Console.WriteLine(a % b);   // 1   ← resto da divisão (módulo)
Console.WriteLine(10.0 / 3);// 3.333...
```

O operador `%` é muito útil: `numero % 2 == 0` diz se um número é par.

**Relacionais** (sempre retornam `bool`): `==`, `!=`, `>`, `<`, `>=`, `<=`.

**Lógicos:**

| Operador | Nome | Verdadeiro quando |
|----------|------|-------------------|
| `&&` | E | as duas condições são verdadeiras |
| `\|\|` | OU | pelo menos uma é verdadeira |
| `!` | NÃO | inverte o valor |

```csharp
bool podeDirigir = idade >= 18 && temCarteira;
bool ehFimDeSemana = dia == "sábado" || dia == "domingo";
```

**Atribuição composta:** `x += 5` é o mesmo que `x = x + 5`. `x++` soma 1.

### 1.5 Estruturas de decisão

**if / else if / else:**

```csharp
double nota = 7.5;

if (nota >= 7)
{
    Console.WriteLine("Aprovado");
}
else if (nota >= 5)
{
    Console.WriteLine("Recuperação");
}
else
{
    Console.WriteLine("Reprovado");
}
```

**switch** (quando há muitos casos para um mesmo valor):

```csharp
int diaSemana = 3;

string nomeDia = diaSemana switch
{
    1 => "Domingo",
    2 => "Segunda",
    3 => "Terça",
    4 => "Quarta",
    5 => "Quinta",
    6 => "Sexta",
    7 => "Sábado",
    _ => "Dia inválido"     // _ significa "qualquer outro valor"
};
```

**Operador ternário** (um if curto que devolve um valor):

```csharp
string situacao = nota >= 7 ? "Aprovado" : "Reprovado";
```

### 1.6 Estruturas de repetição (laços)

**for:** quando você sabe quantas vezes vai repetir.

```csharp
for (int i = 1; i <= 10; i++)
{
    Console.WriteLine($"7 x {i} = {7 * i}");
}
```

Leia assim: "comece com `i = 1`; enquanto `i <= 10`, execute o bloco; depois de cada volta, some 1 em `i`".

**while:** enquanto uma condição for verdadeira.

```csharp
int saldo = 100;
while (saldo > 0)
{
    saldo -= 30;
    Console.WriteLine($"Saldo: {saldo}");
}
```

**do...while:** executa pelo menos uma vez.

```csharp
string? opcao;
do
{
    Console.WriteLine("1 - Jogar | 0 - Sair");
    opcao = Console.ReadLine();
} while (opcao != "0");
```

**foreach:** percorre cada item de uma coleção.

```csharp
string[] frutas = { "maçã", "banana", "uva" };
foreach (string fruta in frutas)
{
    Console.WriteLine(fruta);
}
```

**break** sai do laço; **continue** pula para a próxima volta.

> **Cuidado com o laço infinito:** se a condição do `while` nunca ficar falsa, o programa nunca termina. Sempre se pergunte: "o que faz este laço parar?"

### 1.7 Arrays e listas

Um **array** guarda vários valores do mesmo tipo, com tamanho fixo. Os índices começam em **0**.

```csharp
int[] notas = { 8, 6, 9, 7 };
Console.WriteLine(notas[0]);      // 8
Console.WriteLine(notas.Length);  // 4
notas[1] = 10;                    // altera o segundo elemento
```

Uma **List** cresce e diminui conforme você precisa:

```csharp
List<string> nomes = new List<string>();
nomes.Add("Ana");
nomes.Add("Bruno");
nomes.Remove("Ana");
Console.WriteLine(nomes.Count);   // 1
```

Na prática, você vai usar `List<T>` muito mais que arrays.

### 1.8 Métodos (funções)

Um **método** é um bloco de código com nome, que pode receber valores (**parâmetros**) e devolver um resultado (**retorno**). Métodos evitam repetição e dividem um problema grande em partes pequenas.

```csharp
static double CalcularMedia(double n1, double n2, double n3)
{
    return (n1 + n2 + n3) / 3;
}

static bool EhPar(int numero)
{
    return numero % 2 == 0;
}

static void Saudar(string nome)   // void = não retorna nada
{
    Console.WriteLine($"Olá, {nome}!");
}

double media = CalcularMedia(7, 8, 9);
Console.WriteLine(EhPar(4));   // True
Saudar("Gabriel");
```

**Escopo:** uma variável só existe dentro do bloco `{ }` onde foi declarada.

```csharp
static void Exemplo()
{
    int x = 10;
}
// Console.WriteLine(x);  // ERRO: x não existe aqui
```

### 1.9 Recursão

Um método **recursivo** chama a si mesmo. Todo método recursivo precisa de um **caso base**, que interrompe as chamadas.

```csharp
static int Fatorial(int n)
{
    if (n <= 1) return 1;          // caso base
    return n * Fatorial(n - 1);    // chamada recursiva
}
// Fatorial(4) = 4 * 3 * 2 * 1 = 24
```

Sem o caso base, o método se chama para sempre e o programa quebra com `StackOverflowException`.

### 1.10 Algoritmos clássicos

Estes algoritmos aparecem em entrevistas e treinam seu raciocínio. Tente escrever cada um sozinho **antes** de ler a solução.

**Maior valor de uma lista:**

```csharp
static int Maior(int[] numeros)
{
    int maior = numeros[0];
    foreach (int n in numeros)
    {
        if (n > maior) maior = n;
    }
    return maior;
}
```

**Busca linear** (procura item por item):

```csharp
static int BuscaLinear(int[] numeros, int alvo)
{
    for (int i = 0; i < numeros.Length; i++)
    {
        if (numeros[i] == alvo) return i;   // achou: devolve a posição
    }
    return -1;                               // não achou
}
```

**Busca binária** (só funciona em lista **ordenada**; corta o espaço de busca pela metade a cada passo):

```csharp
static int BuscaBinaria(int[] ordenado, int alvo)
{
    int inicio = 0, fim = ordenado.Length - 1;
    while (inicio <= fim)
    {
        int meio = (inicio + fim) / 2;
        if (ordenado[meio] == alvo) return meio;
        if (ordenado[meio] < alvo) inicio = meio + 1;
        else fim = meio - 1;
    }
    return -1;
}
```

**Bubble sort** (ordenação simples, boa para aprender, ruim para usar em produção):

```csharp
static void BubbleSort(int[] v)
{
    for (int i = 0; i < v.Length - 1; i++)
    {
        for (int j = 0; j < v.Length - 1 - i; j++)
        {
            if (v[j] > v[j + 1])
            {
                (v[j], v[j + 1]) = (v[j + 1], v[j]);   // troca os dois
            }
        }
    }
}
```

**Inverter uma string:**

```csharp
static string Inverter(string texto)
{
    string resultado = "";
    for (int i = texto.Length - 1; i >= 0; i--)
        resultado += texto[i];
    return resultado;
}
```

### 1.11 Complexidade de algoritmos (Big O)

Big O descreve como o tempo de um algoritmo cresce quando a entrada cresce. Não mede segundos, mede **quantidade de passos** em relação ao tamanho `n` da entrada.

| Notação | Nome | Exemplo | 1.000 itens ≈ passos |
|---------|------|---------|----------------------|
| O(1) | Constante | Acessar `array[5]` | 1 |
| O(log n) | Logarítmica | Busca binária | 10 |
| O(n) | Linear | Busca linear, achar o maior | 1.000 |
| O(n log n) | Linearítmica | Ordenações eficientes (merge sort, `Array.Sort`) | 10.000 |
| O(n²) | Quadrática | Bubble sort, dois `for` aninhados | 1.000.000 |

A lição: busca binária em 1 milhão de itens leva cerca de 20 passos; busca linear pode levar 1 milhão. Escolher o algoritmo certo importa mais que ter um computador rápido.

### Exercícios da Parte 1

1. Leia dois números e mostre a soma, a subtração, a multiplicação e a divisão.
2. Leia a idade de uma pessoa e diga se ela é criança (0–12), adolescente (13–17), adulta (18–59) ou idosa (60+).
3. Mostre todos os números pares de 1 a 100.
4. **FizzBuzz:** de 1 a 100, mostre "Fizz" para múltiplos de 3, "Buzz" para múltiplos de 5, "FizzBuzz" para múltiplos de ambos, e o número nos demais casos.
5. Leia 5 notas, guarde em uma lista e mostre a média, a maior e a menor.
6. Verifique se uma palavra é um palíndromo ("arara", "osso").
7. Verifique se um número é primo.
8. Mostre os 20 primeiros números da sequência de Fibonacci (0, 1, 1, 2, 3, 5, 8...). Faça uma versão com laço e outra recursiva.
9. Jogo de adivinhação: o programa sorteia um número de 1 a 100 (`Random.Shared.Next(1, 101)`) e o usuário tenta adivinhar, recebendo dicas de "maior" ou "menor".
10. Implemente a busca binária e conte quantos passos ela leva para achar um número em um array de 1 a 1.000.000.

---

## Parte 2: Conceitos fundamentais da programação

### 2.1 Paradigmas de programação

Um **paradigma** é um estilo de organizar o código.

- **Imperativo/estruturado:** uma sequência de comandos, com decisões e laços. Foi o que fizemos na Parte 1.
- **Orientado a objetos (POO):** o programa é organizado em **objetos** que juntam dados e comportamento. É o paradigma principal do C#.
- **Funcional:** o programa é construído combinando funções, evitando alterar dados. O C# tem recursos funcionais, como o LINQ e as expressões lambda.

### 2.2 Classes e objetos

Uma **classe** é um molde. Um **objeto** é algo criado a partir desse molde.

Analogia: a planta de uma casa é a classe; cada casa construída com essa planta é um objeto. Todas têm a mesma estrutura, mas cada uma tem sua cor e seus moradores.

```csharp
public class Pessoa
{
    // Propriedades (dados)
    public string Nome { get; set; }
    public int Idade { get; set; }

    // Construtor: executado ao criar o objeto
    public Pessoa(string nome, int idade)
    {
        Nome = nome;
        Idade = idade;
    }

    // Método (comportamento)
    public void Apresentar()
    {
        Console.WriteLine($"Oi, eu sou {Nome} e tenho {Idade} anos.");
    }
}

// Criando objetos (instâncias)
Pessoa p1 = new Pessoa("Ana", 30);
var p2 = new Pessoa("Bruno", 22);
p1.Apresentar();
p2.Apresentar();
```

### 2.3 Os quatro pilares da POO

#### Encapsulamento

Esconder os detalhes internos e expor apenas o necessário. Protege o objeto de ficar num estado inválido.

```csharp
public class ContaBancaria
{
    public string Titular { get; }
    public decimal Saldo { get; private set; }   // só a própria classe altera

    public ContaBancaria(string titular)
    {
        Titular = titular;
    }

    public void Depositar(decimal valor)
    {
        if (valor <= 0)
            throw new ArgumentException("O depósito deve ser positivo.");
        Saldo += valor;
    }

    public void Sacar(decimal valor)
    {
        if (valor > Saldo)
            throw new InvalidOperationException("Saldo insuficiente.");
        Saldo -= valor;
    }
}

var conta = new ContaBancaria("Ana");
conta.Depositar(100);
// conta.Saldo = 1000000;  // ERRO: o set é privado
```

**Modificadores de acesso:**

| Modificador | Quem acessa |
|-------------|-------------|
| `public` | Qualquer código |
| `private` | Só a própria classe (padrão para membros) |
| `protected` | A classe e suas filhas |
| `internal` | Qualquer código do mesmo projeto |

#### Herança

Uma classe pode **herdar** dados e comportamentos de outra. Use quando existe uma relação "é um": um `Cachorro` **é um** `Animal`.

```csharp
public class Animal
{
    public string Nome { get; set; } = "";
    public void Comer() => Console.WriteLine($"{Nome} está comendo.");
}

public class Cachorro : Animal
{
    public void Latir() => Console.WriteLine("Au au!");
}

var rex = new Cachorro { Nome = "Rex" };
rex.Comer();   // herdado de Animal
rex.Latir();   // próprio do Cachorro
```

#### Polimorfismo

"Muitas formas": o mesmo método se comporta de jeitos diferentes conforme o objeto.

```csharp
public class Animal
{
    public virtual void EmitirSom() => Console.WriteLine("...");
}

public class Cachorro : Animal
{
    public override void EmitirSom() => Console.WriteLine("Au au!");
}

public class Gato : Animal
{
    public override void EmitirSom() => Console.WriteLine("Miau!");
}

List<Animal> animais = new() { new Cachorro(), new Gato() };
foreach (var a in animais)
    a.EmitirSom();   // Au au! / Miau!
```

O código do `foreach` não sabe nem precisa saber qual animal é cada um.

#### Abstração

Representar apenas o essencial e esconder a complexidade. Uma **classe abstrata** não pode ser instanciada diretamente: serve de base para outras.

```csharp
public abstract class Forma
{
    public abstract double CalcularArea();   // cada filha é obrigada a implementar
}

public class Retangulo : Forma
{
    public double Largura { get; set; }
    public double Altura { get; set; }
    public override double CalcularArea() => Largura * Altura;
}

public class Circulo : Forma
{
    public double Raio { get; set; }
    public override double CalcularArea() => Math.PI * Raio * Raio;
}
```

### 2.4 Interfaces

Uma **interface** é um contrato: diz **o que** uma classe deve fazer, sem dizer **como**. Uma classe pode implementar várias interfaces (mas só pode herdar de uma classe).

```csharp
public interface INotificador
{
    void Enviar(string destino, string mensagem);
}

public class NotificadorEmail : INotificador
{
    public void Enviar(string destino, string mensagem)
        => Console.WriteLine($"E-mail para {destino}: {mensagem}");
}

public class NotificadorSms : INotificador
{
    public void Enviar(string destino, string mensagem)
        => Console.WriteLine($"SMS para {destino}: {mensagem}");
}

static void AvisarCliente(INotificador notificador)
{
    notificador.Enviar("cliente", "Seu pedido saiu para entrega.");
}

AvisarCliente(new NotificadorEmail());
AvisarCliente(new NotificadorSms());
```

Interfaces são a base de quase tudo que você vai ver na Parte 3. Por convenção, o nome começa com `I`.

### 2.5 Tipos por valor e por referência

- **Tipos por valor** (`int`, `double`, `bool`, `struct`): a variável guarda o próprio valor. Copiar a variável copia o valor.
- **Tipos por referência** (`class`, `string`, arrays, listas): a variável guarda o **endereço** do objeto na memória. Copiar a variável copia o endereço, e as duas apontam para o mesmo objeto.

```csharp
int a = 10;
int b = a;
b = 20;
Console.WriteLine(a);   // 10 → a não mudou

var p1 = new Pessoa("Ana", 30);
var p2 = p1;            // p2 aponta para o MESMO objeto
p2.Nome = "Carla";
Console.WriteLine(p1.Nome);   // Carla → p1 mudou também!
```

Entender isso evita muitos bugs difíceis de achar.

### 2.6 Null e tipos anuláveis

`null` significa "nenhum valor" ou "não aponta para nenhum objeto". Acessar um membro de algo nulo causa a famosa `NullReferenceException`.

```csharp
string? nome = null;        // o ? indica que pode ser nulo
int? idade = null;          // int anulável

Console.WriteLine(nome?.Length);        // ?. só acessa se não for nulo
string exibir = nome ?? "Anônimo";      // ?? usa um valor padrão se for nulo
```

### 2.7 Coleções e generics

**Generics** permitem escrever código que funciona com qualquer tipo, mantendo a segurança de tipos. O `<T>` em `List<T>` é um generic.

| Coleção | Uso |
|---------|-----|
| `List<T>` | Lista ordenada, acesso por índice |
| `Dictionary<TChave, TValor>` | Pares chave/valor, busca rápida pela chave |
| `HashSet<T>` | Conjunto sem repetição |
| `Queue<T>` | Fila (primeiro a entrar, primeiro a sair) |
| `Stack<T>` | Pilha (último a entrar, primeiro a sair) |

```csharp
var estoque = new Dictionary<string, int>
{
    ["caneta"] = 50,
    ["caderno"] = 20
};
estoque["lápis"] = 100;
Console.WriteLine(estoque["caneta"]);   // 50

if (estoque.TryGetValue("borracha", out int qtd))
    Console.WriteLine(qtd);
else
    Console.WriteLine("Produto não encontrado");
```

Você também pode criar seus próprios generics:

```csharp
public class Caixa<T>
{
    public T Conteudo { get; set; }
    public Caixa(T conteudo) => Conteudo = conteudo;
}

var caixaDeTexto = new Caixa<string>("presente");
var caixaDeNumero = new Caixa<int>(42);
```

### 2.8 Expressões lambda e LINQ

Uma **lambda** é uma função curta e sem nome: `x => x * 2` significa "recebe x, devolve x vezes 2".

**LINQ** (Language Integrated Query) permite consultar coleções de forma declarativa, parecida com SQL (que você verá no Guia 4).

```csharp
var produtos = new List<Produto>
{
    new("Notebook", 4500m, "Eletrônicos"),
    new("Mouse", 80m, "Eletrônicos"),
    new("Cadeira", 900m, "Móveis"),
    new("Mesa", 1200m, "Móveis"),
};

// Filtrar
var caros = produtos.Where(p => p.Preco > 1000);

// Transformar
var nomes = produtos.Select(p => p.Nome);

// Ordenar
var porPreco = produtos.OrderBy(p => p.Preco);

// Agregar
decimal total = produtos.Sum(p => p.Preco);
bool temBarato = produtos.Any(p => p.Preco < 100);
var primeiro = produtos.FirstOrDefault(p => p.Categoria == "Móveis");

// Agrupar
var porCategoria = produtos
    .GroupBy(p => p.Categoria)
    .Select(g => new { Categoria = g.Key, Quantidade = g.Count() });

public record Produto(string Nome, decimal Preco, string Categoria);
```

O `record` acima é uma forma curta de criar uma classe para guardar dados.

### 2.9 Tratamento de exceções

Uma **exceção** é um erro que acontece durante a execução. Se não for tratada, o programa para.

```csharp
try
{
    Console.Write("Digite um número: ");
    int n = int.Parse(Console.ReadLine()!);
    Console.WriteLine(100 / n);
}
catch (FormatException)
{
    Console.WriteLine("Você não digitou um número.");
}
catch (DivideByZeroException)
{
    Console.WriteLine("Não é possível dividir por zero.");
}
catch (Exception ex)
{
    Console.WriteLine($"Erro inesperado: {ex.Message}");
}
finally
{
    Console.WriteLine("Isto sempre executa.");
}
```

**Boas práticas:**
- Capture exceções específicas antes das genéricas.
- Não use `catch` vazio: esconder o erro é pior que deixar o programa quebrar.
- Exceções são para situações **excepcionais**. Para validação comum, prefira `if` e `TryParse`.

### 2.10 Programação assíncrona (async/await)

Algumas operações demoram: ler um arquivo, consultar um banco, chamar uma API. Em vez de travar o programa esperando, usamos código **assíncrono**.

Analogia: num restaurante, o garçom anota seu pedido e vai atender outras mesas enquanto a cozinha prepara. Ele não fica parado na porta da cozinha. `await` é o garçom indo atender outras mesas.

```csharp
static async Task<string> BaixarPaginaAsync(string url)
{
    using var http = new HttpClient();
    string conteudo = await http.GetStringAsync(url);   // não trava a thread
    return conteudo;
}

string html = await BaixarPaginaAsync("https://example.com");
Console.WriteLine(html.Length);
```

Regras práticas:
- Um método com `await` deve ser marcado com `async` e retornar `Task` ou `Task<T>`.
- Por convenção, o nome termina com `Async`.
- Em APIs (Parte 4), praticamente todo acesso a banco e rede é assíncrono.

### 2.11 Organização: namespaces, projetos e soluções

- **Namespace:** agrupa classes relacionadas e evita conflito de nomes (`namespace Loja.Pedidos;`).
- **Projeto (.csproj):** um conjunto de arquivos que gera um executável ou uma biblioteca.
- **Solução (.sln):** agrupa vários projetos relacionados.
- **NuGet:** o gerenciador de pacotes do .NET. `dotnet add package NomeDoPacote` instala bibliotecas de terceiros.

### Exercícios da Parte 2

1. Crie uma classe `Retangulo` com largura e altura e métodos para calcular área e perímetro.
2. Melhore a `ContaBancaria` com um método `Transferir(ContaBancaria destino, decimal valor)` e um histórico de transações.
3. Crie uma hierarquia `Funcionario` → `Gerente`, `Desenvolvedor`, com um método `CalcularSalario()` polimórfico (gerente ganha bônus de 20%, desenvolvedor ganha por hora).
4. Crie uma interface `IDesconto` com duas implementações: `DescontoPercentual` e `DescontoFixo`.
5. Use um `Dictionary<string, int>` para contar quantas vezes cada palavra aparece em um texto.
6. Com LINQ, a partir de uma lista de alunos (nome, nota, turma): liste os aprovados (nota ≥ 7), a média por turma e o aluno com a maior nota.
7. Escreva um programa que leia números até o usuário digitar "fim", tratando entradas inválidas com `try/catch`.

---

## Parte 3: Princípios, padrões e design

Saber a sintaxe não basta. Código que funciona hoje precisa continuar fácil de entender e alterar daqui a seis meses, por você ou por outra pessoa. Esta parte trata de **como organizar** o código.

### 3.1 Código limpo (Clean Code)

- **Nomes que explicam:** `diasDesdeUltimoAcesso` em vez de `d`. `CalcularFrete()` em vez de `Calc()`.
- **Métodos pequenos que fazem uma coisa só.** Se você precisa de "e" para descrever o método ("valida **e** salva **e** envia e-mail"), ele faz coisas demais.
- **Evite números mágicos:** `if (idade >= IdadeMinimaParaDirigir)` é mais claro que `if (idade >= 18)`.
- **Comentários explicam o porquê, não o quê.** Se o código precisa de um comentário para dizer o que faz, renomeie as coisas até ele não precisar.
- **Convenções do C#:** `PascalCase` para classes, métodos e propriedades; `camelCase` para variáveis locais e parâmetros; `_camelCase` para campos privados; `I` antes do nome de interfaces.

### 3.2 Princípios gerais

| Sigla | Significado | Ideia |
|-------|-------------|-------|
| **DRY** | Don't Repeat Yourself | Não repita lógica. Se copiou e colou, provavelmente deveria ser um método. |
| **KISS** | Keep It Simple, Stupid | A solução mais simples que resolve o problema costuma ser a melhor. |
| **YAGNI** | You Aren't Gonna Need It | Não construa hoje o que você *acha* que vai precisar amanhã. |

### 3.3 SOLID

Cinco princípios de design orientado a objetos. Não decore: entenda o problema que cada um resolve.

#### S: Single Responsibility (Responsabilidade Única)

Uma classe deve ter **um único motivo para mudar**.

```csharp
// RUIM: a classe faz três coisas diferentes
public class Pedido
{
    public void CalcularTotal() { /* ... */ }
    public void SalvarNoBanco() { /* ... */ }
    public void EnviarEmailConfirmacao() { /* ... */ }
}

// MELHOR: cada responsabilidade em seu lugar
public class Pedido { public decimal CalcularTotal() { /* ... */ return 0; } }
public class PedidoRepository { public void Salvar(Pedido p) { /* ... */ } }
public class EmailService { public void EnviarConfirmacao(Pedido p) { /* ... */ } }
```

#### O: Open/Closed (Aberto/Fechado)

Aberto para **extensão**, fechado para **modificação**. Deve ser possível adicionar comportamento sem mexer no código que já funciona.

```csharp
// RUIM: cada novo tipo de frete exige alterar este método
public decimal CalcularFrete(string tipo, decimal peso)
{
    if (tipo == "normal") return peso * 2;
    if (tipo == "expresso") return peso * 5;
    // amanhã alguém adiciona outro if aqui...
    return 0;
}

// MELHOR: novos fretes são novas classes
public interface IFrete { decimal Calcular(decimal peso); }
public class FreteNormal : IFrete { public decimal Calcular(decimal peso) => peso * 2; }
public class FreteExpresso : IFrete { public decimal Calcular(decimal peso) => peso * 5; }
```

#### L: Liskov Substitution (Substituição de Liskov)

Uma classe filha deve poder substituir a classe mãe sem quebrar o programa. Se `Pinguim` herda de `Ave` e `Ave` tem `Voar()`, temos um problema: pinguins não voam. A hierarquia está errada.

#### I: Interface Segregation (Segregação de Interfaces)

É melhor ter várias interfaces pequenas e específicas do que uma grande e genérica. Ninguém deve ser obrigado a implementar métodos que não usa.

```csharp
// RUIM: uma impressora simples é obrigada a implementar Escanear e Fax
public interface IMultifuncional { void Imprimir(); void Escanear(); void EnviarFax(); }

// MELHOR
public interface IImpressora { void Imprimir(); }
public interface IScanner { void Escanear(); }
```

#### D: Dependency Inversion (Inversão de Dependência)

Classes devem depender de **abstrações** (interfaces), não de implementações concretas.

```csharp
// RUIM: PedidoService está preso ao SQL Server
public class PedidoService
{
    private readonly SqlServerRepository _repo = new SqlServerRepository();
}

// MELHOR: depende de uma interface, recebida pelo construtor
public class PedidoService
{
    private readonly IPedidoRepository _repo;
    public PedidoService(IPedidoRepository repo) => _repo = repo;
}
```

Agora você pode trocar o banco ou usar uma versão falsa nos testes sem tocar em `PedidoService`.

### 3.4 Injeção de dependência (DI)

O último exemplo mostra a **injeção de dependência**: em vez de a classe criar o que precisa (`new`), ela **recebe** pronto. O ASP.NET Core tem um contêiner de DI embutido que faz isso automaticamente (você vai usar na Parte 4).

```csharp
// Registro: "quando alguém pedir IPedidoRepository, entregue um PedidoRepository"
builder.Services.AddScoped<IPedidoRepository, PedidoRepository>();
builder.Services.AddScoped<PedidoService>();
```

**Tempos de vida:**

| Método | Uma instância por... |
|--------|----------------------|
| `AddSingleton` | aplicação inteira |
| `AddScoped` | requisição HTTP |
| `AddTransient` | cada vez que for pedida |

### 3.5 Padrões de projeto (Design Patterns)

Padrões de projeto são **soluções reutilizáveis para problemas comuns**. Foram catalogados no livro *Design Patterns* (1994), da "Gangue dos Quatro" (GoF). Dividem-se em três grupos:

- **Criacionais:** como criar objetos.
- **Estruturais:** como compor objetos.
- **Comportamentais:** como objetos se comunicam.

Aprenda o **problema** que cada padrão resolve. Aplicar padrão onde não há problema só complica o código.

#### Singleton (criacional)

**Problema:** garantir que exista uma única instância de uma classe.

```csharp
public sealed class Configuracao
{
    private static readonly Configuracao _instancia = new();
    public static Configuracao Instancia => _instancia;
    private Configuracao() { }   // construtor privado: ninguém mais cria
    public string AmbienteAtual { get; set; } = "Desenvolvimento";
}
```

No ASP.NET Core, prefira registrar a classe com `AddSingleton` em vez de implementar o padrão na mão.

#### Factory Method (criacional)

**Problema:** criar objetos sem que o código cliente precise saber qual classe concreta instanciar.

```csharp
public static class FreteFactory
{
    public static IFrete Criar(string tipo) => tipo switch
    {
        "normal" => new FreteNormal(),
        "expresso" => new FreteExpresso(),
        _ => throw new ArgumentException($"Tipo de frete desconhecido: {tipo}")
    };
}

IFrete frete = FreteFactory.Criar("expresso");
```

#### Builder (criacional)

**Problema:** montar objetos complexos passo a passo, de forma legível.

```csharp
var email = new EmailBuilder()
    .Para("cliente@exemplo.com")
    .Assunto("Pedido confirmado")
    .Corpo("Obrigado pela compra!")
    .Construir();
```

Você já usa builders no ASP.NET Core: `WebApplication.CreateBuilder()`.

#### Adapter (estrutural)

**Problema:** fazer uma classe com interface incompatível funcionar onde se espera outra interface. Como um adaptador de tomada.

```csharp
// Biblioteca de terceiros que você não pode alterar
public class ServicoSmsExterno
{
    public void SendMessage(string phone, string text) { /* ... */ }
}

// Adaptador que faz o serviço externo cumprir sua interface
public class SmsAdapter : INotificador
{
    private readonly ServicoSmsExterno _externo = new();
    public void Enviar(string destino, string mensagem)
        => _externo.SendMessage(destino, mensagem);
}
```

#### Decorator (estrutural)

**Problema:** adicionar comportamento a um objeto sem alterar sua classe.

```csharp
public class NotificadorComLog : INotificador
{
    private readonly INotificador _interno;
    public NotificadorComLog(INotificador interno) => _interno = interno;

    public void Enviar(string destino, string mensagem)
    {
        Console.WriteLine($"[LOG] Enviando para {destino}");
        _interno.Enviar(destino, mensagem);
    }
}

INotificador n = new NotificadorComLog(new NotificadorEmail());
```

#### Strategy (comportamental)

**Problema:** escolher um algoritmo entre vários em tempo de execução. O exemplo `IFrete` do princípio Open/Closed já é um Strategy.

```csharp
public class CalculadoraPedido
{
    private readonly IFrete _frete;
    public CalculadoraPedido(IFrete frete) => _frete = frete;
    public decimal Total(decimal subtotal, decimal peso) => subtotal + _frete.Calcular(peso);
}
```

#### Observer (comportamental)

**Problema:** avisar vários objetos quando algo acontece, sem que quem avisa conheça quem escuta. Em C#, isso é feito com **eventos**.

```csharp
public class Loja
{
    public event Action<string>? ProdutoChegou;
    public void ReceberProduto(string nome) => ProdutoChegou?.Invoke(nome);
}

var loja = new Loja();
loja.ProdutoChegou += nome => Console.WriteLine($"Cliente 1 avisado: {nome}");
loja.ProdutoChegou += nome => Console.WriteLine($"Cliente 2 avisado: {nome}");
loja.ReceberProduto("PlayStation");
```

#### Repository (padrão de arquitetura)

**Problema:** isolar o acesso a dados do resto da aplicação. O código de negócio fala com o repositório, não com o banco.

```csharp
public interface IProdutoRepository
{
    Task<Produto?> ObterPorIdAsync(int id);
    Task<List<Produto>> ListarAsync();
    Task AdicionarAsync(Produto produto);
    Task RemoverAsync(int id);
}
```

### 3.6 Arquitetura de software

À medida que um sistema cresce, ele precisa de uma organização maior que classes e padrões.

**Arquitetura em camadas** (a mais comum para começar):

```
┌──────────────────────────┐
│ Apresentação (API)       │  Recebe requisições, devolve respostas
├──────────────────────────┤
│ Aplicação / Serviços     │  Orquestra os casos de uso
├──────────────────────────┤
│ Domínio                  │  Entidades e regras de negócio
├──────────────────────────┤
│ Infraestrutura / Dados   │  Banco de dados, e-mail, arquivos
└──────────────────────────┘
```

Cada camada só conversa com a camada logo abaixo.

**Clean Architecture** inverte essa ideia: o **domínio** fica no centro e não depende de nada; banco de dados e API são detalhes da borda que dependem do domínio. É mais trabalhosa, mas facilita testes e trocas de tecnologia. Estude depois de dominar a arquitetura em camadas.

**MVC (Model-View-Controller):** separa dados (Model), apresentação (View) e controle do fluxo (Controller). É o padrão por trás dos controllers do ASP.NET Core.

### 3.7 Testes automatizados

Um teste automatizado é um código que verifica se outro código funciona. Ele roda em segundos e avisa quando uma mudança quebra algo.

```bash
dotnet new xunit -n Loja.Testes
```

```csharp
public class ContaBancariaTests
{
    [Fact]
    public void Depositar_ValorPositivo_AumentaSaldo()
    {
        // Arrange (preparar)
        var conta = new ContaBancaria("Ana");

        // Act (agir)
        conta.Depositar(100);

        // Assert (verificar)
        Assert.Equal(100, conta.Saldo);
    }

    [Fact]
    public void Sacar_ValorMaiorQueSaldo_LancaExcecao()
    {
        var conta = new ContaBancaria("Ana");
        Assert.Throws<InvalidOperationException>(() => conta.Sacar(50));
    }
}
```

Rode com `dotnet test`. Código que segue SOLID e usa injeção de dependência é muito mais fácil de testar.

### Exercícios da Parte 3

1. Pegue o exercício da `ContaBancaria` e escreva testes xUnit para depósito, saque e transferência.
2. Refatore este código aplicando o princípio Open/Closed com Strategy:
   ```csharp
   decimal CalcularImposto(string estado, decimal valor)
   {
       if (estado == "SP") return valor * 0.18m;
       if (estado == "RJ") return valor * 0.20m;
       if (estado == "MG") return valor * 0.18m;
       return valor * 0.17m;
   }
   ```
3. Crie um sistema de notificações com `INotificador`, implementações para e-mail e SMS, um Decorator de log e uma Factory que escolhe a implementação.
4. Implemente um `ProdutoRepositoryEmMemoria` (usando `List<Produto>`) que cumpra a interface `IProdutoRepository`.
5. Para cada padrão desta parte, escreva com suas palavras um exemplo do mundo real onde ele seria útil.

---

## Parte 4: APIs com ASP.NET Core

### 4.1 Como a web funciona

Quando você acessa um site:

1. O navegador (**cliente**) envia uma **requisição** HTTP para um **servidor**.
2. O servidor processa e devolve uma **resposta** HTTP.
3. O navegador exibe o resultado.

```
Cliente                                     Servidor
   │  ── GET /produtos/5 ──────────────────►  │
   │                                          │  busca no banco
   │  ◄── 200 OK  { "id": 5, "nome": ... } ── │
```

### 4.2 HTTP em detalhes

Uma requisição tem:

- **Método (verbo):** o que você quer fazer.
- **URL:** em qual recurso.
- **Cabeçalhos (headers):** metadados (`Content-Type`, `Authorization`).
- **Corpo (body):** dados enviados (em POST e PUT).

**Métodos HTTP:**

| Método | Ação | Exemplo |
|--------|------|---------|
| `GET` | Ler | `GET /produtos` |
| `POST` | Criar | `POST /produtos` |
| `PUT` | Substituir/atualizar | `PUT /produtos/5` |
| `PATCH` | Atualizar parcialmente | `PATCH /produtos/5` |
| `DELETE` | Remover | `DELETE /produtos/5` |

**Códigos de status:**

| Faixa | Significado | Mais comuns |
|-------|-------------|-------------|
| 2xx | Sucesso | `200 OK`, `201 Created`, `204 No Content` |
| 3xx | Redirecionamento | `301 Moved Permanently`, `304 Not Modified` |
| 4xx | Erro do cliente | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict` |
| 5xx | Erro do servidor | `500 Internal Server Error`, `503 Service Unavailable` |

### 4.3 JSON

**JSON** (JavaScript Object Notation) é o formato mais usado para trocar dados entre front-end e back-end.

```json
{
  "id": 5,
  "nome": "Notebook",
  "preco": 4500.00,
  "emEstoque": true,
  "tags": ["eletrônicos", "informática"],
  "fabricante": {
    "nome": "TechCorp",
    "pais": "Brasil"
  }
}
```

O ASP.NET Core converte objetos C# para JSON (e o contrário) automaticamente.

### 4.4 O que é uma API e o que é REST

Uma **API** (Application Programming Interface) é um conjunto de pontos de entrada que um programa expõe para outros programas usarem. Uma **API web** faz isso via HTTP.

**REST** é um estilo de arquitetura para APIs web. Os principais princípios:

- **Recursos identificados por URLs:** use substantivos no plural (`/produtos`, `/clientes/3/pedidos`), não verbos (`/obterProdutos`).
- **Verbos HTTP indicam a ação.**
- **Sem estado (stateless):** cada requisição contém tudo que o servidor precisa para atendê-la.
- **Representações:** o recurso é transferido numa representação, geralmente JSON.

**Exemplo de API REST para produtos:**

| Ação | Método e rota | Resposta de sucesso |
|------|---------------|---------------------|
| Listar | `GET /api/produtos` | `200` + lista |
| Obter um | `GET /api/produtos/5` | `200` + produto, ou `404` |
| Criar | `POST /api/produtos` | `201` + produto criado |
| Atualizar | `PUT /api/produtos/5` | `204` ou `200` |
| Excluir | `DELETE /api/produtos/5` | `204` |

### 4.5 Criando sua primeira API

```bash
dotnet new webapi -n LojaApi --use-controllers
cd LojaApi
dotnet run
```

O terminal mostra o endereço (algo como `http://localhost:5000`). O template já vem com um exemplo de previsão do tempo.

**Estrutura do projeto:**

```
LojaApi/
├── Controllers/         ← controllers da API
├── Properties/
│   └── launchSettings.json
├── appsettings.json     ← configurações (connection string, etc.)
├── Program.cs           ← ponto de entrada e configuração
└── LojaApi.csproj
```

**Program.cs:**

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. Registrar serviços (injeção de dependência)
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// 2. Configurar o pipeline de requisições (middlewares)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// 3. Iniciar
app.Run();
```

### 4.6 Duas formas de escrever endpoints

**Minimal APIs** (direto no `Program.cs`, ótimo para APIs pequenas):

```csharp
app.MapGet("/api/saudacao/{nome}", (string nome) => $"Olá, {nome}!");
```

**Controllers** (organizados em classes, mais comum em projetos grandes):

```csharp
[ApiController]
[Route("api/[controller]")]   // vira /api/saudacao
public class SaudacaoController : ControllerBase
{
    [HttpGet("{nome}")]
    public IActionResult Get(string nome) => Ok($"Olá, {nome}!");
}
```

Neste guia vamos usar controllers.

### 4.7 Um CRUD completo

**CRUD** = Create, Read, Update, Delete: as quatro operações básicas sobre dados.

**Modelo (entidade):**

```csharp
// Models/Produto.cs
public class Produto
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public decimal Preco { get; set; }
    public int Estoque { get; set; }
}
```

**DTOs (Data Transfer Objects):** objetos que definem o que entra e o que sai da API. Assim você não expõe a entidade diretamente e controla exatamente quais campos o cliente pode enviar.

```csharp
// DTOs/ProdutoDtos.cs
using System.ComponentModel.DataAnnotations;

public record CriarProdutoDto(
    [Required, StringLength(100)] string Nome,
    [Range(0.01, 1_000_000)] decimal Preco,
    [Range(0, int.MaxValue)] int Estoque);

public record ProdutoDto(int Id, string Nome, decimal Preco, int Estoque);
```

Os atributos `[Required]`, `[StringLength]` e `[Range]` fazem **validação automática**: com `[ApiController]`, se o cliente mandar dados inválidos, a API devolve `400 Bad Request` com os erros, sem você escrever nenhum `if`.

**Controller:**

```csharp
// Controllers/ProdutosController.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly IProdutoService _service;

    public ProdutosController(IProdutoService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<ProdutoDto>>> Listar()
        => Ok(await _service.ListarAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProdutoDto>> Obter(int id)
    {
        var produto = await _service.ObterAsync(id);
        return produto is null ? NotFound() : Ok(produto);
    }

    [HttpPost]
    public async Task<ActionResult<ProdutoDto>> Criar(CriarProdutoDto dto)
    {
        var criado = await _service.CriarAsync(dto);
        return CreatedAtAction(nameof(Obter), new { id = criado.Id }, criado);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, CriarProdutoDto dto)
    {
        var ok = await _service.AtualizarAsync(id, dto);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var ok = await _service.ExcluirAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
```

Repare como o controller é "magro": ele só recebe a requisição, chama o serviço e escolhe o código de status. A regra de negócio fica no serviço (responsabilidade única).

### 4.8 Entity Framework Core: conectando ao banco

O **Entity Framework Core (EF Core)** é um **ORM** (Object-Relational Mapper): ele traduz classes C# em tabelas do banco e consultas LINQ em SQL. Você vai entender as tabelas e o SQL gerado no Guia 4.

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet tool install --global dotnet-ef
```

**DbContext** (representa a sessão com o banco):

```csharp
// Data/LojaContext.cs
using Microsoft.EntityFrameworkCore;

public class LojaContext : DbContext
{
    public LojaContext(DbContextOptions<LojaContext> options) : base(options) { }

    public DbSet<Produto> Produtos => Set<Produto>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Produto>(e =>
        {
            e.Property(p => p.Nome).HasMaxLength(100).IsRequired();
            e.Property(p => p.Preco).HasPrecision(10, 2);
        });
    }
}
```

**appsettings.json:**

```json
{
  "ConnectionStrings": {
    "Loja": "Server=localhost;Database=LojaDb;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

**Program.cs:**

```csharp
builder.Services.AddDbContext<LojaContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Loja")));

builder.Services.AddScoped<IProdutoService, ProdutoService>();
```

**Migrations** (criam e atualizam as tabelas a partir das classes):

```bash
dotnet ef migrations add CriacaoInicial
dotnet ef database update
```

**Serviço usando o EF Core:**

```csharp
// Services/ProdutoService.cs
using Microsoft.EntityFrameworkCore;

public interface IProdutoService
{
    Task<List<ProdutoDto>> ListarAsync();
    Task<ProdutoDto?> ObterAsync(int id);
    Task<ProdutoDto> CriarAsync(CriarProdutoDto dto);
    Task<bool> AtualizarAsync(int id, CriarProdutoDto dto);
    Task<bool> ExcluirAsync(int id);
}

public class ProdutoService : IProdutoService
{
    private readonly LojaContext _db;
    public ProdutoService(LojaContext db) => _db = db;

    public Task<List<ProdutoDto>> ListarAsync() =>
        _db.Produtos
           .OrderBy(p => p.Nome)
           .Select(p => new ProdutoDto(p.Id, p.Nome, p.Preco, p.Estoque))
           .ToListAsync();

    public async Task<ProdutoDto?> ObterAsync(int id)
    {
        var p = await _db.Produtos.FindAsync(id);
        return p is null ? null : new ProdutoDto(p.Id, p.Nome, p.Preco, p.Estoque);
    }

    public async Task<ProdutoDto> CriarAsync(CriarProdutoDto dto)
    {
        var p = new Produto { Nome = dto.Nome, Preco = dto.Preco, Estoque = dto.Estoque };
        _db.Produtos.Add(p);
        await _db.SaveChangesAsync();
        return new ProdutoDto(p.Id, p.Nome, p.Preco, p.Estoque);
    }

    public async Task<bool> AtualizarAsync(int id, CriarProdutoDto dto)
    {
        var p = await _db.Produtos.FindAsync(id);
        if (p is null) return false;
        p.Nome = dto.Nome;
        p.Preco = dto.Preco;
        p.Estoque = dto.Estoque;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExcluirAsync(int id)
    {
        var p = await _db.Produtos.FindAsync(id);
        if (p is null) return false;
        _db.Produtos.Remove(p);
        await _db.SaveChangesAsync();
        return true;
    }
}
```

**Relacionamentos no EF Core** (um para muitos):

```csharp
public class Categoria
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public List<Produto> Produtos { get; set; } = new();   // uma categoria tem muitos produtos
}

public class Produto
{
    public int Id { get; set; }
    // ...
    public int CategoriaId { get; set; }                  // chave estrangeira
    public Categoria Categoria { get; set; } = null!;     // propriedade de navegação
}

// Carregando junto (vira um JOIN no SQL):
var produtos = await _db.Produtos.Include(p => p.Categoria).ToListAsync();
```

### 4.9 Middlewares e o pipeline

Cada requisição passa por uma sequência de **middlewares** antes de chegar ao controller, e a resposta passa por eles na volta. Cada um pode inspecionar, alterar ou interromper a requisição.

```
Requisição ─► [HTTPS] ─► [CORS] ─► [Autenticação] ─► [Autorização] ─► Controller
Resposta   ◄─ [HTTPS] ◄─ [CORS] ◄─ [Autenticação] ◄─ [Autorização] ◄─ Controller
```

A ordem dos `app.Use...()` no `Program.cs` importa.

Um middleware próprio, que mede o tempo de cada requisição:

```csharp
app.Use(async (context, next) =>
{
    var inicio = DateTime.UtcNow;
    await next();   // chama o próximo middleware
    var duracao = DateTime.UtcNow - inicio;
    Console.WriteLine($"{context.Request.Method} {context.Request.Path} → {context.Response.StatusCode} em {duracao.TotalMilliseconds} ms");
});
```

### 4.10 Tratamento global de erros

Em vez de `try/catch` em cada controller, trate erros num lugar só e devolva respostas padronizadas (formato **ProblemDetails**):

```csharp
builder.Services.AddProblemDetails();
// ...
app.UseExceptionHandler();
app.UseStatusCodePages();
```

Nunca devolva detalhes internos de exceções (stack trace, mensagens do banco) ao cliente em produção. Isso expõe informações úteis para atacantes.

### 4.11 Documentação e testes manuais

O template gera um documento **OpenAPI** que descreve sua API. Você pode explorá-la com uma interface visual instalando o Swagger UI ou o Scalar:

```bash
dotnet add package Scalar.AspNetCore
```

```csharp
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();   // acesse /scalar
}
```

Outras opções para testar: o arquivo `.http` do próprio projeto (o VS Code e o Visual Studio executam), o **Postman** ou o **Insomnia**.

```http
### Criar produto
POST http://localhost:5000/api/produtos
Content-Type: application/json

{
  "nome": "Teclado",
  "preco": 250.00,
  "estoque": 15
}
```

### 4.12 CORS

Por segurança, o navegador bloqueia requisições de um site para outro domínio ou porta (por exemplo, do Angular em `localhost:4200` para a API em `localhost:5000`). **CORS** é a configuração que diz à API quais origens podem chamá-la.

```csharp
builder.Services.AddCors(o => o.AddPolicy("Frontend", p =>
    p.WithOrigins("http://localhost:4200")
     .AllowAnyHeader()
     .AllowAnyMethod()));
// ...
app.UseCors("Frontend");
```

Você vai precisar disso quando conectar o Angular (Guia 2) à sua API.

### 4.13 Autenticação e autorização

- **Autenticação:** *quem é você?* (login)
- **Autorização:** *o que você pode fazer?* (permissões)

O modelo mais comum em APIs é o **JWT** (JSON Web Token):

1. O usuário envia login e senha para `POST /api/auth/login`.
2. A API valida e devolve um **token** assinado.
3. O cliente envia o token em todas as requisições seguintes: `Authorization: Bearer <token>`.
4. A API valida a assinatura do token e identifica o usuário.

```csharp
[Authorize]                       // exige usuário autenticado
[HttpDelete("{id:int}")]
public async Task<IActionResult> Excluir(int id) { /* ... */ }

[Authorize(Roles = "Admin")]      // exige o papel Admin
[HttpPost]
public async Task<ActionResult<ProdutoDto>> Criar(CriarProdutoDto dto) { /* ... */ }

[AllowAnonymous]                  // libera mesmo se o controller exigir login
[HttpGet]
public async Task<ActionResult<List<ProdutoDto>>> Listar() { /* ... */ }
```

**Regras de segurança que nunca mudam:**
- Nunca guarde senhas em texto puro. Use um hash com sal (por exemplo, o `PasswordHasher` do ASP.NET Core Identity).
- Nunca coloque segredos (chaves, senhas de banco) no código ou no Git. Use **User Secrets** (`dotnet user-secrets`) em desenvolvimento e variáveis de ambiente ou um cofre de segredos em produção.
- Sempre use HTTPS.
- Valide toda entrada que vem do cliente.

### 4.14 Boas práticas para APIs

- **Paginação:** nunca devolva milhares de registros de uma vez. `GET /api/produtos?pagina=2&tamanho=20`.
- **Filtros e ordenação via query string:** `GET /api/produtos?categoria=moveis&ordem=preco`.
- **Versionamento:** `/api/v1/produtos`, para poder evoluir sem quebrar clientes antigos.
- **Logs:** use o `ILogger<T>` injetado para registrar o que acontece.
- **Use `async` em tudo que acessa banco ou rede.**
- **Códigos de status corretos:** não devolva `200` com `{ "erro": "..." }` no corpo.

### Exercícios da Parte 4

1. Crie a API de produtos completa desta parte, com EF Core e SQL Server. Teste todas as rotas pelo arquivo `.http`.
2. Adicione a entidade `Categoria` com relacionamento um-para-muitos e o endpoint `GET /api/categorias/{id}/produtos`.
3. Adicione paginação e filtro por nome em `GET /api/produtos`.
4. Adicione validação: o nome do produto deve ser único (devolva `409 Conflict` se já existir).
5. Escreva testes xUnit para o `ProdutoService` usando o provedor de banco em memória (`Microsoft.EntityFrameworkCore.InMemory`).
6. **Desafio:** adicione cadastro e login de usuários com JWT e proteja os endpoints de escrita.

---

## Glossário

| Termo | Significado |
|-------|-------------|
| Algoritmo | Sequência finita de passos para resolver um problema |
| API | Interface que um programa expõe para outros usarem |
| Classe | Molde que define dados e comportamentos de objetos |
| Compilador | Programa que traduz código-fonte para outro formato executável |
| CRUD | Create, Read, Update, Delete |
| DTO | Objeto usado só para transportar dados entre camadas |
| Endpoint | Uma rota específica da API (método + URL) |
| Exceção | Erro que ocorre durante a execução |
| Interface | Contrato que define métodos que uma classe deve implementar |
| JSON | Formato de texto para troca de dados |
| Middleware | Componente que processa requisições no pipeline |
| Objeto | Instância de uma classe |
| ORM | Ferramenta que mapeia objetos para tabelas do banco |
| REST | Estilo de arquitetura para APIs web |
| Runtime | Ambiente que executa o programa |

## Para continuar estudando

- **Documentação oficial:** https://learn.microsoft.com/dotnet/csharp
- **Tutoriais do ASP.NET Core:** https://learn.microsoft.com/aspnet/core
- **Microsoft Learn (trilhas gratuitas, em português):** https://learn.microsoft.com/training
- **Livros:** *Código Limpo* (Robert C. Martin); *Padrões de Projeto* (Gamma, Helm, Johnson, Vlissides); *Entendendo Algoritmos* (Aditya Bhargava), excelente para iniciantes.
- **Prática de algoritmos:** https://www.beecrowd.com.br (problemas em português), https://exercism.org/tracks/csharp, https://leetcode.com

**Próximo passo:** [Guia 2: JavaScript, TypeScript e Angular](02-javascript-typescript-angular.md)
