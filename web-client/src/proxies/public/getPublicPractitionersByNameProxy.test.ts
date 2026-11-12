jest.mock('../requests');
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { get } from '../requests';
import { getPublicPractitionersByNameInteractor } from './getPublicPractitionersByNameProxy';

describe('getPublicPractitionersByNameProxy', () => {
  const mockGet = get as jest.Mock;

  beforeEach(() => {
    mockGet.mockResolvedValue({});
  });

  it('encodes the pagination cursor as JSON to preserve null values', async () => {
    const searchAfter = [null, 'smith', 'SB1234'];

    await getPublicPractitionersByNameInteractor(applicationContext, {
      name: 'smith',
      searchAfter,
    });

    expect(mockGet.mock.calls[0][0].params.searchAfter).toBe(
      JSON.stringify(searchAfter),
    );
  });

  it('omits an empty pagination cursor', async () => {
    await getPublicPractitionersByNameInteractor(applicationContext, {
      name: 'smith',
      searchAfter: [],
    });

    expect(mockGet.mock.calls[0][0].params.searchAfter).toBeUndefined();
  });

  it('omits an undefined pagination cursor', async () => {
    await getPublicPractitionersByNameInteractor(applicationContext, {
      name: 'smith',
    });

    expect(mockGet.mock.calls[0][0].params.searchAfter).toBeUndefined();
  });
});
