Goals
- Reduce complexity of lambda deployment process
- Reduce complexity of api deployment process
- Add sourcemaps

:::TO DO:::
- Delete webpack
- switch all lambdas to new deployment strategy
- Investigate how web-api/terraform/bin/deploy-app.sh deploys to green vs blue depending on DEPLOYING_COLOR
- Revisit parallelism=2 in terraform web-api/terraform/bin/deploy-app.sh
- Figure out if there is an easier way to get the elasticsearch endpoint on line 30 web-api/setup-elasticsearch-index.sh
- Turn on source map env variable for all lambdas

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
