const AWS = require('aws-sdk');

const STAGE = process.argv[2];
const REGION = process.argv[3];

const main = async () => {
  const fullDomain = `efcms-${STAGE}.${process.env.EFCMS_DOMAIN}`;
  const apigateway = new AWS.APIGateway({
    region: REGION,
  });

  const { items: basePathMappings } = await apigateway
    .getBasePathMappings({ domainName: fullDomain })
    .promise();
  const { items: restApis } = await apigateway
    .getRestApis({ limit: 20000 })
    .promise();

  const restApisFiltered = restApis.filter(restApi =>
    restApi.name.includes(STAGE),
  );

  for (let basePathMapping of basePathMappings) {
    const currentStackName = (
      restApisFiltered.find(
        restApi => restApi.id === basePathMapping.restApiId,
      ) || {}
    ).name;

    if (
      currentStackName &&
      (currentStackName.includes('blue') || currentStackName.includes('green'))
    ) {
      let newName;
      if (currentStackName.includes('green')) {
        newName = currentStackName.replace('green', 'blue');
      } else {
        newName = currentStackName.replace('blue', 'green');
      }

      const newStack =
        restApisFiltered.find(restApi => restApi.name === newName) || {};

      await apigateway
        .updateBasePathMapping({
          basePath: basePathMapping.basePath,
          domainName: fullDomain,
          patchOperations: [
            {
              op: 'replace',
              path: '/restapiId',
              value: newStack.id,
            },
          ],
        })
        .promise();
    }
  }
};

main();
