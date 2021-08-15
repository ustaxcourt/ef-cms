FROM cypress/base:14.16.0

WORKDIR /home/app

RUN sh -c 'echo "deb [check-valid-until=no] http://ftp.debian.org/debian stretch-backports main" > /etc/apt/sources.list.d/stretch-backports.list'
RUN sed -i '/deb http:\/\/deb.debian.org\/debian stretch-backports main/d' /etc/apt/sources.list

RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y -t stretch-backports openjdk-11-jdk=11.0.6+10-1~bpo9+1 -V
RUN apt-get install -yq less=487-0.1+b1 python python-dev python-pip jq=1.5+dfsg-2+b1
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.0.54.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
RUN rm awscliv2.zip

RUN pip install --upgrade pip

RUN wget -q -O terraform_1.0.2_linux_amd64.zip https://releases.hashicorp.com/terraform/1.0.2/terraform_1.0.2_linux_amd64.zip && \
  unzip -o terraform_1.0.2_linux_amd64.zip terraform && \
  cp terraform /usr/local/bin/ && \
  curl -OL 'https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.2.0.1227-linux.zip' && \
  mkdir sonar_scanner && \
  unzip -d sonar_scanner sonar-scanner-cli-3.2.0.1227-linux.zip && \
  mv sonar_scanner/* sonar_home && \
  rm -rf sonar_scanner sonar-scanner-cli-3.2.0.1227-linux.zip && \
  CI=true npm install cypress && \
  sed -i 's/use_embedded_jre=true/use_embedded_jre=false/g' sonar_home/bin/sonar-scanner

COPY package.json /home/app/package.json
COPY package-lock.json /home/app/package-lock.json
RUN npm set progress=false && \
  npm config set puppeteer_skip_chromium_download true && \
  npm ci

COPY . /home/app

RUN mkdir -p /home/app/web-client/cypress/screenshots && \
  mkdir -p /home/app/web-client/cypress/videos && \
  mkdir -p /home/app/web-client/cypress-smoketests/videos

CMD echo "🔥"
