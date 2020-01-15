# Environment-Related Troubleshooting

## Errors You May Encounter
> ```deploy failed with ServerlessError: An error occurred: YourLambdaFunction - The role defined for the function cannot be assumed by Lambda. (Service: AWSLambdaInternal; Status Code: 400; Error Code: InvalidParameterValueException; Request ID: ae81b07e-8a75-4f98-9473-2096a5da63f9).```
* If you're standing up a new environment, it is critical that you run the scripts (mentioned above and found in SETUP.md) to create Lambda roles & policies.
> ``` ROLLBACK_COMPLETE ```
* If you see this error in the AWS Cloudformation Stacks for your `$ENVIRONMENT`, there was an error configuring this stack. This stack will need to be DELETED prior to attempting to deploy again.  We hope to identify the causes of these situations as well as avoid downtime by utilizing blue/green deploy strategies.