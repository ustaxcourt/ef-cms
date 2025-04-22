import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords',
);
import { AUTOMATIC_BLOCKED_REASONS } from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE_WITHOUT_PENDING } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteCaseDeadlineInteractor } from './deleteCaseDeadlineInteractor';
import { deleteCaseDeadline as deleteCaseDeadlineMock } from '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { deleteCaseTrialSortMappingRecords as deleteCaseTrialSortMappingRecordsMock } from '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';

describe('deleteCaseDeadlineInteractor', () => {
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );
  const deleteCaseDeadline = jest.mocked(deleteCaseDeadlineMock);
  const deleteCaseTrialSortMappingRecords = jest.mocked(
    deleteCaseTrialSortMappingRecordsMock,
  );
  let user;
  let mockCase;
  let mockDeadlines;
  let mockLock;
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
    mockCase = MOCK_CASE_WITHOUT_PENDING;

    applicationContext.environment.stage = 'local';
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);

    getCaseDeadlinesByDocketNumber.mockImplementation(() => mockDeadlines);
  });

  beforeEach(() => {
    mockLock = undefined;
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      deleteCaseDeadlineInteractor(
        applicationContext,
        {
          caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          docketNumber: MOCK_CASE_WITHOUT_PENDING.docketNumber,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValueOnce([]);
    await deleteCaseDeadlineInteractor(
      applicationContext,
      {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: MOCK_CASE_WITHOUT_PENDING.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE_WITHOUT_PENDING.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE_WITHOUT_PENDING.docketNumber}`],
    });
  });

  it('throws an error if the user is not valid or authorized', async () => {
    user = {};
    await expect(
      deleteCaseDeadlineInteractor(
        applicationContext,
        {
          caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          docketNumber: '123-20',
        },
        user,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('calls persistence to delete a case deadline and sets the case as no longer automatically blocked if there are no more deadlines', async () => {
    mockDeadlines = [];

    await deleteCaseDeadlineInteractor(
      applicationContext,
      {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: '123-20',
      },
      mockPetitionsClerkUser,
    );

    expect(deleteCaseDeadline.mock.calls[0][0]).toMatchObject({
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
    expect(deleteCaseTrialSortMappingRecords).not.toHaveBeenCalled();
  });

  it('calls persistence to delete a case deadline and leaves the case automatically blocked if there are more deadlines', async () => {
    mockDeadlines = [
      { caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416' },
      { caseDeadlineId: 'will remain after deletion' },
    ];

    await deleteCaseDeadlineInteractor(
      applicationContext,
      {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: '123-20',
      },
      mockPetitionsClerkUser,
    );

    expect(deleteCaseDeadline.mock.calls[0][0]).toMatchObject({
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
    expect(deleteCaseTrialSortMappingRecords).toHaveBeenCalled();
  });
});
