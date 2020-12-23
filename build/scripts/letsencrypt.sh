# Check if Required Software is Avaiable
if ! command -v certbot &> /dev/null
then
    echo "certbot could not be found"
    exit
fi

sed -i -r 's/(listen .*443)/\1;#/g; s/(ssl_(certificate|certificate_key) )/#;#\1/g' client/docker/nginx.conf
sudo certbot certonly --webroot -d example.com --email info@example.com -w client/docker/ssl -n --agree-tos --force-renewal
sed -i -r 's/#?;#//g' client/docker/nginx.conf
./scripts/build.sh
