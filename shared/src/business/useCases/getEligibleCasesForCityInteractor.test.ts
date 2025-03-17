import '@web-api/persistence/postgres/cases/mocks.jest';
import { applicationContext } from '../test/createTestApplicationContext';
import { MOCK_ELIGIBLE_CASE } from '@shared/test/mockCase';
import { getEligibleCasesForTrialCity as getEligibleCasesForTrialCityMock } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialCity';
import { getEligibleCasesForCityInteractor } from '@shared/business/useCases/getEligibleCasesForCityInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('getEligibleCasesForCityInteractor', () => {
  const getEligibleCasesForTrialCity = jest.mocked(
    getEligibleCasesForTrialCityMock,
  );
  const mockTrialCity = 'Birmingham, Alabama';
  beforeAll(() => {
    getEligibleCasesForTrialCity.mockResolvedValue([MOCK_ELIGIBLE_CASE]);
  });

  it('should throw an unauthorized error when the user does not have permission to view eligible cases', async () => {
    await expect(
      getEligibleCasesForCityInteractor(
        applicationContext,
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
      applicationContext,
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
});
