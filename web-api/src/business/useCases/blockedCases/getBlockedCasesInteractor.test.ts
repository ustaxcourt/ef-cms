jest.mock('@web-api/persistence/elasticsearch/getBlockedCases');
import { getBlockedCases as getBlockedCasesMock } from '@web-api/persistence/elasticsearch/getBlockedCases';
import { getBlockedCasesInteractor } from './getBlockedCasesInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { UnauthorizedError } from '@web-api/errors/errors';

describe('getBlockedCasesInteractor', () => {
  const getBlockedCases = jest.mocked(getBlockedCasesMock);
  it('calls search function with correct params and returns records', async () => {
    const mockResults = [
      {
        docketNumber: '101-20',
        caseCaption: '',
        procedureType: '',
        status: 'Assigned - Case',
      } as const,
    ];
    getBlockedCases.mockResolvedValue(mockResults);

    const results = await getBlockedCasesInteractor(
      {
        trialLocation: 'Boise, Idaho',
      },
      mockPetitionsClerkUser,
    );

    expect(results).toEqual(mockResults);
  });

  it('should throw an unauthorized error if the user does not have access to blocked cases', async () => {
    await expect(
      getBlockedCasesInteractor(
        {
          trialLocation: 'Boise, Idaho',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });
});
