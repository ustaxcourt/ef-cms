const { getApiGateway } = require('./getApiGateway');
const { getCustomDomains } = require('./getCustomDomains');
const { sleep } = require('./sleep');

exports.deleteCustomDomains = async ({ environment }) => {
  const apiGateway = getApiGateway({ environment });

  const customDomains = await getCustomDomains({
    apiGateway,
    environment,
  });

  for (const domain of customDomains) {
    console.log('Delete ', domain.DomainName);
    await apiGateway
      .deleteDomainName({ DomainName: domain.DomainName })
      .promise();
    await sleep(10000);
  }

  let resourceCount = customDomains.length;

  while (resourceCount > 0) {
    await sleep(5000);
    const refreshedDomains = await getCustomDomains({
      apiGateway,
      environment,
    });
    console.log(
      'Waiting for domains to be deleted: ',
      Date(),
      refreshedDomains.length,
    );
    resourceCount = refreshedDomains.length;
  }
};
