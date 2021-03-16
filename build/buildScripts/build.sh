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

# Delete Previous build files
if test -d "build/client/web"; then
    rm -R build/client/web
fi

if test -f "build/server/server"; then
    rm build/server/server
fi

if test -d "build/client/docker/"; then
    rm -R build/client/docker
fi

if test -f "build/LICENSE"; then
    rm build/LICENSE
fi

if test -f "build/build.zip"; then
    rm build/build.zip
fi

# Build
mkdir build/client/web
DOCKER_BUILDKIT=1 docker build -o ./build/client/web -f ./build/buildScripts/Dockerfile.client ./client
DOCKER_BUILDKIT=1 docker build -o ./build/server -f ./build/buildScripts/Dockerfile.server ./server

cp -r ./build/clnDocker ./build/client
mv ./build/client/clnDocker ./build/client/docker
mkdir ./build/client/web/static
mv ./build/client/docker/email ./build/client/web/static

# Zip
cp LICENSE build/
cd build
touch client/docker/letsencrypt/acme_challenge_goes_here
zip -r build.zip * -x **/.gitkeep **/.gitignore ./buildScripts/\* ./clnDocker/\*
cd ..
