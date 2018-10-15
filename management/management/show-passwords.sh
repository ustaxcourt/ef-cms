BASTION_PUBLIC_IP=$(terraform output bastion_public_ip)
JENKINS_PRIVATE_IP=$(terraform output jenkins_private_ip)
SONARQUBE_PRIVATE_IP=$(terraform output sonarqube_private_ip)
ssh-add ssh/id_rsa
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'cat ./bitnami_credentials'"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${SONARQUBE_PRIVATE_IP} 'cat ./bitnami_credentials'"