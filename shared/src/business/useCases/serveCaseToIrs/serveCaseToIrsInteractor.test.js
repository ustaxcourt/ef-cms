const sinon = require('sinon');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { MOCK_CASE } = require('../../../test/mockCase');
const { serveCaseToIrsInteractor } = require('./serveCaseToIrsInteractor');
const { User } = require('../../entities/User');

const MOCK_WORK_ITEMS = [
  {
    assigneeId: null,
    assigneeName: 'IRSBatchSystem',
    caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    caseStatus: Case.STATUS_TYPES.inProgress,
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

const MOCK_PDF_DATA =
  'JVBERi0xLjcKJYGBgYEKCjUgMCBvYmoKPDwKL0ZpbHRlciAvRmxhdGVEZWNvZGUKL0xlbm' +
  'd0aCAxMDQKPj4Kc3RyZWFtCniccwrhMlAAwaJ0Ln2P1Jyy1JLM5ERdc0MjCwUjE4WQNC4Q' +
  '6cNlCFZkqGCqYGSqEJLLZWNuYGZiZmbkYuZsZmlmZGRgZmluDCQNzc3NTM2NzdzMXMxMjQ' +
  'ztFEKyuEK0uFxDuAAOERdVCmVuZHN0cmVhbQplbmRvYmoKCjYgMCBvYmoKPDwKL0ZpbHRl' +
  'ciAvRmxhdGVEZWNvZGUKL1R5cGUgL09ialN0bQovTiA0Ci9GaXJzdCAyMAovTGVuZ3RoID' +
  'IxNQo+PgpzdHJlYW0KeJxVj9GqwjAMhu/zFHkBzTo3nCCCiiKIHPEICuJF3cKoSCu2E8/b' +
  '20wPIr1p8v9/8kVhgilmGfawX2CGaVrgcAi0/bsy0lrX7IGWpvJ4iJYEN3gEmrrGBlQwGs' +
  'HHO9VBX1wNrxAqMX87RBD5xpJuddqwd82tjAHxzV1U5LPgy52DKXWnr1Lheg+j/c/pzGVr' +
  'iqV0VlwZPXGPCJjElw/ybkwUmeoWgxesDXGhHJC/D/iikp1Av80ptKU0FdBEe25pPihAM1' +
  'u6ytgaaWfs2Hrz35CJT1+EWmAKZW5kc3RyZWFtCmVuZG9iagoKNyAwIG9iago8PAovU2l6' +
  'ZSA4Ci9Sb290IDIgMCBSCi9GaWx0ZXIgL0ZsYXRlRGVjb2RlCi9UeXBlIC9YUmVmCi9MZW' +
  '5ndGggMzgKL1cgWyAxIDIgMiBdCi9JbmRleCBbIDAgOCBdCj4+CnN0cmVhbQp4nBXEwREA' +
  'EBAEsCwz3vrvRmOOyyOoGhZdutHN2MT55fIAVocD+AplbmRzdHJlYW0KZW5kb2JqCgpzdG' +
  'FydHhyZWYKNTEwCiUlRU9G';

describe('serveCaseToIrsInteractor', () => {
  let deleteWorkItemFromInboxStub = sinon.stub().resolves(null);
  let zipDocumentsStub = sinon.stub().resolves(null);
  let deleteDocumentStub = sinon.stub().resolves(null);
  let updateCaseStub = sinon.stub().resolves(null);
  let updateWorkItemStub = sinon.stub().resolves(null);
  let putWorkItemInUsersOutboxStub = sinon.stub().resolves(null);
  let generateCaseConfirmationPdfStub = jest.fn();
  let appendPaperServiceAddressPageToPdfStub = jest.fn();

  let applicationContext;
  let mockCase;

  beforeEach(() => {
    deleteWorkItemFromInboxStub = sinon.stub().resolves(null);
    zipDocumentsStub = sinon.stub().resolves(null);
    deleteDocumentStub = sinon.stub().resolves(null);
    updateCaseStub = sinon.stub().resolves(null);
    updateWorkItemStub = sinon.stub().resolves(null);
    putWorkItemInUsersOutboxStub = sinon.stub().resolves(null);

    mockCase = MOCK_CASE;
    mockCase.documents[0].workItems = MOCK_WORK_ITEMS;
    applicationContext = {
      environment: { stage: 'local' },
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

  it('should not return a paper service pdf when the case is electronic', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
    };
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'bob',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getEntityConstructors: () => ({
        Case,
        DocketRecord,
      }),
      getPersistenceGateway: () => {
        return {
          deleteDocument: deleteDocumentStub,
          deleteWorkItemFromInbox: deleteWorkItemFromInboxStub,
          getCaseByCaseId: () => Promise.resolve(mockCase),
          getDocumentQCInboxForSection: () => Promise.resolve(MOCK_WORK_ITEMS),
          putWorkItemInUsersOutbox: putWorkItemInUsersOutboxStub,
          updateCase: updateCaseStub,
          updateWorkItem: updateWorkItemStub,
          zipDocuments: zipDocumentsStub,
        };
      },
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCaseHelpers: () => {
        return {
          appendPaperServiceAddressPageToPdf: appendPaperServiceAddressPageToPdfStub,
          generateCaseConfirmationPdf: generateCaseConfirmationPdfStub,
        };
      },
      getUtilities: () => ({
        formatDateString: () => '12/27/18',
      }),
    };

    const result = await serveCaseToIrsInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(appendPaperServiceAddressPageToPdfStub).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should return a paper service pdf when the case is paper', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: true,
      mailingDate: 'some day',
    };
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'bob',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getEntityConstructors: () => ({
        Case,
        DocketRecord,
      }),
      getPersistenceGateway: () => {
        return {
          deleteDocument: deleteDocumentStub,
          deleteWorkItemFromInbox: deleteWorkItemFromInboxStub,
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
        appendPaperServiceAddressPageToPdf: appendPaperServiceAddressPageToPdfStub,
        generateCaseConfirmationPdf: () => {
          return MOCK_PDF_DATA;
        },
      }),
      getUtilities: () => ({
        formatDateString: () => '12/27/18',
      }),
    };

    const result = await serveCaseToIrsInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(appendPaperServiceAddressPageToPdfStub).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
