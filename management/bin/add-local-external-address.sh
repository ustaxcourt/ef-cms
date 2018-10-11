# a script to substitute your local external IP address into the terraform.tfvars variable file

EXTERNAL_IP=$(curl -s http://checkip.amazonaws.com)
echo "Your current external IP address is ${EXTERNAL_IP}"
if grep --quiet "CHANGEME_SSH_CIDR_PLACEHOLDER" terraform.tfvars; then
  echo "Automatically substituting your external IP address to the provisioning process"
  sed -i.bak -e "s/CHANGEME_SSH_CIDR_PLACEHOLDER/${EXTERNAL_IP}/" terraform.tfvars
  rm terraform.tfvars.bak
else
  echo "A replacement placeholder was not found in the terraform.tfvars file, not substituting."
fi