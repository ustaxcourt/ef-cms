import { ColdCaseEntry } from './coldCaseReportInteractor';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { coldCaseReportInteractor } from './coldCaseReportInteractor';

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
    applicationContext.getCurrentUser.mockImplementation(() => ({
      role: ROLES.petitioner,
      userId: 'petitioner',
    }));

    await expect(coldCaseReportInteractor(applicationContext)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should return the expected mocked data', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => ({
      role: ROLES.docketClerk,
      userId: 'docketclerk',
    }));

    const coldCases = await coldCaseReportInteractor(applicationContext);

    expect(coldCases).toEqual(mockColdCases);
  });
});
