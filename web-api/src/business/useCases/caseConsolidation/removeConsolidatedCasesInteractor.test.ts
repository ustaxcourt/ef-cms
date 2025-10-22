import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber',
);
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber',
);
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineIds',
);
jest.mock('@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines');
import { MOCK_CASE } from '@shared/test/mockCase';

import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { removeConsolidatedCasesInteractor } from '@web-api/business/useCases/caseConsolidation/removeConsolidatedCasesInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getConsolidatedCases as getConsolidatedCasesMock } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { getCaseDeadlinesByConsolidatedCaseDeadlineIds as getCaseDeadlinesByConsolidatedCaseDeadlineIdsMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineIds';
import { upsertCaseDeadlines as upsertCaseDeadlinesMock } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';

describe('removeConsolidatedCasesInteractor', () => {
  let mockCases;
  const allDocketNumbers = ['101-19', '102-19', '103-19', '104-19', '105-19'];
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const getConsolidatedCases = getConsolidatedCasesMock as jest.Mock;
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  // In this file, getCasesByDocketNumbers should be the cases that are to be removed
  const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );
  const getCaseDeadlinesByConsolidatedCaseDeadlineIds = jest.mocked(
    getCaseDeadlinesByConsolidatedCaseDeadlineIdsMock,
  );
  const upsertCaseDeadlines = jest.mocked(upsertCaseDeadlinesMock);

  beforeEach(() => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);
    getCaseDeadlinesByConsolidatedCaseDeadlineIds.mockResolvedValue([]);
    upsertCaseDeadlines.mockResolvedValue([]);
    mockCases = {
      '101-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '101-19',
        leadDocketNumber: '101-19',
      },
      '102-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '102-19',
        leadDocketNumber: '101-19',
      },
      '103-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '103-19',
        leadDocketNumber: '101-19',
      },
      '104-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '104-19',
        leadDocketNumber: '104-19',
      },
      '105-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '105-19',
        leadDocketNumber: '104-19',
      },
    };

    getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
      return mockCases[docketNumber];
    });
    getConsolidatedCases.mockImplementation(({ leadDocketNumber }) => {
      return Object.keys(mockCases)
        .map(key => mockCases[key])
        .filter(mockCase => mockCase.leadDocketNumber === leadDocketNumber);
    });
    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
  });

  it('Should return an Unauthorized error if the user does not have the CONSOLIDATE_CASES permission', async () => {
    getCasesByDocketNumbers.mockResolvedValue([mockCases['101-19']]);
    await expect(
      removeConsolidatedCasesInteractor(
        applicationContext,
        {
          docketNumber: '102-19',
          docketNumbersToRemove: ['101-19'],
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized for case consolidation');
  });

  it('Should try to get the case by its docketNumber', async () => {
    getCasesByDocketNumbers.mockResolvedValue([mockCases['101-19']]);
    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '102-19',
        docketNumbersToRemove: ['101-19'],
      },
      mockDocketClerkUser,
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
  });

  it('Should return a Not Found error if the case to update can not be found', async () => {
    getCasesByDocketNumbers.mockResolvedValue([mockCases['101-19']]);
    await expect(
      removeConsolidatedCasesInteractor(
        applicationContext,
        {
          docketNumber: '111-11',
          docketNumbersToRemove: ['101-19'],
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Case 111-11 was not found.');
  });

  it('Should return an error if any cases to remove cannot be found', async () => {
    getCasesByDocketNumbers.mockRejectedValue(new Error('Error'));
    await expect(
      removeConsolidatedCasesInteractor(
        applicationContext,
        {
          docketNumber: '102-19',
          docketNumbersToRemove: ['111-11'],
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Error');
  });

  it('Should only update the removed case if the case to remove is not the lead case', async () => {
    getCasesByDocketNumbers.mockResolvedValue([mockCases['102-19']]);
    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '101-19',
        docketNumbersToRemove: ['102-19'],
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations.mock.calls.length).toEqual(1);
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      docketNumber: '102-19',
      leadDocketNumber: undefined,
    });
  });

  it('Should update the removed case and all other currently consolidated cases if the case to remove is the lead case', async () => {
    getCasesByDocketNumbers.mockResolvedValue([mockCases['101-19']]);
    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '102-19',
        docketNumbersToRemove: ['101-19'],
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations.mock.calls.length).toEqual(3);
    // first updates cases with new lead docket number
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      docketNumber: '102-19',
      leadDocketNumber: '102-19',
    });
    expect(
      updateCaseAndAssociations.mock.calls[1][0].caseToUpdate,
    ).toMatchObject({
      docketNumber: '103-19',
      leadDocketNumber: '102-19',
    });
    // then removes leadDocketNumber from case to remove
    expect(
      updateCaseAndAssociations.mock.calls[2][0].caseToUpdate,
    ).toMatchObject({
      docketNumber: '101-19',
      leadDocketNumber: undefined,
    });
  });

  it('Should update all cases to remove consolidation if new consolidated cases length is 0', async () => {
    const docketNumbersToRemove = allDocketNumbers;
    getCasesByDocketNumbers.mockResolvedValue(
      docketNumbersToRemove.map(docketNumber => mockCases[docketNumber]),
    );
    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '101-19',
        docketNumbersToRemove,
      },
      mockDocketClerkUser,
    );
    expect(updateCaseAndAssociations).toHaveBeenCalledTimes(
      docketNumbersToRemove.length,
    );
  });

  it('Should update ALL cases to remove consolidation if new consolidated cases length is 1', async () => {
    const docketNumbersToRemove = [
      // 101-19 is the lead case but not in the list to be removed
      '102-19',
      '103-19',
      '104-19',
      '105-19',
    ];
    getCasesByDocketNumbers.mockResolvedValue(
      docketNumbersToRemove.map(docketNumber => mockCases[docketNumber]),
    );
    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '101-19',
        docketNumbersToRemove,
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalledTimes(
      allDocketNumbers.length,
    );

    allDocketNumbers.forEach((docketNumber, callIndex) => {
      expect(
        updateCaseAndAssociations.mock.calls[callIndex][0].caseToUpdate
          .docketNumber,
      ).toBe(docketNumber);
    });
  });

  it('Should update the removed case and remove consolidation from the original lead case if there is only one case remaining after removal', async () => {
    getCasesByDocketNumbers.mockResolvedValue([mockCases['105-19']]);
    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '104-19',
        docketNumbersToRemove: ['105-19'],
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations.mock.calls.length).toEqual(2);
    // first removes leadDocketNumber from original case
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      docketNumber: '104-19',
      leadDocketNumber: undefined,
    });
    // then removes leadDocketNumber from case to remove
    expect(
      updateCaseAndAssociations.mock.calls[1][0].caseToUpdate,
    ).toMatchObject({
      docketNumber: '105-19',
      leadDocketNumber: undefined,
    });
  });

  it('Should update the removed case and remove consolidation from the original non-lead case if there is only one case remaining after removal', async () => {
    getCasesByDocketNumbers.mockResolvedValue([mockCases['104-19']]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '105-19',
        docketNumbersToRemove: ['104-19'],
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations.mock.calls.length).toEqual(2);
    // first removes leadDocketNumber from original case
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      docketNumber: '105-19',
      leadDocketNumber: undefined,
    });
    // then removes leadDocketNumber from case to remove
    expect(
      updateCaseAndAssociations.mock.calls[1][0].caseToUpdate,
    ).toMatchObject({
      docketNumber: '104-19',
      leadDocketNumber: undefined,
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);
    getCasesByDocketNumbers.mockResolvedValue([mockCases['104-19']]);

    await expect(
      removeConsolidatedCasesInteractor(
        applicationContext,
        {
          docketNumber: '105-19',
          docketNumbersToRemove: ['104-19'],
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the cases', async () => {
    getCasesByDocketNumbers.mockResolvedValue([mockCases['104-19']]);
    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '105-19',
        docketNumbersToRemove: ['104-19'],
      },
      mockDocketClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledTimes(1);

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: ['case|105-19', 'case|104-19'],
      }),
    );
  });

  it('should remove consolidated case references from case deadlines when removing a case', async () => {
    const mockDeadlines = [
      {
        caseDeadlineId: 'deadline-1',
        docketNumber: '102-19',
        consolidatedCaseDeadlineId: 'lead-deadline-1',
        deadlineDate: '2024-01-01',
        description: 'Test deadline',
      },
    ] as any;
    getCaseDeadlinesByDocketNumber.mockResolvedValue(mockDeadlines);
    getCasesByDocketNumbers.mockResolvedValue([mockCases['102-19']]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '101-19',
        docketNumbersToRemove: ['102-19'],
      },
      mockDocketClerkUser,
    );

    expect(upsertCaseDeadlines).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          caseDeadlineId: 'deadline-1',
          consolidatedCaseDeadlineId: undefined,
        }),
      ]),
    );
  });

  it('should update consolidated case deadline reference IDs when removing the lead case', async () => {
    const oldLeadDeadlines = [
      {
        caseDeadlineId: 'old-lead-deadline-1',
        docketNumber: '101-19',
        deadlineDate: '2024-01-01',
        description: 'Lead deadline',
      },
    ] as any;
    const childDeadlines = [
      {
        caseDeadlineId: 'child-deadline-1',
        docketNumber: '102-19',
        consolidatedCaseDeadlineId: 'old-lead-deadline-1',
        deadlineDate: '2024-01-01',
        description: 'Child deadline 1',
      },
      {
        caseDeadlineId: 'child-deadline-2',
        docketNumber: '103-19',
        consolidatedCaseDeadlineId: 'old-lead-deadline-1',
        deadlineDate: '2024-01-01',
        description: 'Child deadline 2',
      },
    ] as any;

    getCaseDeadlinesByDocketNumber.mockResolvedValueOnce(oldLeadDeadlines);
    getCaseDeadlinesByConsolidatedCaseDeadlineIds.mockResolvedValue(
      childDeadlines,
    );
    getCasesByDocketNumbers.mockResolvedValue([mockCases['101-19']]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '102-19',
        docketNumbersToRemove: ['101-19'],
      },
      mockDocketClerkUser,
    );

    expect(getCaseDeadlinesByConsolidatedCaseDeadlineIds).toHaveBeenCalledWith([
      'old-lead-deadline-1',
    ]);
    expect(upsertCaseDeadlines).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          caseDeadlineId: 'child-deadline-1',
          docketNumber: '102-19',
          consolidatedCaseDeadlineId: undefined,
        }),
        expect.objectContaining({
          caseDeadlineId: 'child-deadline-2',
          consolidatedCaseDeadlineId: 'child-deadline-1',
        }),
      ]),
    );
  });

  it('should set new lead deadline ID as undefined when new lead deadline is not found in child deadlines', async () => {
    const oldLeadDeadlines = [
      {
        caseDeadlineId: 'old-lead-deadline-1',
        docketNumber: '101-19',
        deadlineDate: '2024-01-01',
        description: 'Lead deadline',
      },
    ] as any;
    const childDeadlines = [
      {
        caseDeadlineId: 'child-deadline-1',
        docketNumber: '103-19',
        consolidatedCaseDeadlineId: 'old-lead-deadline-1',
        deadlineDate: '2024-01-01',
        description: 'Child deadline',
      },
    ] as any;

    getCaseDeadlinesByDocketNumber.mockResolvedValueOnce(oldLeadDeadlines);
    getCaseDeadlinesByConsolidatedCaseDeadlineIds.mockResolvedValue(
      childDeadlines,
    );
    getCasesByDocketNumbers.mockResolvedValue([mockCases['101-19']]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '102-19',
        docketNumbersToRemove: ['101-19'],
      },
      mockDocketClerkUser,
    );

    expect(upsertCaseDeadlines).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          caseDeadlineId: 'child-deadline-1',
          consolidatedCaseDeadlineId: undefined,
        }),
      ]),
    );
  });

  it('should not update deadline references when there are no child deadlines', async () => {
    const oldLeadDeadlines = [
      {
        caseDeadlineId: 'old-lead-deadline-1',
        docketNumber: '101-19',
        deadlineDate: '2024-01-01',
        description: 'Lead deadline',
      },
    ] as any;

    getCaseDeadlinesByDocketNumber.mockResolvedValueOnce(oldLeadDeadlines);
    getCaseDeadlinesByConsolidatedCaseDeadlineIds.mockResolvedValue([]);
    getCasesByDocketNumbers.mockResolvedValue([mockCases['101-19']]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '102-19',
        docketNumbersToRemove: ['101-19'],
      },
      mockDocketClerkUser,
    );

    expect(getCaseDeadlinesByConsolidatedCaseDeadlineIds).toHaveBeenCalledWith([
      'old-lead-deadline-1',
    ]);
    expect(upsertCaseDeadlines).toHaveBeenCalledWith([]);
  });

  it('should handle rejected promises when updating deadline references and log warnings', async () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const oldLeadDeadlines = [
      {
        caseDeadlineId: 'old-lead-deadline-1',
        docketNumber: '101-19',
        deadlineDate: '2024-01-01',
        description: 'Lead deadline',
      },
    ] as any;

    getCaseDeadlinesByDocketNumber.mockResolvedValueOnce(oldLeadDeadlines);
    getCaseDeadlinesByConsolidatedCaseDeadlineIds.mockRejectedValue(
      new Error('Database error'),
    );
    getCasesByDocketNumbers.mockResolvedValue([mockCases['101-19']]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '102-19',
        docketNumbersToRemove: ['101-19'],
      },
      mockDocketClerkUser,
    );

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Some deadline updates failed:',
      expect.arrayContaining([
        expect.objectContaining({
          status: 'rejected',
          reason: expect.any(Error),
        }),
      ]),
    );

    consoleWarnSpy.mockRestore();
  });

  it('should not call deadline reference update when no old lead deadlines exist', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);
    getCasesByDocketNumbers.mockResolvedValue([mockCases['101-19']]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '102-19',
        docketNumbersToRemove: ['101-19'],
      },
      mockDocketClerkUser,
    );

    expect(
      getCaseDeadlinesByConsolidatedCaseDeadlineIds,
    ).not.toHaveBeenCalled();
  });
});
