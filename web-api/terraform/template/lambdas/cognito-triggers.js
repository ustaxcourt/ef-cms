const AWS = require('aws-sdk');
const {
  createLogger,
} = require('../../../../shared/src/utilities/createLogger');
const {
  createPetitionerAccountInteractor,
} = require('../../../../shared/src/business/useCases/users/createPetitionerAccountInteractor');
const {
  persistUser,
} = require('../../../../shared/src/persistence/dynamo/users/persistUser');

const { DynamoDB } = AWS;
const logger = createLogger({
  defaultMeta: {
    environment: {
      stage: process.env.STAGE || 'local',
    },
  },
});

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
  logger: {
    debug: logger.debug.bind(logger),
    error: logger.error.bind(logger),
    info: logger.info.bind(logger),
  },
};

exports.applicationContext = applicationContext;

exports.handler = async event => {
  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const { email, name, sub: userId } = event.request.userAttributes;

    const user = await applicationContext
      .getUseCases()
      .createPetitionerAccountInteractor({
        applicationContext,
        email,
        name,
        userId,
      });

    applicationContext.logger.info('Petitioner signup processed', {
      event,
      user,
    });
  }

  return event;
};
