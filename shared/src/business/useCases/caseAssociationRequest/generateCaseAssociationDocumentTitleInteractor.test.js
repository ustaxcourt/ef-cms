const {
  CaseAssociationRequestFactory,
} = require('../../entities/CaseAssociationRequestFactory');
const {
  generateCaseAssociationDocumentTitleInteractor,
} = require('./generateCaseAssociationDocumentTitleInteractor');

describe('generateCaseAssociationDocumentTitle', () => {
  let applicationContext;

  it('generates a document title', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getEntityConstructors: () => ({
        CaseAssociationRequestFactory,
      }),
    };
    const title = await generateCaseAssociationDocumentTitleInteractor({
      applicationContext,
      caseAssociationRequest: {
        documentTitleTemplate: 'Substitution of counsel for [Petitioner Names]',
        documentType: 'Substitution of counsel',
        representingPrimary: true,
      },
      contactPrimaryName: 'Test Petitioner',
      contactSecondaryName: 'Another Petitioner',
    });
    expect(title).toEqual('Substitution of counsel for Petr. Test Petitioner');
  });
});
