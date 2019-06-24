FROM amazonlinux:2

WORKDIR /home/build

RUN set -e

RUN echo "Prepping Ghostscript"

RUN rm -rf bin
RUN rm -rf lib

RUN yum update -y
RUN amazon-linux-extras install epel -y
RUN yum install -y cpio yum-utils tar.x86_64 gzip

RUN yumdownloader -x \*i686 --archlist=x86_64 ghostscript
RUN rpm2cpio ghostscript*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 groff
RUN rpm2cpio groff*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 lcms2
RUN rpm2cpio lcms2*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 jasper-libs
RUN rpm2cpio jasper-libs*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 libtiff
RUN rpm2cpio libtiff*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 libjpeg
RUN rpm2cpio libjpeg*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 cups-libs
RUN rpm2cpio cups-libs*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 libpng
RUN rpm2cpio libpng*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 fontconfig
RUN rpm2cpio fontconfig*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 freetype
RUN rpm2cpio freetype*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 jbigkit-libs
RUN rpm2cpio jbigkit-libs*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 avahi-libs
RUN rpm2cpio avahi-libs*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 dbus-libs
RUN rpm2cpio dbus-libs*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 systemd-libs
RUN rpm2cpio systemd-libs*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 lz4
RUN rpm2cpio lz4*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 elfutils-libs
RUN rpm2cpio elfutils-libs*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 expat
RUN rpm2cpio expat*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 xz-libs
RUN rpm2cpio xz-libs*.rpm | cpio -vimd

RUN mkdir -p bin
RUN mkdir -p lib
RUN mkdir -p share

RUN cp usr/bin/ghostscript usr/bin/gs bin/.
RUN ls /lib64 |grep crypt
RUN cp /lib64/libcrypt-2.26.so lib/.
RUN cp /lib64/libcrypt.so.1 lib/.
RUN cp /lib64/libgcrypt.so.11 lib/.
RUN cp /lib64/libgcrypt.so.11.8.2 lib/.
RUN cp /usr/lib64/libgpg-error.so.0 lib/.
RUN cp /usr/lib64/libgpg-error.so.0.10.0 lib/.
RUN cp /usr/lib64/libelf-0.170.so lib/.
RUN cp /usr/lib64/libelf.so.1 lib/.
RUN cp /usr/lib64/libbz2.so.1 lib/.
RUN cp /usr/lib64/libbz2.so.1.0.6 lib/.

RUN cp -r usr/lib64/* lib/.
RUN cp -r usr/share/* share/.

RUN tar -czf ghostscript_lambda_layer.tar.gz bin lib share

