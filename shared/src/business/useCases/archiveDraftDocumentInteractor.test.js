const {
  archiveDraftDocumentInteractor,
} = require('./archiveDraftDocumentInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');

describe('archiveDraftDocumentInteractor', () => {
  it('returns an unauthorized error on non petitionsclerk users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      archiveDraftDocumentInteractor({
        applicationContext,
        docketNumber: '101-20',
        documentId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('expect the updated case to contain the archived document', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await archiveDraftDocumentInteractor({
      applicationContext,
      docketNumber: '101-20',
      documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });

    expect(
      applicationContext
        .getPersistenceGateway()
        .updateCase.mock.calls[0][0].caseToUpdate.documents.find(
          d => d.documentId === 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        ),
    ).toMatchObject({
      archived: true,
      documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
  });
});
