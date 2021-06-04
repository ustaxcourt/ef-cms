const AWS = require('aws-sdk');
const {
  createLogger,
} = require('../../../../shared/src/utilities/createLogger');
const {
  createPetitionerAccountInteractor,
} = require('../../../../shared/src/business/useCases/users/createPetitionerAccountInteractor');
const {
  getCaseByDocketNumber,
} = require('../../../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber');
const {
  getDocketNumbersByUser,
} = require('../../../../shared/src/persistence/dynamo/cases/getDocketNumbersByUser');
const {
  getUserById,
} = require('../../../../shared/src/persistence/dynamo/users/getUserById');
const {
  persistUser,
} = require('../../../../shared/src/persistence/dynamo/users/persistUser');
const {
  setUserEmailFromPendingEmailInteractor,
} = require('../../../../shared/src/business/useCases/users/setUserEmailFromPendingEmailInteractor');
const {
  updateCase,
} = require('../../../../shared/src/persistence/dynamo/cases/updateCase');
const {
  updateCaseAndAssociations,
} = require('../../../../shared/src/business/useCaseHelper/caseAssociation/updateCaseAndAssociations');
const {
  updateUser,
} = require('../../../../shared/src/persistence/dynamo/users/updateUser');

const { DynamoDB } = AWS;
const logger = createLogger({
  defaultMeta: {
    environment: {
      stage: process.env.STAGE || 'local',
    },
  },
});

const applicationContext = {
  getCurrentUser: () => ({}),
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
    getCaseByDocketNumber,
    getDocketNumbersByUser,
    getUserById,
    persistUser,
    updateCase,
    updateUser,
  }),
  getUseCaseHelpers: () => ({ updateCaseAndAssociations }),
  getUseCases: () => ({
    createPetitionerAccountInteractor,
    setUserEmailFromPendingEmailInteractor,
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
      .createPetitionerAccountInteractor(applicationContext, {
        email,
        name,
        userId,
      });

    applicationContext.logger.info('Petitioner signup processed', {
      event,
      user,
    });
  } else if (event.triggerSource === 'PostAuthentication_Authentication') {
    const { email, sub } = event.request.userAttributes;
    const userId = event.request.userAttributes['custom:userId'] || sub;

    const userFromPersistence = await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId });

    if (
      userFromPersistence &&
      userFromPersistence.pendingEmail &&
      userFromPersistence.pendingEmail === email
    ) {
      const updatedUser = await applicationContext
        .getUseCases()
        .setUserEmailFromPendingEmailInteractor(applicationContext, {
          user: userFromPersistence,
        });

      applicationContext.logger.info(
        'Petitioner post authentication processed',
        {
          event,
          updatedUser,
        },
      );
    }
  }

  return event;
};
