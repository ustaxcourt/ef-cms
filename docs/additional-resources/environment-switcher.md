# Interacting with Deployed DAWSON Environments

## Getting Started

Before you start, you should have an SSO Signin URL and know the region where your AWS Identity Center is hosted. We use the AWS Identity Center for authentication and granting access with short lived credentials. Contact your Sysadmin to ascertain this information. You should be able to login and authenticate with this URL.

### Configuring AWS SSO

1. Configure AWS SSO:
    ```
    aws configure sso
    ```
1. Give the session a name:
    ```
    SSO session name (Recommended): ustc-sso
    ```
1. Enter your SSO start URL and SSO region (contact your Sysadmin for this information):
    ```
    SSO start URL [None]: https://example.com
    SSO region [None]: us-something-1
    ```
1. Accept the default for SSO registration scopes:
    ```
    SSO registration scopes [sso:account:access]:
    ```
1. The process will spawn a browser session to authenticate you (if you're not already) via the AWS Identity Center. After authenticating, click "Allow" to proceed. 
1. Your terminal window will now prompt you to choose an account from those available to you. Select the one to use with `efcms` (DAWSON). 
1. Enter `us-east-1` for the default client Region:
    ```
    CLI default client Region [None]: us-east-1
    ```
1. Accept the default output format:
    ```
    CLI default output format [None]:
    ```
1. Enter a CLI profile name. (e.g., `ustc-staging` for working with the environments in the USTC Staging account). Keep track of this value, as it will be required when setting up your environment files later. 
    ```
    CLI profile name [*****]: ustc-staging
    ```

### Default Setup

1. Create a `defaults` configuration file:
    ```
   cp scripts/env/defaults-example scripts/env/defaults
   ```
1. Open the new file and populate it with values that make sense for you.

### Environment Setup

For each deployed environment you wish to manage, you will need to create a `.env` file that corresponds with the environment. 

1. Create a configuration file for the DAWSON environment:
    ```
    cp scripts/env/environments/example.env scripts/env/environments/myenv.env
    ```
1. Open the new file and update your environment variables
    - Populate your DAWSON environment name (`ENV`) (e.g., `test`). 
    - Set `AWS_PROFILE` to the **CLI profile name** from your SSO configuration.
    - Set the `AWS_ACCOUNT_ID` to where the environments are hosted. (e.g., if USTC, contact someone at USTC for this value)
1. (Optional) Define any additional values used for local testing.

### Local Environment Setup

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
npm run admin:lookup-user admissionsclerk "John Doe"
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

