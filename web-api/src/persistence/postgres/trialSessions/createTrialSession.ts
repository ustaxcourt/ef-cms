import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { fromKyselyTrialSession, toKyselyNewTrialSession } from './mapper';

export const createTrialSession = async ({
  trialSession,
}: {
  trialSession: RawTrialSession;
}): Promise<RawTrialSession> => {//TODO TYPING
  const result = (await pgInsertInto({
    table: 'dwTrialSession',
    values: [toKyselyNewTrialSession(trialSession)],
  })).at(0);

  if(!result) throw Error("CreateTrialSession failed to create a record!!")
  let paperPdfs = [];
  if (trialSession.paperServicePdfs) throw Error('NYI'); //TODO Implement this
  paperPdfs = [];

  return fromKyselyTrialSession(result, paperPdfs);
}
