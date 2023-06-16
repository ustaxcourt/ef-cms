import { runAction } from '@web-client/presenter/test.cerebral';
import { setAlertSuccessAction } from './setAlertSuccessAction';

describe('setAlertSuccessAction', () => {
  it('sets state.alertSuccess from props.alertSuccess', async () => {
    const { state } = await runAction(setAlertSuccessAction, {
      props: {
        alertSuccess: {
          messages: 'Alert success message',
          title: 'Alert success title',
        },
      },
    });

    expect(state.alertSuccess).toEqual({
      messages: 'Alert success message',
      title: 'Alert success title',
    });
  });
});
