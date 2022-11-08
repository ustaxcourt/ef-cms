# Rotating Secrets

In order to maintain the security of any environment that contains production like data, we are enforcing a credential rotation every quarter. We will rotate the account passwords for any of the test users in any of the environments that contain production-like data. We will also rotate the credentials for IAM users that access these environments.

## Account Level Users

These are users who access the entire AWS account where environments live. We currently support two AWS Accounts. In the production Account, we will need to rotate:

### Administrators Group Users

For every user in this group, we'll need to run a script to check the age of the users credentials. If they are older than the start of the previous quarter, then we will need to rotate them.

Console access is managed for the account via the Account Password Policy. These passwords are set to expire after 92 days.

We can either inform the user and provide them with steps to update their own credentials, or perform that change automatically. Ideally, they can rotate their own credentials.

We have an [admin script to identify any accounts that need to be rotated](../../shared/admin-tools/user/list-users-with-old-credentials.js).

#### Manual Credential Rotation

Perform the following steps or give them to another user in order to rotate their `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

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
   1. Either update the credentials for the profile you use in `~/.git/credentials` or
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

The **CircleCI** user gets updated in a very similar workflow as above. We need to perform this operation in both the Production and Staging AWS Accounts. To help simplify this process, we have made a script that deletes old access keys and outputs new keys to enter into the CircleCI interface.

1. Run the [rotate-circleci-secrets.sh](../../shared/admin-tools/user/rotate-circleci-secrets.sh)
2. The script outputs new keys to copy and paste into the CircleCI web interface.

## Environment Super Users

Any environment with production like data will have a `USTC_ADMIN_USER` and `USTC_ADMIN_PASS` associated with it that is used to create Test Users and perform admin-level operations. These passwords are stored in AWS Secrets Manager.

To help automate that process, we have another script that rotates the `USTC_ADMIN_PASS`. You need to specify the new password as a command line argument:

```bash
./shared/admin-tools/user/rotate-ustc-admin-password.sh "new-passw0rd-here"
```

## Environment Test Users

Each environment has a number of test users that are created to help aid testing various workflows. The [setup-test-users.sh](../../shared/admin-tools/user/setup-test-users.sh) script is currently run on every deploy.

```bash
./shared/admin-tools/user/rotate-default-account-password.sh "new-passw0rd-here"
```
