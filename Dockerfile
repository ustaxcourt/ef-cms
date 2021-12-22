FROM cypress/base:14.17.3

WORKDIR /home/app

RUN sh -c 'echo "deb [check-valid-until=no] http://ftp.debian.org/debian stretch-backports main" > /etc/apt/sources.list.d/stretch-backports.list'
RUN sed -i '/deb http:\/\/deb.debian.org\/debian stretch-backports main/d' /etc/apt/sources.list

RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y -t stretch-backports openjdk-11-jdk=11.0.6+10-1~bpo9+1 -V
RUN apt-get install -yq less=487-0.1+b1 python python-dev python-pip jq=1.5+dfsg-2+b1
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.3.6.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
RUN rm awscliv2.zip

RUN pip install --upgrade pip

RUN wget -q -O terraform_1.1.0_linux_amd64.zip https://releases.hashicorp.com/terraform/1.1.0/terraform_1.1.0_linux_amd64.zip && \
  unzip -o terraform_1.1.0_linux_amd64.zip terraform && \
  cp terraform /usr/local/bin/ && \
  CI=true npm install cypress

COPY package.json /home/app/package.json
COPY package-lock.json /home/app/package-lock.json
RUN npm set progress=false && \
  npm config set puppeteer_skip_chromium_download true && \
  npm ci

COPY . /home/app

RUN mkdir -p /home/app/web-client/cypress-integration/screenshots && \
  mkdir -p /home/app/web-client/cypress-integration/videos && \
  mkdir -p /home/app/web-client/cypress-smoketests/videos

CMD echo "🔥"
