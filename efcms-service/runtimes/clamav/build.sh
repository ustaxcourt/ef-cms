#!/usr/bin/env bash

set -e

echo "Prepping ClamAV"

rm -rf bin
rm -rf lib

yum update -y
amazon-linux-extras install epel -y
yum install -y cpio yum-utils tar.x86_64 gzip

# extract binaries for clamav, json-c, pcre
mkdir -p /tmp/build
pushd /tmp/build
yumdownloader -x \*i686 --archlist=x86_64 clamav clamav-lib clamav-update json-c pcre2 libxml2
rpm2cpio clamav-0*.rpm | cpio -vimd
rpm2cpio clamav-lib*.rpm | cpio -vimd
rpm2cpio clamav-update*.rpm | cpio -vimd
rpm2cpio json-c*.rpm | cpio -vimd
rpm2cpio pcre*.rpm | cpio -vimd
rpm2cpio libxml2.rpm | cpio -vimd
popd

mkdir -p bin
mkdir -p lib

# ln -s /tmp/build/usr/bin/freshclam /usr/bin/freshclam
# ln -s /tmp/build/lib64/clamav* /usr/lib/

cp /tmp/build/usr/bin/clamscan /tmp/build/usr/bin/freshclam bin/.
cp /tmp/build/usr/lib64/* lib/.
cp freshclam.conf bin/freshclam.conf

tar -czf /opt/app/clamav_lambda_layer.tar.gz bin lib
