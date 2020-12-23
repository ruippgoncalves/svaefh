# Check if Required Software is Avaiable
if ! command -v certbot &> /dev/null
then
    echo "certbot could not be found"
    exit
fi

sed -i -r 's/(listen .*443)/\1;#/g; s/(ssl_(certificate|certificate_key) )/#;#\1/g' client/docker/nginx.conf
sudo certbot run -w client/docker/ssl
sed -i -r 's/#?;#//g' client/docker/nginx.conf
cp client/docker/ssl/privkey.pem client/docker/ssl/ssl.key
cp client/docker/ssl/fullchain.pem client/docker/ssl/ssl.crt
./scripts/build.sh
