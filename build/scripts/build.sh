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
mkdir build/client/web
sudo docker build -o ./build/client/web -f ./build/scripts/Dockerfile.client ./client
sudo docker build -o ./build/server -f ./build/scripts/Dockerfile.server ./server

cp ./client/docker ./build/client
rm -R ./build/client/docker/email

# Zip
cp LICENSE build/
cd build
zip -r build.zip client data server docker-compose.yml LICENSE README.md
cd ..

echo "If Build is Incomplete:"
echo "  BuildKit needs to be enabled: https://docs.docker.com/develop/develop-images/build_enhancements/"
