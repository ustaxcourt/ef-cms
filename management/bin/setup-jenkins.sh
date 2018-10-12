#!/usr/bin/env bash

BASTION_PUBLIC_IP=$(terraform output bastion_public_ip)
JENKINS_PRIVATE_IP=$(terraform output jenkins_private_ip)
JENKINS_URL=$(terraform output jenkins_elb_url)
echo "Setting up Jenkins ${JENKINS_PRIVATE_IP} via bastion host ${BASTION_PUBLIC_IP} using ${JENKINS_URL}"
ssh-add ssh/id_rsa

# initial curl includes retry logic
echo "Waiting for Jenkins to be available"
curl --connect-timeout 5 --max-time 10 --retry 12 --retry-delay 0 --retry-max-time 120 --insecure ${JENKINS_URL} &> /dev/null

CREDS=$(ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'cat ./bitnami_credentials'" | grep "The default username and password" | awk '{print $7,$9}' | sed -e "s/'//g" -e "s/\.$//" -e "s/ /:/")

# get crumb for future requests
CRUMB=$(curl --insecure -u ${CREDS} "${JENKINS_URL}crumbIssuer/api/xml?xpath=concat(//crumbRequestField,\":\",//crumb)")

function install_plugin() {
	PLUGIN=$1
	echo "Installing plugin ${PLUGIN}"
	curl -X POST --insecure -u ${CREDS} -d "<jenkins><install plugin=\"${PLUGIN}\" /></jenkins>" --header 'Content-Type: text/xml' --header "${CRUMB}" "${JENKINS_URL}pluginManager/installNecessaryPlugins"
}

declare -a plugins=("blueocean@1.6.2" "blueocean-commons@1.6.2" "blueocean-config@1.6.2" "blueocean-dashboard@1.6.2" "blueocean-events@1.6.2" "blueocean-git-pipeline@1.6.2" "blueocean-github-pipeline@1.6.2" "blueocean-i18n@1.6.2" "blueocean-jwt@1.6.2" "blueocean-personalization@1.6.2" "blueocean-pipeline-api-impl@1.6.2" "blueocean-rest@1.6.2" "blueocean-rest-impl@1.6.2" "blueocean-web@1.6.2" "blueocean-pipeline-editor@1.6.2" "blueocean-autofavorite@1.2.2" "blueocean-bitbucket-pipeline@1.6.2" "blueocean-core-js@1.6.2" "blueocean-display-url@2.2.0" "blueocean-jira@1.6.2" "blueocean-pipeline-scm-api@1.6.2" "ssh-agent@1.16" "github@1.29.2" "pipeline-githubnotify-step@1.0.4", "amazon-ecr@1.6", "aws-credentials@1.23", "pipeline-aws@1.32")

for plugin in "${plugins[@]}"
do
	install_plugin "${plugin}"
done
