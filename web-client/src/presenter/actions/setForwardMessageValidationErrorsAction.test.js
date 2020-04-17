import { runAction } from 'cerebral/test';
import { setForwardMessageValidationErrorsAction } from './setForwardMessageValidationErrorsAction';

describe('setForwardMessageValidationErrorsAction', () => {
  it('sets state.validationErrors[props.workItemId] with props.errors', async () => {
    const { state } = await runAction(setForwardMessageValidationErrorsAction, {
      props: {
        errors: 'some errors',
        workItemId: '1234',
      },
      state: {
        validationErrors: {},
      },
    });

    expect(state.validationErrors['1234']).toEqual('some errors');
  });
});
