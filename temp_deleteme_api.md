Goals
- Reduce complexity of lambda deployment process
- Reduce complexity of api deployment process
- Add sourcemaps

:::TO DO:::
- Investigate if we want blue/green deployment for UI
  - Defer until we have finished validating API blue/green deployments
- run a migration deploy
- verify the health checks work during a switch color
- Create Rollback steps for reverting the deployment

:::Deployment steps:::
- on staging branch deploy with all resource "aws_api_gateway_deployment" lifecycles deleted
- Manually delete all custom domain names for the environment
- manually delete resources in aws console
  - cloudwatch log group /aws/apigateway/gateway_api_public_exp5_green in us-east-1
  - cloudwatch log group /aws/apigateway/gateway_api_public_exp5_green in us-west-1
- switch to 'terraform-module-esbuild' and deploy





:::Things Being destroyed during first deploy:::
- API
- Route53 records
- Send email queue
- ALL queues(worker, send_email, trialsession)
- ACM certs
- api Domain names
