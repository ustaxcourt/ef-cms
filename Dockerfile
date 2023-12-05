# Note: this is debian 11 (bullseye)

FROM cypress/browsers:node-18.16.1-chrome-114.0.5735.133-1-ff-114.0.2-edge-114.0.1823.51-1
FROM cypress/browsers:node-18.16.1-chrome-114.0.5735.133-1-ff-114.0.2-edge-114.0.1823.51-1

WORKDIR /home/app

# needed to install jre successfully
RUN mkdir -p /usr/share/man/man1

# delete duplicate list if it exists
RUN [ -f /etc/apt/sources.list.d/microsoft-edge.list ] && [ -f /etc/apt/sources.list.d/microsoft-edge-stable.list ] && rm /etc/apt/sources.list.d/microsoft-edge-stable.list

RUN apt-get update

RUN apt-get install -y \
  openjdk-11-jre-headless \
  openjdk-11-jdk-headless \
  openjdk-11-jre \
  openjdk-11-jdk \
  zip \
  curl \
  wget \
  git \
  less \
  python \
  python-dev \
  python3-pip \
  jq \
  graphicsmagick=1.4+really1.3.36+hg16481-2+deb11u1 \
  ghostscript=9.53.3~dfsg-7+deb11u6 \
  chromium \
  openssh-client \
  sudo

# These are needed to prevent node canvas from failing during node-gyp build steps
RUN apt-get install -y build-essential
RUN apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.14.5.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf awscliv2.zip

RUN pip install --upgrade pip
RUN wget -q -O terraform.zip https://releases.hashicorp.com/terraform/1.6.5/terraform_1.6.5_linux_amd64.zip && \ 
  unzip -o terraform.zip terraform && \
  rm terraform.zip && \
  cp terraform /usr/local/bin/

CMD echo "🔥"