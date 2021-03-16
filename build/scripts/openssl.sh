# Check if Required Software is Avaiable
if ! command -v openssl &> /dev/null
then
    echo "openssl could not be found"
    exit
fi

openssl req -newkey rsa:4096 -x509 -sha256 -days 3650 -nodes -out client/docker/ssl/ssl.crt -keyout client/docker/ssl/ssl.key
./scripts/build.sh
