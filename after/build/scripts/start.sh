# Check if Required Software is Avaiable
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose could not be found"
    exit
fi

sudo docker-compose up -d
