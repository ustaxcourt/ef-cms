import { runAction } from '@web-client/presenter/test.cerebral';
import { setModalTitleAction } from './setModalTitleAction';

describe('setModalTitleAction', () => {
  const mockTitle = 'The Duke of Hastings';

  it('sets the state.modal.title to the value of props.title', async () => {
    const { state } = await runAction(setModalTitleAction, {
      props: {
        title: mockTitle,
      },
      state: { modal: {} },
    });
    expect(state.modal.title).toEqual(mockTitle);
  });
});
