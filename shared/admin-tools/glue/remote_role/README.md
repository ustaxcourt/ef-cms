# Role to allow remote writing

In order to migrate data across accounts, the destination account must have a role with a trust relationship with the source account. This role should have policies that define which actions the source account may take in the destination account.

The terraform in this folder will create a role that allows reading/writing/updating on DynamoDB tables. This terraform should be run in the *destination* account.

## Initialize Terraform

The `bin` folder has a bash script that will setup the terraform backend to use the appropriate s3 bucket and DynamoDB table. To use, set the environmental variable `ZONE_NAME` to the appropriate value such as `ef-cms.ustaxcourt.gov`. Run the script from this directory passing the environment as an argument:

`./bin/deploy-init.sh mig`

## Terraform Plan / Apply:  variables:

**aws_region (optional - defaults to us-east-1):**  
AWS region

**remote_account_number:**  
The 12-digit source account number (https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)

These may be passed in as environmental variables or via the command line, for example:

`terraform plan  -var 'remote_account_number=140455059536'`

This will output the ARN of the role which will be needed by the glue job run in the source environment.
