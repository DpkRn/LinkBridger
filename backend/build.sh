

BACKEND_IMAGE="clickly-server"
echo "Building backend docker image: $BACKEND_IMAGE"
sudo chmod +X Dockerfile
sudo docker rmi -f $BACKEND_IMAGE || true
sudo docker build -t $BACKEND_IMAGE .

echo "Backend Docker image built successfully! 🎉"

