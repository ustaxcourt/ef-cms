import {
  APIGatewayClient,
  CreateBasePathMappingCommand,
  DeleteBasePathMappingCommand,
  GetRestApisCommand,
} from '@aws-sdk/client-api-gateway';
import { requireEnvVars } from '../shared/admin-tools/util';

requireEnvVars(['DEPLOYING_COLOR', 'EFCMS_DOMAIN', 'ENV']);

const { DEPLOYING_COLOR, EFCMS_DOMAIN, ENV } = process.env;
const REGIONS = ['us-east-1', 'us-west-1'];

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  for (const region of REGIONS) {
    const apigateway = new APIGatewayClient({ region });
    const getRestApisCommand = new GetRestApisCommand({ limit: 500 });
    const { items } = await apigateway.send(getRestApisCommand);

    const apiGatewayRecord = items?.find(
      record => record.name === `gateway_api_${ENV}_${DEPLOYING_COLOR}`,
    );

    if (apiGatewayRecord && 'id' in apiGatewayRecord && apiGatewayRecord.id) {
      try {
        const deleteBasePathMappingResult = await apigateway.send(
          new DeleteBasePathMappingCommand({
            basePath: '(none)',
            domainName: `api.${EFCMS_DOMAIN}`,
          }),
        );
        if (deleteBasePathMappingResult) {
          const createBasePathMappingResult = await apigateway.send(
            new CreateBasePathMappingCommand({
              domainName: `api.${EFCMS_DOMAIN}`,
              restApiId: apiGatewayRecord.id,
              stage: ENV,
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
})();
