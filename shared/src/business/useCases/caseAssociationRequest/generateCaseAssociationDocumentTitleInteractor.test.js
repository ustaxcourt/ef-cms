const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateCaseAssociationDocumentTitleInteractor,
} = require('./generateCaseAssociationDocumentTitleInteractor');

describe('generateCaseAssociationDocumentTitle', () => {
  it('generates a document title', async () => {
    const mockPrimaryId = 'df21f551-abe2-4755-80d2-d76b19528d6e';
    const title = await generateCaseAssociationDocumentTitleInteractor(
      applicationContext,
      {
        caseAssociationRequest: {
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          filers: [mockPrimaryId],
        },
        petitioners: [
          { contactId: mockPrimaryId, name: 'Test Petitioner' },
          {
            contactId: 'dc184c34-5f03-4fcb-9aff-920c737d80ff',
            name: 'Another Petitioner',
          },
        ],
      },
    );

    expect(title).toEqual('Substitution of Counsel for Petr. Test Petitioner');
  });
});
