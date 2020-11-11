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

let s3Cache;
let dynamoClientCache = {};

const { DynamoDB, S3, SQS } = AWS;
const sqs = () => {
  return new SQS({ region: 'us-east-1' });
};
const environment = {
  documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
  dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  masterDynamoDbEndpoint:
    process.env.MASTER_DYNAMODB_ENDPOINT || 'dynamodb.us-east-1.amazonaws.com',
  masterRegion: process.env.MASTER_REGION || 'us-east-1',
  region: process.env.AWS_REGION || 'us-east-1',
  s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
};
const getDocumentClient = ({ useMasterRegion = false } = {}) => {
  const type = useMasterRegion ? 'master' : 'region';
  if (!dynamoClientCache[type]) {
    dynamoClientCache[type] = new DynamoDB.DocumentClient({
      endpoint: useMasterRegion
        ? environment.masterDynamoDbEndpoint
        : environment.dynamoDbEndpoint,
      region: useMasterRegion ? environment.masterRegion : environment.region,
    });
  }
  return dynamoClientCache[type];
};

const applicationContext = {
  environment,
  getDocumentClient,
  getDocumentsBucketName: () => {
    return environment.documentsBucketName;
  },
  getPdfJs: async () => {
    const pdfjsLib = require('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

    return pdfjsLib;
  },
  getPersistenceGateway: () => ({
    getCaseByDocketNumber,
    saveDocumentFromLambda,
    updateCase,
  }),
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
