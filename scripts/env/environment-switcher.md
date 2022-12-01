# Interacting with Deployed DAWSON Environments

## Getting Started

1. Create a `defaults` configuration file:
    ```
   cp scripts/env/defaults-example scripts/env/defaults
   ```
1. Open the new file and populate it with values that make sense for you.
1. Create a configuration file for the AWS account to which this deployed environment belongs:
    ```
    cp scripts/env/aws-accounts/example.env scripts/env/aws-accounts/my-account.env
    ```
1. Open the new file and populate your AWS account details and credentials.
1. Create a configuration file for the DAWSON environment:
    ```
    cp scripts/env/environments/example.env scripts/env/environment/my-env.env
    ```
1. Open the new file and populate your DAWSON environment name and AWS account configuration filename.
1. (Optional) Define any additional values used for local testing.
1. Create a configuration file for local development:
    ```
   cp scripts/env/environments/local-example.env scripts/env/environment/local.env
   ```
1. (Optional) Open the new file and define any variables you use for local development.

## Usage

To switch to a deployed environment:
```
source scripts/env/set-env.zsh my-env
```

To unset all environment variables set by `set-env.sh`:
```
source scripts/env/unset-env.zsh
```

## Examples

### Run cypress tests against `my-env`

```
source scripts/env/set-env.zsh my-env
npm run cypress:smoketests:open
```

### Impersonate a different user in `my-env`

First configure your user's `$COGNITO_USER_ID` and `$COGNITO_USER_EMAIL` in your `my-env.env` file, then run:
```
source scripts/env/set-env.zsh my-env
npm run admin:lookup-user -- admissionsClerk "John Doe"
npm run admin:become-user 00000000-aaaa-bbbb-cccc-999999999999
```
Log in to DAWSON with your credentials. When you're done impersonating, run this to go back to yourself:
```
npm run admin:become-user "$COGNITO_USER_ID"
```

### Re-serve documents to the IRS superuser

```
source scripts/env/set-env.zsh my-env
node shared/admin-tools/email/resend-service-email-to-irs-superuser.js "2022-09-07T14:18:00.000Z" "2022-09-07T15:04:00.000Z"
```

### Run environment-level terraform deployment

```
source scripts/env/set-env.zsh my-env
cd web-api/terraform/main
../bin/deploy-app.sh
```
