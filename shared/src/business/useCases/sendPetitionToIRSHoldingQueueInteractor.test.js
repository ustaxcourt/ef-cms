const {
  sendPetitionToIRSHoldingQueueInteractor,
} = require('./sendPetitionToIRSHoldingQueueInteractor');
const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');
const { getCaseInteractor } = require('./getCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');
const { omit } = require('lodash');
const { User } = require('../entities/User');

const MOCK_WORK_ITEMS = [
  {
    assigneeId: null,
    assigneeName: 'IRSBatchSystem',
    caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    caseStatus: 'Batched for IRS',
    createdAt: '2018-12-27T18:06:02.971Z',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      createdAt: '2018-12-27T18:06:02.968Z',
      documentId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
      documentType: Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
    },
    isInitializeCase: true,
    messages: [
      {
        createdAt: '2018-12-27T18:06:02.968Z',
        from: 'Petitioner',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'Petition ready for review',
        messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
        role: 'petitioner',
        to: null,
      },
    ],
    section: 'petitions',
    sentBy: 'petitioner',
    updatedAt: '2018-12-27T18:06:02.968Z',
    workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
  },
  {
    assigneeId: null,
    assigneeName: 'Test Petitionsclerk',
    caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    caseStatus: 'Batched for IRS',
    createdAt: '2018-12-27T18:12:02.971Z',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      createdAt: '2018-12-27T18:06:02.968Z',
      documentId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
      documentType: Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
    },
    isInitializeCase: false,
    messages: [
      {
        createdAt: '2018-12-27T18:06:02.968Z',
        from: 'Petitioner',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'Test messsage',
        messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
        role: 'petitioner',
        to: null,
      },
    ],
    section: 'petitions',
    sentBy: 'petitioner',
    updatedAt: '2018-12-27T18:06:02.968Z',
    workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
  },
];
describe('Send petition to IRS Holding Queue', () => {
  let applicationContext;
  let mockCase;

  beforeEach(() => {
    mockCase = MOCK_CASE;
    mockCase.documents[0].workItems = MOCK_WORK_ITEMS;
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Petitionsclerk',
          role: 'petitionsclerk',
          userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
        });
      },
      getPersistenceGateway: () => {
        return {
          addWorkItemToSectionInbox: () => Promise.resolve(null),
          deleteWorkItemFromInbox: () => Promise.resolve(null),
          getCaseByCaseId: () => Promise.resolve(mockCase),
          getUserById: ({ userId }) => MOCK_USERS[userId],
          putWorkItemInOutbox: () => Promise.resolve(null),
          updateCase: ({ caseToUpdate }) =>
            Promise.resolve(
              new Case({ applicationContext, rawCase: caseToUpdate }),
            ),
          updateWorkItem: () => Promise.resolve(null),
        };
      },
      getUseCases: () => ({
        getCaseInteractor,
      }),
    };
  });

  it('sets the case status to Batched for IRS', async () => {
    const result = await sendPetitionToIRSHoldingQueueInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(result.status).toEqual('Batched for IRS');
  });

  it('throws unauthorized error if user is unauthorized', async () => {
    applicationContext.getCurrentUser = () => {
      return { userId: 'notauser' };
    };
    let error;
    try {
      await sendPetitionToIRSHoldingQueueInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized for update case');
  });

  it('case not found if caseId does not exist', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Petitionsclerk1',
          role: 'petitionsclerk',
          userId: 'e7d90c05-f6cd-442c-a168-202db587f16f',
        });
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => null,
          getUserById: ({ userId }) => MOCK_USERS[userId],
          updateCase: () => null,
        };
      },
      getUseCases: () => ({ getCaseInteractor }),
    };
    let error;
    try {
      await sendPetitionToIRSHoldingQueueInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        userId: 'e7d90c05-f6cd-442c-a168-202db587f16f',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toContain(
      'Case c54ba5a9-b37b-479d-9201-067ec6e335ba was not found',
    );
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Petitionsclerk1',
          role: 'petitionsclerk',
          userId: 'e7d90c05-f6cd-442c-a168-202db587f16f',
        });
      },
      getPersistenceGateway: () => {
        return {
          addWorkItemToSectionInbox: () => Promise.resolve(null),
          deleteWorkItemFromInbox: () => Promise.resolve(null),
          getCaseByCaseId: () =>
            Promise.resolve(omit(MOCK_CASE, 'docketNumber')),
          getUserById: ({ userId }) => MOCK_USERS[userId],
          putWorkItemInOutbox: () => Promise.resolve(null),
          updateCase: ({ caseToUpdate }) =>
            Promise.resolve(
              new Case({ applicationContext, rawCase: caseToUpdate }),
            ),
          updateWorkItem: () => Promise.resolve(null),
        };
      },
      getUseCases: () => ({ getCaseInteractor }),
    };
    let error;
    try {
      await sendPetitionToIRSHoldingQueueInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'e7d90c05-f6cd-442c-a168-202db587f16f',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "docketNumber" fails because ["docketNumber" is required]',
    );
  });
});
