Goals
- Reduce complexity of lambda deployment process
- Reduce complexity of api deployment process
- Add sourcemaps

:::TO DO:::
- Investigate how web-api/terraform/bin/deploy-app.sh deploys to green vs blue depending on DEPLOYING_COLOR

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
