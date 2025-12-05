# AWS

The goal of this part of the documentation is to outline the various AWS services we use on Dawson and give a quick overview of it's purpose.

!> All of our AWS resources are managed via terraform; therefore, you should never modify a AWS resource directly from the AWS console unless you are just experimenting with new values.

## IAM

IAM is an AWS service for creating and managing users, roles, and permissions that can be used for interacting with aws via the cli, terraform, or attached to lambda functions to grant them access to other AWS resources.  By default, most AWS resources have limited access to other resources.  For example, since we use Elasticsearch on our project, we have to explicitly grant permissions to our lambda functions to be able to access that database.  It's worth noting that IAM is not the same as Cognito. Cognito is for managing the users of the application and NOT of our AWS resources.

A majority of our permissions are defined in our terraform files. For example, `iam/terraform/account-specific/main/circle-ci.tf` is where we grant access to our circle-ci user to be able to create and destroy the various AWS resources needed to deploy and environment.  Another common file you may modified in regards to permissions is the `iam/terraform/environment-specific/main/lambda.tf` file. 

For the most part, you'll mainly be changing IAM policies if you need to grant more access to a resource.  The way a IAM policy is defined is as follows:

```javascript

{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
            "logs:DescribeLogStreams"
        ],
        "Resource": [
            "arn:aws:logs:*:*:*"
        ]
    }]
}
```

A policy consists of an array of statements which grant the policy access to different AWS services and functions on that service.  For example, in this example above, we are granting that policy access to the `logs` service, and more specifically the ability to run `CreateLogGroup`, `CreateLogStream`, `PutLogEvents`, `DescribeLogStreams`, etc.  If you ever run into an error related to AWS permissions after you deployed to an environment, it's probably because you need to update these policies.

The policies can be attached to roles, and roles can be specified when creating resources.  For example, when creating a new lambda function, you need to specify a role.  In our case, our lambda functions use the `lambda_role`.

## Cognito

Cognito is a user management service provided by AWS which handles the ability to create users, send out forgot password emails, send out verifications emails, etc.  Cognito also provides a hosted UI where users can login and register.  The choice in use Cognito was mainly to speed up development time since it reduces our developer time needed to implement our own login system and reduce the risks involved with designing our own authentication system.  We also create a separate Cognito pool for the IRS super user which is named `efcms-irs-$ENV`.  The main reason we have a separate pool for the IRS is so we could enable MFA since the IRS user.

## OpenSearch (ElasticSearch)

> ElasticSearch is an inverted index solution we use to help us query our data

OpenSearch is an AWS service that provides a managed forked ElasticSearch version.  It has the ability to easily scale up and scale down your elasticsearch cluster, change instance types, easily upgrade versions without downtime, and more.  ElasticSearch is a tool used to help our users and application easily query for information that they need.

We use ElasticSearch to allow users to easily search over docket records by date, title, petitioner name, docket number, etc.  We mainly started using ElasticSearch for order and opinion searches, but we slowly started finding needs to do other queries against our elasticsearch cluster.

One use case of using elasticsearch in our system is for finding all open cases.  We can use a query like:

```
await esClient.search({
    body: {
        _source: ['docketNumber', 'petitioners'],
        query: {
        bool: {
            must: [],
            must_not: [
            {
                term: { 'status.S': 'Closed' },
            },
            ],
        },
        },
    },
    index: 'efcms-case',
    size: 20000,
});
```

This query will find all cases from the `efcms-case` index whose status is NOT closed.  This is why we use elasticsearch.

## Lambda

Lambda is a AWS service that allows developers to deploy their code to a managed infrastructure which automatically scales up to handle the requests.  All requests and logs are automatically forwarded to CloudWatch which makes it very easy to debug.  Additionally, AWS has built in monitoring to allow developers to see how often their lambdas are being executed, how long the execution took to run, and other useful metrics.

When a lambda is executed, your AWS is billed based on the memory size of the lambda and also the execution time.  The longer your function takes to run, the more AWS will charge you.  One interesting thing to point out about Lambda is that the more memory you allocate to your lambda, the more CPU your lambda has access to utilize.  This means you can sometimes reduce the cost of your lambdas by increasing the memory since it will speed up the execution and reduce the execution time.  Note, AWS does charge more per memory usage, so it's a good idea to experiment with a **optimal spot** for your code to get the price to performance ratio.

