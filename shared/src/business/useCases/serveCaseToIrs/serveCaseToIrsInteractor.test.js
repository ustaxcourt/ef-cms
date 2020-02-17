const sinon = require('sinon');
const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
const { MOCK_CASE } = require('../../../test/mockCase');
const { serveCaseToIrsInteractor } = require('./serveCaseToIrsInteractor');
const { User } = require('../../entities/User');

const MOCK_WORK_ITEMS = [
  {
    assigneeId: null,
    assigneeName: 'IRSBatchSystem',
    caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    caseStatus: Case.STATUS_TYPES.batchedForIRS,
    completedAt: '2018-12-27T18:06:02.968Z',
    completedBy: 'Petitioner',
    completedByUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    createdAt: '2018-12-27T18:06:02.971Z',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      createdAt: '2018-12-27T18:06:02.968Z',
      documentId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
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
  },
];

describe('serveCaseToIrsInteractor', () => {
  let deleteWorkItemFromSectionStub = sinon.stub().resolves(null);
  let zipDocumentsStub = sinon.stub().resolves(null);
  let deleteDocumentStub = sinon.stub().resolves(null);
  let updateCaseStub = sinon.stub().resolves(null);
  let updateWorkItemStub = sinon.stub().resolves(null);
  let putWorkItemInUsersOutboxStub = sinon.stub().resolves(null);

  let applicationContext;
  let mockCase;

  beforeEach(() => {
    deleteWorkItemFromSectionStub = sinon.stub().resolves(null);
    zipDocumentsStub = sinon.stub().resolves(null);
    deleteDocumentStub = sinon.stub().resolves(null);
    updateCaseStub = sinon.stub().resolves(null);
    updateWorkItemStub = sinon.stub().resolves(null);
    putWorkItemInUsersOutboxStub = sinon.stub().resolves(null);

    mockCase = MOCK_CASE;
    mockCase.documents[0].workItems = MOCK_WORK_ITEMS;
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'bob',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          deleteDocument: deleteDocumentStub,
          deleteWorkItemFromSection: deleteWorkItemFromSectionStub,
          getCaseByCaseId: () => Promise.resolve(mockCase),
          getDocumentQCInboxForSection: () => Promise.resolve(MOCK_WORK_ITEMS),

          putWorkItemInUsersOutbox: putWorkItemInUsersOutboxStub,
          updateCase: updateCaseStub,
          updateWorkItem: updateWorkItemStub,
          zipDocuments: zipDocumentsStub,
        };
      },
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCaseHelpers: () => ({
        generateCaseConfirmationPdf: () => {},
      }),
    };
  });

  it('should throw unauthorized error when user is unauthorized', async () => {
    applicationContext.getCurrentUser = () => {
      return { userId: 'notauser' };
    };
    let error;

    try {
      await serveCaseToIrsInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('Unauthorized');
  });
});
