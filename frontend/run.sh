docker rm -f frontend || true
docker run --name frontend -p 8080:8080 -d frontend