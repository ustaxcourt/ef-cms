import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

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

  const url = `https://app-${environment.currentColor}.${environment.efcmsDomain}/${bucketName}/${key}`;

  const signedUrl = getSignedUrl({
    dateLessThan: '2024-06-19',
    keyPairId: 'K2EHQGE49YSTCV',
    privateKey,
    url,
  });

  return { url: signedUrl };
};
