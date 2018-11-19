# serverless-plugin-bind-deployment-id
[![Coverage Status](https://coveralls.io/repos/github/jacob-meacham/serverless-plugin-bind-deployment-id/badge.svg?branch=develop)](https://coveralls.io/github/jacob-meacham/serverless-plugin-bind-deployment-id?branch=develop)
[![Build Status](https://travis-ci.org/jacob-meacham/serverless-plugin-bind-deployment-id.svg?branch=develop)](https://travis-ci.org/jacob-meacham/serverless-plugin-bind-deployment-id)

Bind the serverless deployment to your custom resources like magic! Simply use `__deployment__` in place of anywhere you want the deployment to show up.

# Usage
```yaml

custom:
  myVariable: bar

resources:
  Resources:
    PathMapping:
      Type: AWS::ApiGateway::BasePathMapping
      DependsOn: ApiGatewayStage
      Properties:
        BasePath: basePath
        DomainName: ${self:provider.domain}
        RestApiId:
          Ref: ApiGatewayRestApi
        Stage: ${self:provider.stage}
    __deployment__:
      Properties:
        Description: This is my deployment
    ApiGatewayStage:
      Type: AWS::ApiGateway::Stage
      Properties:
        DeploymentId:
          Ref: __deployment__
        RestApiId:
          Ref: ApiGatewayRestApi
        StageName : ${self:provider.stage}
        MethodSettings:
          - DataTraceEnabled: true
            HttpMethod: "*"
            LoggingLevel: INFO
            ResourcePath: "/*"
            MetricsEnabled: true
    ApiGatewayStage2:
      Type: AWS::ApiGateway::Stage
      Properties:
        DeploymentId:
          Ref: __deployment__
        RestApiId:
          Ref: ApiGatewayRestApi
        StageName : myOtherStage
        Variables: [${self:custom.myVariable}]

plugins:
  - serverless-plugin-bind-deployment-id
```

When built, this will merge the custom properties set above with the default CloudFormation template, allowing you to apply custom properties to your Deployment or Stage. This will even allow you to add multiple Stages!

### Compatibility Note
If you are using Serverless 0.12+, please use the 1.x.x plugin. For previous Serverless versions, use the 0.1.x plugin.

## Advanced Usage
By default `__deployment__` is the sentinel value which is replaced by the API Deployment Id. This is configurable. If you'd like to use a different value, you can set:

```yaml
custom:
  deploymentId:
    variableSyntax: ApiGatewayDeployment
```

In this example, any instance of ApiGatewayDeployment in your custom resources will be replaced with the true deployment Id.

## Known Issues
Because the deployment id is not stable across CloudFormation stack updates, you cannot make changes to the default stage with the StageDescription property. If you attempt to do so, you will see an error:

```
An error occurred while provisioning your stack: ApiGatewayDeployment1490846212163
     - StageDescription cannot be specified when stage referenced
     by StageName already exists.
```

The easiest way to get around this is to leave the default stage unused, and create a new stage that you actually use. By default, we name this default stage __unused_stage__, but you could change it to something else by setting:

```yaml
__deployment__:
      Properties:
        StageName: myUnusedStage
```

## Release Notes
* 1.0.1 - Fix peer dependency
* 1.0.0 - Fix an incompatibility with serverless 1.12
* 0.1.0 - Initial release

## Contributors
* [Jacob Meacham](https://github.com/jacob-meacham)
* [ajkerr](https://github.com/ajkerr)
