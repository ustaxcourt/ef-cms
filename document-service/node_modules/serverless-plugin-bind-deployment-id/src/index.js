import _ from 'lodash'

export default class BindDeploymentId {
  constructor(serverless, options) {
    this.serverless = serverless
    this.hooks = {
      'before:aws:package:finalize:mergeCustomProviderResources': this.bindDeploymentId.bind(this)
    }
  }

  bindDeploymentId() {
    const template = this.serverless.service.provider.compiledCloudFormationTemplate

    // Find the deployment resource
    let deploymentId
    for (let key of Object.keys(template.Resources)) {
      const resource = template.Resources[key]
      if (resource.Type === 'AWS::ApiGateway::Deployment') {
        deploymentId = key
        break
      }
    }

    // Now, replace the reference to the deployment id
    const resources = _.get(this.serverless.service, 'resources.Resources', null)
    if (resources) {
      const variableRegex = new RegExp(_.get(this.serverless.service, 'custom.deploymentId.variableSyntax', '__deployment__'), 'g')
      this.serverless.service.resources.Resources = this.replaceDeploymentIdReferences(resources, deploymentId, variableRegex)

      const customStages = this.getCustomStages(this.serverless.service)
      if (Object.keys(customStages).length > 0) {
        // We have custom stages. The deployment will also create a stage, so we'll map
        // that to an unused stage instead. The API keys will also need to depend on
        // the stage, instead of the deployment
        template.Resources = this.fixUpDeploymentStage(template.Resources, deploymentId)
        template.Resources = this.fixUpApiKeys(template.Resources, customStages)
      }
    }
  }

  replaceDeploymentIdReferences(resources, deploymentId, variableRegex) {
    return JSON.parse(JSON.stringify(resources).replace(variableRegex, deploymentId))
  }

  getCustomStages(service) {
    const resources = _.get(service, 'resources.Resources', null)
    if (!resources) {
      return {}
    }

    return _.pickBy(resources, (resource) => {
      return resource.Type === 'AWS::ApiGateway::Stage'
    })
  }

  fixUpDeploymentStage(resources, deploymentId) {
    const newResources = _.cloneDeep(resources)
    newResources[deploymentId].Properties.StageName = '__unused_stage__'

    return newResources
  }

  fixUpApiKeys(resources, stages) {
    const stageKeys = Object.keys(stages)
    const stageToDependOn = _.first(stageKeys)
    if (stageKeys.length > 1) {
      this.serverless.cli.log(`Multiple stages detected. The API keys will depend on ${stageToDependOn}`)
    }

    return _.mapValues(resources, (resource) => {
      if (resource['Type'] === 'AWS::ApiGateway::ApiKey') {
        return { ...resource, DependsOn: stageToDependOn }
      }
      return resource
    })
  }
}
