#!/bin/bash
cd ${0%/*}

dest=../skt/assets/webdb

if [ ! -e "$dest" ]; then
  git clone https://github.com/jht1493/webdb.git $dest
fi
cd $dest
git pull
