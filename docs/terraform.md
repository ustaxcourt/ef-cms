# Terraform

Terraform is an infrastructure of code tool which we use to deploy our application to AWS.  This section's goal is to document our specific use of terraform in our project and how we use it to deploy our application.  We will start by explaining how and why we use terraform in Dawson, and later you can get a more detailed understanding of terraform after we have explained how terraform is setup in our project.

!> Before you run terraform locally, make sure you have the correct environment variables setup to match our Circle CI environment variables for your environment.  If you run terraform with incorrect environment variables, you can easily break the environment or find yourself waiting 40 minutes for terraform to scale up or down elasticsearch.

## DAWSON's Terraform

Before we talk about the intricacies of terraform and how it works, we thought it would be useful to first explain how the terraform code is setup in our project.  

Terraform code in Dawson is separated into different directories to help reduce coupling between our UI, API, etc.  A terraform directory must be deployed separately; this allows us to easily make updates to the UI related terraform changes without needing to re-deploy the API terraform directory.  Our project currently has a couple of terraform directories that are used for setup our infrastructure:

- `./web-api/terraform/` (Terraform for the API, Dynamo, Backend, etc)
- `./web-client/terraform/` (For the UI, CloudFront, etc)
- `./iam/terraform/environment-specific` (For environment-specific IAM roles) 
- `./iam/terraform/account-specific` (For account-specific IAM roles) 
- `./web-api/workflow-terraform/migration` (For the migration setup)
- `./web-api/workflow-terraform/migration-cron` (For the migration cron setup)
- `./web-api/workflow-terraform/reindex-cron` (For the reindex cron setup)
- `./web-api/workflow-terraform/switch-colors-cron` (For the color switch cron setup)

and each of these directories are deployed via the following npm scripts:

- `npm run deploy:api exp1` (runs terraform in `./web-api/terraform/`)
- `npm run deploy:ui exp1` (runs terraform in `./web-client/terraform/`)
- `npm run deploy:environment-specific exp1` (runs terraform in `./iam/terraform/environment-specific/`)
- `npm run deploy:account-specific` (runs terraform in `./iam/terraform/account-specific/`)
- `npm run deploy:migration` (runs terraform in `./web-api/workflow-terraform/migration/`)
- `npm run deploy:migration-cron` (runs terraform in `./web-api/workflow-terraform/migration-cron/`)
- `npm run deploy:reindex-cron` (runs terraform in `./web-api/workflow-terraform/reindex-cron/`)
- `npm run deploy:switch-colors-cron` (runs terraform in `./web-api/workflow-terraform/switch-colors-cron/`)

These various terraform deployment will be explained in detail later in the following sections, but for right now we should note that our terraform directories extend a common directory / file structure:

```
├── bin
│   ├── create-bucket.sh // utility script used for creating the terraform s3 bucket if it doesn't already exist
│   ├── create-dynamodb.sh // utility script used for creating the terraform dynamodb table if it doesn't already exist
│   ├── deploy-app.sh // utility script used for deploying the terraform code to AWS
│   ├── deploy-init.sh // utility script used for initializing the terraform code to AWS
│   ├── destroy-app.sh // utility script used for destroying the terraform code from AWS
├── main
│   ├── main.tf // the main entry point of the terraform directory
│   ├── outputs.tf // a definition of all outputs of this terraform directory
│   ├── variables.tf // a definition of all variables of this terraform directory
```

The `variables.tf` file is used to define the arguments needed to run terraform in order to successfully deploy the application.  These variables are then accessible to other sibling `.tf` files and can be referenced via `var.my_variable_name`, or interpolated in strings using `"testing-${var.my_variable_name}"`.  

The `outputs.tf` is useful to understand because we often define certain outputs from modules that are pass around throughout the terraform code.  For example, assume the `outputs.tf` contains the following code:

```
# outputs.tf
output "puppeteer_layer_arn" {
  value = aws_lambda_layer_version.puppeteer_layer.arn
}
```

This means we are able to access the output from outside that terraform module, like so:

```
module.my_module.puppeteer_layer_arn
```

The `main.tf` usually just contains definitions for the `providers` and `terraform` setup.  

> every .tf file inside a directory is considered part of the same module, so they all have access to the same resources and variables defined in sibling .tf files.


### Web Api Terraform

