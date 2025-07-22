import { getMonthDayYearInETObj } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

export const createBarNumber = async ({ initials }: { initials: string }) => {
  const year = `${getMonthDayYearInETObj().year}`;
  const twoDigitYear = year.slice(-2);

  // TODO: 10495:
  // - this doesn't use a transaction, so I still think we can have duplicate bar numbers
  // - the pad start seems unnecessary as we always start at 100
  // - the auto incrementing number is supposed to be bucketed by year (ask Chris or Tenille)
  const practitioner = await getDbReader(reader =>
    reader
      .selectFrom('dwUser')
      .select(_eb => [
        sql<number>`MAX(CAST(SUBSTRING("bar_number", 5) AS INTEGER))`.as(
          'maxBarNumber',
        ),
      ])
      .where('barNumber', 'is not', null)
      .executeTakeFirst(),
  );

  const lastNumber = practitioner?.maxBarNumber ?? 0;
  const nextNumber = String(lastNumber + 1).padStart(3, '0');

  return `${initials}${twoDigitYear}${nextNumber}`;
};
