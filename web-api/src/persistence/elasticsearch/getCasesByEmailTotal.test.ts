import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCasesByEmailTotal } from '@web-api/persistence/elasticsearch/getCasesByEmailTotal';
jest.mock('./searchClient');
import { search } from './searchClient';

describe('getCasesByEmailTotal', () => {
  const TEST_EMAIL = 'TEST_EMAIL';
  const RESULTS_MOCK = 99999;

  beforeEach(() => {
    (search as jest.Mock).mockImplementation(() => ({ total: RESULTS_MOCK }));
  });

  it('should call search with correct parameters', async () => {
    const results = await getCasesByEmailTotal({
      applicationContext,
      email: TEST_EMAIL,
    });

    const searchCalls = (search as jest.Mock).mock.calls;
    expect(searchCalls.length).toEqual(1);
    expect(searchCalls[0][0].searchParameters).toEqual({
      body: {
        query: {
          bool: {
            minimum_should_match: 1,
            must: [
              {
                term: {
                  'entityName.S': 'Case',
                },
              },
            ],
            should: [
              {
                term: {
                  'privatePractitioners.L.M.email.S': TEST_EMAIL,
                },
              },
              {
                term: {
                  'irsPractitioners.L.M.email.S': TEST_EMAIL,
                },
              },
              {
                term: {
                  'petitioners.L.M.email.S': TEST_EMAIL,
                },
              },
            ],
          },
        },
      },
      index: 'efcms-case',
    });

    expect(results).toEqual(RESULTS_MOCK);
  });
});