The `./web-api/terraform` directory contains definitions for all of our aws resources associated with the web api, including elasticsearch, dynamo, the s3 bucket where we save documents, the lambdas where our code runs, etc.  This is by far the most complex terraform directory we have in Dawson.  All terraform directories in this This directory contains an entry point `main` directory which has multiple `.tf` files that define the infrastructure for the web api.  If you want to run the terraform code locally, there is an npm script setup called `npm run deploy:web-api $ENV`, where $ENV would be the environment you want terraform to deploy.

!> note, you'll need more env variables set to correct run this deploy.

We try to split up our terraform files by type, so each file usually related to the type of resource that is being created in AWS.  For example, a file named `./api-async.tf` contains definitions related to our async endpoints, or `./elasticsearch.tf` contains definitions for our elasticsearch clusters.  Since there are too many .tf files to explain in detail, the follow structure contains the main directories you want to understand.

```
.
├── api // a module containing all the resources needed for our api, including API Gateway, Lambda Functions, Lambda Layers, etc.  
│   ├── variables.tf
│   ├── outputs.tf
├── bin // useful scripts for running terraform commands
├── main // the entry point of terraform
└── template // all of the remaining resources needed for the web-api, including elasticsearch, dynamo, s3 bucket, etc.
    ├── dynamo-table // module for the dynamodb tables
    ├── elasticsearch // module for the elasticsearch clusters
    ├── lambdas // module for all the lambdas
```

Our main.tf calls the template module, and that template module will further use additional modules for deploying our AWS resources.  For example, if you look at the `./web-api/terraform/main` directory, you will see a `main.tf` which invokes another **module** named `template` and passes in some variables using the following code:

```
module "ef-cms_apis" {
  source                     = "../template/"
  ... // omitted for brevity
}
```

We do this a few places, so try to understand all we are really doing is calling this module to run the code in another module while passing in some variables.


### Web Client Terraform

The `./web-client/terraform` directory contains definitions for all of our aws resources associated with the web client, including cloudfront, s3 bucket for holding the compiled web assets, ec2 instance to host dynamsoft, etc.  

This follows the same pattern we did for the web-api.  The script for deploying the UI related infrastructure is `npm run deploy:ui $ENV`, where `$ENV` is the environment you want terraform to deploy.

Let's take a look at the directory structure to understand what we are doing:

```
├── bin
│   ├── ... same scripts as web-api, but with tweak for support different variables
├── common
│   ├── cloudfront-edge // contains lambdas used for attaching headers to the files served from CloudFront
│   ├── frontend-public-www-redirect.tf // used for redirecting requests
│   ├── header-security-lambda.tf // the lambda used to add security headers to the web client
│   ├── main.tf // the main entry point of the terraform module
│   ├── strip-basepath-lambda.tf // a lambda used in cloudfront to remove a basepath
├── dynamsoft
│   ├── dynamsoft.tf // code for deploying the dynamsoft instance to an EC2 server
├── main
│   ├── main.tf // main entry file
│   ├── setup_dynamsoft.sh // script for bootstrapping the ec2 instance
└── ui // module for setting up the CloudFront and S3 buckets hosting the UI
    ├── frontend-public.tf // code for the public UI
    ├── frontend.tf // code for the private UI
```

At this point, if you have a decent understanding of how the web-api terraform directory was setup, this web-client directory should be easier to understand.  All in all, this terraform deployment is responsible for deploying and managing the following AWS resources:

- CloudFront for hosting our files on a CDN
- S3 buckets for hosting our compiled public and private react app
- EC2 instance for hosting the dynamsoft software
- Lambdas for attaching headers to the files served from CloudFront
- Lambdas for stripping the basepath from the files served from CloudFront
- Route53 URLs to point domains to CloudFront
- Certificates for the Route53 URLs

### Environment Specific Terraform

The `./iam/terraform/environment-specific` directory contains the definitions used for creating the roles and policies needed for our deployed application to AWS, hence the reason it is nested in an `iam` directory.  IAM is the AWS tool used for managing permissions on AWS.  

Due to a security requirement by the court, no AWS roles or policies were allowed to be created or modified in our CI/CD process.  Due to this, we were required to separate our policies into a isolated terraform directory which an administrator can manually deploy when permissions need to be changed.

This terraform setup contains all roles and permissions related to a specific environment.  For example, when we deploy the api terraform, it will create lambdas which will require access to various resources, such as S3 and Dynamo.  This environment specific terraform will create the `lambda_role` and `lambda_policy` necessary for that lambda to be able to execute without permission errors.

