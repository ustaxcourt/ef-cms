import { runAction } from 'cerebral/test';
import { setComputeFormDateFactoryAction } from './setComputeFormDateFactoryAction';

describe('setComputeFormDateFactoryAction', () => {
  it('sets the props.computedDate value on the given form[path]', async () => {
    const result = await runAction(
      setComputeFormDateFactoryAction('testDate'),
      {
        props: {
          computedDate: '2020-01-13',
        },
        state: {
          form: {},
        },
      },
    );

    expect(result.state.form).toEqual({ testDate: '2020-01-13' });
  });
});
