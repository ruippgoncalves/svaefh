# Check if Required Software is Avaiable
if ! [ -x "$(command -v docker-compose)" ];
then
    echo "docker-compose could not be found"
    exit
fi

sudo docker-compose up -d
