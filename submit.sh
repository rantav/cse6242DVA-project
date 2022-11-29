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

DOC - a folder called DOC (short for “documentation”) containing:
team081report.pdf - Your report writeup in PDF format; can be created using any software, e.g., latex, Word.
team081poster.pdf - Your final poster.

tree submission

zip -r team081final.zip submission

echo
echo "Done creating submission. Created file team081final.zip"