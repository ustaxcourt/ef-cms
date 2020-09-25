const AWS = require('aws-sdk');

const STAGE = process.argv[2];
const REGION = process.argv[3];
const CURRENT_COLOR = process.argv[4];
const NEW_COLOR = process.argv[5];

const getNewStack = ({
  basePathMapping,
  currentColor,
  newColor,
  restApisFiltered,
}) => {
  const currentStackName = (
    restApisFiltered.find(
      restApi => restApi.id === basePathMapping.restApiId,
    ) || {}
  ).name;

  let newStack;

  if (
    currentStackName &&
    (currentStackName.includes('blue') || currentStackName.includes('green')) &&
    currentStackName.includes(currentColor)
  ) {
    let newName;
    if (currentStackName.includes('green')) {
      newName = currentStackName.replace('green', 'blue');
    } else {
      newName = currentStackName.replace('blue', 'green');
    }

    newStack = restApisFiltered.find(restApi => restApi.name === newName) || {};

    if (!newStack.name || !newStack.name.includes(newColor)) {
      newStack = undefined;
    }
  }

  return newStack;
};

const switchBasePathMappings = async ({
  apigateway,
  currentColor,
  fullDomain,
  newColor,
  stage,
}) => {
  const { items: basePathMappings } = await apigateway
    .getBasePathMappings({ domainName: fullDomain })
    .promise();
  const { items: restApis } = await apigateway
    .getRestApis({ limit: 1000 })
    .promise();

  const restApisFiltered = restApis.filter(restApi =>
    restApi.name.includes(stage),
  );

  for (let basePathMapping of basePathMappings) {
    const newStack = getNewStack({
      basePathMapping,
      currentColor,
      newColor,
      restApisFiltered,
    });

    if (newStack) {
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

/* istanbul ignore next */
const main = async () => {
  const fullDomain = `efcms-${STAGE}.${process.env.EFCMS_DOMAIN}`;
  const apigateway = new AWS.APIGateway({
    region: REGION,
  });

  await switchBasePathMappings({
    apigateway,
    currentColor: CURRENT_COLOR,
    fullDomain,
    newColor: NEW_COLOR,
    stage: STAGE,
  });
};

/* istanbul ignore next */
if (STAGE && REGION && CURRENT_COLOR && NEW_COLOR) {
  main();
}

module.exports = { getNewStack, switchBasePathMappings };
