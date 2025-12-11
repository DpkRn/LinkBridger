
DEPLOY_DIR="/var/www/clickly/app"


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