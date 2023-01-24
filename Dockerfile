# Note: this is debian 11 (bullseye)

FROM cypress/browsers:node16.17.1-chrome106-ff105-edge

WORKDIR /home/app

RUN sh -c 'echo "deb [check-valid-until=no] http://ftp.debian.org/debian stretch-backports main" > /etc/apt/sources.list.d/stretch-backports.list'
RUN sed -i '/deb http:\/\/deb.debian.org\/debian stretch-backports main/d' /etc/apt/sources.list

RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y -t \
  stretch-backports \
  openjdk-11-jre-headless=11.0.16+8-1~deb11u1 \
  openjdk-11-jdk-headless=11.0.16+8-1~deb11u1 \
  openjdk-11-jre=11.0.16+8-1~deb11u1 \
  openjdk-11-jdk=11.0.16+8-1~deb11u1 \
  zip \
  curl \
  wget \
  git \
  less=551-2 \
  python \
  python-dev \
  python3-pip \
  jq=1.6-2.1 \
  graphicsmagick=1.4+really1.3.36+hg16481-2+deb11u1 \
  ghostscript=9.53.3~dfsg-7+deb11u2 \
  chromium \
  sudo \
  -V


# These are needed to prevent node canvas from failing during node-gyp build steps
RUN apt-get install -y build-essential 
RUN apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.8.9.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf awscliv2.zip

RUN pip install --upgrade pip

RUN wget -q -O terraform.zip https://releases.hashicorp.com/terraform/1.3.7/terraform_1.3.7_linux_amd64.zip && \
  unzip -o terraform.zip terraform && \
  rm terraform.zip && \
  cp terraform /usr/local/bin/

CMD echo "🔥"
