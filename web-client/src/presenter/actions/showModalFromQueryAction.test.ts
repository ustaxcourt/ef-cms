import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { showModalFromQueryAction } from './showModalFromQueryAction';

describe('showModalFromQueryAction', () => {
  it('sets state.modal.showModal from props.openModal', async () => {
    const result = await runAction(showModalFromQueryAction, {
      modules: {
        presenter,
      },
      props: { openModal: 'SomeModal' },
      state: {},
    });
    expect(result.state.modal.showModal).toEqual('SomeModal');
  });

  it('does not change state.modal.showModal if props.openModal is undefined', async () => {
    const result = await runAction(showModalFromQueryAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        modal: {
          showModal: 'SomeOtherModal',
        },
      },
    });
    expect(result.state.modal.showModal).toEqual('SomeOtherModal');
  });
});
