# Overview

This section outlines the steps necessary for creating the necessary resources needed for setting up the CI / CD pipeline.  Following the setup steps will produce the following:

- a VPC used for securing the Jenkins machine from external access
- a Route53 zone setup for the sub domain to host the application and jenkins behind
- a bastion ec2 instance which is used as the entry point to the VPC
- a bitnami Jenkins ec2 instance used for building and deploying the application code
- a Route53 record for accessing the Jenkins machine

# Prerequisites
- install terraform locally
    - https://www.terraform.io/downloads.html
- create an aws account
- setup a user or role with admin privileges
- set local machine to use this role or user
- clone this repo locally
- setup a github user with access to the repo
- setup an account in sonarcloud.io
    - create a project key for the ui
    - create a project key for the api

# Setup Steps

1. Update dns_domain inside the management/management/terraform.tfvars.template to match your desired domain.
2. run the deploy-infrastructure.sh script:
    - `cd management/management && ./deploy-infrastructure.sh`
    - this command will continously print out "module.management.jenkins-certificate.aws_acm_certificate_validation.dns_validation: Still creating..." until you have finished set 7 and waited some time
    - this command will generate 2 files (id_rsa / id_rsa.pub)
        - backup these keys
        - they are used to ssh into the bastion and jenkins ec2 instances
3. create NS records on your current DNS to point to the AWS DNS
    - login to aws and navigate to the Route53 console
    - click on "hosted zones"
    - click on your domain
    - keep track of the 4 NS record - you will use these in the next step
    - open your DNS / domain name provider
    - manage the DNS related to your domain
    - create the same 4 NS Records to match the ones in the Route53 console
        -  example host: efcms
        -  example value: ns-1212.awsdns-23.org.
4. If too much time has passed for step 2 as it tries to validate the acm, it may fail.  That's ok!, just re-run the deploy-infrastructure.sh script.
5. after step 4 is successful, run the setup jenkins script to install necessary plugins onto jenkins:
    - `cd management/management && ../bin/setup-jenkins.sh`
6. additional Jenkins setup
    - get the Jenkins credentials:
        - `cd management/management && ./show-passwords.sh`
    - make note of the Jenkins username and password
    - login to Jenkins using those credentials
    - click the x in the top right off the modal
    - setup 3 global credentials
        - a username / password type
            - id: flexion-ci
        - a secret text type
            - id: API_SONAR_TOKEN
        - a secret text type
            - id: UI_SONAR_TOKEN
    - setup the jobs via the setup-jobs.sh script
        - `cd management/management && ../bin/setup-jobs.sh
7. the CI / CD pipeline is ready to operate

# Job Overview
