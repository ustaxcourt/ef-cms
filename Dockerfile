FROM cypress/base:12.18.3

WORKDIR /home/app

RUN sh -c 'echo "deb [check-valid-until=no] http://ftp.debian.org/debian stretch-backports main" > /etc/apt/sources.list.d/stretch-backports.list'
RUN sed -i '/deb http:\/\/deb.debian.org\/debian stretch-backports main/d' /etc/apt/sources.list

RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y -t stretch-backports openjdk-11-jdk

# RUN apt-get -o Acquire::Check-Valid-Until=false update

# RUN apt-get install -y -t jessie-backports ca-certificates-java && apt-get -y install openjdk-8-jdk && update-alternatives --config java

RUN apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
  libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
  ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
  git bash openssh-client python python-dev python-pip python-setuptools ca-certificates less \
  unzip wget jq shellcheck clamav

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
RUN rm awscliv2.zip

RUN freshclam

RUN pip install --upgrade pip
RUN wget -q -O terraform_0.12.28_linux_amd64.zip https://releases.hashicorp.com/terraform/0.12.28/terraform_0.12.28_linux_amd64.zip && \
  unzip -o terraform_0.12.28_linux_amd64.zip terraform && \
  cp terraform /usr/local/bin/ && \
  curl -OL 'https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.2.0.1227-linux.zip' && \
  mkdir sonar_scanner && \
  unzip -d sonar_scanner sonar-scanner-cli-3.2.0.1227-linux.zip && \
  mv sonar_scanner/* sonar_home && \
  rm -rf sonar_scanner sonar-scanner-cli-3.2.0.1227-linux.zip && \
  CI=true npm install cypress && \
  sed -i 's/use_embedded_jre=true/use_embedded_jre=false/g' sonar_home/bin/sonar-scanner

ENV SONAR_RUNNER_HOME=/home/app/sonar_home
ENV PATH ${SONAR_RUNNER_HOME}/bin:$PATH
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

COPY package.json /home/app/package.json
COPY package-lock.json /home/app/package-lock.json
RUN npm set progress=false && \
  npm config set puppeteer_skip_chromium_download true && \
  npm ci

COPY . /home/app

COPY web-client/pa11y/package.json /home/app/web-client/pa11y/package.json
COPY web-client/pa11y/package-lock.json /home/app/web-client/pa11y/package-lock.json
RUN npm set progress=false && npm ci --prefix=web-client/pa11y/
COPY ./web-client/pa11y /home/app/web-client/pa11y

RUN mkdir -p /home/app/web-client/cypress/screenshots && \
  mkdir -p /home/app/web-client/cypress/videos && \
  mkdir -p /home/app/web-client/cypress-smoketests/videos

CMD echo "please overwrite this command"
