#!/usr/bin/env sh

# abort on errors
set -e
currenet_branch=$(git rev-parse --abbrev-ref HEAD)

# build
npm run build

git checkout gh-pages
cp -r dist/* ..

echo "Pushing to gh-pages"
# git push -f https://github.com/rantav/cse6242DVA-project.git master:gh-pages
git push origin gh-pages

git checkout $currenet_branch

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

# git init
# git checkout -B master
# git add -A
# git commit -m 'deploy' | echo "Nothing to commit"

# echo "Pushing to gh-pages"
# git push -f https://github.com/rantav/cse6242DVA-project.git master:gh-pages

# cd -
