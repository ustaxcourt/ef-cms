const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateInitialFilingDocuments,
} = require('./updateInitialFilingDocuments');
const { Case } = require('../../../business/entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('addNewInitialFilingToCase', () => {
  const mockRQT = {
    documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3850',
    documentType: 'Request for Place of Trial',
    eventCode: 'RQT',
    filedBy: 'Test Petitioner',
    userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
  };

  let mockOriginalCase;
  let mockCaseToUpdate;

  beforeAll(() => {});

  it('should add a new initial filing document to the case when the document does not exist on the original case', async () => {
    mockOriginalCase = new Case(
      { ...MOCK_CASE, documents: [] },
      { applicationContext },
    );

    mockCaseToUpdate = {
      ...MOCK_CASE,
      documents: [...MOCK_CASE.documents, mockRQT],
    };

    await updateInitialFilingDocuments({
      applicationContext,
      caseEntity: mockOriginalCase,
      caseToUpdate: mockCaseToUpdate,
    });

    const rqtFile = mockOriginalCase.documents.find(
      d => d.documentId === mockRQT.documentId,
    );
    expect(rqtFile).toBeDefined();
  });

  it('should remove a new initial filing document from the case when the document does not exist on the case from the form', async () => {
    mockCaseToUpdate = { ...MOCK_CASE, documents: [] };
    mockOriginalCase = new Case(
      {
        ...MOCK_CASE,
        documents: [...MOCK_CASE.documents, mockRQT],
      },
      { applicationContext },
    );

    await updateInitialFilingDocuments({
      applicationContext,
      caseEntity: mockOriginalCase,
      caseToUpdate: mockCaseToUpdate,
    });

    const rqtFile = mockOriginalCase.documents.find(
      d => d.documentId === mockRQT.documentId,
    );
    expect(rqtFile).toBeUndefined();
  });

  it('should remove the original document and add the new one to the case when the document has been re-added', async () => {
    mockOriginalCase = new Case(
      { ...MOCK_CASE, documents: [...MOCK_CASE.documents, mockRQT] },
      { applicationContext },
    );

    const mockNewRQT = {
      ...mockRQT,
      documentId: applicationContext.getUniqueId(),
    };
    mockCaseToUpdate = {
      ...MOCK_CASE,
      documents: [...MOCK_CASE.documents, mockNewRQT],
    };

    await updateInitialFilingDocuments({
      applicationContext,
      caseEntity: mockOriginalCase,
      caseToUpdate: mockCaseToUpdate,
    });

    const oldRqtFile = mockOriginalCase.documents.find(
      d => d.documentId === mockRQT.documentId,
    );
    expect(oldRqtFile).toBeUndefined();
    const newRqtFile = mockOriginalCase.documents.find(
      d => d.documentId === mockNewRQT.documentId,
    );
    expect(newRqtFile).toBeDefined();
  });
});
