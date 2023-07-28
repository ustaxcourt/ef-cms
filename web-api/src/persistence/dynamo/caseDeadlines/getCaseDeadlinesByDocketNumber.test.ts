import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { batchGet, query } from '../../dynamodbClientService';
import { getCaseDeadlinesByDocketNumber } from './getCaseDeadlinesByDocketNumber';

jest.mock('../../dynamodbClientService', () => ({
  batchGet: jest.fn(),
  query: jest.fn(),
}));

const mockCaseDeadline = {
  caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  deadlineDate: '2019-03-01T21:42:29.073Z',
  description: 'hello world',
  docketNumber: '123-20',
};

describe('getCaseDeadlinesByDocketNumber', () => {
  const mockBatchGet = batchGet as jest.Mock;
  const mockQuery = query as jest.Mock;

  beforeEach(() => {
    mockBatchGet.mockReturnValue([
      {
        ...mockCaseDeadline,
        pk: `case-deadline|${mockCaseDeadline.caseDeadlineId}`,
        sk: `case-deadline|${mockCaseDeadline.caseDeadlineId}`,
      },
    ]);
    mockQuery.mockReturnValue([
      {
        pk: `case|${mockCaseDeadline.docketNumber}`,
        sk: `case-deadline|${mockCaseDeadline.caseDeadlineId}`,
      },
    ]);
  });

  it('should return data as received from persistence', async () => {
    const result = await getCaseDeadlinesByDocketNumber({
      applicationContext,
      docketNumber: mockCaseDeadline.docketNumber,
    });
    expect(result).toEqual([
      {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        deadlineDate: '2019-03-01T21:42:29.073Z',
        description: 'hello world',
        docketNumber: '123-20',
        pk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });

  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await getCaseDeadlinesByDocketNumber({
      applicationContext,
      docketNumber: mockCaseDeadline.docketNumber,
    });
    expect(mockBatchGet.mock.calls[0][0].keys).toEqual([
      {
        pk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
