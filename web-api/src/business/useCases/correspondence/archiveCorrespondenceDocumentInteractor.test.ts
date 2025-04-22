import '@web-api/persistence/postgres/caseCorrespondences/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { Correspondence } from '../../../../../shared/src/business/entities/Correspondence';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { archiveCorrespondenceDocumentInteractor } from './archiveCorrespondenceDocumentInteractor';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { upsertCaseCorrespondences as upsertCaseCorrespondencesMock } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';

const upsertCaseCorrespondences = upsertCaseCorrespondencesMock as jest.Mock;

describe('archiveCorrespondenceDocumentInteractor', () => {
  const mockUserId = '2474e5c0-f741-4120-befa-b77378ac8bf0';
  const mockCorrespondenceId = applicationContext.getUniqueId();
  let mockCorrespondence;
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
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

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        correspondence: [mockCorrespondence],
      });
  });

  it('should throw an Unauthorized error if the user role does not have the CASE_CORRESPONDENCE permission', async () => {
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

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.correspondence,
    ).toEqual([]);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.archivedCorrespondences,
    ).toEqual([{ ...mockCorrespondence, archived: true }]);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
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

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
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
