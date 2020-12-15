# Check if Required Software is Avaiable
if ! command -v zip &> /dev/null
then
    echo "zip could not be found"
    exit
fi

if ! command -v docker &> /dev/null
then
    echo "docker could not be found"
    exit
fi

# Build
sudo docker build -o ./build/client/web -f client - < ./build/scripts/Dockerfile.client
sudo docker build -o ./build/server/server - < ./build/scripts/Dockerfile.server

# Zip
cp LICENSE build/
cd build
zip -r build.zip client data server docker-compose.yml LICENSE README.md
cd ..
