import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { pinkLog } from '@shared/tools/pinkLog';

export const getDownloadPolicyUrl = async ({
  // applicationContext,
  // filename,
  key,
  // urlTtl = 120,
  useTempBucket = false,
}: {
  applicationContext: ServerApplicationContext;
  filename?: string;
  key: string;
  urlTtl?: number;
  useTempBucket?: boolean;
}): Promise<{ url: string }> => {
  const client = new SecretsManagerClient({
    region: 'us-east-1',
  });

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: 'exp4_cloudfront_signing_private_key_delete_me',
      VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
    }),
  );

  const privateKey = response.SecretString!;
  const bucketName = useTempBucket ? 'temp-documents' : 'documents';
  pinkLog(privateKey);

  // const url = `https://app-${environment.currentColor}.${environment.efcmsDomain}/${bucketName}/${key}`;
  const url = `https://d1w39o8lp3jgfs.cloudfront.net/${bucketName}/${key}`;
  // const url = new URL(
  //   `${bucketName}/${key}`,
  //   'https://d1w39o8lp3jgfs.cloudfront.net',
  // ).toString();
  pinkLog('SIGN URL', url);

  const expireIn5Min = new Date();
  expireIn5Min.setUTCMinutes(new Date().getUTCMinutes() + 5);

  const signedUrl = getSignedUrl({
    dateLessThan: expireIn5Min.toISOString(),
    keyPairId: 'K2EHQGE49YSTCV',
    privateKey,
    url,
  });

  return { url: signedUrl };
};
