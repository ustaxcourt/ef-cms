# Terraform tips & tricks

Terraform is a tool which represents your infrastructure (AWS services) as code. You can think of it as a little robot that uses the AWS console for you in a repeatable, automatic way. 🤖

It supports many cloud services, including AWS, through providers. You can read more about providers and see a list of supported clouds in the [Terraform documentation for providers](https://www.terraform.io/docs/providers/index.html).

- For your little Terraform robot to work correctly, it needs to be run from a particular directory — from a folder which has a `main.tf`.

- Terraform is very specific about version numbers. It will automatically update versions forward, but will not run against files which have been managed by a newer version. So, if one person updates terraform, everyone has to update terraform. You may want to use [tfswitch](https://warrensbox.github.io/terraform-switcher/) to manage switching between installed Terraform versions. See [fixing version errors](#Fixing-version-errors) below for additional help.

- It also needs access to a state file — more on that below!

## Understanding Terraform state files

Terraform is a **declarative programming language**. You don’t describe how to create, update, or destroy infrastructure — instead, you program how things should exist, and Terraform figures out how to make it happen.

When Terraform is comparing your infrastructure, it needs to be able to map the things you’ve described in your code to the infrastructure that exists in AWS. Some of these are obvious — things that have well-known names — but some of them have no known identifiers. Terraform keeps track of the mapping from your code to infrastructure in a **state file**. A state file is a JSON file.

To determine what needs to be created, updated, or removed, Terraform examines:

- The code in all `*.tf` files in the current directory. This indicates the end-state — what you’re trying to do.

- The state file from previous Terraform runs. This lets Terraform know where to look for your infrastructure.

- The infrastructure that exists, by running API queries. This indicates what exists, and is compared against where you’re trying to go.

### How Terraform knows what to do

When comparing your code and infrastructure, Terraform follows these rules:

- If a piece of infrastructure is **in the state file but isn’t in your code**, Terraform knows you intend to delete that item.

- If a piece of infrastructure is **in your code but not in the state file**, Terraform knows you intend to create that item.

- If a piece of infrastructure **has properties that don’t match** between your code and the result of API queries, Terraform knows you intend to update that item.

Knowing these rules, you can manipulate the state file if needed to add or remove items without creating or destroying them. See [Adding infrastructure without creating it](#Adding-infrastructure-without-creating-it) and [Removing infrastructure without destroying it](#Removing-infrastructure-without-destroying-it) below.

### State backend

Since state files need to be saved across Terraform runs, they need to be stored somewhere accessible — like an S3 bucket. You can read more about how state files are stored in the [Terraform documentation for the S3 backend](https://www.terraform.io/docs/backends/types/s3.html).

### State locking

As you may imagine, two people modifying things at the same time can lead to unpredictable results. Terraform handles this by using DynamoDB to lock the state file while you are modifying it.

Under normal circumstances, you won’t notice this happening. However, if you cancel a terraform run, the lock won’t be released — and you’ll need to [Manually unlock the state file](#Manually-unlock-the-state-file).

## Stages of a Terraform run

Terraform has three main stages — `init`, `plan`, and `apply`.

| Stage | Description |
|-------|-------------|
| `init` | Installs providers and configures state files to point to the appropriate backend.
| `plan` | Compares the infrastructure code, state files, and current infrastructure to figure out what additions, modifications, and deletions are needed — without making any changes.
| `apply` | Modifies infrastructure, either by first automatically calculating a plan, or by using the plan passed to it from `terraform plan`.

## Passing variables to Terraform

Terraform allows input variables, set when running `terraform plan` or `terraform apply`, to be used to control infrastructure. We use input variables for things like domain names and environment names.

Input variables are declared in any Terraform file, but are typically declared in `variables.tf`. Input variables can be set in a few ways — most commonly through the command line or environment variables. See the [Terraform documentation on input variables](https://www.terraform.io/docs/configuration/variables.html) for more information.

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

Generally, it’s good practice to check the Terraform plan when you’re not feeling confident — it’ll help calm your fears or justify them!

Here are a few debugging tricks to help with commonly encountered situations.

### Manually unlock the state file

Cancelling a terraform run before it completes often results in a locked state file. First, double-check that no other person or process is currently applying changes — verify that the state file is _wrongfully_ locked, not _intentionally_ locked.

Then, use `terraform force-unlock` — see the [Terraform documentation](https://www.terraform.io/docs/commands/force-unlock.html).

### Fixing version errors

As mentioned, Terraform requires versions to exactly match across Terraform runs. It will silently upgrade state files to the current version but fail to run if the state file has a newer version than the current version of Terraform.

Use a tool like [tfswitch](https://warrensbox.github.io/terraform-switcher/) to help you manage Terraform versions and avoid this problem in the future.

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

Each type of infrastructure has a different specific syntax for importing items — but all of them use `terraform import`. See the general [Terraform import documentation](https://www.terraform.io/docs/import/usage.html) and then look at the Terraform documentation for the specific kind of infrastructure you’re trying to import for the specific syntax for that item.

### Removing infrastructure without destroying it

Sometimes you may want to remove items from the Terraform code but not remove them from AWS. For those circumstances, you’ll want to remove it from Terraform’s state file and from the code.

To remove items from Terraform’s state file, run `terraform state rm` — see the [Terraform documentation](https://www.terraform.io/docs/commands/state/rm.html).
