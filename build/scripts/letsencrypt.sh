# Check if Required Software is Avaiable
if ! [ -x "$(command -v certbot)" ];
then
    echo "certbot could not be found"
    exit
fi

read -p 'Domain: ' Domain

sed -i -r 's/(listen .*443)/\1;#/g; s/(ssl_(certificate|certificate_key) )/#;#\1/g' client/docker/nginx.conf
sudo certbot certonly --manual -d $Domain
sed -i -r 's/#?;#//g' client/docker/nginx.conf
sudo cp /etc/letsencrypt/live/$Domain/privkey.pem client/docker/ssl/ssl.key
sudo cp /etc/letsencrypt/live/$Domain/fullchain.pem client/docker/ssl/ssl.crt
