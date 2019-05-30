#!/usr/bin/env bash

set -e

echo "Prepping Ghostscript"

rm -rf bin
rm -rf lib

yum update -y
amazon-linux-extras install epel -y
yum install -y cpio yum-utils tar.x86_64 gzip

mkdir -p /tmp/build
pushd /tmp/build
yumdownloader -x \*i686 --archlist=x86_64 ghostscript groff
rpm2cpio ghostscript*.rpm | cpio -vimd
rpm2cpio groff*.rpm | cpio -vimd
popd

mkdir -p bin
mkdir -p lib

cp /tmp/build/usr/bin/ghostscript /tmp/build/usr/bin/gs bin/.
cp /tmp/build/usr/lib64/* /tmp/build/usr/lib64/ghostscript/*/* lib/.

tar -czf /opt/app/ghostscript_lambda_layer.tar.gz bin lib 
