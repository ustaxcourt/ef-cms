ARG TARGETARCH=amd64

FROM cypress/browsers:node-24.15.0-chrome-148.0.7778.96-1-ff-150.0.3-edge-148.0.3967.54-1
WORKDIR /home/app

# needed to install jre successfully
RUN mkdir -p /usr/share/man/man1

RUN apt-get update

RUN apt-get install -y \
  openjdk-21-jre-headless \
  openjdk-21-jdk-headless \
  openjdk-21-jre \
  openjdk-21-jdk \
  zip \
  curl \
  wget \
  git \
  less \
  python3 \
  python3-dev \
  python3-pip \
  jq \
  graphicsmagick \
  ghostscript \
  openssh-client \
  postgresql-client \
  sudo

# These are needed to prevent node canvas from failing during node-gyp build steps
RUN apt-get install -y build-essential
RUN apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.34.47.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf awscliv2.zip

RUN wget -q -O terraform.zip https://releases.hashicorp.com/terraform/1.15.3/terraform_1.15.3_linux_amd64.zip && \
  unzip -o terraform.zip terraform && \
  rm terraform.zip && \
  cp terraform /usr/local/bin/

CMD echo "🔥"
