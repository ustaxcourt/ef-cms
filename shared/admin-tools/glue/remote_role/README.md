# Role to allow remote writing

In order to migrate data across accounts, the destination account must have a role with a trust relationship with the source account. This role should have policies that define which actions the source account may take in the destination account.

The terraform in this folder will create a role that allows reading/writing/updating on DynamoDB tables. This terraform should be run in the *destination* account.

```bash
cd shared/admin-tools/glue/remote_role
./bin/deploy-remote-role.sh
```
