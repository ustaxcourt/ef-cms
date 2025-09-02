import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { DEFAULT_FILTERED_BLOCKED_CASE_STATUSES } from '@shared/business/entities/EntityConstants';
import { Kysely } from 'kysely';
import { Database } from '@web-api/persistence/postgres/database-schema';
import { Case } from '@shared/business/entities/cases/Case';

const MAX_RESULTS = 5000;

export type BlockedCaseData = Pick<
  RawCase,
  | 'automaticBlocked'
  | 'automaticBlockedDate'
  | 'automaticBlockedReason'
  | 'blocked'
  | 'blockedDate'
  | 'blockedReason'
  | 'caseCaption'
  | 'docketNumber'
  | 'docketNumberSuffix'
  | 'leadDocketNumber'
  | 'status'
  | 'procedureType'
>;

export const blockedCasesQuery = ({
  db,
  trialLocation,
}: {
  db: Kysely<Database>;
  trialLocation: string;
}) => {
  return db
    .selectFrom('dwCase')
    .where('preferredTrialCity', '=', trialLocation)
    .where(eb =>
      eb.or([
        eb('automaticBlocked', '=', true),
        eb('blocked', '=', true),
        eb.or([
          eb.exists(sq =>
            sq
              .selectFrom('dwCase as c2')
              .select('c2.leadDocketNumber')
              .where('c2.preferredTrialCity', '=', trialLocation)
              .whereRef('c2.leadDocketNumber', '=', 'dwCase.leadDocketNumber')
              .where(qb =>
                qb.or([
                  qb('c2.automaticBlocked', '=', true),
                  qb('c2.blocked', '=', true),
                ]),
              ),
          ),
        ]),
      ]),
    );
};

export const getBlockedCasesForTrialLocation = async (
  trialLocation: string,
  blockedCaseFilter:
    | typeof DEFAULT_FILTERED_BLOCKED_CASE_STATUSES
    | undefined = undefined,
) => {
  const results = await getDbReader(async reader => {
    let query = blockedCasesQuery({ db: reader, trialLocation })
      .select([
        'automaticBlocked',
        'automaticBlockedDate',
        'automaticBlockedReason',
        'blocked',
        'blockedDate',
        'blockedReason',
        'caption',
        'docketNumber',
        'docketNumberSuffix',
        'leadDocketNumber',
        'status',
        'procedureType',
      ])
      .limit(MAX_RESULTS);

    if (blockedCaseFilter) {
      query = query.where('status', 'in', blockedCaseFilter);
    }

    return await query.execute();
  });

  return results.map(result => {
    return {
      ...fromKyselyCase(result),
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: result.docketNumber,
        docketNumberSuffix: result.docketNumberSuffix,
      }),
    };
  });
};
