import { runAction } from 'cerebral/test';
import { updateSearchTermAction } from './updateSearchTermAction';

describe('updateSearchTermAction', () => {
  const mockSearchTerm = 'order search';

  it('should seet state.header.searchTerm to the value of props.searchTerm', async () => {
    const { state } = await runAction(updateSearchTermAction, {
      props: {
        searchTerm: mockSearchTerm,
      },
      state: {
        header: {
          searchTerm: '',
        },
      },
    });

    expect(state.header.searchTerm).toBe(mockSearchTerm);
  });
});
