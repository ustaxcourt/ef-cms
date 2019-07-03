const { createDocumentInteractor } = require('./createDocumentInteractor');
const { User } = require('../entities/User');

describe('createDocumentInteractor', () => {
  let applicationContext;
  let testingCaseData = {
    caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    contactPrimary: {
      name: 'Johnny Taxpayer',
    },
    createdAt: '2019-04-19T14:45:15.595Z',
    docketNumber: '101-19',
    documents: [
      {
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Answer',
        isPaper: false,
        processingStatus: 'pending',
        userId: 'petitionsclerk',
      },
    ],
    partyType: 'Petitioner',
  };

  it('throws an exception when it fails to create a document', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Test Taxpayer',
          role: 'respondent',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        getCaseByCaseId: () => ({ ...testingCaseData, isPaper: 'asf' }),
        saveWorkItemForNonPaper: () => null,
        updateCase: () => null,
      }),
    };

    let error;

    try {
      await createDocumentInteractor({
        applicationContext,
        caseId: testingCaseData.caseId,
        document: testingCaseData.documents[0],
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('creates a document successfully', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Test Taxpayer',
          role: 'respondent',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        getCaseByCaseId: () => testingCaseData,
        saveWorkItemForNonPaper: () => null,
        updateCase: () => null,
      }),
    };

    let error;

    try {
      await createDocumentInteractor({
        applicationContext,
        caseId: testingCaseData.caseId,
        document: testingCaseData.documents[0],
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
  });
});
