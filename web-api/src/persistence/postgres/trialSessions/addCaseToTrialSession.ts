import { settlePromises } from '@web-api/utilities/settlePromises';
import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { updateTrialSession } from './updateTrialSession';

export const addCaseToTrialSession = ({
  docketNumber,
  trialSession,
  isHearing
}: {
  docketNumber: string;
  trialSession: RawTrialSession;
  isHearing: boolean;
}) =>
  settlePromises([
    pgInsertInto({
      table: 'dwTrialSessionCase',
      values: { trialSessionId: trialSession.trialSessionId, docketNumber, isHearing },
    }),

    updateTrialSession({
      trialSessionToUpdate: trialSession,
    }),
  ]);
