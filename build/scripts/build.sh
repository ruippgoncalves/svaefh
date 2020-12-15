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
docker build --o ./build/client/web . - < ./build/scripts/Dockerfile.client
docker build --o ./build/server/server . - < ./build/scripts/Dockerfile.server

# Zip
cp LICENSE build/
zip -r build/build.zip build/client build/data build/server build/docker-compose.yml build/LICENSE build/README.md
