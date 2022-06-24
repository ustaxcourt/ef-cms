FROM cypress/base:14.19.0

WORKDIR /home/app

RUN sh -c 'echo "deb [check-valid-until=no] http://ftp.debian.org/debian stretch-backports main" > /etc/apt/sources.list.d/stretch-backports.list'
RUN sed -i '/deb http:\/\/deb.debian.org\/debian stretch-backports main/d' /etc/apt/sources.list

RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y -t stretch-backports openjdk-11-jdk=11.0.6+10-1~bpo9+1 -V
RUN apt-get install -yq less=487-0.1+b1 python python-dev python-pip jq=1.5+dfsg-2+b1
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

RUN apt-get install -y zip

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.6.1.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf awscliv2.zip

RUN pip install --upgrade pip

RUN wget -q -O terraform.zip https://releases.hashicorp.com/terraform/1.2.3/terraform_1.2.3_linux_amd64.zip && \
  unzip -o terraform.zip terraform && \
  rm terraform.zip && \
  cp terraform /usr/local/bin/

RUN apt-get install -y graphicsmagick=1.4+really1.3.35-1~deb10u1 ghostscript=9.27~dfsg-2+deb10u5

CMD echo "🔥"
