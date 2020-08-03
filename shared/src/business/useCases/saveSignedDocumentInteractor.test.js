const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  PETITIONS_SECTION,
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
  const mockParentMessageId = 'b3bc3773-6ddd-439d-a3c9-60d6beceff99';

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

    applicationContext
      .getPersistenceGateway()
      .getMessageThreadByParentId.mockReturnValue([
        {
          caseStatus: mockCase.status,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-03-01T21:40:46.415Z',
          docketNumber: mockCase.docketNumber,
          docketNumberWithSuffix: mockCase.docketNumber,
          from: 'Test Petitionsclerk',
          fromSection: PETITIONS_SECTION,
          fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
          message: 'hey there',
          messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
          parentMessageId: mockParentMessageId,
          subject: 'hello',
          to: 'Test Petitionsclerk2',
          toSection: PETITIONS_SECTION,
          toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
        },
      ]);
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
    const { caseEntity } = await saveSignedDocumentInteractor({
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
    expect(signedDocumentEntity.documentId).toEqual(mockSignedDocumentId);
    expect(signedDocumentEntity.isDraft).toEqual(true);
    expect(signedDocumentEntity.signedJudgeName).toEqual('Guy Fieri');
    expect(signedDocumentEntity.documentType).toEqual('Stipulated Decision');
  });

  it("should set the document's processing status to complete", async () => {
    const { caseEntity } = await saveSignedDocumentInteractor({
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
    const { caseEntity } = await saveSignedDocumentInteractor({
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

  it('should add the signed document to the latest message in the message thread if parentMessageId is included and the original document is a Proposed Stipulated Decision', async () => {
    await saveSignedDocumentInteractor({
      applicationContext,
      docketNumber: mockCase.docketNumber,
      nameForSigning: 'Guy Fieri',
      originalDocumentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      parentMessageId: mockParentMessageId,
      signedDocumentId: mockSignedDocumentId,
    });

    expect(
      applicationContext.getPersistenceGateway().updateMessage,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateMessage.mock.calls[0][0]
        .message,
    ).toMatchObject({
      attachments: [
        {
          documentId: mockSignedDocumentId,
          documentTitle: 'Stipulated Decision',
        },
      ],
    });
  });
});
