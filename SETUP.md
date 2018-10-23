# Deploy Management Related Infrastructure

This section outlines the steps necessary for creating the necessary resources needed for setting up the CI / CD pipeline.  Following the setup steps will produce the following:

- a VPC used for securing the Jenkins machine from external access
- a Route53 zone setup for the sub domain to host the application and jenkins behind
- a bastion ec2 instance which is used as the entry point to the VPC
- a bitnami Jenkins ec2 instance used for building and deploying the application code
- a Route53 record for accessing the Jenkins machine

## Setup Steps

1. Update dns_domain inside the management/management/terraform.tfvars.template file to have the necessary domain name.
2. run the deploy-infrastructure.sh script to create the described resources above:
    - `cd management/management && ./deploy-infrastructure.sh`
    - this command will generate 2 files
        - id_rsa
        - id_rsa.pub
    - do not lose these keys
        - back them up
        - never distribute them insecurely
        - never commit them to the git repo
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
4. run the setup jenkins script to install necessary plugins:
    - `cd management/management && ../bin/setup-jenkins.sh`
5. additional Jenkins setup
    - get the Jenkins credentials:
        - `cd management/management && ./show-passwords.sh`
    - make note of the Jenkins username and password
    - open your browser to the Jenkins url
    -
