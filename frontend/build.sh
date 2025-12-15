sudo chmod +X Dockerfile
docker rmi -f frontend || true
docker build -t frontend .
echo "frontend Docker image built successfully! 🎉"

