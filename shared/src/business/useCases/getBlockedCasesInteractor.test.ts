import { applicationContext } from '../test/createTestApplicationContext';
import { getBlockedCasesInteractor } from './getBlockedCasesInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('getBlockedCasesInteractor', () => {
  it('calls search function with correct params and returns records', async () => {
    applicationContext.getPersistenceGateway().getBlockedCases.mockReturnValue([
      {
        docketNumber: '101-20',
      },
      {
        docketNumber: '201-20',
      },
    ]);

    const results = await getBlockedCasesInteractor(
      applicationContext,
      {
        trialLocation: 'Boise, Idaho',
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
        applicationContext,
        {
          trialLocation: 'Boise, Idaho',
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
