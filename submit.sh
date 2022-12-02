rm -rf submission
rm -f team081final.zip

mkdir submission
mkdir submission/CODE
mkdir submission/CODE/ui

cp ui/index.html submission/CODE/ui
cp ui/package*.json submission/CODE/ui
cp ui/vite.config.js submission/CODE/ui
cp -r ui/src submission/CODE/ui

cp *.py submission/CODE/
cp requirements.txt submission/CODE/
cp Makefile submission/CODE/
cp Procfile submission/CODE/
cp .env submission/CODE/

cp README.txt submission/

mkdir submission/DOC

cp doc/final/team081report.pdf submission/DOC/
cp doc/final/team081poster.pdf submission/DOC/

cd submission
tree .

zip -r ../team081final.zip .

echo
echo "Done creating submission. Created file team081final.zip"