import { rawCaseEntity } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';

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

export const getBlockedCasesForTrialLocation = async (
  trialLocation: string,
) => {
  const results = await getDbReader(reader =>
    reader
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
      )
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
      .limit(MAX_RESULTS)
      .execute(),
  );
  return results.map(result => rawCaseEntity(result) as BlockedCaseData);
};
