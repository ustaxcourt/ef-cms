FROM lambci/lambda:nodejs10.x

WORKDIR /var/tasks

COPY ./bin /opt/bin
COPY ./lib /opt/lib
COPY ./var /opt/var
COPY ./test.pdf /var/tasks

RUN clamscan -d /opt/var/lib/clamav test.pdf