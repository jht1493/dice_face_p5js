#!/bin/bash
cd ${0%/*}

dest=../nod
if [ ! -e "$dest/node_modules" ]; then
  pushd $dest > /dev/null
  npm install
  popd > /dev/null
fi

node ../nod/build.js
