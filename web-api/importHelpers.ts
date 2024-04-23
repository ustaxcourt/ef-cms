import {
  APIGatewayClient,
  GetRestApisCommand,
} from '@aws-sdk/client-api-gateway';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { getUserToken } from './storage/scripts/loadTest/loadTestHelpers';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import localUsers from './storage/fixtures/seed/users.json';

export const getToken = async () => {
  if (process.env.ENV === 'local') {
    const adminUser = localUsers.find(user => user.role === 'admin');
    const user = {
      ...adminUser,
      'custom:role': adminUser!.role,
      sub: adminUser!.userId,
    };

    return Promise.resolve(jwt.sign(user, 'secret'));
  }

  const cognito = new CognitoIdentityProvider({
    region: process.env.REGION!,
  });

  return await getUserToken({
    cognito,
    env: process.env.ENV!,
    password: process.env.USTC_ADMIN_PASS!,
    username: process.env.USTC_ADMIN_USER!,
  });
};

export const getServices = async ({
  color,
  environmentName,
  region,
}: {
  color?: string;
  environmentName?: string;
  region?: string;
}) => {
  if (!color) {
    color = process.env.DEPLOYING_COLOR!;
  }
  if (!environmentName) {
    environmentName = process.env.ENV!;
  }
  if (!region) {
    region = process.env.REGION!;
  }
  const apiGateway = new APIGatewayClient({
    region,
  });
  const getRestApisCommand = new GetRestApisCommand({ limit: 200 });
  const { items: apis } = await apiGateway.send(getRestApisCommand);

  return (apis ?? [])
    .filter(api =>
      api.name?.includes(`gateway_api_${environmentName}_${color}`),
    )
    .reduce((obj, api) => {
      obj[api.name?.replace(`_${environmentName}`, '')!] =
        `https://${api.id}.execute-api.${region}.amazonaws.com/${environmentName}`;
      return obj;
    }, {});
};

export const readCsvFile = file => {
  return fs.readFileSync(file, 'utf8');
};