Sometimes you need to add new permissions to our AWS resources.  If you are unfamiliar with IAM, it boils down to attaching strings such as `logs:CreateLogGroup`, where `logs` is the aws service, and `CreateLogGroup` is the action on that service:

Below is an example of an IAM Statement used to allow a lambda to create log groups and streams, and also put events onto those streams.  The `Resource` property can be used to specify which AWS resource this permission should be allowed to access.  We usually just use Allow in our `Effect` property, but you can also specifically `Deny` access to resources if needed.  The `Action` property defined which action we are allowing.

```
{
    "Effect": "Allow",
    "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
    ],
    "Resource": [
        "arn:aws:logs:*:*:*"
    ]
},
```

!> When adding new permissions, try to keep them as granular as possible and avoid the use of *.  It's easier said than done, but try to grant permissions for exactly what you need.

Here is an overview of the files associated with this terraform directory:

```
├── bin
│   ├── ... same scripts as web-api, but with tweak for support different variables
└── main
    ├── api-gateway-authorizer.tf // code for creating the api authorizer
    ├── cognito-authorizer.tf // permissions related to cognito authorizer
    ├── header-security.tf // permissions related to header security
    ├── lambda.tf // permissions related to all our lambdas (they share permissions)
    ├── main.tf // main entry file
    ├── migration.tf // permissions related to migration
    ├── public-api-authorizer.tf // permissions related to public api authorizer
    ├── s3-replication.tf // permissions related to s3 replication
    ├── strip-basepath.tf // permissions related to strip basepath
    ├── update-petitioner-cases-lambda-role.tf // permissions related to update petitioner cases lambda role
```

?> If you ever find yourself running into permissions errors on AWS after you've deployed your application, you probably just need to add permissions to one of these files and re-run terraform.

### Account Specific Terraform


The `./iam/terraform/account-specific` is very similar to the `environment-specific` terraform in regards to it is mainly used for creating and managing permissions.  We also use this terraform to deploy our logs elasticsearch cluster and some other resources that might be shared between environments or used specifically by circleci, such as ECR.

> If the resource you are trying to add is shared between environments or isn't specific to an environment, it probably belongs as an account-specific definition.


Here is a preview of the account-specific terraform directory and the purpose of some of these files:

```
.
├── bin
│   ├── ... same scripts as web-api, but with tweak for support different variables
└── main
    ├── api-gateway-cloud-watch.tf 
    ├── circle-ci.tf // all permissions needed for circle ci
    ├── cognito.tf // the cognito account to secure the kibana logs
    ├── dynamsoft.tf // configuration for an s3 bucket that contains the dynamsoft software
    ├── ecr.tf // contains all the built docker images needed for CI/CD
    ├── elasticsearch.tf // the elasticsearch cluster used for logs
    ├── lambda-edge-role.tf
    ├── lambda-es-role.tf
    ├── lambda-logs-to-elasticsearch.tf // the lambda used to send logs to elasticsearch
    ├── main.tf // main entry file
    ├── regional-log-subscription-filters // the log subscription filters used for the elasticsearch cluster
    ├── route-53.tf 
    ├── system-health-alarms.tf
```

### Migration Terraform

The `./web-api/workflow-terraform/migration` directory contains the definitions for setting up the migration code necessary to run the blue-green migration.  

To understand this terraform directory you need to understand how the blue-green migration works.  First, we deploy a lambda which we call `migration-segments` which is used for processing a small `segment` of the dynamodb table.  This segment will process each record and modify the record if needed via our migration scripts which can be located at `web-api/workflow-terraform/migration/main/lambdas/migrations`.  Additionally, we also deploy a `migration` lambda which runs on records when user modifies the old dynamodb table.  We sometimes call this the `live migration process`.  This allows us to potentially keep the system online and working while a migration is running.  After we've finished setting up the migration infrastructure, we will run a script which will publish a bunch of events to an SQS queue which will be consumed by the `migration-segments` lambda.


Here is an outline of what some of these files do at a high level:

```
.
├── bin
│   ├── ... same scripts as web-api, but with tweak for support different variables
└── main
    ├── lambdas
    │   ├── migration-segments.js // the lambda used to process the dynamo segments
    │   ├── migration.js // the live migration process
    │   ├── migrations // contains all the migration scripts used for processing the dynamodb items
    │   ├── migrationsToRun.ts // a list of all the migration scripts we want to run
    │   ├── utilities.js // contains all the utility functions used by the migration scripts
    ├── main.tf // main entry file
    ├── migration-segments.tf // the resources needed for the migration-segments lambda
    ├── migration.tf // the resources needed for the live migration process
    ├── sqs.tf // all sqs queues used for this migration process
```

