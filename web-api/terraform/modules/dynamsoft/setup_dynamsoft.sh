#!/bin/bash

# we disable SC2269 because these variables are actually defined in terraform and passed in externally.
# these comes from terraform
# shellcheck disable=SC2269
dynamsoft_s3_zip_path="${dynamsoft_s3_zip_path}"
dynamsoft_url="${dynamsoft_url}"
dynamsoft_product_keys="${dynamsoft_product_keys}"

export DEBIAN_FRONTEND=noninteractive
sudo apt update
sudo apt install -y nginx
sudo apt install -y awscli
sudo ufw allow 'Nginx HTTP'
cd /var/www/html || exit

# download the zip
sudo aws s3 cp "${dynamsoft_s3_zip_path}" dynamsoft.tar.gz
sudo tar xvzf dynamsoft.tar.gz

# copy config to /tmp due to permission issues
cp Dynamic\ Web\ TWAIN\ SDK\ 17.2.5/Resources/dynamsoft.webtwain.config.js /tmp/dynamsoft.webtwain.config.js.tpl

# replace the resource path with the full path to the resources folder
sudo sed -i "s|DYNAMSOFT_RESOURCE_PATH|${dynamsoft_url}/Dynamic%20Web%20TWAIN%20SDK%2017.2.5/Resources|" /tmp/dynamsoft.webtwain.config.js.tpl
sudo sed -i "s|DYNAMSOFT_PRODUCT_KEYS|${dynamsoft_product_keys}|" /tmp/dynamsoft.webtwain.config.js.tpl

# copy back from /tmp to main nginx html folder
sudo cp /tmp/dynamsoft.webtwain.config.js.tpl Dynamic\ Web\ TWAIN\ SDK\ 17.2.5/Resources/dynamsoft.webtwain.config.js
