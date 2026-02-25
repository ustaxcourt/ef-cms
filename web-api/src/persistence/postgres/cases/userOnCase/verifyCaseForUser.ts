import { getDbReader } from '@web-api/database';

/**
 * Checks whether the given user is directly associated with a specific case
 * (i.e. has a row in dwUserOnCase for that exact docketNumber).
 *
 * Use this for association/idempotency checks where you need to know if the
 * practitioner is already on THIS specific case, not just any case in a
 * consolidated group.
 */
export const verifyDirectCaseAssociation = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}): Promise<boolean> => {
  const directResult = await getDbReader(db =>
    db
      .selectFrom('dwUserOnCase')
      .where('docketNumber', '=', docketNumber)
      .where('userId', '=', userId)
      .select('docketNumber')
      .executeTakeFirst(),
  );

  return !!directResult;
};

/**
 * Checks whether the given user is associated with the given case,
 * either directly or through a consolidated case group.
 *
 * On staging this was handled by `userIsDirectlyAssociated` +
 * `isUserPartOfGroup` which checked the in-memory consolidated-cases
 * array.  Because the new paginated docket-entries endpoint does not
 * load the full case object, we replicate the same logic at the
 * database level:
 *   1. Check dwUserOnCase for a direct association.
 *   2. If the case has a leadDocketNumber (i.e. is consolidated),
 *      check whether the user is on ANY case in that group.
 *
 * Use this for authorization/access control checks where a user on any
 * case in a consolidated group should be allowed to view the case.
 */
export const verifyCaseForUser = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}): Promise<boolean> => {
  // Fast path: direct association
  const isDirect = await verifyDirectCaseAssociation({ docketNumber, userId });
  if (isDirect) {
    return true;
  }

  // Check if the case is part of a consolidated group
  const caseRecord = await getDbReader(db =>
    db
      .selectFrom('dwCase')
      .where('docketNumber', '=', docketNumber)
      .select('leadDocketNumber')
      .executeTakeFirst(),
  );

  if (!caseRecord?.leadDocketNumber) {
    return false;
  }

  // Check if the user is associated with ANY case in the consolidated group
  const consolidatedResult = await getDbReader(db =>
    db
      .selectFrom('dwUserOnCase as uoc')
      .innerJoin('dwCase as c', 'c.docketNumber', 'uoc.docketNumber')
      .where('c.leadDocketNumber', '=', caseRecord.leadDocketNumber!)
      .where('uoc.userId', '=', userId)
      .select('uoc.docketNumber')
      .executeTakeFirst(),
  );

  return !!consolidatedResult;
};
