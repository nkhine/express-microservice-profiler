#!/bin/bash

cd `dirname $0`/..

rm -rf node_modules &&
npm install &&
gulp u &&
gulp cs
