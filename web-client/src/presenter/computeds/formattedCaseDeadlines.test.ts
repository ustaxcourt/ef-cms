import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formattedCaseDeadlines as formattedCaseDeadlinesComputed } from './formattedCaseDeadlines';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedCaseDeadlines', () => {
  const formattedCaseDeadlines = withAppContextDecorator(
    formattedCaseDeadlinesComputed,
    applicationContext,
  );

  it('should format deadline dates, sorts them by date, and sets overdue to true if date is before today', () => {
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
        caseDetail: {},
      },
    });
    expect(result.length).toEqual(3);
    expect(result).toEqual([
      {
        deadlineDate: '2019-01-30T05:00:00.000Z',
        deadlineDateFormatted: '01/30/19',
        overdue: true,
        displayEditAndDeleteLink: true,
      },
      {
        deadlineDate: '2019-06-30T04:00:00.000Z',
        deadlineDateFormatted: '06/30/19',
        overdue: true,
        displayEditAndDeleteLink: true,
      },
      {
        deadlineDate: '2025-07-30T04:00:00.000Z',
        deadlineDateFormatted: '07/30/25',
        displayEditAndDeleteLink: true,
      },
    ]);
  });

  it('should format deadline dates and does not set overdue to true if the deadlineDate is today', () => {
    const caseDeadlines = [
      {
        deadlineDate: applicationContext.getUtilities().createISODateString(),
      },
    ];

    const result = runCompute(formattedCaseDeadlines, {
      state: {
        caseDetail: {},
        caseDeadlines,
      },
    });
    expect(result.length).toEqual(1);
    expect(result[0].overdue).toBeUndefined();
  });

  it('should not format empty caseDeadlines array', () => {
    const result = runCompute(formattedCaseDeadlines, {
      state: {},
    });
    expect(result.length).toEqual(0);
  });

  it('should not display the edit and delete link when the case deadline is associated to a child case', () => {
    const caseDeadlines = [
      {
        caseDeadlineId: '1',
        consolidatedCaseDeadlineId: undefined,
        deadlineDate: '2019-06-30T04:00:00.000Z',
      },
      {
        caseDeadlineId: '2',
        consolidatedCaseDeadlineId: '1',
        deadlineDate: '2019-01-30T05:00:00.000Z',
      },
      {
        caseDeadlineId: '3',
        consolidatedCaseDeadlineId: undefined,
        deadlineDate: '2025-07-30T04:00:00.000Z',
      },
    ];

    const result = runCompute(formattedCaseDeadlines, {
      state: {
        caseDeadlines,
        caseDetail: { leadDocketNumber: '101-25' },
      },
    });

    expect(result.length).toEqual(3);
    expect(result).toMatchObject([
      {
        caseDeadlineId: '2',
        displayEditAndDeleteLink: false,
      },
      {
        caseDeadlineId: '1',
        displayEditAndDeleteLink: true,
      },
      {
        caseDeadlineId: '3',
        displayEditAndDeleteLink: true,
      },
    ]);
  });
});
