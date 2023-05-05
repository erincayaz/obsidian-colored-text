#!/bin/bash

npm run build
cp -v main.js $1
cp -v styles.css $1
cp -v manifest.json $1