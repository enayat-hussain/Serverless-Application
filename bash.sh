#! /bin/bash



echo "Removing node_modules and layers directory"
rm -rf node_modules/
rm -rf layers/

echo "Installing npm packages in root directory"
npm install --only=prod

echo "Creating layers/generalLayer/nodejs"
mkdir -p layers/generalLayer/nodejs

echo "Copying node_modules to layers/generalLayer/nodejs"
cp -r node_modules/ layers/generalLayer/nodejs/

echo installing node modules in root directory for all dependencies
npm install
