import {
  ApiGatewayV2Client,
  DeleteDomainNameCommand,
  DomainName,
} from '@aws-sdk/client-apigatewayv2';
import { getApiGateway, type tApiGatewayEnvironment } from './getApiGateway';
import { getCustomDomains } from './getCustomDomains';
import { sleepForMilliseconds } from './sleep';

export const deleteCustomDomains = async ({
  environment,
}: {
  environment: tApiGatewayEnvironment;
}): Promise<void> => {
  const apiGateway: ApiGatewayV2Client = getApiGateway({ environment });

  const customDomains: DomainName[] = await getCustomDomains({
    apiGateway,
    environment,
  });

  for (const domain of customDomains) {
    console.log('Delete Custom Domain:', domain.DomainName);
    await apiGateway.send(
      new DeleteDomainNameCommand({
        DomainName: domain.DomainName,
      }),
    );
    await sleepForMilliseconds(100);
  }
};
