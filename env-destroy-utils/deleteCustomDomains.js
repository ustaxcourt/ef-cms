import { DeleteDomainNameCommand } from '@aws-sdk/client-api-gateway';
import { getApiGateway } from './getApiGateway';
import { getCustomDomains } from './getCustomDomains';
import { sleepForMilliseconds } from './sleep';

export const deleteCustomDomains = async ({ environment }) => {
  const apiGateway = getApiGateway({ environment });

  const customDomains = await getCustomDomains({
    apiGateway,
    environment,
  });

  for (const domain of customDomains) {
    console.log('Delete Custom Domain:', domain.DomainName);
    const deleteDomainNameCommand = new DeleteDomainNameCommand({
      DomainName: domain.DomainName,
    });
    await apiGateway.send(deleteDomainNameCommand);
    await sleepForMilliseconds(100);
  }
};
