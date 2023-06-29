import { clearAddDeficiencyFormValuesAction } from './clearAddDeficiencyFormValuesAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearAddDeficiencyFormValuesAction', () => {
  it('sets the form to a default state if yearOrPeriod is changed', async () => {
    const result = await runAction(clearAddDeficiencyFormValuesAction, {
      props: {
        key: 'yearOrPeriod',
        value: 'Year',
      },
      state: {
        form: {
          statisticId: '810d832d-329e-4b78-92d0-2d4e0709d1d0',
          yearOrPeriod: 'Period',
        },
      },
    });

    expect(result.state.form).toEqual({
      statisticId: '810d832d-329e-4b78-92d0-2d4e0709d1d0',
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
