import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

export const fallbackHandler = ({
  dynamoMethod,
  fallbackRegionDocumentClient,
  mainRegionDocumentClient,
}: {
  dynamoMethod: string;
  fallbackRegionDocumentClient: DynamoDBDocument;
  mainRegionDocumentClient: DynamoDBDocument;
}): any => {
  return params => {
    return new Promise((resolve, reject) => {
      mainRegionDocumentClient[dynamoMethod](params)
        .catch(err => {
          if (
            err.code === 'ResourceNotFoundException' ||
            err.statusCode === 503
          ) {
            return fallbackRegionDocumentClient[dynamoMethod](params);
          }
          throw err;
        })
        .then(resolve)
        .catch(reject);
    });
  };
};
