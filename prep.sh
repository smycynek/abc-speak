#! /bin/bash

rm abcspeak.zip
rm -rf abcspeak
npm run build
zip -r abcspeak.zip abcspeak
cd src/public
zip -r data.zip data
mv data.zip ../../
cd ../..