const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../entities/EntityConstants');
const {
  saveSignedDocumentInteractor,
} = require('./saveSignedDocumentInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');

describe('saveSignedDocumentInteractor', () => {
  let mockCase;

  const mockSigningName = 'Guy Fieri';
  const mockDocumentIdBeforeSignature = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3857';
  const mockSignedDocumentId = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3858';
  const mockOriginalDocumentId = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859';

  beforeAll(() => {
    mockCase = {
      ...MOCK_CASE,
      caseCaption: ',',
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);

    applicationContext.getUniqueId.mockReturnValue(
      mockDocumentIdBeforeSignature,
    );
  });

  it('should save the original, unsigned document to S3 with a new id', async () => {
    await saveSignedDocumentInteractor({
      applicationContext,
      docketNumber: mockCase.docketNumber,
      nameForSigning: mockSigningName,
      originalDocumentId: mockOriginalDocumentId,
      signedDocumentId: mockSignedDocumentId,
    });

    expect(applicationContext.getUniqueId).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      documentId: mockDocumentIdBeforeSignature,
    });
  });

  it('should replace the original, unsigned document with the signed document', async () => {
    await saveSignedDocumentInteractor({
      applicationContext,
      docketNumber: mockCase.docketNumber,
      nameForSigning: mockSigningName,
      originalDocumentId: mockOriginalDocumentId,
      signedDocumentId: mockSignedDocumentId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[1][0],
    ).toMatchObject({
      documentId: mockOriginalDocumentId,
    });
  });

  it('should add the signed Stipulated Decision to the case given a Proposed Stipulated Decision', async () => {
    const caseEntity = await saveSignedDocumentInteractor({
      applicationContext,
      docketNumber: mockCase.docketNumber,
      nameForSigning: 'Guy Fieri',
      originalDocumentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      signedDocumentId: mockSignedDocumentId,
    });

    expect(caseEntity.documents.length).toEqual(MOCK_DOCUMENTS.length + 1);

    const signedDocumentEntity = caseEntity.documents.find(
      document =>
        document.documentType === 'Stipulated Decision' &&
        document.documentId === mockSignedDocumentId,
    );

    expect(signedDocumentEntity.isPaper).toEqual(false);
    expect(signedDocumentEntity.signedJudgeName).toEqual('Guy Fieri');
    expect(signedDocumentEntity.documentType).toEqual('Stipulated Decision');
  });

  it("should set the document's processing status to complete", async () => {
    const caseEntity = await saveSignedDocumentInteractor({
      applicationContext,
      docketNumber: mockCase.docketNumber,
      nameForSigning: mockSigningName,
      originalDocumentId: mockOriginalDocumentId,
      signedDocumentId: mockSignedDocumentId,
    });

    const signedDocument = caseEntity.documents.find(
      doc => doc.documentId === mockOriginalDocumentId,
    );
    expect(signedDocument.processingStatus).toBe(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
  });

  it('should set the documentIdBeforeSignature', async () => {
    const caseEntity = await saveSignedDocumentInteractor({
      applicationContext,
      docketNumber: mockCase.docketNumber,
      nameForSigning: mockSigningName,
      originalDocumentId: mockOriginalDocumentId,
      signedDocumentId: mockSignedDocumentId,
    });

    const signedDocument = caseEntity.documents.find(
      doc => doc.documentId === mockOriginalDocumentId,
    );
    expect(signedDocument.documentIdBeforeSignature).toBe(
      mockDocumentIdBeforeSignature,
    );
  });
});
