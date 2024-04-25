import {
  ApiGatewayV2Client,
  DomainName,
  GetDomainNamesCommand,
} from '@aws-sdk/client-apigatewayv2';
import { tApiGatewayEnvironment } from './getApiGateway';

export const getCustomDomains = async ({
  apiGateway,
  environment,
}: {
  apiGateway: ApiGatewayV2Client;
  environment: tApiGatewayEnvironment;
}): Promise<DomainName[]> => {
  const { Items } = await apiGateway.send(new GetDomainNamesCommand({}));
  return (
    Items?.filter(customDomain => {
      return (
        customDomain.DomainName?.includes(`-${environment.name}`) ||
        customDomain.DomainName?.includes(`.${environment.name}`)
      );
    }) || []
  );
};
