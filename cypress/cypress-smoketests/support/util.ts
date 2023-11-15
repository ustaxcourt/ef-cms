export const getRestApi = async () => {
  let apigateway = new AWS.APIGateway({
    region: awsRegion,
  });
  const { items: apis } = await apigateway
    .getRestApis({ limit: 200 })
    .promise();

  const services = apis
    .filter(api => api.name.includes(`gateway_api_${ENV}_${DEPLOYING_COLOR}`))
    .reduce((obj, api) => {
      obj[
        api.name.replace(`_${ENV}_${DEPLOYING_COLOR}`, '')
      ] = `https://${api.id}.execute-api.${awsRegion}.amazonaws.com/${ENV}`;
      return obj;
    }, {});

  return services['gateway_api'];
};
