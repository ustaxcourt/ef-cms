FROM cypress/base:12.18.3

WORKDIR /home/app

RUN sh -c 'echo "deb [check-valid-until=no] http://ftp.debian.org/debian stretch-backports main" > /etc/apt/sources.list.d/stretch-backports.list'
RUN sed -i '/deb http:\/\/deb.debian.org\/debian stretch-backports main/d' /etc/apt/sources.list

RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y -t stretch-backports openjdk-11-jdk=11.0.6+10-1~bpo9+1 -V
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

RUN apt-get install -yq \
  gconf-service=3.2.6-5 \
  libasound2=1.1.8-1 \
  libatk1.0-0=2.30.0-2 \
  libc6=2.28-10 \
  libcairo2=1.16.0-4 \
  libcups2=2.2.10-6+deb10u3 \
  libdbus-1-3=1.12.20-0+deb10u1 \
  libfontconfig1=2.13.1-2 \
  libgcc1=1:8.3.0-6 \
  libgconf-2-4=3.2.6-5 \
  libgdk-pixbuf2.0-0=2.38.1+dfsg-1 \
  libglib2.0-0=2.58.3-2+deb10u2 \
  libgtk-3-0=3.24.5-1 \
  libnspr4=2:4.20-1 \
  libpango-1.0-0=1.42.4-8~deb10u1 \
  libpangocairo-1.0-0=1.42.4-8~deb10u1 \
  libstdc++6=8.3.0-6 \
  libx11-6=2:1.6.7-1 \
  libx11-xcb1=2:1.6.7-1 \
  libxcb1=1.13.1-2 \
  libxcomposite1=1:0.4.4-2 \
  libxcursor1=1:1.1.15-2 \
  libxdamage1=1:1.1.4-3+b3 \
  libxext6=2:1.3.3-1+b2 \
  libxfixes3=1:5.0.3-1 \
  libxi6=2:1.7.9-1 \
  libxrandr2=2:1.5.1-1 \
  libxrender1=1:0.9.10-1 \
  libxss1=1:1.2.3-1 \
  libxtst6=2:1.2.3-1 \
  ca-certificates=20200601~deb10u1 \
  fonts-liberation=1:1.07.4-9 \
  libappindicator1=0.4.92-7 \
  libnss3=2:3.42.1-1+deb10u3 \
  lsb-release=10.2019051400 \
  xdg-utils=1.1.3-1+deb10u1 \
  wget=1.20.1-1.1 \
  git=1:2.20.1-2+deb10u3 \
  bash=5.0-4 \
  openssh-client=1:7.9p1-10+deb10u2 \
  python=2.7.16-1 \
  python-dev=2.7.16-1 \
  python-pip=18.1-5 \
  python-setuptools=40.8.0-1 \
  ca-certificates=20200601~deb10u1 \
  less=487-0.1+b1 \
  unzip=6.0-23+deb10u1 \
  wget=1.20.1-1.1 \
  jq=1.5+dfsg-2+b1 \
  shellcheck=0.5.0-3 \
  clamav=0.102.4+dfsg-0+deb10u1 -V

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.0.54.zip" -o "awscliv2.zip"
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
