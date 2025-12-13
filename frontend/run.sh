docker rm -f frontend || true
docker run --name frontend -p 5173:5173 -d frontend