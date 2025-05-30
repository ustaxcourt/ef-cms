import { getMonthDayYearInETObj } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

export const createBarNumber = async ({ initials }: { initials: string }) => {
  const year = `${getMonthDayYearInETObj().year}`;
  const twoDigitYear = year.slice(-2);

  const practitioner = await getDbReader(reader =>
    reader
      .selectFrom('dwPractitioner')
      .select(_eb => [
        sql<number>`MAX(CAST(SUBSTRING("bar_number", 5) AS INTEGER))`.as(
          'maxBarNumber',
        ),
      ])
      .executeTakeFirst(),
  );

  const lastNumber = practitioner?.maxBarNumber ?? 100;
  const nextNumber = String(lastNumber + 1).padStart(3, '0');

  return `${initials}${twoDigitYear}${nextNumber}`;
};
