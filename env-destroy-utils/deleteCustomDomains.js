const { getApiGateway } = require('./getApiGateway');
const { getCustomDomains } = require('./getCustomDomains');
const { sleepForMilliseconds } = require('./sleep');

exports.deleteCustomDomains = async ({ environment }) => {
  const apiGateway = getApiGateway({ environment });

  const customDomains = await getCustomDomains({
    apiGateway,
    environment,
  });

  for (const domain of customDomains) {
    console.log('Delete Custom Domain:', domain.DomainName);
    await apiGateway
      .deleteDomainName({ DomainName: domain.DomainName })
      .promise();
    await sleepForMilliseconds(100);
  }
};
