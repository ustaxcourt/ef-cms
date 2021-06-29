# Resiliency Risks

*This documentation is intended to act as a living record of the current state of resiliency risks in DAWSON. It should document any known risks that are currently considered acceptable or are slated to be addressed in backlogged work.*

## Accepted Risks

*Resiliency risks that have been acknowledged and accepted until further notice*

* We use AWS for monitoring and alerts regarding failures. Because of this, we accept the risk that AWS's monitoring (CloudWatch logs, Kibana dashboard, CloudTrail logs) and alerts may not function at times due to AWS-level system outages.
* AWS Cognito outages in the *us-east-1* zone will cause the application and API to be unavailable, because Cognito is used for application authentication.

## Failover Infrastructure

We currently have some infrastructure set up for failover, but we have an epic logged to either update or implement additional failover configuration. All of the failover setup is found in our Terraform configuration.

[Failover configuration epic](https://github.com/ustaxcourt/ef-cms/issues/631)

## Critical System Notifications

  We use AWS's Simple Notification Service to alert system administrators about system health-related issues that we've determined to be noteworthy. Currently, the alerts we have set up include:

* Route53 health check failures
* Elasticsearch critical system metrics alarms
  
Some items that are currently backlogged to be worked on:

* [DynamoDB health alerts](https://github.com/ustaxcourt/ef-cms/issues/780)
* [SES health alerts](https://github.com/ustaxcourt/ef-cms/issues/792)
* [application-critical S3 bucket deletion alerts](https://github.com/ustaxcourt/ef-cms/issues/788)
