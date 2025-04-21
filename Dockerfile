ARG TARGETARCH=amd64

FROM cypress/browsers:node-22.14.0-chrome-135.0.7049.84-1-ff-137.0.1-edge-135.0.3179.54-1

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
  openssh-client \
  postgresql-client \
  sudo

# These are needed to prevent node canvas from failing during node-gyp build steps
RUN apt-get install -y build-essential
RUN apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.26.2.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf awscliv2.zip

RUN wget -q -O terraform.zip https://releases.hashicorp.com/terraform/1.11.4/terraform_1.11.4_linux_amd64.zip && \
  unzip -o terraform.zip terraform && \
  rm terraform.zip && \
  cp terraform /usr/local/bin/

CMD echo "🔥"
