import {
  APIGatewayClient,
  CreateBasePathMappingCommand,
  DeleteBasePathMappingCommand,
  GetRestApisCommand,
} from '@aws-sdk/client-api-gateway';
import { requireEnvVars } from '../shared/admin-tools/util';

requireEnvVars(['DEPLOYING_COLOR', 'EFCMS_DOMAIN', 'ENV']);

const { DEPLOYING_COLOR, EFCMS_DOMAIN, ENV } = process.env;

export const switchApiColors = async ({
  deployingColor,
  efcmsDomain,
  environmentName,
  publicApi,
}: {
  deployingColor: string;
  efcmsDomain: string;
  environmentName: string;
  publicApi: boolean;
}) => {
  const regions = ['us-east-1', 'us-west-1'];
  const apiGatewayRecordName = publicApi
    ? `gateway_api_public_${environmentName}_${deployingColor}`
    : `gateway_api_${environmentName}_${deployingColor}`;
  const domainName = publicApi
    ? `public-api.${efcmsDomain}`
    : `api.${efcmsDomain}`;

  for (const region of regions) {
    const apiGateway = new APIGatewayClient({ region });
    const getRestApisCommand = new GetRestApisCommand({ limit: 500 });
    const { items } = await apiGateway.send(getRestApisCommand);

    const apiGatewayRecord = items?.find(
      record => record.name === apiGatewayRecordName,
    );

    if (apiGatewayRecord && 'id' in apiGatewayRecord && apiGatewayRecord.id) {
      try {
        const deleteBasePathMappingResult = await apiGateway.send(
          new DeleteBasePathMappingCommand({
            basePath: '(none)',
            domainName,
          }),
        );
        if (deleteBasePathMappingResult) {
          const createBasePathMappingResult = await apiGateway.send(
            new CreateBasePathMappingCommand({
              domainName,
              restApiId: apiGatewayRecord.id,
              stage: environmentName,
            }),
          );
          if (createBasePathMappingResult) {
            console.log(createBasePathMappingResult);
          }
        }
      } catch (err: any) {
        if (err) {
          console.log(err, err.stack);
        }
      }
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await switchApiColors({
    deployingColor: DEPLOYING_COLOR!,
    efcmsDomain: EFCMS_DOMAIN!,
    environmentName: ENV!,
    publicApi: false,
  });
})();
