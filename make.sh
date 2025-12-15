
REPO="git@github.com:DpkRn/LinkBridger.git"
BRANCH="release"

WORKDIR="/tmp/clickly_build"
DEPLOY_DIR="/var/www/clickly/app"
BACKEND_IMAGE="clickly-server"

# ---- START ----

echo "Removing old workdir..."
rm -rf "$WORKDIR"
mkdir -p "$WORKDIR"

cd "$WORKDIR"

echo "Cloning repo..."
git pull  origin "$BRANCH" 

# ---------------- FRONTEND ---------------- #

cd repo/frontend

echo "Installing dependencies..."
npm install 

echo "Building frontend..."
npm run build 

echo "Deploying new build..."
sudo rm -rf "$DEPLOY_DIR"
sudo mkdir -p "$DEPLOY_DIR"
sudo cp -r dist/* "$DEPLOY_DIR/"

echo "Setting permissions..."
sudo chmod -R 755 "$DEPLOY_DIR"

echo "Frontend Deployment completed! 🎉"

# ---------------- BACKEND ---------------- #

# THIS IS THE ONLY FIX:
# Build backend from the right folder
cd /tmp/clickly_build/repo/backend

echo "Building backend docker image: $BACKEND_IMAGE"
sudo chmod +X Dockerfile
sudo docker rmi -f $BACKEND_IMAGE || true
sudo docker build -t $BACKEND_IMAGE .


echo "Backend Docker image built successfully! 🎉"

echo "All done!"