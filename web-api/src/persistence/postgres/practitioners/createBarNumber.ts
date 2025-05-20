import { getMonthDayYearInETObj } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';
import { sql } from 'kysely';

export const createBarNumber = async ({ initials }: { initials: string }) => {
  const year = `${getMonthDayYearInETObj().year}`;
  const twoDigitYear = year.slice(-2);

  // use getDbWriter to prevent east/west coast replication issues
  const practitioner = await getDbWriter({
    cb: writer =>
      writer
        .selectFrom('dwPractitioner')
        .select(_eb => [
          sql<number>`MAX(CAST(SUBSTRING("bar_number", 5) AS INTEGER))`.as(
            'maxBarNumber',
          ),
        ])
        .executeTakeFirst(),
    table: null,
  });

  const lastNumber = practitioner?.maxBarNumber ?? 100;
  const nextNumber = String(lastNumber + 1).padStart(3, '0');

  return `${initials}${twoDigitYear}${nextNumber}`;
};
