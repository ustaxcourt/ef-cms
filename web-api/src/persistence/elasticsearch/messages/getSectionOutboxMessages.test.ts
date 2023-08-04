import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getSectionOutboxMessages } from './getSectionOutboxMessages';
jest.mock('../searchClient');
import { PETITIONS_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { search } from '../searchClient';

describe('getSectionOutboxMessages', () => {
  it('should return results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getSectionOutboxMessages({
      applicationContext,
      section: PETITIONS_SECTION,
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
