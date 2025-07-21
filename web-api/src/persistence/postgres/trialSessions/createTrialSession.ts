import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { toKyselyNewTrialSession } from './mapper';

export const createTrialSession = ({
  trialSession,
}: {
  trialSession: RawTrialSession;
}) =>
  pgInsertInto({
    table: 'dwTrialSession',
    values: [toKyselyNewTrialSession(trialSession)],
  });
