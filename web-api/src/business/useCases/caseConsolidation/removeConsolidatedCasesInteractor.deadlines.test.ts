import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';

jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber',
);
jest.mock('@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines');

import { removeConsolidatedCasesInteractor } from '@web-api/business/useCases/caseConsolidation/removeConsolidatedCasesInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { MOCK_CASE } from '@shared/test/mockCase';
import { getConsolidatedCases as getConsolidatedCasesMock } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { upsertCaseDeadlines as upsertCaseDeadlinesMock } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';

describe('removeConsolidatedCasesInteractor deadlines', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getConsolidatedCases = getConsolidatedCasesMock as jest.Mock;
  const tryGetLocks = jest.mocked(tryGetLocksMock);
  const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );
  const upsertCaseDeadlines = jest.mocked(upsertCaseDeadlinesMock);

  beforeEach(() => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: true, identifier: 'TESTS' },
    ]);

    updateCaseAndAssociations.mockResolvedValue({} as any);
    upsertCaseDeadlines.mockResolvedValue([]);

    const MOCK_CASES_DICT = {
      '101-25': {
        ...MOCK_CASE,
        docketNumber: '101-25',
        leadDocketNumber: '101-25',
      },
      '102-25': {
        ...MOCK_CASE,
        docketNumber: '102-25',
        leadDocketNumber: '101-25',
      },
    };

    getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
      return MOCK_CASES_DICT[docketNumber];
    });

    getCasesByDocketNumbers.mockImplementation(({ docketNumbers }) => {
      return Promise.resolve(
        Object.values(MOCK_CASES_DICT).filter(mockCase =>
          docketNumbers.includes(mockCase.docketNumber),
        ),
      );
    });

    getConsolidatedCases.mockImplementation(({ leadDocketNumber }) => {
      return Object.keys(MOCK_CASES_DICT)
        .map(key => MOCK_CASES_DICT[key])
        .filter(mockCase => mockCase.leadDocketNumber === leadDocketNumber);
    });
  });

  it('should update the the "consolidatedCaseDeadlineId" for all the deadlines if the lead is removed and is the only case left in the group', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      {
        caseDeadlineId: 'TEST_CASE_DEADLINE_ID',
        consolidatedCaseDeadlineId: 'TEST_CONSOLIDATED_CASE_DEADLINE_ID',
      } as any,
    ]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '101-25',
        docketNumbersToRemove: ['101-25'],
      },
      mockDocketClerkUser,
    );

    const upsertCaseDeadlinesCalls = upsertCaseDeadlines.mock.calls;
    expect(upsertCaseDeadlinesCalls.length).toEqual(1);
    expect(upsertCaseDeadlinesCalls[0][0]).toEqual([
      {
        caseDeadlineId: 'TEST_CASE_DEADLINE_ID',
        consolidatedCaseDeadlineId: undefined,
      },
    ]);
  });
});
