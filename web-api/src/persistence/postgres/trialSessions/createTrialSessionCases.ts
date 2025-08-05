import { settlePromises } from '@web-api/utilities/settlePromises';
import { TCaseOrder } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { pgInsertInto } from '../utils/operation/pgInsertInto';

import { toKyselyNewTrialSessionCase } from './mapper';

export const createTrialSessionCases = async ({
  trialSessionCases,
}: {
  trialSessionCases: {
    docketNumber: string;
    caseOrder: TCaseOrder;
    isHearing: boolean;
    trialSessionId: string;
  }[];
}): Promise<void> => {
  if (!trialSessionCases.length) return;

  await settlePromises([
    pgInsertInto({
      table: 'dwTrialSessionCase',
      values: trialSessionCases.map(TSC =>
        toKyselyNewTrialSessionCase({
          ...TSC.caseOrder,
          isManuallyAdded: TSC.caseOrder.isManuallyAdded ?? false,
          removedFromTrial: TSC.caseOrder.removedFromTrial ?? false,
          docketNumber: TSC.docketNumber,
          isHearing: TSC.isHearing,
          trialSessionId: TSC.trialSessionId,
        }),
      ),
      onConflictColumns: ['trialSessionId', 'docketNumber'],
    }),
  ]);
};
