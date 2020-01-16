# Environment-Related Troubleshooting

## Errors You May Encounter
### Testing-related
We utilize a package called `pa11y-ci` which runs tests found in the `pa11y/` directory.  These run within docker containers, but they also seem to leak memory [see this issue](https://github.com/nodejs/docker-node/issues/1096) from within Node itself.  This has resulted in the need to split our many `pa11y` tests into several more runs, each smaller in size (see `.circleci/config.yml` and the multiple steps within 'e2e-pa11y' job).  If a `pa11y` test repeatedly succeed when running locally but frequently fail within the CI docker container, you may be hitting a memory constraint and should consider further splitting up your `pa11y` test tasks.

### AWS-related 
> ```deploy failed with ServerlessError: An error occurred: YourLambdaFunction - The role defined for the function cannot be assumed by Lambda. (Service: AWSLambdaInternal; Status Code: 400; Error Code: InvalidParameterValueException; Request ID: ae81b07e-8a75-4f98-9473-2096a5da63f9).```
* If you're standing up a new environment, it is critical that you run the scripts (mentioned above and found in SETUP.md) to create Lambda roles & policies.
> ``` ROLLBACK_COMPLETE ```
* If you see this error in the AWS Cloudformation Stacks for your `$ENVIRONMENT`, there was an error configuring this stack. This stack will need to be DELETED prior to attempting to deploy again.  We hope to identify the causes of these situations as well as avoid downtime by utilizing blue/green deploy strategies.