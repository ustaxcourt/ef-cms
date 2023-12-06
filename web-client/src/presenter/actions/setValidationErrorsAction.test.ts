import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setValidationErrorsAction } from './setValidationErrorsAction';

describe('setValidationErrorsAction', () => {
  it('should set state.validationErrors from props.errors', async () => {
    const mockErrors = { irsNoticeDate: 'Some issue occurred' };

    const { state } = await runAction(setValidationErrorsAction, {
      modules: {
        presenter,
      },
      props: {
        errors: mockErrors,
      },
      state: {},
    });

    expect(state.validationErrors).toEqual(mockErrors);
  });
});
