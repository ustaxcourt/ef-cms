FROM cypress/base:16.17.1

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
  -V

RUN apt-get install -yq less=551-2 python python-dev python3-pip jq=1.6-2.1
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

RUN apt-get install -y zip curl wget

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.7.31.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf awscliv2.zip

RUN pip install --upgrade pip

RUN wget -q -O terraform.zip https://releases.hashicorp.com/terraform/1.3.3/terraform_1.3.3_linux_amd64.zip && \
  unzip -o terraform.zip terraform && \
  rm terraform.zip && \
  cp terraform /usr/local/bin/

RUN apt-get install -y graphicsmagick=1.4+really1.3.36+hg16481-2 ghostscript=9.53.3~dfsg-7+deb11u2

RUN wget https://packages.microsoft.com/repos/edge/pool/main/m/microsoft-edge-stable/microsoft-edge-stable_105.0.1343.33-1_amd64.deb
RUN apt-get -yq install ./microsoft-edge-stable_105.0.1343.33-1_amd64.deb

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install ./google-chrome-stable_current_amd64.deb

COPY . /home/app

RUN npm ci --legacy-peer-dep

CMD echo "🔥"
