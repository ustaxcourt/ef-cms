const AWS = require('aws-sdk');
const {
  getCaseByDocketNumber,
} = require('../../../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber');
const {
  parseLegacyDocumentsInteractor,
} = require('../../../../shared/src/business/useCases/migration/parseLegacyDocumentsInteractor');
const {
  saveDocumentFromLambda,
} = require('../../../../shared/src/persistence/s3/saveDocumentFromLambda');
const {
  scrapePdfContents,
} = require('../../../../shared/src/business/utilities/scrapePdfContents');
import { getUniqueId } from '../../../../shared/src/sharedAppContext';
const {
  updateCase,
} = require('../../../../shared/src/persistence/dynamo/cases/updateCase');

const { S3, SQS } = AWS;
const sqs = () => {
  return new SQS({ region: 'us-east-1' });
};
const environment = {
  documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
  s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
};
let s3Cache;

const applicationContext = {
  environment,
  getDocumentsBucketName: () => {
    return environment.documentsBucketName;
  },
  getPersistenceGateway: () => {
    getCaseByDocketNumber, updateCase, saveDocumentFromLambda;
  },
  getStorageClient: () => {
    if (!s3Cache) {
      s3Cache = new S3({
        endpoint: environment.s3Endpoint,
        region: 'us-east-1',
        s3ForcePathStyle: true,
      });
    }
    return s3Cache;
  },
  getUniqueId,
  getUseCases: () => ({
    parseLegacyDocumentsInteractor,
  }),
  getUtilities: () => ({
    scrapePdfContents,
  }),
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
