const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateCaseAssociationDocumentTitleInteractor,
} = require('./generateCaseAssociationDocumentTitleInteractor');

describe('generateCaseAssociationDocumentTitle', () => {
  it('generates a document title', async () => {
    const title = await generateCaseAssociationDocumentTitleInteractor({
      applicationContext,
      caseAssociationRequest: {
        documentTitleTemplate: 'Substitution of Counsel for [Petitioner Names]',
        documentType: 'Substitution of Counsel',
        representingPrimary: true,
      },
      contactPrimaryName: 'Test Petitioner',
      contactSecondaryName: 'Another Petitioner',
    });

    expect(title).toEqual('Substitution of Counsel for Petr. Test Petitioner');
  });
});
