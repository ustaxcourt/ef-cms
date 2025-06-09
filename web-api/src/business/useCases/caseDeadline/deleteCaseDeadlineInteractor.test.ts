import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { AUTOMATIC_BLOCKED_REASONS } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE_WITHOUT_PENDING } from '@shared/test/mockCase';
import { MOCK_LOCK } from '@shared/test/mockLock';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { deleteCaseDeadlineInteractor } from './deleteCaseDeadlineInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { deleteCaseDeadline as deleteCaseDeadlineMock } from '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('deleteCaseDeadlineInteractor', () => {
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );
  const deleteCaseDeadline = jest.mocked(deleteCaseDeadlineMock);
  let user;
  let mockDeadlines;
  let mockLock;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);

  updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
    Promise.resolve(caseToUpdate),
  );

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);

    applicationContext.environment.stage = 'local';
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE_WITHOUT_PENDING);

    getCaseDeadlinesByDocketNumber.mockImplementation(() => mockDeadlines);
  });

  beforeEach(() => {
    mockLock = undefined;
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
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

  it('should throw an error when the user is not valid or authorized', async () => {
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

  it('should call persistence to delete a case deadline and sets the case as no longer automatically blocked when there are no more deadlines', async () => {
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
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
  });

  it('should call persistence to delete a case deadline and leave the case automatically blocked when there are more deadlines', async () => {
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
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
  });
});
