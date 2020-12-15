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
sudo docker build -it --output type=local,dest=./build/client/web -f ./build/scripts/Dockerfile.client ./client
sudo docker build -it --output type=local,dest=./build/server/server -f ./build/scripts/Dockerfile.server ./server

# Zip
cp LICENSE build/
cd build
zip -r build.zip client data server docker-compose.yml LICENSE README.md
cd ..
