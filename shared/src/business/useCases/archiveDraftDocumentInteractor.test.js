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

    const {
      caseToUpdate,
    } = applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0];

    expect(
      caseToUpdate.archivedDocuments.find(
        d => d.documentId === 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      ),
    ).toMatchObject({
      archived: true,
      documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });

    expect(
      caseToUpdate.docketEntries.find(
        d => d.documentId === 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      ),
    ).toBeFalsy();
  });

  it('updates work items if there is a workItem found on the document', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          ...MOCK_CASE.docketEntries,
          {
            createdAt: '2019-04-19T17:29:13.120Z',
            docketNumber: '101-20',
            documentId: '99981f4d-1e47-423a-8caf-6d2fdc3d3999',
            documentTitle: 'Order',
            documentType: 'Order',
            eventCode: 'O',
            isOnDocketRecord: false,
            signedAt: '2019-04-19T17:29:13.120Z',
            signedByUserId: '11181f4d-1e47-423a-8caf-6d2fdc3d3111',
            signedJudgeName: 'Test Judge',
            userId: '11181f4d-1e47-423a-8caf-6d2fdc3d3111',
            workItem: {
              docketNumber: '101-20',
              section: 'docket',
              sentBy: 'Test User',
              workItemId: '22181f4d-1e47-423a-8caf-6d2fdc3d3122',
            },
          },
        ],
      });

    await archiveDraftDocumentInteractor({
      applicationContext,
      docketNumber: '101-20',
      documentId: '99981f4d-1e47-423a-8caf-6d2fdc3d3999',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().deleteSectionOutboxRecord,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().deleteUserOutboxRecord,
    ).toHaveBeenCalled();
  });
});
