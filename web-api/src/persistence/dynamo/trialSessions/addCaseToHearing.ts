import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { put } from '../../dynamodbClientService';
import { updateTrialSession } from './updateTrialSession';

/**
 * addCaseToHearing
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber docket number of the case to add
 * @param {object} providers.trialSession trial session to add as a hearing
 * @returns {Promise} the promise of the call to persistence
 */
export const addCaseToHearing = ({
  applicationContext,
  docketNumber,
  trialSession,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  trialSession: RawTrialSession;
}) =>
  Promise.all([
    // Create mapping record
    put({
      Item: {
        ...trialSession,
        pk: `case|${docketNumber}`,
        sk: `hearing|${trialSession.trialSessionId}`,
      },
      applicationContext,
    }),
    // update trial session
    updateTrialSession({
      applicationContext,
      trialSessionToUpdate: trialSession,
    }),
  ]);