### Migration Cron Terraform


The `./web-api/workflow-terraform/migration-cron` directory contains the definitions for setting up a cron lambda which runs every minute to check if a migration is done running on an envrionment.  To understand the purpose of this terraform directory, we need some background information about our blue-green migrations.

As we are working on stories and bugs, we often need to do what we call a blue-green migration which is a Dawson process for migrating our data from one source dynamodb table (alpha/beta) to another destination table while modifying the records as they are passed over.  Additionally, we need a fresh elasticsearch cluster to be re-indexed via our `streams` lambda while this data is being migrated over to the destination dynamodb table.  This entire process can take up to 5 hours.

Since we wanted to fully automate our CI/CD process, we had to figure out a way to circumvent Circle CI's execution time limits.  CircleCI provides a way to `pause` a build and later `confirm` it via a REST api call.  This is the purpose of the migration cron terraform.  It deploys a lambda which will query elasticsearch every minute to check if the clusters are fully done reindexing.  When that process is done, it will tell CirlceCI to continue the build.

This terraform directory is the easiest to understand, and contains only a handful of files needed to deploy this lambda and setup a cloudwatch alarm.

```
.
├── bin
│   ├── ... same scripts as web-api, but with tweak for support different variables
└── main
    ├── lambdas
    │   ├── reindex-status.js // the lambda code which queries elasticsearch
    ├── main.tf // entry point for the terraform module
    ├── reindex-status.tf // deploys the lambda and sets up a cloudwatch event to invoke the lambda every minute
```

# Terraform Overview

Terraform is a tool which represents infrastructure (AWS services) as code. You can think of it as a little robot that uses the AWS console for you in a repeatable, automatic manner. 🤖

