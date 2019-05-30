#!/bin/bash
git_access_token="${git_access_token}"
dynamsoft_repo="${dynamsoft_repo}"
dynamsoft_zip_name="${dynamsoft_zip_name}"
product_keys="${product_keys}"

sudo apt update
sudo apt install -y nginx
sudo ufw allow 'Nginx HTTP'
cd /var/www/html || exit
sudo curl -H "Authorization: token ${git_access_token}" -L "${dynamsoft_repo}" -o dynamsoft.tar.gz
sudo tar xvzf dynamsoft.tar.gz
sudo cp -R "${dynamsoft_zip_name}"/* .
sudo sed "s/DYNAMSOFT_KEY/${product_keys}/" Resources/dynamsoft.webtwain.config.js.tpl | sudo tee /tmp/dynamsoft.webtwain.config.js
sudo cp /tmp/dynamsoft.webtwain.config.js ./Resources