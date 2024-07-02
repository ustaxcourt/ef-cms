import { ColdCaseEntry } from './coldCaseReportInteractor';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { coldCaseReportInteractor } from './coldCaseReportInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('coldCaseReportInteractor', () => {
  const mockColdCases: ColdCaseEntry[] = [
    {
      caseType: 'Closed',
      createdAt: '123',
      docketNumber: '102-24',
      eventCode: 'O',
      filingDate: '123',
      leadDocketNumber: '104-23',
      preferredTrialCity: 'Orlando, Florida',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getColdCases.mockResolvedValue(mockColdCases);
  });

  it('should throw an unauthorized error when the user does not have access', async () => {
    await expect(
      coldCaseReportInteractor(applicationContext, mockPetitionerUser),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return the expected mocked data', async () => {
    const coldCases = await coldCaseReportInteractor(
      applicationContext,
      mockDocketClerkUser,
    );

    expect(coldCases).toEqual(mockColdCases);
  });
});
