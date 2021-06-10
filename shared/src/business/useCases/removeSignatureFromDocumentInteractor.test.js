const {
  removeSignatureFromDocumentInteractor,
} = require('./removeSignatureFromDocumentInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');

describe('removeSignatureFromDocumentInteractor', () => {
  let mockCase;

  const mockDocketEntryId = 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
  const mockDocumentIdBeforeSignature = 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3858';

  beforeAll(() => {
    mockCase = {
      ...MOCK_CASE,
      docketEntries: [
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: mockDocketEntryId,
          docketNumber: '101-18',
          documentIdBeforeSignature: mockDocumentIdBeforeSignature,
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          processingStatus: 'pending',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockReturnValue(mockCase);
  });

  it('should retrieve the original, unsigned document from S3', async () => {
    await removeSignatureFromDocumentInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument.mock.calls[0][0],
    ).toMatchObject({
      key: mockDocumentIdBeforeSignature,
      protocol: 'S3',
      useTempBucket: false,
    });
  });

  it('should overwrite the current, signed document in S3 with the original, unsigned document', async () => {
    await removeSignatureFromDocumentInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      key: mockDocketEntryId,
    });
  });

  it('should unsign the document and save the updated document to the case', async () => {
    const updatedCase = await removeSignatureFromDocumentInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockCase.docketNumber,
      },
    );

    const unsignedDocument = updatedCase.docketEntries.find(
      doc => doc.docketEntryId === mockDocketEntryId,
    );
    expect(unsignedDocument).toMatchObject({
      signedAt: null,
      signedByUserId: null,
      signedJudgeName: null,
    });
  });
});
