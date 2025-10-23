import '@web-api/persistence/postgres/cases/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { getEligibleCasesForTrialCity as getEligibleCasesForTrialCityMock } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialCity';
import { getEligibleCasesForCityInteractor } from '@shared/business/useCases/getEligibleCasesForCityInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { MOCK_PETITION } from '@shared/test/mockDocketEntry';

describe('getEligibleCasesForCityInteractor', () => {
  const getEligibleCasesForTrialCity = jest.mocked(
    getEligibleCasesForTrialCityMock,
  );
  const mockTrialCity = 'Birmingham, Alabama';
  beforeAll(() => {
    getEligibleCasesForTrialCity.mockResolvedValue([
      MOCK_CASE as Omit<RawCase, 'consolidatedCases'>,
    ]);
  });

  it('should throw an unauthorized error when the user does not have permission to view eligible cases', async () => {
    await expect(
      getEligibleCasesForCityInteractor(
        {
          trialCity: mockTrialCity,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(
      `Invalid User attempting to view eligible cases for: ${mockTrialCity}`,
    );
  });

  it('should call getEligibleCasesForTrialCity with the correct trialCity', async () => {
    await getEligibleCasesForCityInteractor(
      {
        trialCity: mockTrialCity,
      },
      mockPetitionsClerkUser,
    );
    expect(getEligibleCasesForTrialCity).toHaveBeenCalled();
    expect(getEligibleCasesForTrialCity.mock.calls[0][0]).toEqual(
      expect.objectContaining({ trialCity: mockTrialCity }),
    );
  });

  it('should set isAgedCase to false for closed cases', async () => {
    getEligibleCasesForTrialCity.mockResolvedValueOnce([{...MOCK_CASE, status: CASE_STATUS_TYPES.closed}])
    const result = await getEligibleCasesForCityInteractor(
      {
        trialCity: mockTrialCity,
      },
      mockPetitionsClerkUser,
    );

    expect(result![0].isAgedCase).toBe(false);
  });

  it('should handle docket entry filing date being empty', async () => {
    getEligibleCasesForTrialCity.mockResolvedValueOnce([{...MOCK_CASE, docketEntries: [{...MOCK_PETITION, filingDate: ''}]}])
    const result = await getEligibleCasesForCityInteractor(
      {
        trialCity: mockTrialCity,
      },
      mockPetitionsClerkUser,
    );

    expect(result![0].isAgedCase).toBe(false);
  });
});
