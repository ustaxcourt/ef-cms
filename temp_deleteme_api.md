Goals
- Reduce complexity of lambda deployment process
- Reduce complexity of api deployment process
- Add sourcemaps

:::TO DO:::
- Create Rollback steps for reverting the deployment
- Delete webpack related packages
- disable health checks on exp5

:::Deployment steps:::
- on staging branch deploy with all resource "aws_api_gateway_deployment" lifecycles deleted
- Manually delete all custom domain names for the environment  (in east AND west)
- manually delete resources in aws console
  - cloudwatch log group /aws/apigateway/gateway_api_public_exp5_green in us-east-1
  - cloudwatch log group /aws/apigateway/gateway_api_public_exp5_green in us-west-1
- switch to 'terraform-module-esbuild' and deploy

:::Rollback Steps:::
- Manually delete all custom domain names for the environment (in east AND west)
- While on the new branch destroy blue/green terraform modules
  - comment out the module "api-east-blue" and module "api-west-blue" inside of blue.tf
  - `npm run deploy:blue $ENV`
  - comment out the module "api-east-green" and module "api-west-green" inside of green.tf
  - `npm run deploy:green $ENV`
- Kick off a new pipeline build to rebuild old infrastructure
  - revert main branch back to version before terraform refactoring
  - delete cloudwatch loggroup /aws/apigateway/gateway_api_exp5_blue (in east and west)
  - delete cloudwatch loggroup /aws/apigateway/gateway_api_exp5_green (in east and west)
  - delete cloudwatch loggroup /aws/apigateway/gateway_api_public_exp5_blue (in east and west)
  - delete cloudwatch loggroup /aws/apigateway/gateway_api_public_exp5_green (in east and west)
  - Kick off pipeline (it will fail)
  - copy + paste blue puppeteer zip into east and west(DO you have to deploy first?)
  - Kick off pipeline




:::Things Being destroyed during first deploy:::
- API
- Route53 records
- Send email queue
- ALL queues(worker, send_email, trialsession)
- ACM certs
- api Domain names