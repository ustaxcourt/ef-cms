import { applicationContext } from '../test/createTestApplicationContext';
import { documentUrlTranslator } from './documentUrlTranslator';

describe('documentUrlTranslator', () => {
  const documentUrl =
    'https://s3.region-name.amazonaws.com/bucketName/documentPath?AWSAccessKeyId=KeyId&Expires=999&Signature=SignatureString';

  test('the original url is returned when the environment’s stage is local', () => {
    applicationContext.environment.stage = 'local';

    const translatedUrl = documentUrlTranslator({
      applicationContext,
      documentUrl,
      useTempBucket: false,
    });

    expect(translatedUrl).toBe(documentUrl);
  });

  test('temporary documents are rewritten to the app host’s cloudfront temp-documents endpoint', () => {
    applicationContext.environment.stage = 'prod';

    const translatedUrl = documentUrlTranslator({
      applicationContext,
      documentUrl,
      useTempBucket: true,
    });

    const expectedUrl =
      'https://localhost:1234/temp-documents/documentPath?AWSAccessKeyId=KeyId&Expires=999&Signature=SignatureString';
    expect(translatedUrl).toBe(expectedUrl);
  });

  test('non-temporary documents are rewritten to the app host’s cloudfront document endpoint', () => {
    applicationContext.environment.stage = 'prod';

    const translatedUrl = documentUrlTranslator({
      applicationContext,
      documentUrl,
      useTempBucket: false,
    });

    const expectedUrl =
      'https://localhost:1234/documents/documentPath?AWSAccessKeyId=KeyId&Expires=999&Signature=SignatureString';
    expect(translatedUrl).toBe(expectedUrl);
  });
});
