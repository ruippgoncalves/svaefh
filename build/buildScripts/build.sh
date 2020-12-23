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
sudo docker build -o ./build/client/web -f ./build/buildScripts/Dockerfile.client ./client
sudo docker build -o ./build/server -f ./build/buildScripts/Dockerfile.server ./server

cp -r ./client/docker ./build/client
rm -R ./build/client/docker/email

# Zip
cp LICENSE build/
cd build
zip -r build.zip *.* **/* -x **/.gitkeep -x **/.gitignore -x ./buildScripts/* -x build.zip
cd ..

echo "If Build is Incomplete:"
echo "  BuildKit needs to be enabled: https://docs.docker.com/develop/develop-images/build_enhancements/"
