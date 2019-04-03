const docketNumberGenerator = require('../../persistence/dynamo/cases/docketNumberGenerator');

const { saveCase } = require('../../persistence/dynamo/cases/saveCase');
const {
  incrementCounter,
} = require('../../persistence/dynamo/helpers/incrementCounter');
const { PetitionWithoutFiles } = require('../entities/PetitionWithoutFiles');

const { User } = require('../entities/User');
const {
  getWorkItemsBySection: getWorkItemsBySectionPersistence,
} = require('../../persistence/dynamo/workitems/getWorkItemsBySection');
const {
  getWorkItemsForUser: getWorkItemsForUserPersistence,
} = require('../../persistence/dynamo/workitems/getWorkItemsForUser');
const {
  getUserById: getUserByIdPersistence,
} = require('../../persistence/dynamo/users/getUserById');
const {
  getSentWorkItemsForSection: getSentWorkItemsForSectionPersistence,
} = require('../../persistence/dynamo/workitems/getSentWorkItemsForSection');
const {
  saveWorkItem: saveWorkItemPersistence,
} = require('../../persistence/dynamo/workitems/saveWorkItem');
const {
  createWorkItem: createWorkItemPersistence,
} = require('../../persistence/dynamo/workitems/createWorkItem');
const {
  getSentWorkItemsForUser: getSentWorkItemsForUserPersistence,
} = require('../../persistence/dynamo/workitems/getSentWorkItemsForUser');

const {
  getWorkItemById: getWorkItemByIdPersistence,
} = require('../../persistence/dynamo/workitems/getWorkItemById');
const {
  getCaseByCaseId,
} = require('../../persistence/dynamo/cases/getCaseByCaseId');
const {
  deleteWorkItemFromInbox,
} = require('../../persistence/dynamo/workitems/deleteWorkItemFromInbox');
const {
  putWorkItemInOutbox,
} = require('../../persistence/dynamo/workitems/putWorkItemInOutbox');
const {
  updateWorkItem,
} = require('../../persistence/dynamo/workitems/updateWorkItem');
const {
  addWorkItemToSectionInbox,
} = require('../../persistence/dynamo/workitems/addWorkItemToSectionInbox');
const { updateCase } = require('../../persistence/dynamo/cases/updateCase');

const {
  PetitionFromPaperWithoutFiles,
} = require('../entities/PetitionFromPaperWithoutFiles');
const { createMockDocumentClient } = require('./createMockDocumentClient');

const createTestApplicationContext = ({ user } = {}) => {
  const mockDocClient = createMockDocumentClient();
  const applicationContext = {
    docketNumberGenerator,
    environment: { stage: 'local' },
    getCurrentUser: () => {
      return new User(
        user || {
          name: 'richard',
          role: 'petitioner',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        },
      );
    },
    getDocumentClient: () => mockDocClient,
    getEntityConstructors: () => ({
      Petition: PetitionWithoutFiles,
      PetitionFromPaper: PetitionFromPaperWithoutFiles,
    }),
    getPersistenceGateway: () => {
      return {
        addWorkItemToSectionInbox,
        createWorkItem: createWorkItemPersistence,
        deleteWorkItemFromInbox,
        getCaseByCaseId,

        getSentWorkItemsForSection: getSentWorkItemsForSectionPersistence,
        getSentWorkItemsForUser: getSentWorkItemsForUserPersistence,
        getUserById: getUserByIdPersistence,
        getWorkItemById: getWorkItemByIdPersistence,
        getWorkItemsBySection: getWorkItemsBySectionPersistence,
        getWorkItemsForUser: getWorkItemsForUserPersistence,
        incrementCounter,
        putWorkItemInOutbox,
        saveCase,
        saveWorkItem: saveWorkItemPersistence,
        updateCase,
        updateWorkItem,
      };
    },
    isAuthorizedForWorkItems: () => true,
  };
  return applicationContext;
};

exports.createTestApplicationContext = createTestApplicationContext;
