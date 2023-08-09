import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getSectionInboxMessages } from './getSectionInboxMessages';
jest.mock('../searchClient');
import { PETITIONS_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { search } from '../searchClient';

describe('getSectionInboxMessages', () => {
  it('should return results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getSectionInboxMessages({
      applicationContext,
      section: PETITIONS_SECTION,
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });

  it('should filter out completed messages', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    await getSectionInboxMessages({
      applicationContext,
      section: PETITIONS_SECTION,
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual(
      expect.arrayContaining([
        {
          match: {
            'isCompleted.BOOL': false,
          },
        },
      ]),
    );
  });
});
