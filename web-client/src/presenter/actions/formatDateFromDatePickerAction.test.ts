import { FORMATS } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatDateFromDatePickerAction } from './formatDateFromDatePickerAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('formatDateFromDatePicker', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should return a date, formatted using the pattern provided', async () => {
    const { output } = await runAction(formatDateFromDatePickerAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'finalBriefDueDate',
        toFormat: FORMATS.YYYYMMDD,
        value: '08/29/2023',
      },
    });

    expect(output).toEqual({
      key: 'finalBriefDueDate',
      value: '2023-08-29',
    });
  });

  it('should not attempt to format when the date has been cleared', async () => {
    const { output } = await runAction(formatDateFromDatePickerAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'finalBriefDueDate',
        toFormat: FORMATS.YYYYMMDD,
        value: '',
      },
    });

    expect(output).toEqual(undefined);
  });
});
