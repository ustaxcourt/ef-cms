import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { deleteCaseDeadline } from '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

export const updateCaseContext = async (
  applicationContext: ServerApplicationContext,
  {
    caseCaption,
    caseStatus,
    docketNumber,
    judgeData,
  }: {
    judgeData?: {
      associatedJudge: string;
      associatedJudgeId: string;
    };
    caseCaption?: string;
    caseStatus?: string;
    docketNumber: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CASE_CONTEXT)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const oldCase = await getCaseByDocketNumber({
    docketNumber,
  });

  const newCase = new Case(oldCase, { authorizedUser });

  if (caseCaption) {
    newCase.setCaseCaption(caseCaption);
  }

  if (judgeData && judgeData.associatedJudge) {
    const { associatedJudge, associatedJudgeId } = judgeData;
    newCase.setAssociatedJudge(associatedJudge);
    newCase.setAssociatedJudgeId(associatedJudgeId);
  }

  // if this case status is changing FROM calendared
  // we need to remove it from the trial session
  if (caseStatus && caseStatus !== oldCase.status) {
    newCase.setCaseStatus({
      changedBy: authorizedUser.name,
      updatedCaseStatus: caseStatus,
    });

    if (oldCase.status === CASE_STATUS_TYPES.calendared) {
      const disposition = `Status was changed to ${caseStatus}`;

      if (!oldCase.trialSessionId) {
        throw new NotFoundError(
          `Cannot find trialSessionId for case ${docketNumber}`,
        );
      }

      const trialSession = await applicationContext
        .getPersistenceGateway()
        .getTrialSessionById({
          applicationContext,
          trialSessionId: oldCase.trialSessionId,
        });

      if (!trialSession) {
        throw new NotFoundError(
          `Trial session ${oldCase.trialSessionId} was not found.`,
        );
      }

      const trialSessionEntity = new TrialSession(trialSession);

      trialSessionEntity.removeCaseFromCalendar({
        disposition,
        docketNumber: oldCase.docketNumber,
      });

      await applicationContext.getPersistenceGateway().updateTrialSession({
        applicationContext,
        trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
      });

      newCase.removeFromTrialWithAssociatedJudge(judgeData);
    }

    if (
      caseStatus === CASE_STATUS_TYPES.closed ||
      caseStatus === CASE_STATUS_TYPES.closedDismissed
    ) {
      const caseDeadlines = await getCaseDeadlinesByDocketNumber({
        docketNumber,
      });
      await settlePromises(
        caseDeadlines.map(async deadline => {
          return deleteCaseDeadline({
            caseDeadlineId: deadline.caseDeadlineId,
          });
        }),
      );
      newCase.updateAutomaticBlocked({ hasCaseDeadline: false });
    }
  }

  const updatedCase = await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: newCase,
  });

  return new Case(updatedCase, {
    authorizedUser,
  }).toRawObject();
};

export const updateCaseContextInteractor = withLocking(
  updateCaseContext,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
