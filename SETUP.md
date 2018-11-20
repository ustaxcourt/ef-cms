# Overview

This section outlines the steps necessary for creating the necessary resources needed for setting up the CI / CD pipeline. Following the setup steps will produce the following:

- a VPC used for securing the Jenkins machine from external access
- a Route53 zone setup for the sub domain to host the application and jenkins behind
- a bastion ec2 instance which is used as the entry point to the VPC
- a bitnami Jenkins ec2 instance used for building and deploying the application code
- a Route53 record for accessing the Jenkins machine

# Prerequisites

- install terraform locally
  - https://www.terraform.io/downloads.html
- create an aws account
- set up the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) locally, and configure it to use your AWS account
- setup a user or role with admin privileges
- set local machine to use this role or user
- clone this repo locally
- setup a github user with access to the repo
- create an account and setup an organization in sonarcloud.io (https://sonarcloud.io/create-organization)
  - create a token for use by jenkins (SONAR_TOKEN see https://sonarcloud.io/account/security)
  - create a project and project key for the ui (UI_SONAR_TOKEN below see https://sonarcloud.io/projects/create?manual=true)
  - create a project and project key for the api (API_SONAR_TOKEN below)

# Setup Steps

1. export EFCMS_DOMAIN to your domain
   - e.g. `export EFCMS_DOMAIN=ustc-case-mgmt.flexion.us`
2. create a Route53 zone in AWS that matches the same domain in step 1.
3. run the deploy-infrastructure.sh script:
   - `cd management/management && ./deploy-infrastructure.sh`
   - this command continously prints out "module.management.jenkins-certificate.aws_acm_certificate_validation.dns_validation: Still creating..." until you have finished the next step (step 3) and waited some time for the dns resolutions to happen
   - this command will generate 2 files (`ssh/id_rsa` / `ssh/id_rsa.pub`)
     - backup these keys
     - they are used to ssh into the bastion and jenkins ec2 instances
4. create NS records on your current DNS to point a subdomain to AWS Route53 DNS
   - login to aws and navigate to the Route53 console
   - click on "hosted zones"
   - click on your domain
   - keep track of the 4 NS record - you will use these in a bit
   - open your DNS / domain name provider to manage your domain
   - create the same 4 NS Records to match the ones in the Route53 console
     - example host: efcms
     - example value: ns-1212.awsdns-23.org.
5. If too much time has passed for step 2 as it tries to validate the acm, it may fail. That's ok!, just re-run the deploy-infrastructure.sh script.
6. after step 4 is successful, run the setup jenkins script to install necessary plugins onto jenkins:
   - `cd management/management && ../bin/setup-jenkins.sh`
7. additional Jenkins setup
   - get the Jenkins credentials:
     - `cd management/management && ./show-passwords.sh`
   - make note of the Jenkins username and password
   - login to Jenkins using those credentials
   - click the x in the top right off the modal
     - it may prompt you to restart jenkins, if so, restart jenkins
     - the modal will pop up again after restarting, just click the x again
   - setup 3 global credentials
     - a username / password type
       - id: GITHUB_USER
     - a secret text type
       - id: API_SONAR_TOKEN
     - a secret text type
       - id: UI_SONAR_TOKEN
     - a secret text type
       - id: SHARED_SONAR_TOKEN
   - setup the sonar organization property inside jenkins
     - goto: Jenkins -> Manage Jenkins -> Configure System -> Global properties -> Environment variables
     - setup
       - SONAR_ORG
       - your_sonar_org_name // e.g. flexion-github
     - setup
       - EFCMS_DOMAIN
       - your_sub_domain // e.g. ustc-case-mgmt.flexion.us
     - setup
       - UI_SONAR_KEY
       - your_sonar_project_key // e.g. ef-cms-ui
     - setup
       - API_SONAR_KEY
       - your_sonar_project_key // e.g. ef-cms-api-key
     - setup
       - SHARED_SONAR_KEY
       - your_sonar_project_key // e.g. ef-cms-shared-key
   - setup the jobs via the setup-jobs.sh script
     - this script takes 3 arguments in this order
       - your_repo_url // example: https://github.com/flexion/ef-cms.git
       - your_organization_name // organization name in github
       - your_repo_name // repo name
     - here is an example: `cd management/management && ../bin/setup-jobs.sh https://github.com/flexion/ef-cms.git flexion ef-cms
   - increase executors to 5
     - go to management jenkins and increase the executors from 2 to 5
   - restart jenkins
     - https://..../jenkins/safeRestart
8. the CI / CD pipeline is ready to operate
