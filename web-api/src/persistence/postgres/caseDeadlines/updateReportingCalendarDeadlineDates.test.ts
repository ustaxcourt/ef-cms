jest.mock('@web-api/persistence/postgres/utils/operation/pgUpdateTable');
import { REPORTING_CALENDAR_DEADLINE_DESCRIPTION } from '@shared/business/entities/EntityConstants';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { pgUpdateTable as pgUpdateTableMock } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';
import { updateReportingCalendarDeadlineDates } from '@web-api/persistence/postgres/caseDeadlines/updateReportingCalendarDeadlineDates';

describe('updateReportingCalendarDeadlineDates', () => {
  const pgUpdateTable = jest.mocked(pgUpdateTableMock);
  const previousDueDate = '2027-03-21T04:00:00.000Z';
  const newDueDate = '2027-03-25T04:00:00.000Z';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should move only the Reporting calendar deadlines on the previous due date for the given cases', async () => {
    await updateReportingCalendarDeadlineDates({
      docketNumbers: ['101-26', '102-26'],
      newDueDate,
      previousDueDate,
    });

    const { table, values, where } = pgUpdateTable.mock.calls[0][0];
    expect(table).toBe('dwCaseDeadline');
    expect(values).toEqual({
      deadlineDate: calculateDate({ dateString: newDueDate }),
    });

    const conditions: unknown[][] = [];
    const builder = {
      where: (...args: unknown[]) => {
        conditions.push(args);
        return builder;
      },
    };
    where(builder as never);
    expect(conditions).toEqual([
      ['docketNumber', 'in', ['101-26', '102-26']],
      ['description', '=', REPORTING_CALENDAR_DEADLINE_DESCRIPTION],
      ['deadlineDate', '=', calculateDate({ dateString: previousDueDate })],
    ]);
  });

  it('should not update anything when there are no cases', async () => {
    await updateReportingCalendarDeadlineDates({
      docketNumbers: [],
      newDueDate,
      previousDueDate,
    });

    expect(pgUpdateTable).not.toHaveBeenCalled();
  });
});
