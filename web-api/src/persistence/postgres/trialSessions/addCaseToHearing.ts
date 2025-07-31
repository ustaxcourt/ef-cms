import { settlePromises } from '@web-api/utilities/settlePromises';
import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { updateTrialSession } from './updateTrialSession';

export const addCaseToHearing = ({
  docketNumber,
  trialSession,
}: {
  docketNumber: string;
  trialSession: RawTrialSession;
}) =>
  settlePromises([
    pgInsertInto({
      table: 'dwCaseHearing',
      values: { trialSessionId: trialSession.trialSessionId, docketNumber },
    }),

    updateTrialSession({
      trialSessionToUpdate: trialSession,
    }),
  ]);
