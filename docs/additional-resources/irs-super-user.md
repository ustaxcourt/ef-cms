# Testing API v2 with the IRS Superuser

## Getting Started

You will only have to follow these steps once per environment. If you have already set up your IRS test user in the desired environment, proceed to [Generating an API Token for Your IRS Test User](#generating-an-api-token-for-your-irs-test-user).

1. Install the `oathtool` utility:
    ```bash
    brew install oath-toolkit
    ```
1. Setup the [environment switcher](./environment-switcher.md) with a `.env` file for the desired environment.
    1. Be sure to populate the `IRS_SUPERUSER_EMAIL` value like so:
        ```bash
        IRS_SUPERUSER_EMAIL="my.name+irs.su@dawson.example.com"
        ```
    1. Refer to the [example](../../scripts/env/environments/example.env) if you are not sure where to put this value.
1. Use the environment switcher to point your local session to the desired environment:
    ```bash
    . scripts/env/set-env.zsh myenv
    ```
1. Create a user in the desired environment's IRS Cognito pool:
    ```bash
    aws cognito-idp admin-create-user \
     --user-pool-id "$COGNITO_IRS_USER_POOL" \
     --username "$IRS_SUPERUSER_EMAIL" \
     --temporary-password "$DEFAULT_ACCOUNT_PASS" \
     --user-attributes Name="name",Value="${IRS_SUPERUSER_EMAIL}" Name="custom:role",Value="irsSuperuser"
    ```
1. Run the `irs-super-user.ts` script to enroll your IRS test user in MFA:
    ```bash
    npx ts-node --transpile-only scripts/irs-super-user.ts
    ```
1. Find your IRS test user's MFA secret in the script's output and use it to populate the `IRS_SUPERUSER_MFA_SECRET` value in the `.env` file you edited on step 2. Save the file before continuing.
1. In a separate shell session:
    1. Enter the `ef-cms` directory
    1. Point this shell session to the desired environment:
        ```bash
        . scripts/env/set-env.zsh myenv
        ```
    1. Use `oathtool` to generate your MFA code:
        ```bash
        oathtool -b --totp "$IRS_SUPERUSER_MFA_SECRET"
        ```
1. Back in the first shell session, enter the MFA code you just generated. This enrolls your test user in MFA.
1. You will now be asked for a second MFA code. Run `oathtool` again in the second shell session to generate the code, then paste it into the first session. This verifies the MFA enrollment.

## Generating an API Token for Your IRS Test User

1. Open two new shell sessions, switch to the `ef-cms` directory in both, and point both sessions to the desired environment:
    ```bash
    . scripts/env/set-env.zsh myenv
    ```
1. In the first shell session, run the `irs-super-user.ts` script:
    ```bash
    npx ts-node --transpile-only scripts/irs-super-user.ts
    ```
1. In the second shell session, use `oathtool` to generate your MFA code:
    ```bash
    oathtool -b --totp "$IRS_SUPERUSER_MFA_SECRET"
    ```
1. Back in the first shell session, enter the MFA code you just generated.
1. Copy the `IdToken` value from the output to your clipboard.

## Testing API v2 with Your IRS Test User

Be sure to replace `ID_TOKEN` in the authorization header with a valid API token.

### Reconciliation Report
Replace `today` with a specific date if nothing has been served today.
```http request
GET https://api.myenv/v2/reconciliation-report/today
Authorization: Bearer ID_TOKEN
```

### Case Detail
Replace `DOCKET_NUMBER` with the desired docket number.
```http request
GET https://api.myenv/v2/cases/DOCKET_NUMBER
Authorization: Bearer ID_TOKEN
```

### Docket Entry Download
Replace `DOCKET_NUMBER` with the desired docket number, and replace `DOCKET_ENTRY_ID` with a valid docket entry id belonging to the desired case.
```http request
GET https://api.myenv/v2/cases/DOCKET_NUMBER/entries/DOCKET_ENTRY_ID/document-download-url
Authorization: Bearer ID_TOKEN
```
