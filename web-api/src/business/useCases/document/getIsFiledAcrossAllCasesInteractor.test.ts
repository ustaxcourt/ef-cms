import { getIsFiledAcrossAllCasesInteractor } from './getIsFiledAcrossAllCasesInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

jest.mock('@web-api/persistence/postgres/docketEntries/getDocketEntriesById');
jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber');
jest.mock('@web-api/persistence/postgres/cases/getConsolidatedCases');

import { getDocketEntriesById } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesById';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getConsolidatedCases } from '@web-api/persistence/postgres/cases/getConsolidatedCases';

describe('getIsFiledAcrossAllCasesInteractor', () => {
  const mockDocketEntryId = '123e4567-e89b-12d3-a456-426614174000';
  const mockDocketNumber = '101-20';
  const mockLeadDocketNumber = '100-20';

  const getDocketEntriesByIdMock = getDocketEntriesById as jest.Mock;
  const getCaseByDocketNumberMock = getCaseByDocketNumber as jest.Mock;
  const getConsolidatedCasesMock = getConsolidatedCases as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an UnauthorizedError when user does not have EDIT_ORDER permission', async () => {
    await expect(
      getIsFiledAcrossAllCasesInteractor(
        { docketEntryId: mockDocketEntryId },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw a NotFoundError when no docket entries are found', async () => {
    getDocketEntriesByIdMock.mockResolvedValue([]);

    await expect(
      getIsFiledAcrossAllCasesInteractor(
        { docketEntryId: mockDocketEntryId },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should return true when case is not part of a consolidated group', async () => {
    getDocketEntriesByIdMock.mockResolvedValue([
      { docketEntryId: mockDocketEntryId, docketNumber: mockDocketNumber },
    ]);
    getCaseByDocketNumberMock.mockResolvedValue({
      docketNumber: mockDocketNumber,
      leadDocketNumber: undefined,
    });

    const result = await getIsFiledAcrossAllCasesInteractor(
      { docketEntryId: mockDocketEntryId },
      mockDocketClerkUser,
    );

    expect(result).toBe(true);
    expect(getConsolidatedCasesMock).not.toHaveBeenCalled();
  });

  it('should return true when docket entry is filed across all consolidated cases', async () => {
    getDocketEntriesByIdMock.mockResolvedValue([
      { docketEntryId: mockDocketEntryId, docketNumber: '100-20' },
      { docketEntryId: mockDocketEntryId, docketNumber: '101-20' },
      { docketEntryId: mockDocketEntryId, docketNumber: '102-20' },
    ]);

    getCaseByDocketNumberMock.mockResolvedValue({
      docketNumber: mockDocketNumber,
      leadDocketNumber: mockLeadDocketNumber,
    });

    getConsolidatedCasesMock.mockResolvedValue([
      { docketNumber: '100-20' },
      { docketNumber: '101-20' },
      { docketNumber: '102-20' },
    ]);

    const result = await getIsFiledAcrossAllCasesInteractor(
      { docketEntryId: mockDocketEntryId },
      mockDocketClerkUser,
    );

    expect(result).toBe(true);
  });

  it('should return false when docket entry is not filed across all consolidated cases', async () => {
    getDocketEntriesByIdMock.mockResolvedValue([
      { docketEntryId: mockDocketEntryId, docketNumber: '100-20' },
      { docketEntryId: mockDocketEntryId, docketNumber: '101-20' },
    ]);

    getCaseByDocketNumberMock.mockResolvedValue({
      docketNumber: mockDocketNumber,
      leadDocketNumber: mockLeadDocketNumber,
    });

    getConsolidatedCasesMock.mockResolvedValue([
      { docketNumber: '100-20' },
      { docketNumber: '101-20' },
      { docketNumber: '102-20' },
    ]);

    const result = await getIsFiledAcrossAllCasesInteractor(
      { docketEntryId: mockDocketEntryId },
      mockDocketClerkUser,
    );

    expect(result).toBe(false);
  });
});