It supports many cloud services, including AWS, through providers. You can read more about providers and see a list of supported clouds in the [Terraform documentation for providers](https://www.terraform.io/docs/providers/index.html).

- For your little Terraform robot to work correctly, it needs to be run from a particular directory - from a folder which has a `main.tf`.

- Terraform is very specific about version numbers. It will automatically update versions forward, but will not run against files which have been managed by a newer version. So, if one person updates Terraform, everyone has to update Terraform. You may want to use [tfenv](https://github.com/tfutils/tfenv) to manage switching between installed Terraform versions. See [fixing version errors](#Fixing-version-errors) below for additional help.

- It also needs access to a state file - more on that below!

## Terraform State Files

Terraform is a **declarative programming language**. You don’t describe how to create, update, or destroy infrastructure - instead, you program how things should exist, and Terraform figures out how to make it happen.

When Terraform is preparing your infrastructure, it needs to be able to map the things you’ve described in your code to the infrastructure that exists in AWS. Some of these are obvious - things that have well-known names - but some of them have no known identifiers. Terraform keeps track of the mapping from your code to infrastructure in a JSON **state file**.

To determine what needs to be created, updated, or removed, Terraform examines:

- The code in all `*.tf` files in the current directory. This indicates the end-state - what you’re trying to do.

- The state file from previous Terraform runs. This lets Terraform know where to look for your infrastructure.

- The infrastructure that exists, by running API queries. This indicates what exists, and is compared against where you’re trying to go.

### How Terraform knows what to do

When comparing your code and infrastructure, Terraform follows these rules:

- If a piece of infrastructure is **in the state file but isn’t in your code**, Terraform knows you intend to delete that item.

- If a piece of infrastructure is **in your code but not in the state file**, Terraform knows you intend to create that item.

- If a piece of infrastructure **has properties that don’t match** between your code and the result of API queries, Terraform knows you intend to update that item.

Knowing these rules, you can manipulate the state file if needed to add or remove items without creating or destroying them. See [Adding infrastructure without creating it](#Adding-infrastructure-without-creating-it) and [Removing infrastructure without destroying it](#Removing-infrastructure-without-destroying-it) below.

### State Backend

Since state files need to be saved across Terraform runs, they need to be stored somewhere accessible - like an S3 bucket. You can read more about how state files are stored in the [Terraform documentation for the S3 backend](https://www.terraform.io/docs/backends/types/s3.html).

The Dawson project stores terraform state in the following S3 bucket: [ustc-case-mgmt.flexion.us.terraform.deploys](https://s3.console.aws.amazon.com/s3/buckets/ustc-case-mgmt.flexion.us.terraform.deploys?region=us-east-1&tab=objects).  Each environment has a separate `.tfstate` file.  For example, our dev environment has the following state files:

- `documents-dev.tfstate` (infrastructure related to the API / Backend)
- `migrations-cron-dev.tfstate` (infrastructure related to the migration cron script)
- `migrations-dev.tfstate` (infrastructure related to the migrations)
- `permissions-dev.tfstate` (infrastructure related to environment-specific permissions)
- `ui-dev.tfstate` (infrastructure related to the UI)

### State Locking

As you may imagine, two people modifying things at the same time can lead to unpredictable results. Terraform handles this by using DynamoDB to lock the state file while you are modifying it.

Under normal circumstances, you won’t notice this happening. However, if you cancel a Terraform run, the lock won’t be released - and you’ll need to [manually unlock the state file](#Manually-unlock-the-state-file).

## Stages of a Terraform Run

Terraform has three main stages - `init`, `plan`, and `apply`.

| Stage    | Description                                                                                                                                                                   |
|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `init`   | Installs providers and configures state files to point to the appropriate backend.                                                                                            |
| `plan`   | Compares the infrastructure code, state files, and current infrastructure to figure out what additions, modifications, and deletions are needed - without making any changes. |
| `apply`  | Modifies infrastructure, either by first automatically calculating a plan, or by using the plan passed to it from `terraform plan`.                                           |

## Passing Variables to Terraform

Terraform allows input variables, set when running `terraform plan` or `terraform apply`, to be used to control infrastructure. We use input variables for things like domain and environment names.

Input variables are declared in any Terraform file, but are typically declared in `variables.tf`. Input variables can be set in a few ways - most commonly through the command line or environment variables. See the [Terraform documentation on input variables](https://www.terraform.io/docs/configuration/variables.html) for more information.

- To set variables from the command line, pass them as command line arguments:

  ```bash
  -var "name=value"
  ```

- To set variables from environment variables, the environment variable must start with `TF_VAR_`:

  ```bash
  export TF_VAR_name=value
  ```

  Terraform will ignore all environment variables that do not start with `TF_VAR_`.

## Getting yourself out of sticky situations

Generally, it’s good practice to check the Terraform plan when you’re not feeling confident - it’ll help calm your fears or justify them!

Here are a few debugging tricks to help with commonly encountered situations.

### Manually Unlock the State File

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

### Fixing Version Errors

As mentioned, Terraform requires versions to exactly match across Terraform runs. It will silently upgrade state files to the current version but fail to run if the state file has a newer version than the current version of Terraform.

Use a tool like [tfenv](https://github.com/tfutils/tfenv) to help you manage Terraform versions and avoid this problem in the future.

If a state file is off by a patch version (the third digit of the version number), you _most likely_ will be able to downgrade it if absolutely needed.

Downgrading state file versions is not supported, and requires manually editing Terraform’s state file. It is not recommended, and if you choose to continue, store backups of everything changed to revert if needed.

- First, you’ll need to download the state file. Log in to the AWS S3 console and download the state file from the backend bucket.

- Store a backup.

- Open this file in an editor (it’s a JSON document) and change the Terraform version listed near the top of the file.

- Save and upload this file to the S3 bucket.

- In DynamoDB, navigate to the Terraform backend state table. Backup the existing item that corresponds to the state file, and then remove it. This state table contains a hash key which will cause the Terraform run to fail if it is not removed, since you have just modified the state file.

- Ensure your Terraform version is the desired version, then run `terraform plan` to verify it worked successfully.

### Adding infrastructure without creating it

If a AWS infrastructure piece exists already before adding it to Terraform, you’ll need to `import` it to Terraform’s state file so Terraform doesn’t try to create it.

Each type of infrastructure has a different specific syntax for importing items - but all of them use `terraform import`. See the general [Terraform import documentation](https://www.terraform.io/cli/import/usage) and then look at the Terraform documentation for the specific kind of infrastructure you’re trying to import for the specific syntax for that item.

### Removing infrastructure without destroying it

Sometimes you may want to remove items from the Terraform code but not remove them from AWS. For those circumstances, you’ll want to remove it from Terraform’s state file and from the code.

To remove items from Terraform’s state file, run `terraform state rm` - see the [Terraform documentation](https://www.terraform.io/cli/commands/state/rm).
