import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import { ROLES } from '../entities/EntityConstants';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import { archiveDraftDocumentInteractor } from './archiveDraftDocumentInteractor';

describe('archiveDraftDocumentInteractor', () => {
  let mockLock;
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });
  beforeEach(() => {
    mockLock = undefined;

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });
  });

  it('returns an unauthorized error on non petitionsclerk users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      archiveDraftDocumentInteractor(applicationContext, {
        docketEntryId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: '101-20',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('expect the updated case to contain the archived document', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await archiveDraftDocumentInteractor(applicationContext, {
      docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: '101-20',
    });

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];

    expect(
      caseToUpdate.archivedDocketEntries.find(
        d => d.docketEntryId === 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      ),
    ).toMatchObject({
      archived: true,
      docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });

    expect(
      caseToUpdate.docketEntries.find(
        d => d.docketEntryId === 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      ),
    ).toBeFalsy();
  });

  it('updates work items if there is a workItem found on the document', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          ...MOCK_CASE.docketEntries,
          {
            createdAt: '2019-04-19T17:29:13.120Z',
            docketEntryId: '99981f4d-1e47-423a-8caf-6d2fdc3d3999',
            docketNumber: '101-20',
            documentTitle: 'Order',
            documentType: 'Order',
            eventCode: 'O',
            filedByRole: ROLES.docketClerk,
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

    await archiveDraftDocumentInteractor(applicationContext, {
      docketEntryId: '99981f4d-1e47-423a-8caf-6d2fdc3d3999',
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteWorkItem,
    ).toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      archiveDraftDocumentInteractor(applicationContext, {
        docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        docketNumber: '101-20',
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await await archiveDraftDocumentInteractor(applicationContext, {
      docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});
