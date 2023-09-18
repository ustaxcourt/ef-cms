import { FORMATS } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatDateFromDatePicker } from './formatDateFromDatePicker';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('formatDateFromDatePicker', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should return formatted date as `YYYY-MM-DD` when passed a date', async () => {
    const { output } = await runAction(formatDateFromDatePicker, {
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

  it('should not attempt to format an empty string when the date has been cleared', async () => {
    const { output } = await runAction(formatDateFromDatePicker, {
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

  it('should format the date correctly, when month and day is only one digit', async () => {
    const { output } = await runAction(formatDateFromDatePicker, {
      modules: {
        presenter,
      },
      props: {
        key: 'finalBriefDueDate',
        toFormat: FORMATS.YYYYMMDD,
        value: '9/9/2023',
      },
    });

    expect(output).toEqual({
      key: 'finalBriefDueDate',
      value: '2023-09-09',
    });
  });
});
