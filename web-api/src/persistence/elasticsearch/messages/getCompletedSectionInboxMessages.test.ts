import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCompletedSectionInboxMessages } from './getCompletedSectionInboxMessages';
jest.mock('../searchClient');
import { PETITIONS_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { search } from '../searchClient';

describe('getCompletedSectionInboxMessages', () => {
  it('should return results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getCompletedSectionInboxMessages({
      applicationContext,
      section: PETITIONS_SECTION,
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
