FROM ubuntu

WORKDIR /home/clamav

RUN echo "Prepping ClamAV"

RUN apt update -y
RUN apt install curl -y
RUN apt install sudo -y
RUN apt install procps -y

RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN apt install -y nodejs
RUN npm init -y

RUN npm i aws-sdk tmp --save
RUN DEBIAN_FRONTEND=noninteractive sh -c 'apt install -y awscli'

RUN apt install -y clamav clamav-daemon

RUN mkdir /var/run/clamav && \
    chown clamav:clamav /var/run/clamav && \
    chmod 750 /var/run/clamav

RUN freshclam

COPY ./clamd.conf /etc/clamav/clamd.conf
COPY ./worker.js .
ADD ./run.sh ./run.sh

CMD ["bash", "./run.sh"]
