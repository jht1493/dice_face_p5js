#!/bin/bash
cd ${0%/*}

dest=../skt/
cd $dest

rm -rf node_modules/
npm install