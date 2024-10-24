# Note: node-20.14.0-chrome-125.0.* is debian 12.5 (bookworm)

FROM cypress/browsers:node-20.18.0-chrome-129.0.6668.89-1-ff-131.0.2-edge-129.0.2792.65-1

WORKDIR /home/app

# needed to install jre successfully
RUN mkdir -p /usr/share/man/man1

RUN apt-get update

RUN apt-get install -y \
  openjdk-17-jre-headless \
  openjdk-17-jdk-headless \
  openjdk-17-jre \
  openjdk-17-jdk \
  zip \
  curl \
  wget \
  git \
  less \
  python-is-python3 \
  2to3 \
  python3 \
  python3-dev \
  python-dev-is-python3 \
  python3-pip=23.0.1+dfsg-1 \
  jq \
  graphicsmagick \
  ghostscript \
  chromium \
  openssh-client \
  postgresql-client \
  sudo

# These are needed to prevent node canvas from failing during node-gyp build steps
RUN apt-get install -y build-essential
RUN apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.18.8.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf awscliv2.zip

RUN wget -q -O terraform.zip https://releases.hashicorp.com/terraform/1.9.8/terraform_1.9.8_linux_amd64.zip && \
  unzip -o terraform.zip terraform && \
  rm terraform.zip && \
  cp terraform /usr/local/bin/

CMD echo "🔥"
