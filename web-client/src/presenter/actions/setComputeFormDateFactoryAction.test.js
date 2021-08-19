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
          form: {
            day: '13',
            month: '01',
            year: '2020',
          },
        },
      },
    );

    expect(result.state.form).toEqual({ testDate: '2020-01-13' });
    expect(result.output).toEqual({ testDate: '2020-01-13' });
  });

  it('unsets [path], day, month, year from state if computed date is not defined in props', async () => {
    const result = await runAction(
      setComputeFormDateFactoryAction('testDate'),
      {
        props: {},
        state: {
          form: {
            day: '13',
            month: '01',
            size: 'XS',
            testDate: 'blind',
            year: '2020',
          },
        },
      },
    );

    expect(result.state.form).toEqual({
      size: 'XS',
    });
  });
});
