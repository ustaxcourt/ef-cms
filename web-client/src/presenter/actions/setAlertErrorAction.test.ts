import { runAction } from '@web-client/presenter/test.cerebral';
import { setAlertErrorAction } from './setAlertErrorAction';

describe('setAlertErrorAction', () => {
  it('sets state.alertError from props.alertError', async () => {
    const { state } = await runAction(setAlertErrorAction, {
      props: {
        alertError: {
          messages: 'Alert error message',
          title: 'Alert error title',
        },
      },
    });

    expect(state.alertError).toEqual({
      messages: 'Alert error message',
      title: 'Alert error title',
    });
  });
});
