FROM cypress/base:10.15.3

WORKDIR /home/build

RUN mkdir -p .fonts

RUN apt-get update && apt-get -y install curl fontconfig cabextract
RUN wget http://ftp.de.debian.org/debian/pool/contrib/m/msttcorefonts/ttf-mscorefonts-installer_3.6_all.deb && dpkg -i ttf-mscorefonts-installer_3.6_all.deb

RUN fc-match 'Times'
RUN fc-cache -f

RUN cp -r /usr/share/fonts/truetype/msttcorefonts/* .fonts

COPY package.json /home/build/nodejs/package.json
COPY package-lock.json /home/build/nodejs/package-lock.json
RUN cd /home/build/nodejs/ && npm i
RUN tar -czf puppeteer_lambda_layer.tar.gz nodejs .fonts

CMD echo "tar has been created"
