import '@web-api/persistence/postgres/cases/mocks.jest';
import { getBlockedCasesInteractor } from './getBlockedCasesInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getBlockedCasesForTrialLocation as getBlockedCasesForTrialLocationMock } from '@web-api/persistence/postgres/cases/reports/getBlockedCasesForTrialLocation';

describe('getBlockedCasesInteractor', () => {
  const getBlockedCasesForTrialLocation =
    getBlockedCasesForTrialLocationMock as jest.Mock;
  it('calls search function with correct params and returns records', async () => {
    getBlockedCasesForTrialLocation.mockResolvedValue([
      {
        docketNumber: '101-20',
      },
      {
        docketNumber: '201-20',
      },
    ]);

    const results = await getBlockedCasesInteractor(
      {
        trialLocation: 'Boise, Idaho',
        filterStatusForTrialLocation: false,
      },
      mockPetitionsClerkUser,
    );

    expect(results).toEqual([
      {
        docketNumber: '101-20',
      },
      {
        docketNumber: '201-20',
      },
    ]);
  });

  it('should throw an unauthorized error if the user does not have access to blocked cases', async () => {
    let error;
    try {
      await getBlockedCasesInteractor(
        {
          trialLocation: 'Boise, Idaho',
          filterStatusForTrialLocation: true,
        },
        mockPetitionerUser,
      );
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized');
  });
});
