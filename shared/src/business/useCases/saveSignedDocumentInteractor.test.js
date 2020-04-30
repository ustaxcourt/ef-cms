const {
  saveSignedDocumentInteractor,
} = require('./saveSignedDocumentInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');

describe('saveSignedDocumentInteractor', () => {
  let mockCase;

  beforeAll(() => {
    mockCase = {
      ...MOCK_CASE,
      caseCaption: ',',
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);
  });

  it('should add the signed Stipulated Decision to the case given a Proposed Stipulated Decision', async () => {
    const caseEntity = await saveSignedDocumentInteractor({
      applicationContext,
      caseId: mockCase.caseId,
      docketNumber: MOCK_CASE.docketNumber,
      nameForSigning: 'Guy Fieri',
      originalDocumentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      signedDocumentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });

    expect(caseEntity.documents.length).toEqual(MOCK_DOCUMENTS.length + 1);

    const signedDocumentEntity = caseEntity.documents.find(
      document =>
        document.documentType === 'Stipulated Decision' &&
        document.documentId === 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    );

    expect(signedDocumentEntity.isPaper).toEqual(false);
    expect(signedDocumentEntity.signedJudgeName).toEqual('Guy Fieri');
    expect(signedDocumentEntity.documentType).toEqual('Stipulated Decision');
  });

  it('should update the current document as signed', async () => {
    const caseEntity = await saveSignedDocumentInteractor({
      applicationContext,
      caseId: mockCase.caseId,
      nameForSigning: 'Guy Fieri',
      originalDocumentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      signedDocumentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });

    expect(caseEntity.documents.length).toEqual(MOCK_DOCUMENTS.length);
  });
});
