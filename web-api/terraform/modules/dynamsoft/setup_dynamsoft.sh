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
cp Dynamic\ Web\ TWAIN\ SDK\ 18.5/Resources/dynamsoft.webtwain.config.js /tmp/dynamsoft.webtwain.config.js.tpl

# replace the resource path with the full path to the resources folder
sudo sed -i "s|//Dynamsoft.DWT.ResourcesPath = 'Resources';|Dynamsoft.DWT.ResourcesPath = '${dynamsoft_url}/Dynamic%20Web%20TWAIN%20SDK%2018.5/Resources';|" /tmp/dynamsoft.webtwain.config.js.tpl
sed -i '/Dynamsoft\.DWT\.ProductKey/d' "/tmp/dynamsoft.webtwain.config.js.tpl"
echo "Dynamsoft.DWT.ProductKey = '${dynamsoft_product_keys}';" >> "/tmp/dynamsoft.webtwain.config.js.tpl"

# copy back from /tmp to main nginx html folder
sudo cp /tmp/dynamsoft.webtwain.config.js.tpl Dynamic\ Web\ TWAIN\ SDK\ 18.5/Resources/dynamsoft.webtwain.config.js

# Add Access-Control-Allow-Origin header to NGINX configuration
echo 'add_header Access-Control-Allow-Origin "*";' | sudo tee /etc/nginx/conf.d/cors.conf

# Start and enable nginx service
sudo systemctl start nginx
sudo systemctl enable nginx

# Reload nginx to apply changes
sudo systemctl reload nginx
