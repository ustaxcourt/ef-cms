import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { getUserToken } from './loadTestHelpers';
import { v4 } from 'uuid';
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const cognito = new CognitoIdentityProvider({
    region: 'us-east-1',
  });

  const token = await getUserToken({
    cognito,
    env: process.env.ENV || '',
    password: process.env.DEFAULT_ACCOUNT_PASS || '',
    username: 'petitionsclerk1@example.com',
  });

  const checkPDFComplete = async (asyncSyncId: string) => {
    await new Promise(resolve => setTimeout(() => resolve(null), 1000));
    const URL = `https://api-${process.env.DEPLOYING_COLOR}.${process.env.EFCMS_DOMAIN}/results/fetch/${asyncSyncId}`;
    const headers = {
      Asyncsyncid: asyncSyncId,
      Authorization: `Bearer ${token}`,
      'x-test-user': 'true',
    };

    const results: {
      data: {
        response: any;
      };
    } = await axios.get(URL, {
      headers,
    });

    if (!results) return await checkPDFComplete(asyncSyncId);
    const { response } = results.data;
    if (!response) return await checkPDFComplete(asyncSyncId);

    const responseObj = JSON.parse(response);
    if (+responseObj.statusCode === 200) return;

    throw new Error(
      `Error generating PDF -> ${JSON.stringify(responseObj, null, 2)}`,
    );
  };

  for (let i = 0; i < 100; i++) {
    try {
      const asyncSyncId = v4();
      await axios.get(
        `https://api-${process.env.DEPLOYING_COLOR}.${process.env.EFCMS_DOMAIN}/async/reports/printable-case-inventory-report?associatedJudge=&status=New`,
        {
          headers: {
            Asyncsyncid: asyncSyncId,
            Authorization: `Bearer ${token}`,
            'x-test-user': 'true',
          },
        },
      );

      await checkPDFComplete(asyncSyncId);
    } catch (e) {
      console.log('ERROR', e);
      throw e;
    }
  }
})();
