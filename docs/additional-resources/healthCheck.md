We need a health check for the west api and east api.
Within the west region we have 2 apis. Blue and Green.
We deploy a toal of 4 APIs.
What we really want the health check to key off of is the ACTIVE west side.



How health checks work in Route53
- "If you're routing traffic to resources that you can't create alias records for, such as EC2 instances, you create a record and a health check for each resource. Then you associate each health check with the applicable record."
- "If you're using alias records to route traffic to selected AWS resources, such as ELB load balancers, you can configure Route 53 to evaluate the health of the resource and to route traffic only to resources that are healthy. When you configure an alias record to evaluate the health of a resource, you don't need to create a health check for the resource."
- "You can mix alias and non-alias records, but they all must have the same value for Name, Type, and Routing Policy."
- To associate a health check with a Route53 A record, the A Record "value" must match the domain_name/ IP address of the health check. 
- If you omit a health check record or do not enable "evaluate target health" for alias records then Route53 will always assume that record is healthy. 
- https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-simple-configs.html




Do we need these records for the UI?
- "Note: If Amazon CloudFront is your primary target, then the following resolutions don't apply."
- I think cloudfront management acts has its own builtin failover and does not need routing records.
- https://repost.aws/knowledge-center/route-53-dns-health-checks


Configure custom health checks for DNS failover
- "When you choose Evaluate Target Health for an alias record, those records fail only when the API Gateway service is unavailable in the Region. In some cases, your own API Gateway APIs can experience interruption before that time. To control DNS failover directly, configure custom Route 53 health checks for your API Gateway APIs."
- https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_domain_name
- https://docs.aws.amazon.com/apigateway/latest/developerguide/dns-failover.html


Links
- https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-configuring.html
- https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-complex-configs.html
- https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-simple-configs.html
- https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html
- https://docs.aws.amazon.com/apigateway/latest/developerguide/dns-failover.html#dns-failover-intial-setup
- https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create-alarm-on-metric-math-expression.html
- https://docs.aws.amazon.com/pdfs/whitepapers/latest/blue-green-deployments/blue-green-deployments.pdf#welcome





Requirements 
- The health check url endpoint must always know absolutely it is hitting the east or west side.
- Blue and green specific APIs(or the passive and active API) must always be available to hit so we can test the passive environment before deploying.
- We only care about monitoring the active environment, we do not care about the health of the inactive environment.
- We should be able to update the health checks of one of the passive color without affecting the health check of the active color.



1. Deploy 4 health checks through terraform(east-green, east-blue, west-green, west-blue)
- All checks will be enabled when deployed, once the color switch occurs we will disable the inactive health checks.
- Problem 1: This creates a problem with blue/green deployments as when we run the deploy step all 4 health checks are enabled which means we are periodically monitoring the inactive environments. What happens if we end up not switching colors? Well then we are monitoring an environment we should not be.
- Problem 2: When we deploy with all 4 checks active it will appear unhealthy on first deployment as /public-api/cached-health does not exist on active. This is more of a terraform problem as we have not separated blue-green stacks for deployment. Although if we were to say update the search string to a new value for the health check, the active environment would start appearing unhealthy as it does not have the lambdas which return the healthy code.
- Problem 3: There is complexity involved in disabling 2/4 health checks in the deployment process when swithcing colors.

2. Deploy 2 health checks through terraform that are always pointing at east-west
- Create top level api of api.efcms.com which latency and health check routes to -> api-east.efcms.com + api-west.efcms.com which then route to api-west-green.efcms.com + api-west-blue.efcms.com and api-east-green.efcms.com + api-west-green.efcms.com.
- With this routing our health checks will never need to be updated as they will always be pointed at the active color.
- Problem 1: We would need to update all api calls from api-green.efcms.com to the top level api.efcms.com
- Problem 2: In our switch color steps we need to update api-east.efcms.com alias record to point to the active color. So there is still complexity in the deployment process, however changing alias route targets for a blue-green deployment is the most common method of achieving blue-green deployments. Seems like necessary complexity. 
- Problem 3: There is not a convenient way to access the green environment api and blue environment api. Typically we want to access the passive environment during deployment for tests to make sure it is good to go. Now the api would look something like api-east-green.efcms.com to hit the api and we do not care about the east very much.
- Problem 4: Terraform would be managing api-east.efcms.com and api-west.efcms.com and ideally always pointing to the active color. During the deploy step it is always going to try and rewrite the value it is re-routing to before the color-switch step. This means that terraform is going to start re-routing traffic before we have switched colors. HUGE PROBLEM.

3. Create a new terraform state that is specifically meant to manage the alias records. 
- Create a new piece of terraform that only manages the pieces of infrastructure which is involved in changing during the blue-green deployment.
- One of the major problems with terraform for a blue-green deployment is that the infrastructure is conditional depending on what is active and what is passive. This means any script used during switch-colors to modify infrastructure is going to be reset by terraform
- What pieces of infrastructure would need to be managed by terraform for the MVP of this to work?
- Do we end up with a chicken/egg problem where the deploy terraform infra relies on the switch-colors infrastructure?
- In this setup nothing in web-api terraform could rely on switch-colors terraform. It would have to be in one direction.
- Resources needed in the switchy: 
  - aws_route53_health_check.failover_health_check : Because the fqdn changes depending on deploying color
  - aws_route53_record.api_public_route53_regional_record : The health check ID shouldn't change once created but this record relies on aws_route53_health_check to be created first. Circular deployment problem. We could move aws_route53_record.api_public_route53_regional_record into the switch-colors step but then the api mapping will not exist until after we switch colors. How can we run tests without the domain existing? Probably a show stopper.

4. Use the meta-argument ignore_changes on health check to allow outside mods.
  - Add an ignore_changes on "fqdn" attrbitue as the health check needs to be updated when a switch color happens so that we can update what url we are looking at for the health check.
  - Only create 2 health checks (One for east, one for west). During the switch colors we will update what the health check is looking at. This means we should never have to update the cloudwatch alarm as the alarm will always be looking at the same 2 health checks.
  - 

