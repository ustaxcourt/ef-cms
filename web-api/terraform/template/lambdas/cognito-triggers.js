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
  getUserCaseMappingsByDocketNumber,
} = require('../../../../shared/src/persistence/dynamo/cases/getUserCaseMappingsByDocketNumber');
const {
  getWebSocketConnectionsByUserId,
} = require('../../../../shared/src/persistence/dynamo/notifications/getWebSocketConnectionsByUserId');
const {
  persistUser,
} = require('../../../../shared/src/persistence/dynamo/users/persistUser');
const {
  sendNotificationToUser,
} = require('../../../../shared/src/notifications/sendNotificationToUser');
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
  updateIrsPractitionerOnCase,
  updatePrivatePractitionerOnCase,
} = require('../../../../shared/src/persistence/dynamo/cases/updatePractitionerOnCase');
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
  getNotificationClient: ({ endpoint }) => {
    return new AWS.ApiGatewayManagementApi({
      endpoint,
      httpOptions: {
        timeout: 900000, // 15 minutes
      },
    });
  },
  getNotificationGateway: () => ({
    sendNotificationToUser,
  }),
  getPersistenceGateway: () => ({
    getCaseByDocketNumber,
    getDocketNumbersByUser,
    getUserById,
    getUserCaseMappingsByDocketNumber,
    getWebSocketConnectionsByUserId,
    persistUser,
    updateCase,
    updateIrsPractitionerOnCase,
    updatePrivatePractitionerOnCase,
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
