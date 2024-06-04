# Terraform

# How Dawson Uses Terraform
Dawson has split its terraform into two separate categories, infrastructure modules/blueprints and live infrastructure. 

### Infrastructure Modules (./web-api/terraform/modules)
The infrastructure modules/blueprints are only meant to describe the infrastructure for a service and are meant to be re-used for each environment. So a module might be created for all of the infrastructure necessary to deploy a worker service like an sqs_queue, a dead letter queue, a lambda, a cloudwatch alarm, etc. This is only the blueprint for how to create the worker, it is not actually the creation of the worker itself. This worker module could be created by exp1, exp2, exp3-us-east-1, exp3-us-west-1. It is only meant to be the blueprints for the infrastructure, not the actual infrastructure itself. The folder which holds all infrastructure modules is `./web-api/terraform/modules/`. You will never run a `terraform apply` inside of the modules directory as it is only meant to be a blueprint.

### Live Infrastructure (./web-api/terraform/applyables)
The applyables folder is aptly named because it is where you will run a `terraform apply` as its responsibility is to instantiate all of the terraform modules/blueprints. The applyables folder is responsible for creating all of the infrastructure and composing all of the modules into what is required for an environment. For example all environments rely on resources to be created, so there is a terraform applyable for all account-specific resources. Inside the account-specific terraform it instantiates modules for things like ci_cd permissions, route53 zones, and kibana logging. There are multiple folders for deploying an environment with the first being `allColors` which is responsible for creating resources that both blue/green utilizes like s3 documents bucket, cognito, certificates. 

It is important to know that the applyables/ folder should NEVER be contain any terraform resources, only terraform modules. It is the responsibility of the `modules/` folder to describe all terraform resources and it is the responsibility of the `applyables/` folder to compose those modules together.

## Infrastructure Order/Dependencies
Our infrastructure is set to be deployed in the below order:

`account-specific -> allColors -> green`

This means account-specific will run first, allColors second, and individual color third. This order will never change as each step relies on resources the previous created. For example in order for green to deploy it will need cognito to have been deployed first by allColors, and in order for allColors to deploy, it will need a route53 zone to have been deployed by account-specific. It is always okay for later steps to depend on infrastructure created by previous steps, however it is not okay for previous steps to rely on infrastructure in later steps. If account-specific relies on green deploy to run first and green relies on account-specific to run first then there is a chicken-egg problem.

## Blue/Green

All resources that are duplicated in both blue and green should be instantiated in the `applyables/blue/` and `applyables/green` folder. Folder structure is very important in terraform and we have separated our blue/green resources into their own deployments so that the deployment or changes to one color does not affect the other color. If you are refactoring an API that is duplicated across blue/green you should feel safe to make infrastructure changes as it will not affect the active color.

## How To Guides

## Account Specific Terraform
If you make changes to the account specific terraform you will need to manually run an account specific deploy as the account specific deploy is not automated as part of our CI/CD process.

To run an account specific deploy:
1. Use the environment switcher to point to an environment in the account you would like to deploy the changes to.
2. Run the following command:
```
npm run deploy:account-specific
```

## Manually Unlock the State File

Cancelling a Terraform run before it completes often results in a locked state file. First, double-check that no other person or process is currently applying changes - verify that the state file is _wrongfully_ locked, not _intentionally_ locked.

1. Determine which terraform failed (e.g web-api, web-client, environment).
2. Switch to the correct environment using your AWS creds.
3. Switch to the correct terraform version (example: `tfswitch 1.4.5`).
4. Navigate to `main` directory of the deployed terraform at fault (example `web-api/terraform/main`).
5. Edit the deploy-app.sh by commenting out both the terraform `plan` and `apply` commands (not `terraform init`).
```
# terraform plan -out execution-plan
# terraform apply -auto-approve execution-plan
```
6. Start up Docker Desktop if you don't have it running already.
7. Set up terraform for the specific environment in question by running the deploy-app.sh script (this will eventually run the `terraform init` command)  (example: `../bin/deploy-app.sh "$ENV"`). 
8. Determine the lock ID that needs to be unlocked (lockID).
9. Force unlock the state file by running `terraform force-unlock ${lockID}` - see the [Terraform documentation](https://www.terraform.io/cli/commands/force-unlock).
10. Uncomment the `terraform plan` and `apply` commands.

## Resources

[Guide on creating scalable terraform](https://blog.gruntwork.io/an-introduction-to-terraform-f17df9c6d180)