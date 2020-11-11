const AWS = require('aws-sdk');
const {
  parseLegacyDocumentsInteractor,
} = require('../../../../shared/src/business/useCases/migration/parseLegacyDocumentsInteractor');
const {
  getCaseByDocketNumber,
} = require('../../../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber');
const {
  updateCase,
} = require('../../../../shared/src/persistence/dynamo/cases/updateCase');
const {
  saveDocumentFromLambda,
} = require('../../../../shared/src/persistence/s3/saveDocumentFromLambda');
import {
  getUniqueId,
} from '../../../../shared/src/sharedAppContext';

const {
  S3,
  SQS
} = AWS;
const sqs = () => {
  return new SQS({  region: 'us-east-1' });
}
const environment = {
  s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
  documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
};
let s3Cache;

const applicationContext = {
  environment,
  getPersistenceGateway: () => {
    getCaseByDocketNumber,
    updateCase,
    saveDocumentFromLambda
  },
  getUseCases: () => ({
    parseLegacyDocumentsInteractor,
  }),
  getUtilities: () => ({
    scrapePdfContents,
  }),
  getUniqueId,
  getStorageClient: () => {
    if (!s3Cache) {
      s3Cache = new S3({
        endpoint: environment.s3Endpoint,
        region: 'us-east-1',
        s3ForcePathStyle: true,
      });
    }
    return s3Cache;
  }
};

exports.applicationContext = applicationContext;

exports.handler = async event => {
  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { docketEntryId, docketNumber } = JSON.parse(body);

  console.log(
    `About to process legacy document for case:${docketNumber}, docketEntryId: ${docketEntryId}`,
  );

  await applicationContext.getUseCases().parseLegacyDocumentsInteractor({
    applicationContext,
    docketEntryId,
    docketNumber,
  });

  await sqs
    .deleteMessage({
      QueueUrl: process.env.MIGRATE_LEGACY_DOCUMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
