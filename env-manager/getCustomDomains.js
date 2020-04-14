const { filter } = require('lodash');

exports.getCustomDomains = async ({ apiGateway, environment }) => {
  const { Items } = await apiGateway.getDomainNames({}).promise();
  return filter(Items, customDomain => {
    return customDomain.DomainName.includes(`-${environment.name}`);
  });
};
