# Guia 2: Git e versionamento de código

> **Objetivo:** aprender a guardar o histórico do seu código com Git, trabalhar com branches sem medo de estragar o que já funciona e publicar seus projetos no GitHub. A partir daqui, todo exercício e projeto da trilha pode (e deve) virar um repositório.
>
> **Pré-requisito:** Guia 1 (C#). Você já usou o terminal para rodar `dotnet` e já tem código de verdade para versionar.

## Sumário

- [Parte 0: Preparando o ambiente](#parte-0-preparando-o-ambiente)
- [Parte 1: O que é versionamento de código](#parte-1-o-que-é-versionamento-de-código)
- [Parte 2: Primeiros passos com Git](#parte-2-primeiros-passos-com-git)
- [Parte 3: O fluxo de trabalho do dia a dia](#parte-3-o-fluxo-de-trabalho-do-dia-a-dia)
- [Parte 4: Branches e merge](#parte-4-branches-e-merge)
- [Parte 5: Repositórios remotos e GitHub](#parte-5-repositórios-remotos-e-github)
- [Parte 6: Git nos projetos da trilha](#parte-6-git-nos-projetos-da-trilha)
- [Glossário](#glossário)
- [Para continuar estudando](#para-continuar-estudando)

---

## Parte 0: Preparando o ambiente

### Ferramentas deste guia

| Ferramenta | Para quê | Obrigatória? |
|-----------|----------|--------------|
| **Git** | Controle de versão, usado pelo terminal | Sim |
| **Visual Studio Code** | Editor de mensagens de commit, resolução de conflitos e painel visual do Git | Recomendado (veja a Parte 0 do Guia 1) |
| **Conta no GitHub** | Guardar seus repositórios na nuvem e montar seu portfólio | Sim, a partir da Parte 5 |
| **GitHub Desktop** | Interface gráfica alternativa ao terminal | Opcional |

### Instalando o Git

Se você já instalou o Git no Guia 1, confira a versão e pule para o próximo tópico:

```bash
git --version     # ex.: git version 2.51.0.windows.1
```

**No Windows**, pelo terminal:

```bash
winget install Git.Git
```

Ou baixe o instalador em https://git-scm.com/downloads. O instalador faz muitas perguntas; as opções padrão servem, com dois ajustes recomendados:

1. **Choosing the default editor used by Git:** escolha **Use Visual Studio Code as Git's default editor**.
2. **Adjusting the name of the initial branch:** escolha **Override the default branch name** e digite `main`.

O instalador também traz o **Git Bash**, um terminal no estilo Linux. Você pode usar o Git pelo PowerShell, pelo Git Bash ou pelo terminal integrado do VS Code: os comandos `git` são os mesmos.

- **macOS:** rode `git --version` no Terminal; se não estiver instalado, o sistema oferece instalar as *Command Line Tools*. Outra opção é `brew install git`.
- **Linux (Ubuntu/Debian):** `sudo apt install git`.

> Depois de instalar, **feche e abra o terminal** de novo. Terminais que já estavam abertos não enxergam programas recém-instalados.

### Configurando sua identidade

Todo commit registra **quem** fez a alteração. Configure seu nome e e-mail uma única vez por computador:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

> Use o **mesmo e-mail da sua conta no GitHub**. É assim que o GitHub liga os commits ao seu perfil. Se não quiser expor seu e-mail, o GitHub oferece um endereço do tipo `12345+usuario@users.noreply.github.com` em **Settings → Emails**.

Outras configurações úteis:

```bash
git config --global init.defaultBranch main      # novos repositórios começam na branch main
git config --global core.editor "code --wait"    # VS Code como editor de mensagens
git config --global core.autocrlf true           # só no Windows: converte finais de linha (veja abaixo)
git config --global --list                       # mostra tudo o que está configurado
```

**Por que `core.autocrlf`?** O Windows termina cada linha de texto com dois caracteres invisíveis (CRLF) e o Linux e o macOS com um (LF). Com `true`, o Git guarda LF no repositório e entrega CRLF na sua máquina, evitando que um arquivo pareça "todo alterado" quando outra pessoa o abre em outro sistema. No macOS e no Linux, use `input`.

### Criando sua conta no GitHub

O **GitHub** (https://github.com) é o serviço mais usado para hospedar repositórios Git. É gratuito para repositórios públicos e privados.

1. Acesse https://github.com/signup e crie a conta.
2. Escolha um **nome de usuário profissional**: ele vai aparecer nos links dos seus projetos (`github.com/seu-usuario/projeto`) e no seu currículo.
3. Ative a **autenticação em dois fatores** (**Settings → Password and authentication**). O GitHub exige isso de quem envia código.
4. Coloque uma foto e uma descrição curta no perfil. Recrutadores olham.

### Testando o ambiente

Rode no terminal:

```bash
git --version
git config user.name
git config user.email
```

Se os três comandos mostrarem a versão, o seu nome e o seu e-mail, está tudo pronto.

---

## Parte 1: O que é versionamento de código

### 1.1 O problema

Você provavelmente já viu (ou criou) uma pasta assim:

```
trabalho.docx
trabalho_v2.docx
trabalho_v2_revisado.docx
trabalho_final.docx
trabalho_final_AGORA_VAI.docx
```

Agora imagine isso com um projeto de 200 arquivos e cinco pessoas mexendo ao mesmo tempo. Surgem perguntas difíceis:

- Qual é a versão que funciona?
- O que mudou entre ontem e hoje, e quem mudou?
- Como desfazer só a alteração que quebrou o sistema, sem perder o resto?
- Como duas pessoas editam o mesmo arquivo sem uma apagar o trabalho da outra?

### 1.2 O que é um sistema de controle de versão

Um **sistema de controle de versão** (VCS, *Version Control System*) registra as alterações de um conjunto de arquivos ao longo do tempo. Cada registro é uma "foto" do projeto, com data, autor e uma mensagem explicando o que mudou. Com ele você pode:

- **Voltar no tempo:** ver ou restaurar qualquer versão anterior.
- **Comparar:** ver exatamente quais linhas mudaram entre duas versões.
- **Experimentar com segurança:** criar uma linha paralela de desenvolvimento, testar uma ideia e descartá-la sem afetar a versão principal.
- **Colaborar:** juntar o trabalho de várias pessoas de forma organizada.

O **Git** é o sistema de controle de versão mais usado no mundo. Foi criado em 2005 por Linus Torvalds, o criador do Linux, para gerenciar o código do próprio Linux.

### 1.3 Git não é GitHub

Uma confusão muito comum:

| | Git | GitHub |
|--|-----|--------|
| O que é | Um **programa** instalado no seu computador | Um **site/serviço** na internet |
| Função | Registrar o histórico do código | Hospedar repositórios Git e facilitar a colaboração |
| Funciona sem internet? | Sim | Não |
| Alternativas | Mercurial, SVN (mais antigos) | GitLab, Bitbucket, Azure DevOps |

Uma analogia: o Git é como a câmera que tira as fotos; o GitHub é como o álbum online onde você guarda e compartilha essas fotos.

### 1.4 Centralizado x distribuído

Sistemas antigos, como o SVN, são **centralizados**: o histórico fica num servidor, e cada pessoa tem só a versão atual dos arquivos. Sem acesso ao servidor, não dá para fazer commit nem ver o histórico.

O Git é **distribuído**: cada cópia do repositório tem o **histórico completo**. Você faz commits, cria branches e consulta o histórico sem internet. O GitHub é só mais uma cópia, que a equipe combina de usar como ponto de encontro.

```
        Centralizado                         Distribuído

          Servidor                             GitHub
         (histórico)                        (histórico)
        /    |    \                         /    |    \
      Ana   Bia   Caio                    Ana   Bia   Caio
    (arquivos) (arquivos)            (histórico) (histórico)
```

### 1.5 O mínimo de terminal

O Git tem interfaces gráficas, mas entender os comandos ajuda a saber o que está acontecendo de verdade (e a seguir tutoriais e respostas na internet). Estes comandos funcionam no PowerShell e no Git Bash:

| Comando | O que faz |
|---------|-----------|
| `pwd` | Mostra a pasta atual |
| `ls` | Lista os arquivos da pasta (`ls -a` mostra também os ocultos, no Git Bash) |
| `cd nome-da-pasta` | Entra numa pasta |
| `cd ..` | Volta para a pasta de cima |
| `mkdir nome` | Cria uma pasta |
| `code .` | Abre a pasta atual no VS Code |
| `clear` | Limpa a tela |

> **Dica:** aperte **Tab** para completar nomes de pastas e arquivos, e as setas **↑** e **↓** para repetir comandos anteriores.

### Exercícios da Parte 1

1. Explique, com suas palavras, a diferença entre Git e GitHub.
2. Liste três situações do seu dia a dia (fora da programação) em que um controle de versão teria ajudado.
3. Pelo terminal, crie a pasta `estudos-git`, entre nela e abra-a no VS Code com `code .`.

---

## Parte 2: Primeiros passos com Git

### 2.1 Criando um repositório

Um **repositório** é uma pasta cujo histórico o Git está acompanhando. Dentro da pasta `estudos-git`:

```bash
git init
```

O Git cria uma pasta oculta chamada `.git`. **É ali que fica todo o histórico.** Seus arquivos continuam onde estão; a pasta `.git` só guarda as fotos e as informações sobre elas.

> **Nunca apague nem edite a pasta `.git` manualmente.** Se ela sumir, o histórico some junto.

Rode `git init` **uma vez por projeto**, na pasta raiz. Não crie um repositório dentro de outro.

### 2.2 As três áreas do Git

Este é o conceito mais importante do guia. Um arquivo passa por três lugares:

```
 Diretório de trabalho          Staging area              Repositório
 (working directory)            (área de preparação)      (.git, o histórico)
┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
│ Onde você edita   │── add ─►│ O que vai entrar  │─commit─►│ Fotos permanentes │
│ os arquivos       │         │ no próximo commit │         │ do projeto        │
└───────────────────┘         └───────────────────┘         └───────────────────┘
```

- **Diretório de trabalho:** os arquivos que você vê e edita.
- **Staging area:** uma "caixa" onde você separa as alterações que vão entrar na próxima foto.
- **Repositório:** o histórico de commits, guardado na pasta `.git`.

Por que existe a staging area? Para você escolher **o que** entra em cada commit. Se você corrigiu um bug e também mudou o estilo de outra tela, pode fazer dois commits separados, cada um com sua explicação.

### 2.3 Vendo o estado: git status

`git status` é o comando que você mais vai usar. Ele diz em que branch você está e em que área cada arquivo se encontra. Crie um arquivo `README.md` com o texto `# Estudos de Git` e rode:

```bash
git status
```

```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md
```

Os estados possíveis de um arquivo:

| Estado | Significado |
|--------|-------------|
| **Untracked** (não rastreado) | Arquivo novo que o Git ainda não acompanha |
| **Modified** (modificado) | Arquivo acompanhado que mudou desde o último commit |
| **Staged** (preparado) | Alteração marcada para entrar no próximo commit |
| **Committed** (sem alterações) | Igual à versão do último commit; não aparece no `status` |

> **Regra de ouro:** rode `git status` antes e depois de cada comando enquanto estiver aprendendo. Ele quase sempre mostra também o comando para desfazer o que você acabou de fazer.

### 2.4 Preparando alterações: git add

```bash
git add README.md          # um arquivo
git add src/               # uma pasta inteira
git add .                  # tudo o que mudou na pasta atual e subpastas
```

Rode `git status` de novo: o `README.md` aparece em **Changes to be committed**.

> `git add .` é prático, mas pode incluir arquivos que você não queria (senhas, arquivos gerados). Olhe o `git status` antes de fazer o commit.

### 2.5 Registrando: git commit

```bash
git commit -m "Adiciona README com o título do projeto"
```

Pronto: você criou a primeira foto do projeto. Cada commit recebe um identificador único, o **hash**, como `a1b2c3d4e5f6...`. Na prática, os 7 primeiros caracteres (`a1b2c3d`) bastam para se referir a ele.

Sem o `-m`, o Git abre o editor configurado (o VS Code) para você escrever uma mensagem mais longa. Salve e feche a aba para concluir o commit.

### 2.6 Boas mensagens de commit

O histórico é lido por pessoas, inclusive por você daqui a seis meses. Compare:

| Ruim | Bom |
|------|-----|
| `ajustes` | `Corrige cálculo do desconto para pedidos acima de R$ 500` |
| `teste` | `Adiciona testes do serviço de clientes` |
| `mudanças diversas` | (dois commits) `Valida CPF no cadastro` e `Aumenta fonte dos botões` |

Regras práticas:

- Escreva no **imperativo**, completando a frase "Este commit vai...": "Adiciona", "Corrige", "Remove".
- Primeira linha curta (até ~50 caracteres), dizendo **o que** mudou. Se precisar explicar o **porquê**, deixe uma linha em branco e escreva um parágrafo.
- **Um assunto por commit.** Commits pequenos são mais fáceis de entender e de desfazer.

Muitas equipes usam o padrão **Conventional Commits**, que adiciona um prefixo com o tipo da alteração:

```
feat: adiciona cadastro de instrumentos
fix: corrige data de devolução no fuso horário errado
docs: explica como rodar o projeto no README
refactor: extrai cálculo do valor para um serviço
```

### 2.7 Vendo o histórico: git log

```bash
git log                    # histórico completo
git log --oneline          # uma linha por commit
git log --oneline --graph --all   # desenha as branches
git log -p README.md       # histórico de um arquivo, com as alterações
```

```
3f9c2a1 (HEAD -> main) Adiciona seção de comandos básicos
a1b2c3d Adiciona README com o título do projeto
```

`HEAD` é um ponteiro para "onde você está agora", normalmente o último commit da branch atual. Aperte **q** para sair do `git log` quando a lista for longa.

### 2.8 Vendo as diferenças: git diff

```bash
git diff                   # o que mudou e ainda NÃO está na staging area
git diff --staged          # o que está na staging area e vai para o próximo commit
git diff a1b2c3d 3f9c2a1   # diferença entre dois commits
```

```diff
-# Estudos de Git
+# Estudos de Git e GitHub
+
+Anotações do Guia 2 da Trilha Web.
```

Linhas com `-` foram removidas; linhas com `+` foram adicionadas. Uma linha alterada aparece como uma remoção seguida de uma adição.

### 2.9 Ignorando arquivos: .gitignore

Nem tudo deve ir para o repositório:

- **Arquivos gerados** pela compilação (`bin/`, `obj/`, `dist/`): podem ser recriados a qualquer momento.
- **Dependências baixadas** (`node_modules/`): o `package.json` já diz quais são.
- **Segredos** (senhas, chaves de API, arquivos `.env`): nunca devem ir para o Git.
- **Arquivos pessoais** do editor ou do sistema (`.vs/`, `.DS_Store`, `Thumbs.db`).

Crie um arquivo chamado `.gitignore` na raiz do repositório, com um padrão por linha:

```gitignore
# Compilação .NET
bin/
obj/

# Node e Angular
node_modules/
dist/
.angular/

# Segredos
.env
appsettings.Development.json

# Sistema e editores
.vs/
.DS_Store
Thumbs.db
*.log
```

O `.gitignore` também deve ir para o repositório (`git add .gitignore`), para valer para toda a equipe. Modelos prontos para cada tecnologia: https://github.com/github/gitignore.

> O `.gitignore` só afeta arquivos **ainda não rastreados**. Se um arquivo já foi commitado, adicioná-lo ao `.gitignore` não o remove do histórico. Para parar de rastreá-lo (mantendo-o no disco), use `git rm --cached nome-do-arquivo` e faça um commit.

### Exercícios da Parte 2

1. Na pasta `estudos-git`, crie o repositório, um `README.md` e faça o primeiro commit.
2. Crie os arquivos `comandos.md` e `duvidas.md`. Faça **dois commits separados**, um para cada arquivo, usando `git add` com o nome do arquivo.
3. Altere o `README.md`, veja a diferença com `git diff`, adicione com `git add` e compare com `git diff --staged`.
4. Crie um arquivo `senha.txt` e um `.gitignore` que o ignore. Confirme com `git status` que ele não aparece.
5. Rode `git log --oneline` e explique o que cada linha mostra.
6. Transforme a pasta do Jogo de Adivinhação do Guia 1 num repositório, com um `.gitignore` que ignore `bin/` e `obj/`.

---

## Parte 3: O fluxo de trabalho do dia a dia

### 3.1 O ciclo básico

Quase todo o seu trabalho com Git vai seguir este ciclo:

```
  ┌──► 1. Edite os arquivos
  │    2. git status           (o que mudou?)
  │    3. git diff             (confira as alterações)
  │    4. git add <arquivos>   (separe o que vai no commit)
  │    5. git commit -m "..."  (registre com uma boa mensagem)
  └─── repita
```

**Quando fazer um commit?** Sempre que você terminar uma unidade de trabalho que faça sentido sozinha e que **funcione**: um método implementado, um bug corrigido, uma tela nova. Uma regra prática: se você consegue descrever o commit numa frase curta sem usar "e", ele está do tamanho certo.

### 3.2 Desfazendo alterações

Errar faz parte. O comando certo depende de **onde** a alteração está:

| Situação | Comando |
|----------|---------|
| Editei um arquivo e quero descartar as alterações | `git restore arquivo` |
| Fiz `git add` sem querer e quero tirar da staging area (mantendo a alteração) | `git restore --staged arquivo` |
| Errei a mensagem do último commit (ainda não enviei para o GitHub) | `git commit --amend -m "Nova mensagem"` |
| Esqueci um arquivo no último commit (ainda não enviei) | `git add arquivo` e depois `git commit --amend --no-edit` |
| Um commit antigo introduziu um erro e quero desfazê-lo | `git revert <hash>` |

> **Cuidado:** `git restore arquivo` descarta as alterações que não foram commitadas. **Não há como recuperá-las.** Leia o comando duas vezes antes de apertar Enter.

**`git revert` x `git reset`**

- `git revert <hash>` cria um **novo commit** que faz o contrário do commit indicado. O histórico fica intacto, e por isso é a forma segura de desfazer algo que já foi compartilhado.
- `git reset` move a branch para um commit anterior, **apagando** os commits seguintes da branch. É útil para arrumar commits locais, mas perigoso em commits que já foram enviados:

```bash
git reset --soft HEAD~1    # desfaz o último commit, mantém as alterações na staging area
git reset HEAD~1           # desfaz o último commit, mantém as alterações nos arquivos
git reset --hard HEAD~1    # desfaz o último commit e DESCARTA as alterações (perigoso)
```

`HEAD~1` significa "um commit antes do HEAD"; `HEAD~3`, três commits antes.

> **Perdeu um commit?** O Git guarda por algumas semanas o registro de por onde o `HEAD` passou. `git reflog` mostra essa lista, e `git reset --hard <hash>` volta para qualquer ponto dela. É a rede de segurança para quando tudo parece perdido.

### 3.3 Guardando alterações temporariamente: git stash

Você está no meio de uma alteração e precisa trocar de assunto (corrigir um bug urgente, por exemplo), mas o trabalho ainda não está pronto para um commit. O `stash` guarda as alterações numa gaveta e deixa a pasta limpa:

```bash
git stash                  # guarda as alterações e limpa o diretório de trabalho
git stash list             # lista o que está guardado
git stash pop              # traz de volta a última alteração guardada
```

### 3.4 Navegando no histórico

```bash
git show a1b2c3d           # mostra um commit: autor, data, mensagem e alterações
git switch --detach a1b2c3d   # deixa os arquivos como estavam naquele commit
git switch main            # volta para o presente
```

Ao visitar um commit antigo, o Git avisa que você está em **detached HEAD** ("HEAD desanexado"): você está olhando o passado, fora de qualquer branch. Pode explorar e rodar o programa à vontade, mas volte para a `main` antes de fazer novos commits.

**Tags** dão um nome fixo a um commit importante, como uma versão publicada:

```bash
git tag v1.0               # marca o commit atual
git tag                    # lista as tags
git switch --detach v1.0   # visita a versão 1.0
```

### 3.5 Git no VS Code

O VS Code tem um painel de Git completo: o **Source Control** (**Ctrl+Shift+G**).

| Ação | No VS Code |
|------|-----------|
| `git status` | A lista de arquivos no painel. **U** = untracked, **M** = modified, **D** = deleted |
| `git diff` | Clique num arquivo da lista: o editor mostra o antes e o depois lado a lado |
| `git add arquivo` | O **+** ao lado do arquivo (ou **Stage Changes**) |
| `git restore --staged` | O **−** ao lado do arquivo na seção **Staged Changes** |
| `git restore arquivo` | A seta curva (**Discard Changes**) |
| `git commit -m` | Escreva a mensagem na caixa do topo e clique em **Commit** |
| Branch atual | Canto inferior esquerdo da janela; clique para trocar ou criar branches |

O editor também marca na margem esquerda as linhas adicionadas (verde), modificadas (azul) e removidas (vermelho) desde o último commit.

> Use o terminal enquanto aprende, para entender cada passo. Depois, use o que for mais confortável: muitos profissionais fazem os commits pelo VS Code e as operações menos comuns pelo terminal.

### 3.6 Git no Visual Studio

Se você escolheu o Visual Studio Community no Guia 1, ele também tem Git integrado:

- **Git → Create Git Repository** cria o repositório e, se quiser, já publica no GitHub.
- A janela **Git Changes** (**Ctrl+0, Ctrl+G**) mostra as alterações, a staging area e a caixa de mensagem de commit.
- **Git → View Branch History** mostra o histórico em forma de gráfico.
- O Visual Studio cria automaticamente um `.gitignore` adequado para projetos .NET.

### Exercícios da Parte 3

1. Altere um arquivo, descarte a alteração com `git restore` e confirme com `git status`.
2. Faça um commit com uma mensagem errada e corrija-a com `git commit --amend`.
3. Faça um commit que apaga uma linha importante. Desfaça-o com `git revert` e observe o novo commit no `git log --oneline`.
4. Comece uma alteração, guarde-a com `git stash`, faça outro commit e depois traga a alteração de volta com `git stash pop`.
5. Use `git switch --detach` para visitar o primeiro commit do repositório. Veja como os arquivos estavam e volte para a `main`.
6. Repita os exercícios 1 e 2 usando só o painel Source Control do VS Code.

---

## Parte 4: Branches e merge

### 4.1 O que é uma branch

Uma **branch** (ramo) é uma linha independente de desenvolvimento. Você cria uma branch para trabalhar numa funcionalidade sem mexer na versão principal; quando terminar, junta o resultado de volta.

```
                C ── D          ← branch "cadastro-clientes"
               /
  main:  A ── B ── E            ← main continua andando
```

Tecnicamente, uma branch é só um **ponteiro leve para um commit**. Criar uma branch é instantâneo e não copia arquivos. Por isso, no Git, branches são usadas o tempo todo, até para alterações pequenas.

A branch principal costuma se chamar `main` (em projetos mais antigos, `master`). Por convenção, a `main` deve sempre conter código que funciona.

### 4.2 Criando e trocando de branch

```bash
git branch                       # lista as branches; a atual tem um *
git switch -c cadastro-clientes  # cria uma branch nova e muda para ela
git switch main                  # volta para a main
git branch -d cadastro-clientes  # apaga uma branch que já foi integrada
```

Ao trocar de branch, o Git **altera os arquivos da pasta** para refletir aquela branch. Faça o teste: crie um arquivo na branch nova, faça o commit, volte para a `main` e veja o arquivo sumir. Volte para a branch e ele reaparece.

> Faça o commit (ou o `stash`) das suas alterações antes de trocar de branch. Se houver alterações que conflitam com a outra branch, o Git se recusa a trocar para não perder seu trabalho.

Nomes de branch costumam descrever o trabalho, às vezes com um prefixo: `feature/cadastro-clientes`, `fix/calculo-desconto`, `docs/readme`.

### 4.3 Juntando branches: git merge

Para trazer as alterações de uma branch para a `main`, vá **para a branch que vai receber** as alterações e rode o merge:

```bash
git switch main
git merge cadastro-clientes
```

Existem dois resultados possíveis:

**Fast-forward (avanço rápido):** se a `main` não recebeu nenhum commit desde que a branch foi criada, o Git só avança o ponteiro da `main`. Nenhum commit novo é criado.

```
Antes:   main: A ── B                      Depois:  A ── B ── C ── D
                     \                                        ↑
                      C ── D  (cadastro)               main, cadastro
```

**Merge commit (commit de mesclagem):** se as duas branches andaram, o Git cria um commit especial com dois "pais", que junta os dois históricos.

```
Antes:          C ── D  (cadastro)         Depois:         C ── D
               /                                          /      \
  main: A ── B ── E                         main: A ── B ── E ──── M
```

### 4.4 Resolvendo conflitos

Um **conflito** acontece quando as duas branches alteraram **as mesmas linhas** do mesmo arquivo. O Git não sabe qual versão manter, então para o merge e pede sua ajuda:

```
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

O arquivo fica marcado assim:

```
<<<<<<< HEAD
Projeto de estudos de Git, Guia 2.
=======
Projeto de estudos de Git e GitHub.
>>>>>>> cadastro-clientes
```

- Entre `<<<<<<< HEAD` e `=======`: a versão da branch atual (`main`).
- Entre `=======` e `>>>>>>>`: a versão da branch que está chegando.

Para resolver:

1. Abra o arquivo e decida o resultado final: uma das versões, as duas ou uma terceira escrita por você.
2. **Apague os marcadores** `<<<<<<<`, `=======` e `>>>>>>>`.
3. Marque como resolvido e conclua o merge:

```bash
git add README.md
git commit                 # o Git já sugere a mensagem "Merge branch ..."
```

O VS Code facilita: ele destaca os conflitos e mostra os botões **Accept Current Change**, **Accept Incoming Change** e **Accept Both Changes**, além de um editor de merge em três painéis.

> **Conflito não é erro**, é só o Git pedindo uma decisão que ele não pode tomar. Para evitar conflitos grandes: faça commits pequenos, integre as branches com frequência e combine com a equipe quem mexe em quê. Se quiser desistir no meio, `git merge --abort` volta tudo para antes do merge.

### 4.5 Rebase: uma introdução

O `rebase` é outra forma de integrar alterações: em vez de criar um merge commit, ele **reaplica** os commits da sua branch em cima da ponta da outra, como se você tivesse começado o trabalho a partir dali.

```
Antes:          C ── D  (cadastro)          Depois do rebase:
               /                                             C' ── D'  (cadastro)
  main: A ── B ── E                         main: A ── B ── E
```

```bash
git switch cadastro-clientes
git rebase main
```

O resultado é um histórico linear, mais fácil de ler. O custo é que os commits `C` e `D` são **recriados** com novos hashes (`C'` e `D'`).

> **A regra de ouro do rebase:** nunca faça rebase de commits que já foram enviados para um repositório compartilhado e que outras pessoas podem estar usando. Na dúvida, use `merge`.

### 4.6 Estratégias de branch

Equipes combinam um jeito de usar branches. O mais simples, e suficiente para a maioria dos projetos, é o **GitHub Flow**:

1. A `main` sempre funciona e pode ser publicada.
2. Para qualquer alteração, crie uma branch a partir da `main` com um nome descritivo.
3. Faça commits na branch e envie-a para o GitHub.
4. Abra um **pull request** (Parte 5) para a equipe revisar.
5. Depois de aprovado, faça o merge na `main` e apague a branch.

Projetos maiores às vezes usam modelos mais elaborados, como o **Git Flow** (com branches `develop`, `release` e `hotfix`). Você vai encontrá-lo em algumas empresas, mas comece pelo GitHub Flow.

### Exercícios da Parte 4

1. Crie a branch `anotacoes-branches`, adicione um arquivo `branches.md` com um resumo desta parte e faça o commit. Volte para a `main` e confirme que o arquivo não existe lá. Faça o merge e observe que foi um fast-forward.
2. Crie a branch `titulo-novo` e altere a primeira linha do `README.md`. Volte para a `main`, altere a **mesma linha** de outro jeito e faça o commit. Faça o merge e resolva o conflito.
3. Rode `git log --oneline --graph --all` e identifique o merge commit do exercício 2.
4. Repita o exercício 2, mas desista com `git merge --abort` e confira que tudo voltou ao normal.
5. Pratique no jogo interativo https://learngitbranching.js.org (tem versão em português): faça pelo menos os níveis da seção **Introdução**.

---

## Parte 5: Repositórios remotos e GitHub

### 5.1 O que é um repositório remoto

Um **remoto** é uma cópia do repositório em outro lugar, normalmente num servidor como o GitHub. Seu repositório local e o remoto são independentes: eles só trocam commits quando você manda.

```
   Seu computador                                GitHub
 ┌───────────────────┐       git push ──►      ┌───────────────────┐
 │ repositório local │                         │ repositório remoto│
 │ (main)            │       ◄── git pull      │ (origin/main)     │
 └───────────────────┘                         └───────────────────┘
```

Por convenção, o remoto principal se chama **origin**. A branch `main` do remoto aparece no seu computador como `origin/main`.

### 5.2 Autenticação no GitHub

O GitHub não aceita sua senha da conta no terminal. No Windows, o **Git Credential Manager**, que vem com o instalador do Git, resolve isso: no primeiro `push`, ele abre o navegador para você fazer login no GitHub e guarda a autorização com segurança. Não há mais nada a configurar.

Outras opções, que você vai encontrar em tutoriais:

- **Personal Access Token (PAT):** um "token" gerado em **Settings → Developer settings**, usado no lugar da senha.
- **Chave SSH:** um par de chaves criptográficas (`ssh-keygen -t ed25519`) cuja parte pública é cadastrada em **Settings → SSH and GPG keys**. Os endereços dos repositórios passam a ser do tipo `git@github.com:usuario/projeto.git`.

Para começar, fique com o Credential Manager e os endereços HTTPS.

### 5.3 Publicando um repositório local

1. No GitHub, clique em **New repository** (o **+** no canto superior direito).
2. Dê um nome (`estudos-git`), escolha **Public** ou **Private** e **não** marque as opções de criar README, `.gitignore` ou licença: o repositório precisa nascer vazio, porque o seu já tem commits.
3. O GitHub mostra os comandos. No seu repositório local:

```bash
git remote add origin https://github.com/SEU-USUARIO/estudos-git.git
git branch -M main         # garante que a branch se chama main
git push -u origin main
```

- `git remote add origin <url>` registra o endereço do remoto com o nome `origin`.
- `git push -u origin main` envia a branch `main`. O `-u` liga a sua `main` à `origin/main`; dali em diante, basta `git push`.

Atualize a página do GitHub: seus arquivos e todo o histórico de commits estão lá.

```bash
git remote -v              # mostra os remotos configurados
```

### 5.4 Clonando um repositório

Para baixar um repositório que já existe no GitHub (seu, em outro computador, ou de outra pessoa):

```bash
git clone https://github.com/SEU-USUARIO/estudos-git.git
cd estudos-git
```

O `clone` cria a pasta, baixa **todo o histórico** e já configura o `origin`. Não é preciso rodar `git init`.

### 5.5 Sincronizando: fetch, pull e push

| Comando | O que faz |
|---------|-----------|
| `git push` | Envia seus commits locais para o remoto |
| `git fetch` | Baixa os commits novos do remoto **sem** alterar seus arquivos (atualiza o `origin/main`) |
| `git pull` | `fetch` + `merge`: baixa e já integra na sua branch |

O fluxo de quem trabalha em equipe:

```bash
git pull                   # 1. começa o dia trazendo o trabalho dos colegas
# ... edita, add, commit ...
git pull                   # 2. antes de enviar, integra o que chegou enquanto você trabalhava
git push                   # 3. envia
```

Se alguém enviou commits que você ainda não tem, o `push` é recusado:

```
! [rejected]        main -> main (fetch first)
```

Não se assuste: rode `git pull`, resolva conflitos se houver, e rode `git push` de novo.

> **Nunca use `git push --force` na `main`** de um repositório compartilhado. Ele sobrescreve o histórico do remoto e pode apagar o trabalho dos colegas.

Para enviar uma branch nova pela primeira vez: `git push -u origin nome-da-branch`.

### 5.6 Pull requests e code review

Um **pull request** (PR) é um pedido para integrar uma branch em outra, feito no GitHub. É ali que acontece a **revisão de código** (*code review*): a equipe lê as alterações, comenta linha a linha, pede ajustes e aprova.

1. Envie sua branch: `git push -u origin cadastro-clientes`.
2. No GitHub, clique em **Compare & pull request**.
3. Escreva um título claro e uma descrição: o que mudou, por que mudou e como testar.
4. Os revisores comentam. Para atender aos pedidos, faça novos commits na mesma branch e dê `git push`: o PR se atualiza sozinho.
5. Depois de aprovado, clique em **Merge pull request** e apague a branch.
6. No seu computador, volte para a `main` e atualize: `git switch main` e `git pull`.

Mesmo estudando sozinho, abrir PRs para os seus próprios projetos é um bom treino: você revisa o próprio código com calma antes de integrá-lo.

### 5.7 Forks e contribuição em código aberto

Você não pode enviar commits direto para o repositório de outra pessoa. Para contribuir, faça um **fork**: uma cópia do repositório na **sua** conta.

1. No repositório original, clique em **Fork**.
2. Clone o **seu fork**, crie uma branch, faça os commits e envie para o seu fork.
3. Abra um pull request do seu fork para o repositório original.

Procure projetos com a etiqueta **good first issue** para começar. Contribuições em documentação e traduções também contam, e muito.

### 5.8 README e Markdown

O arquivo `README.md` na raiz é a **página de apresentação** do repositório: o GitHub o mostra logo abaixo da lista de arquivos. Ele é escrito em **Markdown**, a mesma linguagem destes guias:

````markdown
# Nome do projeto

Uma frase dizendo o que o projeto faz.

## Tecnologias

- C# e ASP.NET Core
- Angular
- SQL Server

## Como rodar

```bash
dotnet run
```

![Captura de tela](docs/tela.png)
````

Um bom README tem: o que é o projeto, uma imagem, as tecnologias usadas e o passo a passo para rodar. Ele é a primeira coisa que um recrutador vê no seu portfólio.

### 5.9 Boas práticas

- **Nunca faça commit de segredos.** Senhas, chaves de API e connection strings de produção ficam fora do repositório (`.gitignore`, User Secrets do .NET, variáveis de ambiente). Se um segredo foi enviado por engano, **considere-o vazado**: troque a senha ou gere uma chave nova. Apagar o arquivo num commit novo não basta, porque ele continua no histórico.
- **Commits pequenos e frequentes**, cada um com um assunto e uma boa mensagem.
- **A `main` sempre funciona.** Trabalhe em branches.
- **`git pull` antes de começar** e antes de enviar.
- **Revise o `git status` e o `git diff` antes de cada commit.**
- **Não versione arquivos gerados** nem dependências baixadas.

### Exercícios da Parte 5

1. Publique o repositório `estudos-git` no GitHub e confira o histórico de commits na página do repositório.
2. Clone o repositório em outra pasta (simulando outro computador). Faça um commit nessa cópia e envie. Volte para a pasta original e traga a alteração com `git pull`.
3. Repita o exercício 2, mas faça commits nas duas cópias alterando a mesma linha antes de sincronizar. Resolva o conflito que vai aparecer no `pull`.
4. Crie uma branch, envie-a para o GitHub, abra um pull request, revise o próprio código e faça o merge pelo site. Depois atualize a `main` local.
5. Escreva um README completo para o repositório do Jogo de Adivinhação e publique-o.
6. Faça um fork de um repositório público qualquer e abra-o no seu perfil (não precisa abrir PR).

---

## Parte 6: Git nos projetos da trilha

### 6.1 Projetos .NET

O .NET tem um modelo de `.gitignore` pronto, que ignora `bin/`, `obj/`, `.vs/` e outros arquivos gerados:

```bash
dotnet new gitignore
```

Lembre-se do que **não** vai para o Git: connection strings com senha (use **User Secrets**, visto no Guia 1: `dotnet user-secrets set "ConnectionStrings:Padrao" "..."`). O `appsettings.json` pode ir para o repositório, desde que só com valores sem segredos.

### 6.2 Projetos Angular

O `ng new` (Guia 3) já cria um repositório Git, um `.gitignore` adequado e o primeiro commit. Confira com `git log --oneline` logo depois de criar o projeto.

- **Vai para o Git:** `package.json` e `package-lock.json` (fixa as versões exatas das dependências).
- **Não vai:** `node_modules/` (recriada com `npm install`), `dist/` e `.angular/`.

> Se você criar um projeto Angular dentro de uma pasta que **já é** um repositório (por exemplo, `afinado/web` dentro de `afinado`), use `ng new web --skip-git` para não criar um repositório dentro do outro.

### 6.3 Scripts de banco de dados

Os scripts SQL que criam as tabelas (Guia 5) também são código e devem ser versionados, numerados na ordem em que devem ser executados:

```
banco/
├── 01-criar-tabelas.sql
├── 02-indices.sql
└── 03-dados-iniciais.sql
```

Assim, qualquer pessoa recria o banco do zero só com o repositório. As **migrations** do EF Core (Guia 1) seguem a mesma ideia: cada alteração no esquema vira um arquivo versionado.

### 6.4 Um repositório para o projeto completo

No desafio final, a aplicação tem três partes. Uma organização simples é um único repositório (chamado **monorepo**) com uma pasta para cada uma:

```
afinado/
├── .gitignore        ← ignora bin/, obj/, node_modules/, dist/, .angular/
├── README.md         ← como rodar as três partes
├── banco/            ← scripts SQL
├── api/              ← ASP.NET Core Web API
└── web/              ← Angular
```

Um fluxo de trabalho para o desafio:

```bash
git switch -c etapa-1-banco
# ... cria os scripts, add, commit (vários commits pequenos) ...
git switch main
git merge etapa-1-banco
git push
```

### 6.5 Publicando um site estático a partir do GitHub

Serviços como **Vercel**, **Netlify** e **GitHub Pages** se conectam ao seu repositório e publicam o site automaticamente a cada `git push` na `main`. O próprio site desta trilha funciona assim. É um bom jeito de colocar no ar os exercícios dos Guias 3 e 4 e o front-end do desafio final.

1. Envie o projeto para o GitHub.
2. Em https://vercel.com, entre com sua conta do GitHub, clique em **Add New → Project** e importe o repositório.
3. A cada `push`, uma nova versão é publicada. Pull requests ganham um endereço de pré-visualização.

### Exercícios da Parte 6

1. Crie um projeto `dotnet new console`, gere o `.gitignore` com `dotnet new gitignore`, faça o primeiro commit e confirme com `git status` que `bin/` e `obj/` não aparecem depois de um `dotnet build`.
2. A partir de agora, crie um repositório para os exercícios de cada guia da trilha e faça commits ao final de cada parte estudada.
3. Monte a estrutura de pastas do desafio final (`banco/`, `api/`, `web/`) com um README e um `.gitignore`, e publique no GitHub. Ela vai ficar pronta para quando você chegar lá.

---

## Glossário

| Termo | Significado |
|-------|-------------|
| Branch | Linha independente de desenvolvimento; um ponteiro para um commit |
| Clone | Cópia completa de um repositório remoto, com todo o histórico |
| Commit | Registro (foto) do projeto num momento, com autor, data e mensagem |
| Conflito | Situação em que duas alterações mexem nas mesmas linhas e o Git precisa de uma decisão |
| Diff | Diferença entre duas versões de um arquivo |
| Fork | Cópia de um repositório de outra pessoa na sua conta do GitHub |
| HEAD | Ponteiro para onde você está no histórico, normalmente o último commit da branch atual |
| Hash | Identificador único de um commit, como `a1b2c3d` |
| Merge | Junção do histórico de duas branches |
| Origin | Nome padrão do repositório remoto principal |
| Pull request | Pedido de integração de uma branch, com revisão de código, no GitHub |
| Rebase | Reaplicação de commits sobre outra base, gerando um histórico linear |
| Remoto | Cópia do repositório em outro lugar, como o GitHub |
| Repositório | Pasta cujo histórico é acompanhado pelo Git |
| Staging area | Área onde ficam as alterações preparadas para o próximo commit |
| Tag | Nome fixo dado a um commit, como uma versão (`v1.0`) |

## Para continuar estudando

- **Livro Pro Git (gratuito, em português):** https://git-scm.com/book/pt-br/v2
- **Learn Git Branching (jogo interativo):** https://learngitbranching.js.org
- **GitHub Skills (cursos práticos dentro do GitHub):** https://skills.github.com
- **Documentação do Git no VS Code:** https://code.visualstudio.com/docs/sourcecontrol/overview
- **Conventional Commits (em português):** https://www.conventionalcommits.org/pt-br
- **Oh Shit, Git!?! (como sair de enrascadas comuns):** https://ohshitgit.com

**Próximo passo:** [Guia 3: JavaScript, TypeScript e Angular](03-javascript-typescript-angular.md)
