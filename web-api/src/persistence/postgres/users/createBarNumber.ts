import { getMonthDayYearInETObj } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/persistence/postgres/database';
import { sql } from 'kysely';

export const createBarNumber = async ({
  initials,
}: {
  initials: string;
}): Promise<string> => {
  const year = `${getMonthDayYearInETObj().year}`;
  const twoDigitYear = year.slice(-2);

  const { lastUsedNumber: incrementedNextNumber } = await getDbWriter({
    table: 'dwBarNumber',
    action: null,
    cb: writer =>
      writer
        .insertInto('dwBarNumber')
        .values({
          year: Number(year),
          lastUsedNumber: 1,
        })
        .onConflict(oc =>
          oc.column('year').doUpdateSet({
            lastUsedNumber: sql<number>`dw_bar_number.last_used_number + 1`,
          }),
        )
        .returning(['lastUsedNumber'])
        .executeTakeFirstOrThrow(),
  });

  const nextNumber = String(incrementedNextNumber).padStart(3, '0');

  return `${initials}${twoDigitYear}${nextNumber}`;
};
