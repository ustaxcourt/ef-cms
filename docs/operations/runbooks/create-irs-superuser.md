# Creating an IRS Superuser

## Description
This runbook describes the process of creating a new IRS superuser for the IRS to use in their eTCS or eCite applications.

## Preqrequisites
- AWS access to the account containing the deployed DAWSON environment for which you wish to generate an IRS superuser.
- The IRS superuser's email address.
- KiteWorks access, provided by the IRS, to securely provide the credentials.
- Install the `oath-toolkit` package from homebrew.

## Steps
1. Generate a new secure password for this IRS superuser.
   ```bash
   scripts/user/generate-new-password.ts
   ```
1. Edit the `.env` file for the deployed DAWSON environment in which you wish to generate the IRS superuser.
   1. Populate the `IRS_SUPERUSER_EMAIL` value with the actual IRS superuser email address
   2. Populate the `IRS_SUPERUSER_PASS` value with the password you just generated
   1. Refer to the [example](../../../scripts/env/environments/example.env) if you are not sure where to put these values.
1. Use the environment switcher to point your local session to the deployed DAWSON environment:
    ```bash
    . scripts/env/set-env.zsh myenv
    ```
1. Create a user in the deployed DAWSON environment's IRS Cognito pool:
    ```bash
    aws cognito-idp admin-create-user \
     --user-pool-id "$COGNITO_IRS_USER_POOL" \
     --username "$IRS_SUPERUSER_EMAIL" \
     --temporary-password "$IRS_SUPERUSER_PASS" \
     --user-attributes Name="name",Value="${IRS_SUPERUSER_EMAIL}" Name="custom:role",Value="irsSuperuser"
    ```
1. Follow the rest of the "Getting Started" instructions in [irs-super-user.md](../../additional-resources/irs-super-user.md), starting after the `aws cognito-idp` command that is very similar to the one you just ran.
1. After completing MFA enrollment and verification, create a new text file containing this IRS superuser's password and MFA secret.
1. Upload the text file containing the credentials to the provided KiteWorks directory and notify the IRS stakeholders.
1. Delete your local copy of the file and remove the credentials from the `.env` file that you edited earlier.
