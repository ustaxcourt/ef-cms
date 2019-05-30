#!/bin/bash
sudo apt update
sudo apt install -y nginx
sudo ufw allow 'Nginx HTTP'
cd /var/www/html
sudo curl -H "Authorization: token ${git_access_token}" -L https://api.github.com/repos/codyseibert/dynamsoft/tarball -o dynamsoft.tar.gz
sudo tar xvzf dynamsoft.tar.gz
sudo cp -R codyseibert-dynamsoft-5bbf51a51de3717dfee641678d33f36e3cc857e7/* .
sudo sed "s/DYNAMSOFT_KEY/${product_keys}/" Resources/dynamsoft.webtwain.config.js.tpl > /tmp/dynamsoft.webtwain.config.js
sudo cp /tmp/dynamsoft.webtwain.config.js ./Resources