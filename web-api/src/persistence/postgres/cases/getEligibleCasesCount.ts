import {
  CASE_STATUS_TYPES,
  ProcedureType,
} from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';

export const getEligibleCasesCount = async ({
  trialCity,
  procedureType,
}: {
  trialCity: string;
  procedureType: ProcedureType;
}): Promise<number> => {
  const caseCount = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .select(reader.fn.countAll().as('count'))
      .where('preferredTrialCity', '=', trialCity)
      .where('procedureType', '=', procedureType)
      .where('status', '=', CASE_STATUS_TYPES.generalDocketReadyForTrial)
      .where(eb =>
        eb.and([
          eb('automaticBlocked', 'is not', true),
          eb('blocked', 'is not', true),
          eb.not(
            eb.exists(sq =>
              sq
                .selectFrom('dwCase as c2')
                .select('c2.leadDocketNumber')
                .where('c2.preferredTrialCity', '=', trialCity)
                .whereRef('c2.leadDocketNumber', '=', 'dwCase.leadDocketNumber')
                .where(qb =>
                  qb.or([
                    qb('c2.automaticBlocked', '=', true),
                    qb('c2.blocked', '=', true),
                  ]),
                ),
            ),
          ),
        ]),
      )
      .executeTakeFirst(),
  );

  return Number(caseCount?.count) || 0;
};
