import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDeadlines as formattedCaseDeadlinesComputed } from './formattedCaseDeadlines';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedCaseDeadlines', () => {
  const formattedCaseDeadlines = withAppContextDecorator(
    formattedCaseDeadlinesComputed,
    applicationContext,
  );

  it('formats deadline dates, sorts them by date, and sets overdue to true if date is before today', () => {
    const caseDeadlines = [
      {
        deadlineDate: '2019-06-30T04:00:00.000Z',
      },
      {
        deadlineDate: '2019-01-30T05:00:00.000Z',
      },
      {
        deadlineDate: '2025-07-30T04:00:00.000Z',
      },
    ];

    const result = runCompute(formattedCaseDeadlines, {
      state: {
        caseDeadlines,
      },
    });
    expect(result.length).toEqual(3);
    expect(result).toEqual([
      {
        deadlineDate: '2019-01-30T05:00:00.000Z',
        deadlineDateFormatted: '01/30/19',
        overdue: true,
      },
      {
        deadlineDate: '2019-06-30T04:00:00.000Z',
        deadlineDateFormatted: '06/30/19',
        overdue: true,
      },
      {
        deadlineDate: '2025-07-30T04:00:00.000Z',
        deadlineDateFormatted: '07/30/25',
      },
    ]);
  });

  it('formats deadline dates and does not set overdue to true if the deadlineDate is today', () => {
    const caseDeadlines = [
      {
        deadlineDate: applicationContext.getUtilities().createISODateString(),
      },
    ];

    const result = runCompute(formattedCaseDeadlines, {
      state: {
        caseDeadlines,
      },
    });
    expect(result.length).toEqual(1);
    expect(result[0].overdue).toBeUndefined();
  });

  it('does not format empty caseDeadlines array', () => {
    const result = runCompute(formattedCaseDeadlines, {
      state: {},
    });
    expect(result.length).toEqual(0);
  });
});
