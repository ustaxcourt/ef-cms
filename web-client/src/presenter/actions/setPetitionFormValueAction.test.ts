import { runAction } from '@web-client/presenter/test.cerebral';
import { setPetitionFormValueAction } from '@web-client/presenter/actions/setPetitionFormValueAction';

describe('setPetitionFormValueAction', () => {
  const KEY = 'KEY';

  it('should set state properly when value is truthy and index is a number', async () => {
    const { state } = await runAction(setPetitionFormValueAction, {
      props: {
        index: 0,
        key: KEY,
        value: 'TEST_VALUE',
      },
      state: {
        form: {
          [KEY]: [],
        },
      },
    });

    expect(state.form[KEY]).toEqual(['TEST_VALUE']);
  });

  it('should set state properly when value is truthy and index is a string', async () => {
    const { state } = await runAction(setPetitionFormValueAction, {
      props: {
        index: 'prop1',
        key: KEY,
        value: 'TEST_VALUE',
      },
      state: {
        form: {
          [KEY]: {},
        },
      },
    });

    expect(state.form[KEY]).toEqual({ prop1: 'TEST_VALUE' });
  });

  it('should set state properly when value is truthy and index is undefined', async () => {
    const { state } = await runAction(setPetitionFormValueAction, {
      props: {
        index: undefined,
        key: KEY,
        value: 'TEST_VALUE',
      },
      state: {
        form: {
          [KEY]: undefined,
        },
      },
    });

    expect(state.form[KEY]).toEqual('TEST_VALUE');
  });

  it('should unset state correctly if the value is null', async () => {
    const { state } = await runAction(setPetitionFormValueAction, {
      props: {
        index: undefined,
        key: KEY,
        value: null,
      },
      state: {
        form: {
          [KEY]: 'PREVIOUS VALUE',
        },
      },
    });

    expect(state.form[KEY]).toEqual(undefined);
  });
});
