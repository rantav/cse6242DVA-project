#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist


# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

# git init
git checkout -B master
git add -A
git commit -m 'deploy' | echo "Nothing to commit"

echo "Pushing to gh-pages"
git push -f https://github.com/rantav/cse6242DVA-project.git master:gh-pages

cd -
