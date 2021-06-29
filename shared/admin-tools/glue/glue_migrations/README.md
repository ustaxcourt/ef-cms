# ETL Glue Job for ef-cms DynamoDB table

This directory contains Terraform to install an AWSL Glue job to migrate a DynamoDB table from one account (source) to another (destination). Before running the Terraform to install these resources, you must first setup a role in the destination account that allows the source account to write to its DynamoDB tables. Terraform code to do this is in the `remote_role` directory.

## To Use

Initialize the Terraform backend with the bash script `./bin/deploy-init.sh`. Set the environmental variable `ZONE_NAME` to the appropriate value such as `ef-cms.ustaxcourt.gov` that corresponds to the S3 bucket holding the project's state files. Run the script from this directory passing the environment as an argument:

`./bin/deploy-init.sh mig`

Run `terraform [plan|apply]` to install the resources necessary to create the Glue job. Terraform will expect variables for

`source_table`: the name of the DynamoDB table in the source account to read data from  
`destination_table`: the name of the DynamoDB table in the destination account to write transformed data to  
`external_role_arn`: the ARN of the role in the *destination account* that the Glue script can assume to acquire write privileges.

For example:

`terraform plan  -var 'source_table=efcms-prod-alpha' -var 'destination_table=efcms-mig-beta' -var 'external_role_arn=arn:aws:iam::350455059537:role/efcms_remote_user_780456054515'`

Once installed you can confirm the job, ETL python script, and passed-in parameters in the AWS console.
