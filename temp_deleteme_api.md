Goals
- Reduce complexity of lambda deployment process
- Reduce complexity of api deployment process
- Add sourcemaps

:::TO DO:::
- Delete webpack
- switch all lambdas to new deployment strategy

:::Deployment steps:::
- on staging branch deploy with all resource "aws_api_gateway_deployment" lifecycles deleted
- Manually delete all custom domain names for the environment
- switch to 'terraform-module-esbuild' and deploy




:::Things Being destroyed during first deploy:::
- API
- Route53 records
- Send email queue
- ALL queues(worker, send_email, trialsession)
- ACM certs
- api Domain names
