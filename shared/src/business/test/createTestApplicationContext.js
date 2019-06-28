const docketNumberGenerator = require('../../persistence/dynamo/cases/docketNumberGenerator');

const {
  addWorkItemToSectionInbox,
} = require('../../persistence/dynamo/workitems/addWorkItemToSectionInbox');
const {
  createWorkItem: createWorkItemPersistence,
} = require('../../persistence/dynamo/workitems/createWorkItem');
const {
  deleteWorkItemFromInbox,
} = require('../../persistence/dynamo/workitems/deleteWorkItemFromInbox');
const {
  getCaseByCaseId,
} = require('../../persistence/dynamo/cases/getCaseByCaseId');
const {
  getSentWorkItemsForSection: getSentWorkItemsForSectionPersistence,
} = require('../../persistence/dynamo/workitems/getSentWorkItemsForSection');
const {
  getSentWorkItemsForUser: getSentWorkItemsForUserPersistence,
} = require('../../persistence/dynamo/workitems/getSentWorkItemsForUser');
const {
  getUserById: getUserByIdPersistence,
} = require('../../persistence/dynamo/users/getUserById');
const {
  getWorkItemById: getWorkItemByIdPersistence,
} = require('../../persistence/dynamo/workitems/getWorkItemById');
const {
  getWorkItemsBySection: getWorkItemsBySectionPersistence,
} = require('../../persistence/dynamo/workitems/getWorkItemsBySection');
const {
  getWorkItemsForUser: getWorkItemsForUserPersistence,
} = require('../../persistence/dynamo/workitems/getWorkItemsForUser');
const {
  incrementCounter,
} = require('../../persistence/dynamo/helpers/incrementCounter');
const {
  PetitionFromPaperWithoutFiles,
} = require('../entities/PetitionFromPaperWithoutFiles');
const {
  putWorkItemInOutbox,
} = require('../../persistence/dynamo/workitems/putWorkItemInOutbox');
const {
  saveWorkItemForNonPaper,
} = require('../../persistence/dynamo/workitems/saveWorkItemForNonPaper');
const {
  saveWorkItemForPaper,
} = require('../../persistence/dynamo/workitems/saveWorkItemForPaper');
const {
  setWorkItemAsRead,
} = require('../../persistence/dynamo/workitems/setWorkItemAsRead');
const {
  updateWorkItem,
} = require('../../persistence/dynamo/workitems/updateWorkItem');
const {
  updateWorkItemInCase,
} = require('../../persistence/dynamo/cases/updateWorkItemInCase');
const {
  verifyCaseForUser,
} = require('../../persistence/dynamo/cases/verifyCaseForUser');
const { createCase } = require('../../persistence/dynamo/cases/createCase');
const { createMockDocumentClient } = require('./createMockDocumentClient');
const { PetitionWithoutFiles } = require('../entities/PetitionWithoutFiles');
const { updateCase } = require('../../persistence/dynamo/cases/updateCase');
const { User } = require('../entities/User');

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
      CaseExternal: PetitionWithoutFiles,
      CaseInternal: PetitionFromPaperWithoutFiles,
    }),
    getPersistenceGateway: () => {
      return {
        addWorkItemToSectionInbox,
        createCase,
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
        saveWorkItemForNonPaper,
        saveWorkItemForPaper,
        setWorkItemAsRead,
        updateCase,
        updateWorkItem,
        updateWorkItemInCase,
        verifyCaseForUser,
      };
    },
    isAuthorizedForWorkItems: () => true,
  };
  return applicationContext;
};

exports.createTestApplicationContext = createTestApplicationContext;
