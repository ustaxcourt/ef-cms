const {
  setWorkItemAsReadInteractor,
} = require('./setWorkItemAsReadInteractor');
const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
const { MOCK_CASE } = require('../../../test/mockCase');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const MOCK_WORK_ITEM = {
  assigneeId: null,
  assigneeName: 'IRSBatchSystem',
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  caseStatus: Case.STATUS_TYPES.batchedForIRS,
  completedAt: '2018-12-27T18:06:02.968Z',
  completedBy: 'Petitioner',
  completedByUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  createdAt: '2018-12-27T18:06:02.971Z',
  docketNumber: '101-18',
  docketNumberSuffix: 'S',
  document: {
    createdAt: '2018-12-27T18:06:02.968Z',
    documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    documentType: Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
  },
  isInitializeCase: true,
  isQC: true,
  messages: [
    {
      createdAt: '2018-12-27T18:06:02.968Z',
      from: 'Petitioner',
      fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'Petition ready for review',
      messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
      role: User.ROLES.petitioner,
      to: null,
    },
  ],
  section: 'irsBatchSection',
  sentBy: 'petitioner',
  updatedAt: '2018-12-27T18:06:02.968Z',
  workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
};

describe('setWorkItemAsReadInteractor', () => {
  it('unauthorized user tries to invoke this interactor', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'baduser',
      }),
    };
    let error;
    try {
      await setWorkItemAsReadInteractor({
        applicationContext,
        messageId: 'abc',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('returns the expected result', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        role: User.ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: async () => {
          const mockCase = MOCK_CASE;
          mockCase.documents = mockCase.documents.map(document => ({
            ...document,
            workItems: [{ ...MOCK_WORK_ITEM }],
          }));
          return mockCase;
        },
        getWorkItemById: async () => MOCK_WORK_ITEM,
        setWorkItemAsRead: async () => [],
        updateCase: async () => {},
      }),
    };

    const res = await setWorkItemAsReadInteractor({
      applicationContext,
      workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
    });
    expect(res).toBeTruthy();
  });
});
