docker rm -f backend || true
docker run --name backend -p 8080:8080 -d backend