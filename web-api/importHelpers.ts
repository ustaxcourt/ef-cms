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
    region: process.env.REGION,
  });

  return await getUserToken({
    cognito,
    env: process.env.ENV!,
    password: process.env.USTC_ADMIN_PASS!,
    username: process.env.USTC_ADMIN_USER!,
  });
};

export const getServices = async () => {
  const apigateway = new APIGatewayClient({
    region: process.env.REGION,
  });
  const getRestApisCommand = new GetRestApisCommand({ limit: 200 });
  const { items: apis } = await apigateway.send(getRestApisCommand);

  return (apis ?? [])
    .filter(api =>
      api.name?.includes(
        `gateway_api_${process.env.ENV}_${process.env.DEPLOYING_COLOR}`,
      ),
    )
    .reduce((obj, api) => {
      obj[api.name?.replace(`_${process.env.ENV}`, '')!] =
        `https://${api.id}.execute-api.${process.env.REGION}.amazonaws.com/${process.env.ENV}`;
      return obj;
    }, {});
};

export const readCsvFile = file => {
  return fs.readFileSync(file, 'utf8');
};
