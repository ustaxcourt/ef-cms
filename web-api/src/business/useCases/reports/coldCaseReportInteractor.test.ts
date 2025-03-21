import '@web-api/persistence/postgres/cases/mocks.jest';
import { ColdCaseEntry } from './coldCaseReportInteractor';
import { coldCaseReportInteractor } from './coldCaseReportInteractor';
import { getColdCases as getColdCasesMock } from '@web-api/persistence/elasticsearch/getColdCases';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('coldCaseReportInteractor', () => {
  const getColdCases = getColdCasesMock as jest.Mock;
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
    getColdCases.mockResolvedValue(mockColdCases);
  });

  it('should throw an unauthorized error when the user does not have access', async () => {
    await expect(coldCaseReportInteractor(mockPetitionerUser)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should return the expected mocked data', async () => {
    const coldCases = await coldCaseReportInteractor(mockDocketClerkUser);

    expect(coldCases).toEqual(mockColdCases);
  });
});
