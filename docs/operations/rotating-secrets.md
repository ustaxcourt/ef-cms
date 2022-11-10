# Rotating Secrets

In order to maintain the security of any environment that contains production like data, we are enforcing a credential rotation every quarter. We will rotate the account passwords for any of the test users in any of the environments that contain production-like data. We will also rotate the credentials for IAM users that access these environments.

## Account Level Users

These are users who access the entire AWS account where environments live. We currently support two AWS Accounts, Production and Staging.

### IAM Users

We will run a script to check the age of the every IAM User's credentials. The script outputs every user that has older than the start of the current quarter. We'll manually reach out to them, and give them [instructions to manually update them](#manual-credential-rotation).

Console access is managed for the account via the Account Password Policy. These passwords are set to expire after 92 days via the [Account Password Policy](https://docs.aws.amazon.com/cli/latest/reference/iam/get-account-password-policy.html).

To identify any accounts that need to be rotated, run this script:

```bash
npm run secrets:check
```

#### Manual Credential Rotation

Perform the following steps to rotate your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

1. Run the following command to create a new access key:

    ```bash
    aws iam create-access-key --user-name MyUser
    ```

2. The response should include the newly created key information:

    ```bash
    {
      "AccessKey": {
          "UserName": "MyUser",
          "AccessKeyId": "AKIAIOSFODNN7EXAMPLE",
          "Status": "Active",
          "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
          "CreateDate": "2018-12-14T17:34:16Z"
      }
    }
    ```

3. Update your local environment variables to use the new credentials, taking note of your old `AWS_ACCESS_KEY_ID` (you will need this later!):
   1. Update the credentials for the profile you use in `~/.aws/credentials` and/or
   2. Save them to a file that you source when accessing this AWS Account:

        ```bash
        export AWS_ACCESS_KEY_ID='AKIAIOSFODNN7EXAMPLE'
        export AWS_SECRET_ACCESS_KEY='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
        ```

        and then be sure to source that file to start using these new credentials.

4. Delete the old `AWS_ACCESS_KEY_ID` with the following command:

    ```bash
    aws iam delete-access-key --access-key-id OLD1KEYAKI4H3FEX4MPL3 --user-name MyUser
    ```

### Circle CI Users

The **CircleCI** user is an IAM user that also needs to be rotated in both the Production and Staging AWS Accounts. To help simplify this process, we have made a script that deletes old access keys and outputs new keys to enter into the CircleCI interface.

1. Run the following script:

    ```bash
    npm run secrets:rotate-circleci
    ```

2. The script outputs new keys to copy and paste into the CircleCI web interface.

## Environment Users

Any environment with production like data will have a `USTC_ADMIN_USER` and `USTC_ADMIN_PASS` associated with it that is used to create Test Users and perform admin-level operations. These passwords are stored in AWS Secrets Manager.

Additionally, each environment has a number of test users that are created to help aid testing various workflows. The [setup-test-users.sh](../../shared/admin-tools/user/setup-test-users.sh) script runs on every deploy.

To help automate that process, we the following script rotates these secrets:

```bash
npm run secrets:rotate-environment
```

This updates the password in Cognito for the `USTC_ADMIN_USER`, and then it updates the Secrets value with that new `USTC_ADMIN_PASS` and `DEFAULT_ACCOUNT_PASS` so that subsequent deploys will make use of the new value.

NOTE: You will need to run [setup-test-users.sh](../../shared/admin-tools/user/setup-test-users.sh) script to update the users or wait for the next deploy.

```bash
./shared/admin-tools/user/setup-test-users.sh
```
