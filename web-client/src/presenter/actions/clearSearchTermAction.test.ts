import { clearSearchTermAction } from './clearSearchTermAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearSearchTermAction', () => {
  it('should clear the value of state.header.searchTerm', async () => {
    const result = await runAction(clearSearchTermAction, {
      state: {
        header: {
          searchTerm: 'test',
        },
      },
    });

    expect(result.state.header.searchTerm).toEqual('');
  });
});
