import { REPORTING_CALENDAR_DEADLINE_DESCRIPTION } from '@shared/business/entities/EntityConstants';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

/**
 * Moves the deadlines that were created when a Reporting calendar was set to a new due date.
 * Only a deadline with the Reporting calendar description that is still on the previous due
 * date is changed, so deadlines that users added or edited are left alone.
 */
export const updateReportingCalendarDeadlineDates = async ({
  docketNumbers,
  newDueDate,
  previousDueDate,
}: {
  docketNumbers: string[];
  newDueDate: string;
  previousDueDate: string;
}): Promise<void> => {
  if (!docketNumbers.length) {
    return;
  }

  await pgUpdateTable({
    table: 'dwCaseDeadline',
    values: { deadlineDate: calculateDate({ dateString: newDueDate }) },
    where: db =>
      db
        .where('docketNumber', 'in', docketNumbers)
        .where('description', '=', REPORTING_CALENDAR_DEADLINE_DESCRIPTION)
        .where(
          'deadlineDate',
          '=',
          calculateDate({ dateString: previousDueDate }),
        ),
  });
};
