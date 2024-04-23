# Estoque-Back

Este projeto é o back-end de uma aplicação de gerenciamento de estoque. Ele fornece uma API RESTful para:

- Adicionar novos produtos ao estoque
- Atualizar informações de produtos existentes
- Remover produtos do estoque
- Visualizar a lista de produtos disponíveis

## Requisitos

- Node.js (versão 14.15.1)

## Instalação

1. Clone este repositório:
    ```
    git clone https://github.com/lu-fragoso/Estoque-Back.git
    ```

2. Instale o Node.js e o Banco de dados MySQL se ainda não estiverem instalados.

3. Navegue até o diretório do projeto:
    ```
    cd Estoque-Back
    ```

4. Instale as dependências do projeto:
    ```
    npm install
    ```

5. Inicie a aplicação:
    ```
    npm start
    ```

Agora a API deve estar rodando em `localhost:3000`.

## Rotas da API

- `POST /register`: Adiciona um novo usuário
- `POST /login`: Realiza o login
- `GET /user`: Obtem todos os usuários
- `POST /registerproduct`: Adiciona um novo produto
- `GET /products/:id`: Obtem o produto cadastrado
- `PUT /products/:id/edit`: Atualiza informações do produto
- `DELETE /products/:id/delete`: Remove um produto
- `GET /products/:id/qtd`: Retorna a quantidade de produtos
- `PUT /products/:id/editquantidade`: Atualiza a quantidade de produtos
- `GET /products/:id/logs`: Retorna os logs do produto
- `GET /products`: Retorna os produtos  cadastrados
- `DELETE /produtos/:id`: Remove um produto



# Banco de Dados MySQL

## Configuração do MySQL Whorkbench 8.0
1. Realizar a importação do DUMP que está na pasta, Dump20240423.sql.
    O DUMP já possui schema em seu código, nesse DUMP já está os dados do usuário Admin.

2. Criar um usuário admin com privilégios para alterar o schema importado, de prefência esse esquema pode possuir o nome ESTOQUE. Mas pode ser alterado.

3. Alterar as informações do database.ts com as informações da conexão do MySQL, como:
- host
- user
- password 
- database 
    Essas informações são respectivamente o endereço utilizado para a conexão, o usuário que possui privéligios de alterar esse schema,a senha do usuário e o Schema que está o banco de dados. Um adendo a autênticação desse usuário, ele deve possuir autênticação Standard quando for configurado.

4. As credênciais do Admin para realizar o Login no App são: 
   - E-mail: admin@admin.br
   - Senha: 1234
