#!/bin/bash
cd ${0%/*}

# Publish html app to jht1493.net

excludes="--exclude .DS_Store --exclude .git --exclude node_modules"
delete=--delete
test=
# test=--dry-run
verbose=
verbose=v

start_time=`date +%s`

host=bitnami@34.236.53.81
siteroot=/home/bitnami/htdocs
homepage=a0/skt
homepage=a1/skt
rpath="${siteroot}/${homepage}"
rdest=$host:${rpath}

ssh $host mkdir -p $rpath

# Remove server uploads directory, establish symbolic link later
# ssh $host rm -rf $rpath/uploads

# source=../p5-projects
source=../skt
# echo $verbose $delete $test
echo -razO$verbose $excludes $delete $test
echo "rsync from $source"
echo "        to $rdest"
rsync -razO$verbose $excludes $delete $test "$source/" "$rdest/"

scp "$source/../index.html" "$rdest/../../index.html"


echo
echo Lapse $(expr `date +%s` - $start_time) 
echo "open https://jht1493.net/${homepage}"


