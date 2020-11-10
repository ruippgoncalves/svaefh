<div align="center">
    <img alt="AEFH Logo" src="client/assets/LogoAEFH_Original.png" width="250" style="border-radius: 15px">
</div>
<br />

# Sistema de Votação AEFH

[**O que é o Sistema de Votação AEFH**](#O-que-é-o-Sistema-de-Votação-AEFH)
| [**Origem**](#Origem)
| [**Objetivos**](#Objetivos)
| [**Funcionalidades**](#Funcionalidades)
| [**Como Utilizar**](#Como-Utilizar)
| [**Tecnologias Utilizadas**](#Tecnologias-Utilizadas)

## O que é o Sistema de Votação AEFH

O Sistema de Votação AEFH é uma plataforma de votação online, desenvolvida pelo Rui Gonçalves no ano létivo de 2020/2021 para a Escola Secundária Francisco de Holanda.

## Origem

Esta plataforma surgiu como proposta feita pelos Professores Orientadores do meu Projeto de Aptidão Profissional.

## Objetivos

O projeto apresenta os principais objetivos:

- Disponibilizar à escola uma ferramenta facilitadora de eleições
- Promover uma participação mais ativa de toda a comunidade escolar num processo de votação
- Facultar à escola uma análise dos resultados mais rápida e fidedigna

## Funcionalidades

As principais funcionalidades:

- Integração com o Email Institucional
- Diferentes Métodos de Votação:
  - Escolha Múltipla (Plurality Voting)
  - Escolha Classificada (Instant-Runoff Voting)
- Utilização na Comunidade Escolar (Alunos e Professores) com Prevenção de Multiplos Votos e Utilização External sem Prevenção de Multiplos Votos
- Restrição de Eleitores (Interno)
- QRCode para a Eleição
- Dados em Tempo Real
- Aplicações Web, Android e IOS

## Como Utilizar

São Necessários:

- Docker e Docker Compose
- Chaves da Google OAuth2 API
- Dominios dos Emails de Professores e Alunos Distintos (ou sub-dominios Ex: email@alunos.aefh.pt; email@aefh.pt)

Intruções:

<ol>
    <li>Copiar server/config/config.example.env para server/config/config.env e proceder à sua edição</li>
    <li>Editar em client/app.json a chave expo.extra.API para https://website/api/v1 (linha 43)</li>
    <li>Editar as Linhas 3 e 11 em client/docker/nginx.example.conf e Renomea-lo para nginx.conf</li>
    <li>Colocar os Ficheiros ssl.crt/ssl.key em client/docker</li>
    <li>Executar o Comando: docker-compose up</li>
</ol>

Para Fins de Teste (Self-Signed Certificate):

    openssl req -newkey rsa:4096 -x509 -sha256 -days 3650 -nodes -out client/docker/ssl.crt -keyout client/docker/ssl.key

CertBot (Let's Encrypt)

    certbot certonly --manual -d mydomain.com
    mv privkey.pem client/docker/ssl.key
    mv mv fullchain.pem client/docker/ssl.crt
    rm *.pem

Em Adição, para Android e IOS, São Necessários:

- Node.JS (v14 LTS)
- Expo CLI + Conta Expo (com sessão iniciada, comando: expo login)

Mais Informações de como Criar as Aplicações em https://docs.expo.io/workflow/publishing/

## Tecnologias Utilizadas

As principais tecnologias:

FrontEnd:
- Expo (React Native)

BackEnd:
- Express.JS
- Passport.JS
- Json Web Token
- Mongoose

Adicionalmente:
- MongoDB
- Docker
