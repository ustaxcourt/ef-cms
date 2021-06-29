# Accessing log data in Kibana

## The log pipeline

Operations within Lambda and other AWS services write logs to CloudWatch log groups (within Lambda, both system invocations and reports as well as anything written to the console are stored there).

Select log groups are subscribed to and then processed by the `LogsToElasticsearch_info` Lambda function, parsing all JSON-formatted log entries into Elasticsearch documents that are accessible through Kibana, a user interface that lets you visualize your Elasticsearch data.

## Accessing Elasticsearch

There is one `info` Elasticsearch domain per AWS account, which operates at an auto-generated URL. You can find this URL by logging into the AWS Console, navigating to the Elasticsearch Service, finding the `info` domain, and then clicking on the Kibana link.

### Logging in to Kibana

Kibana is secured by a Cognito user pool named `log_viewers`. Sign up for an account at the login page, and when presented with an error, navigate to the AWS Console’s Cognito user pool management and manually confirm your newly created user to allow it to authenticate.

Then, head back to the Kibana link and log in with your newly created credentials.

## Understanding Kibana

You’ll likely spend most of your time on the **Discover** tab, indicated by a compass icon in the left navigation. Click **Refresh** to see the latest log entries — and then explore!

You may find it helpful to watch a quick YouTube tutorial on the basics of Kibana, especially if writing Elasticsearch queries are new to you.

- **Adding quotes around your query may help return the results you’re looking for.** If you find searching for a request identifier or other string is returning unexpected results, consider adding double quotes around your query.
