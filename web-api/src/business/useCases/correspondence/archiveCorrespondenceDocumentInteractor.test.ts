import '@web-api/persistence/postgres/caseCorrespondences/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { Correspondence } from '@shared/business/entities/Correspondence';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_LOCK } from '@shared/test/mockLock';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { archiveCorrespondenceDocumentInteractor } from './archiveCorrespondenceDocumentInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateCase as updateCaseMock } from '@web-api/persistence/postgres/cases/updateCase';
import { upsertCaseCorrespondences as upsertCaseCorrespondencesMock } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';

const upsertCaseCorrespondences = upsertCaseCorrespondencesMock as jest.Mock;

describe('archiveCorrespondenceDocumentInteractor', () => {
  const mockUserId = '2474e5c0-f741-4120-befa-b77378ac8bf0';
  const mockCorrespondenceId = applicationContext.getUniqueId();
  let mockCorrespondence;
  let mockLock;

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCase = jest.mocked(updateCaseMock);

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
    updateCase.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
  });

  beforeEach(() => {
    mockLock = undefined;
    mockCorrespondence = new Correspondence({
      correspondenceId: mockCorrespondenceId,
      docketNumber: MOCK_CASE.docketNumber,
      documentTitle: 'My Correspondence',
      filedBy: 'Docket clerk',
      userId: mockUserId,
    });

    getCaseByDocketNumber.mockReturnValue({
      ...MOCK_CASE,
      correspondence: [mockCorrespondence],
    });
  });

  it('should throw an Unauthorized error when the user role does not have the CASE_CORRESPONDENCE permission', async () => {
    const user = { ...mockDocketClerkUser, role: ROLES.petitioner };

    await expect(
      archiveCorrespondenceDocumentInteractor(
        applicationContext,
        {
          correspondenceId: mockCorrespondenceId,
          docketNumber: MOCK_CASE.docketNumber,
        } as any,
        user,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should delete the specified correspondence document from s3', async () => {
    await archiveCorrespondenceDocumentInteractor(
      applicationContext,
      {
        correspondenceId: mockCorrespondenceId,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFile.mock
        .calls[0][0],
    ).toMatchObject({
      key: mockCorrespondenceId,
    });
  });

  it('should update the specified correspondence document on the case to be marked as archived', async () => {
    await archiveCorrespondenceDocumentInteractor(
      applicationContext,
      {
        correspondenceId: mockCorrespondenceId,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(upsertCaseCorrespondences.mock.calls[0][0]).toMatchObject([
      { ...mockCorrespondence, archived: true },
    ]);
  });

  it('should update the case to reflect the archived correspondence', async () => {
    await archiveCorrespondenceDocumentInteractor(
      applicationContext,
      {
        correspondenceId: mockCorrespondenceId,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updateCase.mock.calls[0][0].caseToUpdate.correspondence).toEqual([]);
    expect(
      updateCase.mock.calls[0][0].caseToUpdate.archivedCorrespondences,
    ).toEqual([{ ...mockCorrespondence, archived: true }]);
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      archiveCorrespondenceDocumentInteractor(
        applicationContext,
        {
          correspondenceId: mockCorrespondenceId,
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await archiveCorrespondenceDocumentInteractor(
      applicationContext,
      {
        correspondenceId: mockCorrespondenceId,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

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
