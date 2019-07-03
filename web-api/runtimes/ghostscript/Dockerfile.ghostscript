FROM lambci/lambda:nodejs10.x

WORKDIR /var/tasks

COPY ./bin /opt/bin
COPY ./lib /opt/lib
COPY ./share /opt/share
COPY ./test.pdf .

ENV GS_LIB=/opt/share/ghostscript/9.06/Resource/Init
#ENV LD_LIBRARY_PATH=/opt/lib
#ENV PATH=$PATH:/opt/bin

RUN gs -q -dQUIET -dBATCH -dSAFER -dNOPAUSE -sDEVICE=ps2write -sOutputFile=/tmp/out.ps -f test.pdf

RUN gs -q -dQUIET -dBATCH -dSAFER -dNOPAUSE -dNOCACHE -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress -sColorConversionStrategy=/LeaveColorUnchanged -dAutoFilterColorImages=true -dAutoFilterGrayImages=true -dDownsampleMonoImages=true -dDownsampleGrayImages=true -dDownsampleColorImages=true -sOutputFile=/tmp/out.pdf -f /tmp/out.ps


