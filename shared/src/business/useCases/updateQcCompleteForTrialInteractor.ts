import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

/**
 * updateQcCompleteForTrial
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {boolean} providers.qcCompleteForTrial true if case is qc complete for trial, false otherwise
 * @param {string} providers.trialSessionId the id of the trial session to update
 * @returns {Promise<object>} the updated case data
 */

export const updateQcCompleteForTrial = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    qcCompleteForTrial,
    trialSessionId,
  }: {
    docketNumber: string;
    qcCompleteForTrial: boolean;
    trialSessionId: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSION_QC_COMPLETE)
  ) {
    throw new UnauthorizedError('Unauthorized for trial session QC complete');
  }

  const oldCase = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const newCase = new Case(oldCase, { authorizedUser });

  newCase.setQcCompleteForTrial({ qcCompleteForTrial, trialSessionId });

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: newCase,
    });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

// export const updateQcCompleteForTrialInteractor = async (
//   applicationContext: ServerApplicationContext,
//   {
//     docketNumber,
//     qcCompleteForTrial,
//     trialSessionId,
//   }: {
//     docketNumber: string;
//     qcCompleteForTrial: boolean;
//     trialSessionId: string;
//   },
//   authorizedUser: UnknownAuthUser,
// ) => {
//   const lockId = hashLockId(`case|${docketNumber}`);

//   return mutexLockWrapper({
//     lockId,
//     callback: () =>
//       updateQcCompleteForTrial(
//         applicationContext,
//         { docketNumber, qcCompleteForTrial, trialSessionId },
//         authorizedUser,
//       ),
//   });
// };

export const updateQcCompleteForTrialInteractor = withLocking(
  updateQcCompleteForTrial,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
