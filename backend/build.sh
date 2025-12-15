sudo chmod +X Dockerfile
docker rmi -f backend || true
docker build -t backend .
echo "Backend Docker image built successfully! 🎉"

