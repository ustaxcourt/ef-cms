import { getDbReader } from '@web-api/database';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';

export const getBlockedCasesCount = async (trialLocation: string) => {
  const caseCount = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .select(reader.fn.countAll().as('count'))
      .where('preferredTrialCity', '=', trialLocation)
      .where('status', 'in', [
        CASE_STATUS_TYPES.generalDocket,
        CASE_STATUS_TYPES.generalDocketReadyForTrial,
        CASE_STATUS_TYPES.assignedCase,
        CASE_STATUS_TYPES.assignedMotion,
      ])
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
      .executeTakeFirst(),
  );

  return Number(caseCount?.count) || 0;
};
