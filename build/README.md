Ao utilizar esta aplicação está a concordar com os termos de Licença em LICENSE

Instruções:

<ol>
    <li>Colocar os Ficheiros ssl.crt/ssl.key em client/docker/ssl</li>
    <li>Executar o Comando: sudo docker-compose up -d</li>
</ol>

Para Fins de Teste (Self-Signed Certificate):

    openssl req -newkey rsa:4096 -x509 -sha256 -days 3650 -nodes -out client/docker/ssl/ssl.crt -keyout client/docker/ssl/ssl.key

CertBot (Let's Encrypt)

    # Edite client/docker/nginx.conf
    certbot certonly --manual -d mydomain.com
    # https://letsencrypt.org/docs/challenge-types/#http-01-challenge
    # Colocar o token (acme-challenge) em client/docker/letsencrypt e executar sudo docker-compose up
    # Apos a criação do certificado, precione ctrl + c para fechar o docker
    cp /etc/letsencrypt/live/domain/privkey.pem client/docker/ssl/ssl.key
    cp /etc/letsencrypt/live/domain/fullchain.pem client/docker/ssl/ssl.crt
    # No passo 5 utilizar adicionalmente a flag --build, Ex: sudo docker-compose up -d --build
