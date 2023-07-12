import { runAction } from '@web-client/presenter/test.cerebral';
import { setModalValueAction } from './setModalValueAction';

describe('setModalValueAction', () => {
  it('sets the state.modal[props.key] to the passed in props.value', async () => {
    const result = await runAction(setModalValueAction, {
      props: {
        key: 'hasApples',
        value: true,
      },
      state: { modal: {} },
    });
    expect(result.state.modal.hasApples).toEqual(true);
  });
});
