import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { showModalFromQueryAction } from './showModalFromQueryAction';

describe('showModalFromQueryAction', () => {
  it('sets state.showModal from props.openModal', async () => {
    const result = await runAction(showModalFromQueryAction, {
      modules: {
        presenter,
      },
      props: { openModal: 'SomeModal' },
      state: {},
    });
    expect(result.state.showModal).toEqual('SomeModal');
  });

  it('does not change state.showModal if props.openModal is undefined', async () => {
    const result = await runAction(showModalFromQueryAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        showModal: 'SomeOtherModal',
      },
    });
    expect(result.state.showModal).toEqual('SomeOtherModal');
  });
});
