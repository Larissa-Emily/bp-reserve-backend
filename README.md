# 🧱 Projeto Back-end — Sistema de Reservas

## 📖 Descrição
Este projeto é responsável pelo back-end de um sistema de reservas, desenvolvido em Node.js com NestJS.

Ele é responsável por gerenciar usuários, salas, reservas e o processo de autenticação (login com JWT).

Cada módulo da aplicação segue o padrão do NestJS, com uma clara separação de responsabilidades entre controllers, services e tests, garantindo organização, manutenção e escalabilidade.

## 📂 Estrutura de Pastas
src/

│

├── decorators/

│ ├── public.decorator.ts # Define quais rotas são públicas (sem necessidade de autenticação)

│ └── roles.decorator.ts # Define e manipula as roles (perfis de usuário) via metadata

│

├── guards/

│ ├── auth.guard.ts # Responsável por verificar o token JWT do usuário

│ └── roles.guard.ts # Garante que apenas usuários com certas roles possam acessar rotas específicas

│

├── login/ # Módulo responsável pelo fluxo de autenticação (login)

│ ├── auth.controller.ts

│ ├── auth.service.ts

│ ├── auth.controller.spec.ts

│ └── auth.service.spec.ts

│

├── reserve/ # Módulo responsável pelas reservas

│ ├── reserve.controller.ts

│ ├── reserve.service.ts

│ ├── reserve.controller.spec.ts

│ └── reserve.service.spec.ts

│

├── room/ # Módulo responsável pelas salas

│ ├── room.controller.ts

│ ├── room.service.ts

│ ├── room.controller.spec.ts

│ └── room.service.spec.ts

│

├── user/ # Módulo responsável pelos usuários

│ ├── user.controller.ts

│ ├── user.service.ts

│ ├── user.controller.spec.ts

│ └── user.service.spec.ts

│

├── app.module.ts # Módulo raiz do NestJS que integra todos os módulos

└── main.ts # Arquivo principal de inicialização da aplicação

## 💡 Nota:

Cada módulo possui seus respectivos arquivos de controller e service, acompanhados por testes unitários com Jest, garantindo confiabilidade no código.

## 🔐 Autenticação e Autorização (JWT)
A aplicação utiliza JSON Web Token (JWT) para autenticação.

Todas as rotas (exceto as definidas como públicas via @Public()) exigem que o usuário envie um token válido no cabeçalho da requisição:

Authorization: Bearer

O token é gerado após o login bem-sucedido (rota /auth).

O AuthGuard valida o token antes de permitir o acesso à rota.
O RolesGuard, em conjunto com o @Roles(), define o nível de acesso permitido (ex: admin, user).

## 🌐 Endpoints
Abaixo estão listados todos os endpoints principais organizados por módulo.

## 🔑 Login
Método	Endpoint	Descrição
POST	/auth	Autentica o usuário com e-mail e senha. Retorna um token JWT.


## 🧍‍♂️ User
Método	Endpoint	Descrição
POST	/user	Cria um novo usuário.
GET	/user	Retorna todos os usuários cadastrados.
GET	/user/:id	Retorna um usuário específico pelo ID.
PATCH	/user/:id	Atualiza informações de um usuário.
DELETE	/user/:id	Remove um usuário.


## 🏢 Room
Método	Endpoint	Descrição
POST	/room	Cria uma nova sala.
GET	/room	Retorna todas as salas cadastradas.
GET	/room/:id	Retorna uma sala específica pelo ID.
PATCH	/room/:id	Atualiza informações de uma sala.
DELETE	/room/:id	Remove uma sala.



## 📅 Reserve
Método	Endpoint	Descrição
POST	/reservation	Cria uma nova reserva.
GET	/reservation	Retorna todas as reservas.
GET	/reservation/:id	Retorna uma reserva específica pelo ID.
PATCH	/reservation/:id	Atualiza uma reserva existente.
DELETE	/reservation/:id	Remove uma reserva.



## 🧪 Testes
Cada módulo (Login, Reserve, Room e User) possui seus respectivos testes unitários em Jest, cobrindo as camadas de Controller e Service:

Verificação de rotas e retorno no controller;
Testes de regras de negócio nos services;
Mock de dependências e simulação de chamadas reais.
Para rodar os testes:

npm run test

⚙️ Tecnologias Utilizadas
Node.js
NestJS
TypeScript
Jest (para testes)
JWT (para autenticação)
Decorators do TypeScript (para controle de roles e permissões)

🚀 Inicialização do Projeto

# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run start:dev

# Rodar em modo produção
npm run start:prod
A aplicação iniciará em:

http://localhost:3000

## Acesso
Email: henrique@gmai.com
Senha: Bem75!#P
