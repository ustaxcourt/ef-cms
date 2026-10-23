import { getDbReader } from '@web-api/persistence/postgres/database';

export const checkEmailIsPractitioner = async ({
  email,
}: {
  email: string;
}): Promise<boolean> => {
  const emailMatches = await getDbReader(reader =>
    reader
      .selectFrom('dwUser')
      .where(eb =>
        eb.or([
          eb(eb.fn('lower', ['email']), '=', email.toLowerCase()),
          eb(eb.fn('lower', ['pendingEmail']), '=', email.toLowerCase()),
        ]),
      )
      .where('section', 'in', ['irsPractitioner', 'privatePractitioner'])
      .select(fn => fn.fn.countAll().as('count'))
      .executeTakeFirst(),
  );
  return Number(emailMatches?.count ?? 0) > 0;
};
