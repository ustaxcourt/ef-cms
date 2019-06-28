const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');
const { saveSignedDocument } = require('./saveSignedDocumentInteractor');

describe('saveSignedDocument', () => {
  it('should add the signed document to the case', async () => {
    const mockCase = {
      ...MOCK_CASE,
      caseCaption: ',',
    };
    let applicationContext = {
      getCurrentUser: () => ({ userId: '1' }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: () => mockCase,
        updateCase: () => null,
      }),
      logger: {
        time: () => null,
        timeEnd: () => null,
      },
    };

    const caseEntity = await saveSignedDocument({
      applicationContext,
      caseId: mockCase.caseId,
      originalDocumentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      signedDocumentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });

    expect(caseEntity.documents.length).toEqual(MOCK_DOCUMENTS.length + 1);
  });
});
