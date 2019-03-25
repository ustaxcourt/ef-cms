const assert = require('assert');
const {
  sendPetitionToIRSHoldingQueue,
} = require('./sendPetitionToIRSHoldingQueueInteractor');
const { getCase } = require('./getCaseInteractor');
const { omit } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');
const { Case } = require('../entities/Case');

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
      documentType: Case.documentTypes.petitionFile,
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
          name: 'bob',
          role: 'petitionsclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(mockCase),
          saveCase: ({ caseToSave }) => Promise.resolve(new Case(caseToSave)),
        };
      },
      getUseCases: () => ({ getCase }),
    };
  });

  it('sets the case status to Batched for IRS', async () => {
    const result = await sendPetitionToIRSHoldingQueue({
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
      await sendPetitionToIRSHoldingQueue({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'Unauthorized for send to IRS Holding Queue',
    );
  });

  it('case not found if caseId does not exist', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          role: 'petitionsclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => null,
          saveCase: () => null,
        };
      },
      getUseCases: () => ({ getCase }),
    };
    let error;
    try {
      await sendPetitionToIRSHoldingQueue({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        userId: 'petitionsclerk',
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
    expect(error.message).toContain(
      'Case c54ba5a9-b37b-479d-9201-067ec6e335ba was not found',
    );
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({ role: 'petitionsclerk', userId: 'petitionsclerk' });
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () =>
            Promise.resolve(omit(MOCK_CASE, 'docketNumber')),
        };
      },
      getUseCases: () => ({ getCase }),
    };
    let error;
    try {
      await sendPetitionToIRSHoldingQueue({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'petitionsclerk',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "docketNumber" fails because ["docketNumber" is required]',
    );
  });
});
