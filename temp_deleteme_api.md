Goals
- Reduce complexity of lambda deployment process
- Reduce complexity of api deployment process
- Add sourcemaps

:::TO DO:::
- Delete webpack
- switch all lambdas to new deployment strategy


:::Things Being destroyed during first deploy:::
- API
- Route53 records
- Send email queue
- ALL queues(worker, send_email, trialsession)
- ACM certs
- api Domain names
