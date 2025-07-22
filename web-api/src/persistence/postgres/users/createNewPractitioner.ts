import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import { getMonthDayYearInETObj } from '@shared/business/utilities/DateHandler';
import { getUniqueId } from '@shared/sharedAppContext';
import { sql } from 'kysely';
import { rawUser, toKyselyNewUser } from './mapper';
import { getDbWriter } from '@web-api/database';

export const createNewPractitioner = async ({
  user,
}: {
  user: Omit<RawPractitioner, 'userId'>;
}) => {
  const year = `${getMonthDayYearInETObj().year}`;
  const twoDigitYear = year.slice(-2);
  const initials =
    user.lastName.charAt(0).toUpperCase() +
    user.firstName.charAt(0).toUpperCase();

  return await getDbWriter({
    table: null,
    action: null,
    cb: db => {
      return db.transaction().execute(async trx => {
        const { lastUsedNumber } = await trx
          .insertInto('dwBarNumber')
          .values({
            year,
            lastUsedNumber: 1,
          })
          .onConflict(oc =>
            oc.column('year').doUpdateSet({
              lastUsedNumber: sql<number>`dw_bar_number.last_used_number + 1`,
            }),
          )
          .returning(['lastUsedNumber'])
          .executeTakeFirstOrThrow();

        const barNumber = `${initials}${twoDigitYear}${String(lastUsedNumber).padStart(3, '0')}`;

        const practitionerToPersist = new Practitioner({
          ...user,
          barNumber,
          userId: getUniqueId(),
        })
          .validate()
          .toRawObject();

        const record = await trx
          .insertInto('dwUser')
          .values(toKyselyNewUser(practitionerToPersist))
          .returningAll()
          .execute();

        return rawUser(record[0]);
      });
    },
  });
};
