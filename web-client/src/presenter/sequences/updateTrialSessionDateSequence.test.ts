import { FORMATS } from '@shared/business/utilities/DateHandler';
import { runSequence } from 'cerebral/test';
import { updateTrialSessionDateSequence } from './updateTrialSessionDateSequence';

describe('updateTrialSessionDateSequence', () => {
  it.each([
    ['02/10/2099', '2099-02-10T00:00:00.000-05:00'],
    ['', undefined],
  ])(
    'should synchronize both Reporting dates for input %s',
    async (value, expected) => {
      const result = await runSequence(updateTrialSessionDateSequence, {
        props: { key: 'startDate', value, toFormat: FORMATS.ISO },
        state: {
          form: {
            proceedingType: 'Reporting',
            startDate: '2099-01-01T00:00:00.000Z',
            estimatedEndDate: '2099-01-01T00:00:00.000Z',
          },
        },
      });

      expect(result.state.form.startDate).toBe(expected);
      expect(result.state.form.estimatedEndDate).toBe(expected);
    },
  );

  it.each(['startDate', 'estimatedEndDate'])(
    'should update only %s for an ordinary session',
    async key => {
      const form = {
        proceedingType: 'In Person',
        startDate: '2099-01-01T00:00:00.000Z',
        estimatedEndDate: '2099-01-02T00:00:00.000Z',
      };
      const result = await runSequence(updateTrialSessionDateSequence, {
        props: { key, value: '02/10/2099', toFormat: FORMATS.ISO },
        state: { form },
      });

      expect(result.state.form).toEqual({
        ...form,
        [key]: '2099-02-10T00:00:00.000-05:00',
      });
    },
  );
});
