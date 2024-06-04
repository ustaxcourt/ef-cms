# Deploying The Application

## During CI/CD

Automated deployments are just one portion of CI/CD. Please see the CircleCI portion of the [CI/CD documentation](./ci-cd.md).

## During Development

Sometimes during the course of development it is preferable to deploy just one portion of the application to a lower 
environment without waiting for the entire CI/CD process to complete. This is best accomplished by following the 
procedures set out in the following sections.

### AWS Account

This deployment sets up Kibana instances for the AWS Account. It can also be used to make changes to the AWS Account. 
The effects of this deployment apply for all Flexion environments OR for all USTC environments according to which AWS 
account is being deployed to.

`/iam/terraform/account-specific/bin/deploy-app.sh` may be executed from the project root with this command:

```shell
npm run deploy:account-specific
```

### Web API

This deployment sets up the back end of the application.

`/web-api/terraform/bin/deploy-app.sh` may be executed from the project root with this command:

```shell
npm run deploy:api ${environment}
```

## AWS Secrets Manager

To enable painless deployments from a developer's local machine, environment variables used for the various environments 
are stored in secrets which are retrieved during the deployment script. The secret name is something like `${env}_deploy` 
and the value of `${env}` is what must be passed as an argument to the deployment script. The only exception to this is 
the account specific deployment which takes no argument and makes use of a secret called `account_deploy`.

Secrets can be managed via the [AWS console](https://console.aws.amazon.com/secretsmanager/home?region=us-east-1#!/listSecrets/).
