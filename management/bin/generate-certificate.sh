# a script to generate an certificate for the provisioning process
PREFIX=$1
DNS_NAME=$2
openssl req -x509 -nodes -sha256 -newkey rsa:4096 -keyout certs/${PREFIX}-key.pem -out certs/${PREFIX}-cert.pem -days 365 -subj "/CN=${DNS_NAME}"
