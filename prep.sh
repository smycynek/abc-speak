#! /bin/bash

rm -f abcspeak.zip
rm -rf dist
npm run build
cd dist/abc-speak/browser
zip -r ../../../abcspeak.zip .
cd ../../..
zip -r data.zip public/data
