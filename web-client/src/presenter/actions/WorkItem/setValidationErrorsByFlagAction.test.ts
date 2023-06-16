import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setValidationErrorsByFlagAction } from './setValidationErrorsByFlagAction';

describe('setValidationErrorsByFlagAction', () => {
  it('should put error message on state.modal if fromModal is true', async () => {
    const result = await runAction(setValidationErrorsByFlagAction, {
      modules: {
        presenter,
      },
      props: {
        errors: 'ERROR!',
        fromModal: true,
      },
    });

    expect(result.state.modal.validationErrors).toEqual('ERROR!');
  });

  it('should put error message on base state if fromModal is undefined', async () => {
    const result = await runAction(setValidationErrorsByFlagAction, {
      modules: {
        presenter,
      },
      props: {
        errors: 'ERROR!',
      },
    });

    expect(result.state.validationErrors).toEqual('ERROR!');
  });
});
