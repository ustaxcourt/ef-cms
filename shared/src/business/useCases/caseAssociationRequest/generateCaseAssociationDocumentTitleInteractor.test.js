const {
  CaseAssociationRequest,
} = require('../../entities/CaseAssociationRequest');
const {
  generateCaseAssociationDocumentTitle,
} = require('./generateCaseAssociationDocumentTitleInteractor');

describe('generateCaseAssociationDocumentTitle', () => {
  let applicationContext;

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getEntityConstructors: () => ({
        CaseAssociationRequest,
      }),
    };
    const title = await generateCaseAssociationDocumentTitle({
      applicationContext,
      caseAssociationRequest: {
        documentTitleTemplate: 'Substitution of Counsel for [Petitioner Names]',
        representingPrimary: true,
      },
      contactPrimaryName: 'Test Petitioner',
      contactSecondaryName: 'Another Petitioner',
    });
    expect(title).toEqual('Substitution of Counsel for Petr. Test Petitioner');
  });
});
