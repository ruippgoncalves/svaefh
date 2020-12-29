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
    sudo rm -R build/client/web
fi

if test -f "build/server/server"; then
    sudo rm build/server/server
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
sudo docker build -o ./build/client/web -f ./build/buildScripts/Dockerfile.client ./client
sudo docker build -o ./build/server -f ./build/buildScripts/Dockerfile.server ./server

cp -r ./client/docker ./build/client
rm -R ./build/client/docker/email

# Zip
cp LICENSE build/
cd build
touch client/docker/letsencrypt/acme_challenge_goes_here
zip -r build.zip * -x **/.gitkeep **/.gitignore ./buildScripts/\*
cd ..

echo "If Build is Incomplete:"
echo "  BuildKit needs to be enabled: https://docs.docker.com/develop/develop-images/build_enhancements/"
