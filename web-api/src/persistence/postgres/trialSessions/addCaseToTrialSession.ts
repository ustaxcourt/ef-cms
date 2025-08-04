import { settlePromises } from '@web-api/utilities/settlePromises';
import { TCaseOrder } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { pgInsertInto } from '../utils/operation/pgInsertInto';

import { toKyselyNewTrialSessionCase } from './mapper';

export const addCaseToTrialSession = ({
  docketNumber,
  caseOrder,
  isHearing,
  trialSessionId,
}: {
  docketNumber: string;
  caseOrder: TCaseOrder;
  isHearing: boolean;
  trialSessionId: string;
}) =>
  settlePromises([
    pgInsertInto({
      table: 'dwTrialSessionCase',
      values: toKyselyNewTrialSessionCase({
        ...caseOrder,
        isManuallyAdded: caseOrder.isManuallyAdded ?? false,
        removedFromTrial: caseOrder.removedFromTrial ?? false,
        docketNumber,
        isHearing,
        trialSessionId,
      }),
    }),
  ]);

