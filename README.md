# Projeto de Cadastro e Login de Usuários

Este é um projeto simples que implementa um fluxo completo de autenticação de usuários, consistindo em um front-end em HTML, CSS e JavaScript puro, e um back-end em Node.js com Express.

## Descrição

A aplicação permite que um usuário:
- Insira um e-mail na página inicial.
- Seja direcionado para a página de **cadastro**, se o e-mail for novo.
- Seja direcionado para a página de **login**, se o e-mail já existir.
- Efetue o login para acessar uma página de **perfil** privada.
- Veja seus dados na página de perfil.
- Faça logout do sistema.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

### 1. Front-end (Pasta Raiz)

-   **`index.html`**: Página inicial onde o usuário insere o e-mail.
-   **`cadastro.html`**: Formulário para cadastro de novos usuários.
-   **`login.html`**: Formulário para login de usuários existentes.
-   **`perfil.html`**: Página que exibe os dados do usuário autenticado.
-   **`/css/style.css`**: Folha de estilos principal.
-   **`/js/`**: Contém a lógica do front-end.
    -   `api.js`: Centraliza a comunicação com o back-end.
    -   `main.js`, `cadastro.js`, `login.js`, `perfil.js`: Lógica específica de cada página.

### 2. Back-end (`/aulas-ada-master`)

-   Um servidor API construído com **Node.js** e **Express**.
-   **`index.js`**: Ponto de entrada que inicia o servidor.
-   **`/src`**: Contém a lógica da aplicação.
    -   `controllers/userController.js`: Define as rotas da API (ex: `/login`, `/users`).
    -   `app/userService.js`: Contém a lógica de negócio (criar usuário, validar senha, etc.).
    -   `middleware/auth.js`: Middleware de autenticação que valida tokens JWT.
-   **`/data`**: Onde os dados dos usuários são armazenados em um arquivo `users.json`.

## Como Executar

### Back-end

1.  **Pré-requisito**: Ter o [Node.js](https://nodejs.org/) instalado.
2.  Abra um terminal e navegue até a pasta do back-end:
    ```sh
    cd c:\Users\USUARIO\Desktop\Front-end\Ada\Modulo2\aulas-ada-master
    ```
3.  Instale as dependências (apenas na primeira vez):
    ```sh
    npm install
    ```
4.  Inicie o servidor:
    ```sh
    npm start
    ```
5.  O terminal deve exibir `Servidor rodando na porta 3000`. Mantenha este terminal aberto.

### Front-end

1.  Com o back-end rodando, abra o arquivo `index.html` em qualquer navegador web.

## Diagrama de Sequência UML (Simplificado)

O diagrama abaixo ilustra o fluxo de um novo usuário se cadastrando e fazendo login.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend

    User->>Frontend: Acessa index.html e insere e-mail
    Frontend->>Backend: GET /api/users/validate-email?email=...
    Backend-->>Frontend: Responde que e-mail não existe (204)
    Frontend->>User: Redireciona para cadastro.html

    User->>Frontend: Preenche formulário de cadastro e envia
    Frontend->>Backend: POST /api/users (com dados do usuário)
    Backend-->>Frontend: Responde que usuário foi criado (201)
    Frontend->>User: Alerta de sucesso e redireciona para login.html

    User->>Frontend: Insere a senha e envia
    Frontend->>Backend: POST /api/login (com email e senha)
    Backend-->>Frontend: Responde com um token JWT
    Frontend->>Frontend: Salva o token no localStorage
    Frontend->>User: Redireciona para perfil.html

    User->>Frontend: Acessa perfil.html
    Frontend->>Backend: GET /api/users (com token no cabeçalho)
    Backend-->>Frontend: Responde com os dados do usuário
    Frontend->>User: Exibe os dados do perfil
```
