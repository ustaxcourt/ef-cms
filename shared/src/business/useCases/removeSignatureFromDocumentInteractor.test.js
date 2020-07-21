const {
  removeSignatureFromDocumentInteractor,
} = require('./removeSignatureFromDocumentInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');

describe('removeSignatureFromDocumentInteractor', () => {
  let mockCase;

  const mockDocumentId = 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
  const mockDocumentIdBeforeSignature = 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3858';

  beforeAll(() => {
    mockCase = {
      ...MOCK_CASE,
      documents: [
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketNumber: '101-18',
          documentId: mockDocumentId,
          documentIdBeforeSignature: mockDocumentIdBeforeSignature,
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          processingStatus: 'pending',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);
  });

  it('should retrieve the original, unsigned document from S3', async () => {
    await removeSignatureFromDocumentInteractor({
      applicationContext,
      caseId: mockCase.caseId,
      documentId: mockDocumentId,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument.mock.calls[0][0],
    ).toMatchObject({
      documentId: mockDocumentIdBeforeSignature,
      protocol: 'S3',
      useTempBucket: false,
    });
  });

  it('should overwrite the current, signed document in S3 with the original, unsigned document', async () => {
    await removeSignatureFromDocumentInteractor({
      applicationContext,
      caseId: mockCase.caseId,
      documentId: mockDocumentId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      documentId: mockDocumentId,
    });
  });

  it('should unsign the document and save the updated document to the case', async () => {
    const updatedCase = await removeSignatureFromDocumentInteractor({
      applicationContext,
      caseId: mockCase.caseId,
      documentId: mockDocumentId,
    });

    const unsignedDocument = updatedCase.documents.find(
      doc => doc.documentId === mockDocumentId,
    );
    expect(unsignedDocument).toMatchObject({
      signedAt: null,
      signedByUserId: null,
      signedJudgeName: null,
    });
  });
});
