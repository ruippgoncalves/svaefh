Ao utilizar esta aplicação está a concordar com os termos de Licença em LICENSE

Instruções:

<ol>
    <li>Colocar os Ficheiros ssl.crt/ssl.key em client/docker/ssl ou guias a baixo</li>
    <li>Iniciar o Servidor Execute o Comando: ./scripts/start.sh</li>
    <li>Para Parar o Servidor Execute o Comando: ./scripts/stop.sh</li>
</ol>

Para Fins de Teste (Self-Signed Certificate):

    ./scripts/openssl.sh

CertBot (Let's Encrypt)

    ./scripts/letsencrypt.sh
    # Quando pedir o ACME Challenge, vá a um novo terminal (não necessário se estiver a renovar)
    ./scripts/build.sh
    ./scripts/start.sh
    # Termine o processo iniciado no passo 1
    # Passo seguinte não necessário na renovação de certificado
    ./scripts/stop.sh
    ./scripts/build.sh
