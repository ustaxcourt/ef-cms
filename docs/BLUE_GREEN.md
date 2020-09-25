# Blue-Green Deployment Strategy

We use a blue-green deployment strategy to avoid broken environments due to errors during deploys. Each new deploy goes to a non-active stack, and we only switch that stack to active after the full deploy of each stack and region has passed.

We do this by creating two separate stacks for each of our API services, one blue and one green. We store a record in Dynamo to indicate which stack is currently deployed. When a new deploy begins, the Dynamo record is retrieved and the opposite color stack is deployed. The domain manager is still pointing to the old API stack because Serverless will not overwrite the base path mapping if the current one has a different name. In our post-deploy job (only triggered if deploy-api-east and deploy-api-west both pass), we update the Dynamo record to the new color, and we update the API Gateway custom domain base path mapping to point to the new API stack.

* Note that the Custom Domain Name under API Gateway will need to be deleted before deploying this to each environment that was previously deployed without blue-green. This is because of what is noted above: Serverless will not overwrite the base path mapping if the current one has a different name.

We attempted to use API Gateway aliases/stages as a simpler solution, but occasionally there is an error in a deploy that requires us to delete a stack. When you delete a stack, the API Gateway record for that stack is also deleted. Because of that, we have to create two separate stacks to allow for deletion of a stack.
