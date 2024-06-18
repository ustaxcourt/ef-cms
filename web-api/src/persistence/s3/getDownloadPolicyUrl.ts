import { ServerApplicationContext } from '@web-api/applicationContext';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { environment } from '@web-api/environment';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

export const getDownloadPolicyUrl = async ({
  applicationContext,
  key,
  urlTtl = 120,
  useTempBucket = false,
}: {
  applicationContext: ServerApplicationContext;
  filename?: string;
  key: string;
  urlTtl?: number;
  useTempBucket?: boolean;
}): Promise<{ url: string }> => {
  const privateKey = await applicationContext
    .getSecretsGateway()
    .getSecret({ secretName: 'exp4_cloudfront_signing_private_key_delete_me' });

  if (!privateKey) {
    throw new Error('Could not get cloudfront private key for signing');
  }

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
