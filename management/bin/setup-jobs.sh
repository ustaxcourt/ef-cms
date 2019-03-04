#!/usr/bin/env bash

BASTION_PUBLIC_IP=$(terraform output bastion_public_ip)
JENKINS_PRIVATE_IP=$(terraform output jenkins_private_ip)
ssh-add ssh/id_rsa

GITHUB_URL=$1
REPO_OWNER=$2
REPOSITORY=$3

# TODO: check if there is a better way to setup jobs
echo "compiling templates"
sed "s|GITHUB_URL|${GITHUB_URL}|g" ../jobs/ef-cms/config.xml.tpl \
  | sed "s|REPO_OWNER|${REPO_OWNER}|g" \
  | sed "s|REPOSITORY|${REPOSITORY}|g" > ../jobs/ef-cms/config.xml

sed "s|GITHUB_URL|${GITHUB_URL}|g" ../jobs/ef-cms-ui/config.xml.tpl \
  | sed "s|REPO_OWNER|${REPO_OWNER}|g" \
  | sed "s|REPOSITORY|${REPOSITORY}|g" > ../jobs/ef-cms-ui/config.xml

sed "s|GITHUB_URL|${GITHUB_URL}|g" ../jobs/ef-cms-api/config.xml.tpl \
  | sed "s|REPO_OWNER|${REPO_OWNER}|g" \
  | sed "s|REPOSITORY|${REPOSITORY}|g" > ../jobs/ef-cms-api/config.xml

sed "s|GITHUB_URL|${GITHUB_URL}|g" ../jobs/ef-cms-shared/config.xml.tpl \
  | sed "s|REPO_OWNER|${REPO_OWNER}|g" \
  | sed "s|REPOSITORY|${REPOSITORY}|g" > ../jobs/ef-cms-shared/config.xml

sed "s|GITHUB_URL|${GITHUB_URL}|g" ../jobs/cleanup/config.xml.tpl \
  | sed "s|REPO_OWNER|${REPO_OWNER}|g" \
  | sed "s|REPOSITORY|${REPOSITORY}|g" > ../jobs/cleanup/config.xml

echo "creating job directories on Jenkins machine"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'sudo su -c \"mkdir -p /opt/bitnami/apps/jenkins/jenkins_home/jobs/ef-cms\" tomcat'"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'sudo su -c \"mkdir -p /opt/bitnami/apps/jenkins/jenkins_home/jobs/ef-cms-ui\" tomcat'"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'sudo su -c \"mkdir -p /opt/bitnami/apps/jenkins/jenkins_home/jobs/ef-cms-api\" tomcat'"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'sudo su -c \"mkdir -p /opt/bitnami/apps/jenkins/jenkins_home/jobs/ef-cms-shared\" tomcat'"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'sudo su -c \"mkdir -p /opt/bitnami/apps/jenkins/jenkins_home/jobs/cleanup\" tomcat'"

echo "copying files over to the bastion"
scp ../jobs/ef-cms/config.xml ubuntu@${BASTION_PUBLIC_IP}:/home/ubuntu/ef-cms-config.xml
scp ../jobs/ef-cms-ui/config.xml ubuntu@${BASTION_PUBLIC_IP}:/home/ubuntu/ef-cms-ui-config.xml
scp ../jobs/ef-cms-api/config.xml ubuntu@${BASTION_PUBLIC_IP}:/home/ubuntu/ef-cms-api-config.xml
scp ../jobs/ef-cms-shared/config.xml ubuntu@${BASTION_PUBLIC_IP}:/home/ubuntu/ef-cms-shared-config.xml
scp ../jobs/cleanup/config.xml ubuntu@${BASTION_PUBLIC_IP}:/home/ubuntu/cleanup-config.xml

echo "copying files from bastion to the jenkins box"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "scp /home/ubuntu/ef-cms-config.xml bitnami@${JENKINS_PRIVATE_IP}:/home/bitnami"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "scp /home/ubuntu/ef-cms-ui-config.xml bitnami@${JENKINS_PRIVATE_IP}:/home/bitnami"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "scp /home/ubuntu/ef-cms-api-config.xml bitnami@${JENKINS_PRIVATE_IP}:/home/bitnami"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "scp /home/ubuntu/ef-cms-shared-config.xml bitnami@${JENKINS_PRIVATE_IP}:/home/bitnami"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "scp /home/ubuntu/cleanup-config.xml bitnami@${JENKINS_PRIVATE_IP}:/home/bitnami"

echo "copy job files into correct job directories"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'sudo su -c \"cp /home/bitnami/ef-cms-config.xml /opt/bitnami/apps/jenkins/jenkins_home/jobs/ef-cms/config.xml\" tomcat'"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'sudo su -c \"cp /home/bitnami/ef-cms-ui-config.xml /opt/bitnami/apps/jenkins/jenkins_home/jobs/ef-cms-ui/config.xml\" tomcat'"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'sudo su -c \"cp /home/bitnami/ef-cms-api-config.xml /opt/bitnami/apps/jenkins/jenkins_home/jobs/ef-cms-api/config.xml\" tomcat'"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'sudo su -c \"cp /home/bitnami/ef-cms-shared-config.xml /opt/bitnami/apps/jenkins/jenkins_home/jobs/ef-cms-shared/config.xml\" tomcat'"
ssh -A -oStrictHostKeyChecking=no ubuntu@${BASTION_PUBLIC_IP} "ssh -oStrictHostKeyChecking=no bitnami@${JENKINS_PRIVATE_IP} 'sudo su -c \"cp /home/bitnami/cleanup-config.xml /opt/bitnami/apps/jenkins/jenkins_home/jobs/cleanup/config.xml\" tomcat'"
