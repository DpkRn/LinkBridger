BRANCH="release"
echo "Cloning repo..."
git pull  origin "$BRANCH" 
cp ../.env backend/