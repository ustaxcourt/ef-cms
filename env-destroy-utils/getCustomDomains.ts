import { filter } from 'lodash';

export const getCustomDomains = async ({ apiGateway, environment }) => {
  const { Items } = await apiGateway.getDomainNames();
  return filter(Items, customDomain => {
    return (
      customDomain.DomainName.includes(`-${environment.name}`) ||
      customDomain.DomainName.includes(`.${environment.name}`)
    );
  });
};
