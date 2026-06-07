import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber',
);
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber',
);
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
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { getDocketEntriesById as getDocketEntriesByIdMock } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesById';
import { upsertDocketEntries as upsertDocketEntriesMock } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { getStorageClient } from '@web-api/persistence/s3/getStorageClient';
const mockSend = jest.fn();
jest.mock('@web-api/persistence/s3/getStorageClient', () => ({
  getStorageClient: jest.fn(() => ({ send: mockSend })),
}));

describe('removeConsolidatedCasesInteractor', () => {
  let mockCases;
  const allDocketNumbers = ['101-19', '102-19', '103-19', '104-19', '105-19'];
  const multiDocketedEntryId = '8c741b4e-a645-4df3-8804-edd576d8197f';
  const originalStorageId = 'bffea205-426d-40c2-84f9-6453a1f6ec9f';
  const originalContentsId = 'cffea205-426d-40c2-84f9-6453a1f6ec9c';
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const getDocketEntriesById = jest.mocked(getDocketEntriesByIdMock);
  const upsertDocketEntries = jest.mocked(upsertDocketEntriesMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const getConsolidatedCases = jest.mocked(getConsolidatedCasesMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  // In this file, getCasesByDocketNumbers should be the cases that are to be removed
  const getCasesByDocketNumbers = getCasesByDocketNumbersMock as jest.Mock;
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );

  beforeEach(() => {
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

    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);
    getCasesByDocketNumbers.mockImplementation(({ docketNumbers }) => {
      return Promise.resolve(
        docketNumbers.map(docketNumber => mockCases[docketNumber]),
      );
    });
    getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
      return Promise.resolve(mockCases[docketNumber]);
    });
    getConsolidatedCases.mockImplementation(({ leadDocketNumber }) => {
      return Promise.resolve(
        Object.keys(mockCases)
          .map(key => mockCases[key])
          .filter(mockCase => mockCase.leadDocketNumber === leadDocketNumber),
      );
    });
    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
  });

  it('should return an Unauthorized error if the user does not have the CONSOLIDATE_CASES permission', async () => {
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

  it('should try to get the case by its docketNumber', async () => {
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

  it('should return a Not Found error if the case to update can not be found', async () => {
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

  it('should return an error if any cases to remove cannot be found', async () => {
    getCasesByDocketNumbers.mockRejectedValueOnce(new Error('Error'));
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

  it('should only update the removed case if the case to remove is not the lead case', async () => {
    getCasesByDocketNumbers.mockResolvedValueOnce([mockCases['102-19']]);
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

  it('should update the removed case and all other currently consolidated cases if the case to remove is the lead case', async () => {
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

  it('should update all cases to remove consolidation if new consolidated cases length is 0', async () => {
    const docketNumbersToRemove = allDocketNumbers;
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

  it('should update ALL cases to remove consolidation if new consolidated cases length is 1', async () => {
    const docketNumbersToRemove = [
      // 101-19 is the lead case but not in the list to be removed
      '102-19',
      '103-19',
      '104-19',
      '105-19',
    ];
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

  it('should update the removed case and remove consolidation from the original lead case if there is only one case remaining after removal', async () => {
    getCasesByDocketNumbers.mockResolvedValueOnce([mockCases['105-19']]);
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

  it('should update the removed case and remove consolidation from the original non-lead case if there is only one case remaining after removal', async () => {
    getCasesByDocketNumbers.mockResolvedValueOnce([mockCases['104-19']]);

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
    getCasesByDocketNumbers.mockResolvedValueOnce([mockCases['104-19']]);

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

  it('should copy S3 documents and update multiDocketedOn for multi-docketed entries when removing a case from a group', async () => {
    const baseDocketEntry = {
      ...MOCK_CASE.docketEntries[0],
      docketEntryId: multiDocketedEntryId,
      documentStorageId: originalStorageId,
      multiDocketedOn: ['101-19', '102-19', '103-19'],
    };

    getCasesByDocketNumbers.mockResolvedValueOnce([
      {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '102-19',
        leadDocketNumber: '101-19',
        docketEntries: [{ ...baseDocketEntry, docketNumber: '102-19' }],
      },
    ]);

    getDocketEntriesById.mockResolvedValueOnce([
      { ...baseDocketEntry, docketNumber: '101-19' },
      { ...baseDocketEntry, docketNumber: '102-19' },
      { ...baseDocketEntry, docketNumber: '103-19' },
    ]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '101-19',
        docketNumbersToRemove: ['102-19'],
      },
      mockDocketClerkUser,
    );

    expect(getDocketEntriesById).toHaveBeenCalledWith({
      docketEntryId: multiDocketedEntryId,
    });

    // S3 copy should be called for the removed case's entry
    expect(getStorageClient().send).toHaveBeenCalledTimes(1);

    expect(upsertDocketEntries).toHaveBeenCalled();
    const upsertedEntries = upsertDocketEntries.mock.calls[0][0];

    // Entry on removed case (102-19) should have multiDocketedOn cleared and new documentStorageId
    const removedEntry = upsertedEntries.find(
      e => e.docketNumber === '102-19',
    )!;
    expect(removedEntry.multiDocketedOn).toEqual([]);
    expect(removedEntry.documentStorageId).not.toEqual(originalStorageId);

    // Entries on remaining cases should have multiDocketedOn filtered to exclude '102-19'
    const remainingEntry101 = upsertedEntries.find(
      e => e.docketNumber === '101-19',
    )!;
    expect(remainingEntry101.multiDocketedOn).toEqual(['101-19', '103-19']);

    const remainingEntry103 = upsertedEntries.find(
      e => e.docketNumber === '103-19',
    )!;
    expect(remainingEntry103.multiDocketedOn).toEqual(['101-19', '103-19']);
  });

  it('should also copy documentContentsId when present on a multi-docketed entry on a case being removed from a group', async () => {
    const baseDocketEntry = {
      ...MOCK_CASE.docketEntries[0],
      docketEntryId: multiDocketedEntryId,
      documentStorageId: '2c1efd22-f5c5-4eb5-b860-09890b83e0b2',
      documentContentsId: originalContentsId,
      multiDocketedOn: ['101-19', '102-19', '103-19'],
    };

    getCasesByDocketNumbers.mockResolvedValueOnce([
      {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '102-19',
        leadDocketNumber: '101-19',
        docketEntries: [{ ...baseDocketEntry, docketNumber: '102-19' }],
      },
    ]);

    getDocketEntriesById.mockResolvedValueOnce([
      { ...baseDocketEntry, docketNumber: '101-19' },
      { ...baseDocketEntry, docketNumber: '102-19' },
      { ...baseDocketEntry, docketNumber: '103-19' },
    ]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '101-19',
        docketNumbersToRemove: ['102-19'],
      },
      mockDocketClerkUser,
    );

    // S3 copy called twice: once for documentStorageId, once for documentContentsId
    expect(getStorageClient().send).toHaveBeenCalledTimes(2);

    const upsertedEntries = upsertDocketEntries.mock.calls[0][0];
    const removedEntry = upsertedEntries.find(
      e => e.docketNumber === '102-19',
    )!;
    expect(removedEntry.documentContentsId).not.toEqual(originalContentsId);
    expect(removedEntry.documentContentsId).toBeDefined();
  });

  it('should clear multiDocketedOn when only one docket number remains after filtering', async () => {
    const baseDocketEntry = {
      ...MOCK_CASE.docketEntries[0],
      docketEntryId: multiDocketedEntryId,
      documentStorageId: '0a26264d-b250-4b9e-b3a4-7887d450ae07',
      multiDocketedOn: ['104-19', '105-19'],
    };

    getCasesByDocketNumbers.mockResolvedValueOnce([
      {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '105-19',
        leadDocketNumber: '104-19',
        docketEntries: [{ ...baseDocketEntry, docketNumber: '105-19' }],
      },
    ]);

    getDocketEntriesById.mockResolvedValueOnce([
      { ...baseDocketEntry, docketNumber: '104-19' },
      { ...baseDocketEntry, docketNumber: '105-19' },
    ]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '104-19',
        docketNumbersToRemove: ['105-19'],
      },
      mockDocketClerkUser,
    );

    const upsertedEntries = upsertDocketEntries.mock.calls[0][0];

    // Entry on remaining case 104-19: filtered to ['104-19'] (length 1), so set to []
    const remainingEntry = upsertedEntries.find(
      e => e.docketNumber === '104-19',
    )!;
    expect(remainingEntry.multiDocketedOn).toEqual([]);
  });
});
