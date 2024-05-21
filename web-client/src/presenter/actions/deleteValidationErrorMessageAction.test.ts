import { deleteValidationErrorMessageAction } from '@web-client/presenter/actions/deleteValidationErrorMessageAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('deleteValidationErrorMessageAction', () => {
  it('should do nothing if "validationErrors" is undefined in state', async () => {
    const result = await runAction(deleteValidationErrorMessageAction, {
      props: {
        validationKey: ['some', 'path'],
      },
      state: {
        validationErrors: undefined,
      },
    });

    const { validationErrors } = result.state;
    expect(validationErrors).toEqual(undefined);
  });

  it('should delete a root level validatio error', async () => {
    const result = await runAction(deleteValidationErrorMessageAction, {
      props: {
        validationKey: ['test_1'],
      },
      state: {
        validationErrors: {
          test_1: 'SOME ERROR MESSAGE',
        },
      },
    });

    const { validationErrors } = result.state;
    expect(validationErrors).toEqual({});
  });

  it('should delete a validation error message nested in an object', async () => {
    const result = await runAction(deleteValidationErrorMessageAction, {
      props: {
        validationKey: ['root_object', 'test_1'],
      },
      state: {
        validationErrors: {
          root_object: {
            test_1: 'SOME ERROR MESSAGE',
          },
        },
      },
    });

    const { validationErrors } = result.state;
    expect(validationErrors).toEqual({
      root_object: {},
    });
  });

  it('should delete a validation error message in an object inside an array in state', async () => {
    const result = await runAction(deleteValidationErrorMessageAction, {
      props: {
        validationKey: [
          'root_object',
          'test_array',
          { property: 'index', value: 3 },
          'test_1',
        ],
      },
      state: {
        validationErrors: {
          root_object: {
            test_array: [
              {
                index: 1,
                test_1: 'SOME ERROR MESSAGE',
              },
              {
                index: 2,
                test_1: 'SOME ERROR MESSAGE',
              },
              {
                index: 3,
                test_1: 'SOME ERROR MESSAGE',
              },
              {
                index: 4,
                test_1: 'SOME ERROR MESSAGE',
              },
            ],
          },
        },
      },
    });

    const { validationErrors } = result.state;
    expect(validationErrors).toEqual({
      root_object: {
        test_array: [
          {
            index: 1,
            test_1: 'SOME ERROR MESSAGE',
          },
          {
            index: 2,
            test_1: 'SOME ERROR MESSAGE',
          },
          {
            index: 3,
          },
          {
            index: 4,
            test_1: 'SOME ERROR MESSAGE',
          },
        ],
      },
    });
  });
});
