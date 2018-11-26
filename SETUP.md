# Set Up the CI/CD Pipeline

## Overview

These are the steps to set up the Jenkins-based CI/CD pipeline. This will involve installing software on your local machine, registering for a few websites, doing a small amount of configuration, and then running a few scripts to build the pipeline.

Following this guide will produce the following Amazon Web Services infrastructure:

- A VPC, which secures the Jenkins machine from external access.
- A bastion EC2 instance, used as the entry point to the VPC.
- A Route 53 zone, for the subdomain to host Jenkins and the application, including a sub-subdomain for Jenkins.
- An EC2 instance, running Bitnami’s Jenkins image, for building and deploying the application code.

The end result of this is not a dev, staging, or production website, but is instead a CI/CD pipeline that, when used, will create those sites.

## Prerequisites

- [Install Terraform](https://www.terraform.io/downloads.html) locally. Terraform will build AWS infrastructure automatically.
- [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/). - [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) locally. - In [AWS Identity and Access Management](https://console.aws.amazon.com/iam/), create a user or role with administrator privileges (e.g. attach the `AdministratorAccess` policy). - [Configure the AWS CLI account](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html) on your local machine to use the role or user you just created in IAM.
- Clone this GitHub repository locally.
- [Create a new GitHub account](https://github.com/join), with read-level access to the repository, which Jenkins will use to interact with GitHub. (GitHub describes these as “bot accounts” or “machine accounts,” and they are the exception to GitHub’s rule that accounts are intended for humans.)
- [Create a SonarCloud account](https://sonarcloud.io/). SonarCloud will be used to tests each build. - [Create a new SonarCloud organization](https://sonarcloud.io/create-organization).
  - [Create a token](https://sonarcloud.io/account/security) that Jenkins can use to interact with SonarCloud. (This will be referred to as `SONAR_TOKEN` when setting up Jenkins.)
  - There are two sub-projects to the EF-CMS — the front-end (the UI) and the back-end (the API). Each is handled separately by Jenkins and SonarCloud. - [Create a project and project key](https://sonarcloud.io/projects/create?manual=true) for the UI. (This will be referred to as `UI_SONAR_TOKEN` when setting up Jenkins.) - [Create a project and project key](https://sonarcloud.io/projects/create?manual=true) for the API. (This will be referred to as `API_SONAR_TOKEN` when setting up Jenkins.)

## Setup Steps

1. At the CLI, set `EFCMS_DOMAIN` to the value of the domain for your implementation.
   - e.g. `export EFCMS_DOMAIN=ef-cms.example.gov`
2. [Create a Route 53 zone in AWS](https://console.aws.amazon.com/route53/) that matches the domain in step 1 (e.g., `ef-cms.example.gov`).
3. Run the `deploy-infrastructure.sh` script, found in `management/management/`:
   - `cd management/management && ./deploy-infrastructure.sh`
   - This command continously prints out `module.management.jenkins-certificate.aws_acm_certificate_validation.dns_validation: Still creating...` until you have finished the next step (step 4) and waited for the DNS updates to propagate.
   - This command will generate 2 files: `ssh/id_rsa` and `ssh/id_rsa.pub`). Without these keys, you will be unable to SSH into the bastion or Jenkins EC2 instances, so save a copy of them somewhere.
4. Create `NS` records on your domain’s existing DNS to point a subdomain to Route 53. For example, if your site is `example.gov`, the `example.gov` DNS entry must be modified to delegate authority for `ef-cms.example.gov` to use Route 53.
   - [Open Route 53’s list of hosted zones](https://console.aws.amazon.com/route53/home#hosted-zones:).
   - Select your domain (e.g., `ef-cms.example.gov`).
   - Note the values of the four `NS` domains. These are what need to be added to the DNS entry for your main domain name.
   - The method of modifying your main domain name’s DNS will vary enormously, so specific guidance is impossible, but you need to create four new `NS` records, one for each of those Route 53 records, with a host name of the subdomain (e.g., `ef-cms`) and a value of the AWS DNS (e.g., `ns-123.awsdns-56.net`). If you are limited in the number of `NS` records that you can create, simply create as many of the four as you can.
5. If completing the prior step took more than a few minutes, then step 2 failed. That’s OK! Simply re-run `deploy-infrastructure.sh`.
6. After `deploy-infrastructure.sh` has completed successfully, run the script to install plugins into Jenkins, `setup-jenkins.sh`, found in `management/bin/`.
7. Log into Jenkins.
   - Get the Jenkins credentials, using `show-passwords.sh`, found in `management/management/`.
   - Note the Jenkins username and password.
   - Open Jenkins in your browser. This is found on the subdomain that you figured, at the `jenkins-ef-cms-ops` sub-subdomain, and in the `/jenkins/` subdirectory, e.g. `https://jenkins-ef-cms-ops.ef-cms.example.gov/jenkins/`.
   - Click the `x` in the top right off the modal that appears.
     - You may be prompted to restart Jenkins, in which case you should do so.
     - After restarting, the modal will pop up again — just click the `x` again.
8. Create 3 global credentials in Jenkins, so that Jenkins has permission to interact with GitHub and SonarCloud, using the credentials that you set up per [the prerequisites](#Prerequisites). This is done at a URL like `https://jenkins-ef-cms-ops.ef-cms.ustaxcourt.gov/jenkins/credentials/store/system/domain/_/`, which you can get to by choosing `Credentials` from the home page menu, `System` ⟶ `Global credentials` ⟶ `Add Credentials`.
   - Create a “username with password” type. Provide an ID of `GITHUB_USER`, and enter the username and password for the GitHub account that you created.
   - Create a “secret text” type. Provide an an ID of `API_SONAR_TOKEN`, and a `secret` that is the value of the token that you created in SonarCloud.
   - Create a “secret text” type. Provide an an ID of `UI_SONAR_TOKEN`, and a `secret` that is the value of the token that you created in SonarCloud.
9. Set up the Sonar organization properties in Jenkins. This is done in `Jenkins` ⟶ `Manage Jenkins` ⟶ `Configure System` ⟶ `Global properties`, and then by checking off `Environment variables` to reveal the interface to add new variables. Add the following name/value pairs:

- `SONAR_ORG` / your sonar organization’s name
- `EFCMS_DOMAIN` / your subdomain, e.g. `ef-cms.example.gov`
- `UI_SONAR_KEY` / your Sonar UI project key, e.g. `ef-cms-ui`
- `API_SONAR_KEY` / your Sonar API project key, e.g. `ef-cms-api`

10. At the CLI, set up the jobs via the `setup-jobs.sh` script, which is in `management/bin/`. This script takes three arguments, with a complete command like: `../bin/setup-jobs.sh https://github.com/flexion/ef-cms.git flexion ef-cms`. Those arguments are, in this order:
    - Your Git repository’s URL, e.g. `https://github.com/examplecourt/ef-cms.git`.

- Your organization’s name in GitHub, e.g. `examplecourt`.
- The project repository’s name in GitHub, e.g. `ef-cms`.

11. Increase the number of Jenkins executors to five. Choose `Jenkins` ⟶ `Build Executor Status` ⟶ `Master` ⟶ `Configure`, and change `# of executors` from `2` to `5`.
12. Restart Jenkins. This can be done by choosing `Jenkins` (i.e., going to the home page), and appending `safeRestart` to the URL, e.g. `https://jenkins-ef-cms-ops.ef-cms.example.gov/jenkins/safeRestart`.

You are done — the CI/CD pipeline is now ready to operate. To run a build, [see Jenkins documentation](https://jenkins.io/doc/).
