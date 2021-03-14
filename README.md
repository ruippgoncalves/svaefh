<div align="center">
    <img alt="AEFH Logo" src="client/assets/icon.svg" width="250" style="border-radius: 15px">
</div>
<br />

# Sistema de Votação AEFH

[**O que é o Sistema de Votação AEFH**](#o-que-é-o-sistema-de-votação-aefh)
| [**Origem**](#origem)
| [**Objetivos**](#objetivos)
| [**Funcionalidades**](#funcionalidades)
| [**Como Utilizar**](#como-utilizar)
| [**Tecnologias Utilizadas**](#tecnologias-utilizadas)

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
  - Método Condorcet
- Utilização na Comunidade Escolar (Alunos e Professores) com Prevenção de Multiplos Votos e Utilização Externa sem Prevenção de Multiplos Votos
- Restrição de Eleitores (Interno)
- QRCode para a Eleição
- Dados em Tempo Real
- Aplicações Web, Android e IOS

## Como Utilizar

São Necessários:

- Docker e Docker Compose [(Opcionalmente Docker Registry e Docker Swarm Mode)](https://docs.docker.com/engine/swarm/stack-deploy/)
- Chaves da Google OAuth2 API (Web)
- Email No-Reply (SMTP e Less Secure Apps ativas para essa conta de email)
- Dominios dos Emails de Professores e Alunos Distintos (ou sub-dominios Ex: email@alunos.aefh.pt; email@aefh.pt)

Intruções:

<ol>
    <li>Copiar server/config/config.example.env para server/config/config.env e proceder à sua edição</li>
    <li>Editar client/index.html (copie de client/template) e adicione a sua chave OAuth da Google (linha 20)</li>
    <li>Copie e edite o ficheiro client/lib/config.dart (client/template/config.dart)</li>
    <li>Execute num terminal linux sudo ./build/buildScripts/build.sh</li>
    <li>Envie o ficheiro build/build.zip para produção</li>
</ol>

Em Adição, para Android e IOS, São Necessários:

- Android Studio (testado com 4.1.2)
- macOS + XCode (testado com macOS 11.x.x xxx e XCode x.x.x)

Instruções:

- Configure o client/android/key.properties (https://flutter.dev/docs/deployment/android)
- Ligue o firebase ao projeto no google cloud platform, adicione o a plataforma android (Comece adicionando o Firebase ao seu aplicativo) e coloque o google-services.json em client/android/app/ no servidor preencha o GOOGLE_CLIENT_ID_MOBILE com o Web client (auto created by Google Services) (obter da google cloud api)
- Execute no terminal:

    cd client
    mkdir build
    mkdir build/symbols
    flutter build apk --obfuscate --split-debug-info build/symbols --no-sound-null-safety

## Tecnologias Utilizadas

As principais tecnologias:

FrontEnd:
- Flutter

BackEnd:
- Express.JS
- Mongoose
- Webpack

Adicionalmente:
- MongoDB
- Docker
- Mosaico
- NginX
- DigitalOcean NGINXConfig Tool
