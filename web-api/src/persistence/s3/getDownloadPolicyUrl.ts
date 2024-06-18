import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { environment } from '@web-api/environment';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

export const getDownloadPolicyUrl = async ({
  key,
  urlTtl = 120,
  useTempBucket = false,
}: {
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

  const expirationDate = calculateISODate({
    howMuch: urlTtl,
    units: 'seconds',
  });

  const signedUrl = getSignedUrl({
    dateLessThan: expirationDate,
    keyPairId: 'K2EHQGE49YSTCV',
    privateKey,
    url,
  });

  return { url: signedUrl };
};
