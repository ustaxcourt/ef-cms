# Interacting with Deployed DAWSON Environments

## Getting Started

1. Create a `defaults` configuration file:
    ```
   cp scripts/env/defaults-example scripts/env/defaults
   ```
1. Open the new file and populate it with values that make sense for you.
1. Create a configuration file for the AWS account to which this deployed environment belongs:
    ```
    cp scripts/env/aws-accounts/example.env scripts/env/aws-accounts/myaccount.env
    ```
1. Open the new file and populate your AWS account details and credentials.
1. Create a configuration file for the DAWSON environment:
    ```
    cp scripts/env/environments/example.env scripts/env/environments/myenv.env
    ```
1. Open the new file and populate your DAWSON environment name and AWS account configuration filename.
1. (Optional) Define any additional values used for local testing.
1. Create a configuration file for local development:
    ```
   cp scripts/env/environments/local-example.env scripts/env/environments/local.env
   ```
1. (Optional) Open the new file and define any variables you use for local development.

## Usage

To switch to a deployed environment:
```
source scripts/env/set-env.zsh myenv
```

To unset all environment variables set by `set-env.sh`:
```
source scripts/env/unset-env.zsh
```

## Examples

### Run cypress tests against `myenv`

```
source scripts/env/set-env.zsh myenv
npm run cypress:smoketests:open
```

### Impersonate a different user in `myenv`

First configure your user's `$COGNITO_USER_ID` and `$COGNITO_USER_EMAIL` in your `myenv.env` file, then run:
```
source scripts/env/set-env.zsh myenv
npm run admin:lookup-user -- admissionsClerk "John Doe"
npm run admin:become-user 00000000-aaaa-bbbb-cccc-999999999999
```
Log in to DAWSON with your credentials. When you're done impersonating, run this to go back to yourself:
```
npm run admin:become-user "$COGNITO_USER_ID"
```

### Re-serve documents to the IRS superuser

```
source scripts/env/set-env.zsh myenv
node shared/admin-tools/email/resend-service-email-to-irs-superuser.js "2022-09-07T14:18:00.000Z" "2022-09-07T15:04:00.000Z"
```

### Run environment-level terraform deployment

```
source scripts/env/set-env.zsh myenv
cd web-api/terraform/main
../bin/deploy-app.sh
```

## (Optional) Quality of Life Improvements

### Wrapper in `bin`

To invoke the environment switcher more quickly, create a wrapper in your private `bin` directory, which for ZSH is usually `$HOME/.local/bin`.

First, add this to your `.zshrc`:
```
if [ -d "$HOME/.local/bin" ]; then
        path+=("$HOME/.local/bin")
fi
```
Then create the directory, if necessary:
```
mkdir -p "$HOME/.local/bin"
```
Then create an executable `$HOME/.local/bin/dawson_env` file and populate it with the following:
```
#!/bin/zsh

cd "$HOME/path/to/ef-cms"
source ./scripts/env/defaults
env="${1:-$DEFAULT_ENV}"
source ./scripts/env/set-env.zsh "$env"
```
Then to use the wrapper, simply run:
```
. dawson_env myenv
```

### Retrieve a new AWS session token and populate it in `myaccount.env` automatically

First, define this function in your `.zshrc` or aliases file:
```
function renew_aws_session_token() {
    account=${1-"myaccount"}
    cd "$HOME/path/to/ef-cms"
    if [[ -f "./scripts/env/aws-accounts/${account}.env" ]]; then
        source "./scripts/env/aws-accounts/${account}.env"
        if [[ ! -z "$AWS_ACCOUNT_ID" ]] && [[ ! -z "$AWS_SECRET_ACCESS_KEY" ]]; then
            AWS_SESSION_TOKEN=$(aws sts get-session-token --duration-seconds 86400 --output json | jq -r ".Credentials.SessionToken")
            sed -i '' "/AWS_SESSION_TOKEN/s/.*/export AWS_SESSION_TOKEN='$AWS_SESSION_TOKEN'/" "scripts/env/aws-accounts/${account}.env"
            export AWS_SESSION_TOKEN="$AWS_SESSION_TOKEN"
        fi
    fi
}
```
Then to use the function, simply run:
```
renew_aws_session_token
```
or:
```
renew_aws_session_token myotheraccount
```
