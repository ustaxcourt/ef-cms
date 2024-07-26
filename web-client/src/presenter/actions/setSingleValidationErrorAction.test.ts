import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setSingleValidationErrorAction } from '@web-client/presenter/actions/setSingleValidationErrorAction';

describe('setSingleValidationErrorAction', () => {
  it('should clear all error messages if there are no errors in props', async () => {
    const results = await runAction(setSingleValidationErrorAction, {
      modules: {
        presenter,
      },
      state: {
        errors: undefined,
      },
    });

    expect(results.state.validationErrors).toEqual({});
  });

  it('should set a root level validation message in state', async () => {
    const results = await runAction(setSingleValidationErrorAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          prop1: 'prop1 error message',
        },
        validationKey: ['prop1'],
      },
      state: {
        validationErrors: {},
      },
    });

    expect(results.state.validationErrors).toEqual({
      prop1: 'prop1 error message',
    });
  });

  it('should set a validation message nested in an object', async () => {
    const results = await runAction(setSingleValidationErrorAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          prop1: {
            prop2: 'prop2 error message',
          },
        },
        validationKey: ['prop1', 'prop2'],
      },
      state: {
        validationErrors: {},
      },
    });

    expect(results.state.validationErrors).toEqual({
      prop1: {
        prop2: 'prop2 error message',
      },
    });
  });

  it('should set a validation message on an item in an array', async () => {
    const results = await runAction(setSingleValidationErrorAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          prop1: [
            { index: 0 },
            { index: 1, prop2: 'prop2 validation message' },
            { index: 2 },
          ],
        },
        validationKey: ['prop1', { property: 'index', value: 1 }, 'prop2'],
      },
      state: {
        validationErrors: {},
      },
    });

    expect(results.state.validationErrors).toEqual({
      prop1: [
        {
          index: 1,
          prop2: 'prop2 validation message',
        },
      ],
    });
  });
});
