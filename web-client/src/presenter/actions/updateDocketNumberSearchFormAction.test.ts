import { runAction } from '@web-client/presenter/test.cerebral';
import { updateDocketNumberSearchFormAction } from './updateDocketNumberSearchFormAction';

describe('updateDocketNumberSearchFormAction', () => {
  it('should seet state.header.searchTerm to the value of props.searchTerm', async () => {
    const { state } = await runAction(updateDocketNumberSearchFormAction, {
      props: {
        key: 'something',
        value: 'party',
      },
      state: {},
    });

    expect(state.advancedSearchForm.docketNumberSearch.something).toBe('party');
  });
});
