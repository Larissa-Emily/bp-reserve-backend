# 📘 Sistema de Reservas de Salas de Reunião

## 🧩 Visão Geral do Projeto
Este projeto é uma aplicação web completa desenvolvida com **React.js** no front-end, **NestJS** no back-end e **PostgreSQL** como banco de dados relacional.  
Todo o ambiente é **containerizado via Docker**, garantindo isolamento, fácil manutenção e portabilidade entre ambientes de desenvolvimento e produção.

A aplicação foi idealizada para ser **modular, escalável e segura**, oferecendo uma base sólida para futuras expansões — seja com novas funcionalidades, módulos ou integrações externas.

---

## 🌐 Estrutura de Rotas

### 🖥️ Front-End (React + TailwindCSS)
O front-end utiliza **React Router** para controle de rotas e navegação, com **proteção baseada em autenticação JWT** e permissões de acesso por função (role).  
A interface foi desenvolvida com **TailwindCSS**, proporcionando um design moderno, responsivo e de fácil manutenção.

#### 📄 Principais rotas:
| Rota | Descrição |
|------|------------|
| `/login` | Página de autenticação com limite de **3 tentativas**; após isso, o usuário deve aguardar **10 minutos** para tentar novamente. |
| `/dashboard` | Painel principal com visão geral de **salas disponíveis** e **próximas reuniões**. |
| `/reserve` | Visualização, criação, edição e exclusão de reservas. Possui **filtro para “minhas reservas”**. |
| `/user` | Listagem e gerenciamento de usuários — **restrito a usuários com role `manager`**. |
| `/room` | Gerenciamento das salas, com **filtros por nome e características**. |
| `/profile` | Exibição e atualização de dados pessoais, além do **histórico de reservas**. |
| `/logout` | Encerra a sessão e redireciona o usuário ao login. |

Todas as rotas são **protegidas** por autenticação e verificação de permissões.

---

### ⚙️ Back-End (NestJS)
A API segue o padrão **modular do NestJS**, com separação em **módulos, controladores, serviços e entidades**, garantindo uma arquitetura limpa, testável e de fácil manutenção.

#### 🔗 Principais endpoints:
| Método | Endpoint | Descrição |
|---------|-----------|-----------|
| `POST` | `/auth` | Autenticação de usuários e geração de token JWT. |
| `GET` | `/user` | Retorna a lista de usuários cadastrados. |
| `GET` | `/user/:id` | Retorna detalhes de um usuário específico. |
| `POST` | `/room` | Cria novas salas. |
| `GET` | `/reservation` | Lista todas as reservas existentes. |
| `DELETE` | `/reservation/:id` | Remove uma reserva específica. |

O sistema conta com **middlewares de autenticação e guards de autorização**, garantindo acesso seguro e baseado em roles.

---

## 🔐 Autenticação e Autorização com JWT
A autenticação é realizada com **JSON Web Tokens (JWT)**, garantindo **segurança, escalabilidade e compatibilidade** com o front-end.

### 🔄 Fluxo de autenticação:
1. O usuário faz login com e-mail e senha.  
2. O servidor gera um **token JWT** contendo informações como `sub`, `name`, `email`, `role` etc.  
3. O front-end armazena o token (localStorage ou sessionStorage).  
4. Todas as requisições subsequentes incluem o token no cabeçalho:
   ```http
   Authorization: Bearer <token>
