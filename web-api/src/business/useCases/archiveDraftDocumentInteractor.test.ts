import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { archiveDraftDocumentInteractor } from './archiveDraftDocumentInteractor';
import { deleteWorkItem } from '@web-api/persistence/postgres/workitems/deleteWorkItem';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('archiveDraftDocumentInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  beforeAll(() => {
    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
  });

  it('should return an unauthorized error on non petitionsclerk users', async () => {
    await expect(
      archiveDraftDocumentInteractor(
        applicationContext,
        {
          docketEntryId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '101-20',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should update the case to contain the archived document', async () => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    await archiveDraftDocumentInteractor(
      applicationContext,
      {
        docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        docketNumber: '101-20',
      },
      mockPetitionsClerkUser,
    );

    const { caseToUpdate } = updateCaseAndAssociations.mock.calls[0][0];
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

  it('should update work items when there is a workItem found on the document', async () => {
    getCaseByDocketNumber.mockResolvedValue({
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

    await archiveDraftDocumentInteractor(
      applicationContext,
      {
        docketEntryId: '99981f4d-1e47-423a-8caf-6d2fdc3d3999',
        docketNumber: '101-20',
      },
      mockPetitionsClerkUser,
    );

    expect(deleteWorkItem).toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      archiveDraftDocumentInteractor(
        applicationContext,
        {
          docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-20',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await await archiveDraftDocumentInteractor(
      applicationContext,
      {
        docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });
});
