# Sistema de Gerenciamento de Empréstimos - Sala de Leitura Prof. Antonio Martins da Silva

Um sistema web para gerenciar o empréstimo de livros na Sala de Leitura, permitindo que a profissional cadastre alunos, acompanhe devoluções e gere relatórios de forma simples e eficiente.

## 🚀 Tecnologias Utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias:

- **Frontend:**
  - `HTML5`
  - `CSS3` (Design Responsivo)
  - `JavaScript`

- **Backend:**
  - `TypeScript` (v5.x)
  - `Node.js` (v20.x ou superior)
  - `Express.js` (Para criar o servidor web)
  - `ExcelJS` (Para gerar os relatórios em formato `.xlsx`)

- **Ferramentas de Desenvolvimento:**
  - `Nodemon` (Para reiniciar o servidor automaticamente durante o desenvolvimento)
  - `ts-node` (Para executar o código TypeScript diretamente)

## ✨ Funcionalidades

O sistema oferece as seguintes funcionalidades:

- **Cadastro de Empréstimos:** A profissional pode inserir o nome do aluno, RA, ano e o livro emprestado.
- **Validação:** O sistema impede o cadastro de um aluno com um RA já existente.
- **Relatório Excel:** Gera um arquivo `.xlsx` com todos os empréstimos cadastrados.
- **Visualização da Lista:** Exibe a lista de empréstimos na tela, com a possibilidade de agrupar por ano.
- **Filtro e Busca:** É possível buscar por nome de aluno e filtrar a lista por ano escolar.
- **Gerenciamento de Devolução:** A profissional pode marcar um livro como devolvido, registrando a data da devolução.
- **Limpeza de Dados:** Um botão permite limpar todos os registros do sistema de uma única vez.
- **Persistência de Dados:** Todos os dados são salvos em um arquivo `.json`, garantindo que não sejam perdidos ao fechar o programa.

## 📁 Estrutura do Projeto

A estrutura de pastas foi organizada para separar as responsabilidades do frontend e do backend, facilitando o desenvolvimento e a manutenção.

programa-biblioteca/ <br>
├── src/ <br>
│   ├── interfaces/ <br>
│   │   └── Emprestimo.ts         # Interface de dados do empréstimo <br>
│   ├── services/ <br>
│   │   ├── EmprestimoService.ts   # Lógica principal de negócios <br>
│   │   └── ExcelService.ts        # Lógica para geração de Excel <br>
│   ├── app.ts                     # Configuração do servidor Express <br>
│   └── index.ts                   # Ponto de entrada da aplicação <br>
├── public/ <br>
│   ├── index.html                 # Página principal da interface <br>
│   ├── style.css                  # Estilos CSS da aplicação <br>
│   └── script.js                  # Lógica JavaScript do frontend <br>
├── data/ <br>
│   └── emprestimos.json           # Banco de dados em formato JSON <br>
├── package.json                   # Gerenciador de dependências e scripts <br>
└── tsconfig.json                  # Configurações do TypeScript <br>


## ⚙️ Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- Certifique-se de ter o **Node.js** e o **npm** instalados em sua máquina.

### Instalação

1.  Clone este repositório para sua máquina local:
    ```bash
    git clone [https://github.com/PeedroPrado/Sala_de_Leitura.git](https://github.com/PeedroPrado/Sala_de_Leitura.git)
    cd Sala_de_Leitura
    ```

2.  Instale todas as dependências do projeto:
    ```bash
    npm install
    ```

3.  Inicie o servidor de desenvolvimento:
    O script de desenvolvimento irá compilar o TypeScript e reiniciar o servidor automaticamente a cada alteração de código.
    ```bash
    npm run dev
    ```

### Acesso

Com o servidor rodando, abra seu navegador e acesse:

http://localhost:3000


## 👩‍🏫 Uso da Aplicação

- **Cadastrar:** Preencha o formulário e clique em "Cadastrar Empréstimo".
- **Buscar/Filtrar:** Use o campo de busca ou o dropdown de ano para filtrar a lista. Clique em "Buscar" para atualizar a visualização.
- **Gerar Relatório:** Clique em "Gerar Relatório Excel" para baixar um arquivo com todos os empréstimos.
- **Devolver Livro:** Na tabela, clique no botão "Devolver" ao lado de um empréstimo para registrar a devolução.
- **Limpar Dados:** Clique em "Limpar Lista" para apagar todos os registros do sist
