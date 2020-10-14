const AWS = require('aws-sdk');
const {
  createPetitionerAccountInteractor,
} = require('../../../../shared/src/business/useCases/users/createPetitionerAccountInteractor');
const {
  persistUser,
} = require('../../../../shared/src/persistence/dynamo/users/persistUser');

const { DynamoDB } = AWS;

const applicationContext = {
  getDocumentClient: () => {
    return new DynamoDB.DocumentClient({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
  },
  getEnvironment: () => ({
    dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME,
    stage: process.env.STAGE,
  }),
  getPersistenceGateway: () => ({
    persistUser,
  }),
  getUseCases: () => ({
    createPetitionerAccountInteractor,
  }),
};

exports.applicationContext = applicationContext;

exports.handler = async event => {
  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const { email, name, sub: userId } = event.request.userAttributes;

    await applicationContext.getUseCases().createPetitionerAccountInteractor({
      applicationContext,
      email,
      name,
      userId,
    });
  }

  return event;
};
