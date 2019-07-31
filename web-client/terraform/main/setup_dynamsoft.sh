#!/bin/bash
dynamsoft_s3_zip_path="${dynamsoft_s3_zip_path}"

export DEBIAN_FRONTEND=noninteractive 
sudo apt update
sudo apt install -y nginx 
sudo apt install -y awscli 
sudo ufw allow 'Nginx HTTP'
cd /var/www/html || exit

sudo aws s3 cp "${dynamsoft_s3_zip_path}" dynamsoft.tar.gz
sudo tar xvzf dynamsoft.tar.gz
