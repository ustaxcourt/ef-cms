import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setShowModalAction } from './setShowModalAction';

describe('setShowModalAction,', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set state.modal.showModal to true when props.showModal is true', async () => {
    const { state } = await runAction(setShowModalAction, {
      modules: {
        presenter,
      },
      props: {
        showModal: true,
      },
      state: {},
    });

    expect(state.modal.showModal).toBeTruthy();
  });

  it('should set state.modal.showModal to false when props.showModal is false', async () => {
    const { state } = await runAction(setShowModalAction, {
      modules: {
        presenter,
      },
      props: {
        showModal: false,
      },
      state: {},
    });

    expect(state.modal.showModal).toBeFalsy();
  });
});
