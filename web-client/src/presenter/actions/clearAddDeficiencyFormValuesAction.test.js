import { clearAddDeficiencyFormValuesAction } from './clearAddDeficiencyFormValuesAction';
import { runAction } from 'cerebral/test';

describe('clearAddDeficiencyFormValuesAction', () => {
  it('sets the form to a default state if yearOrPeriod is changed', async () => {
    const result = await runAction(clearAddDeficiencyFormValuesAction, {
      props: {
        key: 'yearOrPeriod',
        value: 'Year',
      },
      state: {
        form: {
          yearOrPeriod: 'Period',
        },
      },
    });

    expect(result.state.form).toEqual({
      yearOrPeriod: 'Year',
    });
  });

  it('does nothing if the key of yearOrPeriod was not passed in', async () => {
    const result = await runAction(clearAddDeficiencyFormValuesAction, {
      props: {
        key: 'amount',
        value: 'yup',
      },
      state: {
        form: {
          yearOrPeriod: 'Year',
        },
      },
    });

    expect(result.state.form).toEqual({
      yearOrPeriod: 'Year',
    });
  });
});