All of our code API in Dawson is written in Node.js and deployed to Lambda.  We follow a `mono lambda` approach, which is the process of deploying all of our API code to a single lambda.  We setup an API Gateway resource to /{+proxy} all requests to that lambda, and the lambda will figure out which request the user is trying to execute.  The main reason we switched to a mono lambda approach was because deploying each API endpoint independently was taking a long time and was becoming unmanagable.  The benefit to a mono lambda is that your lambda, for the most part, will always stay warm.  

## API Gateway

API Gateway is a service you can use to define REST routes and point those paths to execute various AWS resources.  Our main use case in Dawson is to point these REST routes to a mono lambda to execute some Node.js code and process the users request.  API Gateway requires a lot of additional setup just to allow a request to hit a lambda function, including defining a route, an integration request, integration response, REST methods, etc.  Most of this setup can be found here `web-api/terraform/api/api.tf`.  We also had to create separate routes and paths for our async and auth endpoints due to how API Gateway configuration works.

API Gateway has a default timeout of 30 seconds.  That means if your lambda executes longer than 30 seconds, api gateway will throw an exception.  We sometimes have tasks which take longer than 30 seconds, such as setting a trial session.  Because of this, we created a `/async` endpoint which has a different integration request and response to allow longer running lambda (up to 15 minutes if needed).

## Route53

Route53 is a service which allows you to configure a zone and DNS records associated with that zone.  Before an environment is first deployed, someone will need to setup a domain to point to a manually created Route53 zone.  For example, our sub domain at `ef-cms.ustaxcourt.gov` was created and points to our Route53 zone.  This allows us to use AWS to configure and manage various sub domains, such as `exp1.ef-cms.ustaxcourt.gov` without the need to go to the top level DNS management service that is hosting `ustaxcourt.gov`.  

## CloudFront

CloudFront is a CDN.  It is a service which takes your static web assets, such as images and html files, and hosts it across the global on various nodes.  This allows for much quicker access times of files since no matter where you are in the world, the files are hosted at a location close to your location.  It also provides built in caching capabilities to speed up load times.

In Dawson, all of our UIs are hosted in CloudFront.  When we deploy our application, we first upload our compiled React and web files to an s3 bucket.  Our CloudFront distribution is setup with an origin which points to this s3 bucket, so that when someone tries to access a file, CloudFront with either return a cached version of the file or fetch directly from the origin.

## CloudWatch

CloudWatch is a service which allows the aggregation and metrics of logs from various other AWS services we use.  By default, when you deploy a lambda function, it creates something called a log group and multiple log streams as new requests hit your lambda function.  These streams will contain all the logs your lambda generates which you can search through at a later time.

In Dawson, we forward most of our CloudWatch directly to our logging / kibana AWS OpenSearch (elasticsearch) cluster.  Kibana provides a much more user friendly interface to search through logs.  It also allows you to drill down into specific logs by date, user, etc.  Kibana is provided by default when you create a cluster in AWS.

## S3

S3 is a service which allows users to store and retrieve files from something called an AWS bucket.  This bucket can potentially hold as much information as you want and AWS does all the scaling behind the scenes for you.  

In Dawson, we store a majority of our PDFs inside of S3 buckets.  We also scrape the text from the PDFs and store that inside our S3 buckets as well.  We later use that scraped content to index it into elasticsearch to allow users to perform order and opinion searches over the contents of the PDFs.

## SQS

SQS is a service which allows you to send and receive messages into a queue.  A queue is a data structure which accepts messages and pushes them to the end of a list.  When other lambda servers read from the queue, they will get the first message added to the queue so they can process it.

IN Dawson, we use SQS for a variety of things.  We utilize SQS queues for when we need to run any type of long running process or do some type of fan out logic to process many events in parallel.

## SNS

SNS is a service which allows you to setup topics.  Topics are a way to broadcast a message and have many other subscribers receive that same message.  It is different from SQS in that it is a one to many relationship instead of one to one.

In Dawson, we use SNS to notify lower environments when a case is sealed in production to prevent anyone, including our developers, from seeing that sealed case.
