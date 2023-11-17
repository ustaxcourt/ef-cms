import {
  CASE_DISMISSAL_ORDER_TYPES,
  CASE_STATUS_TYPES,
} from '../../entities/EntityConstants';
import { NotFoundError } from '@web-api/errors/errors';
import { TrialSession } from '../../entities/trialSessions/TrialSession';

export const closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments =
  async ({ applicationContext, caseEntity, eventCode }) => {
    let closedStatus = CASE_STATUS_TYPES.closed;

    if (CASE_DISMISSAL_ORDER_TYPES.includes(eventCode)) {
      closedStatus = CASE_STATUS_TYPES.closedDismissed;
    }

    caseEntity.setCaseStatus({
      date: applicationContext.getUtilities().createISODateString(),
      updatedCaseStatus: closedStatus,
    });

    await applicationContext
      .getPersistenceGateway()
      .deleteCaseTrialSortMappingRecords({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
      });

    if (caseEntity.trialSessionId) {
      const trialSession = await applicationContext
        .getPersistenceGateway()
        .getTrialSessionById({
          applicationContext,
          trialSessionId: caseEntity.trialSessionId,
        });

      if (!trialSession) {
        throw new NotFoundError(
          `Trial session ${caseEntity.trialSessionId} was not found.`,
        );
      }

      const trialSessionEntity = new TrialSession(trialSession, {
        applicationContext,
      });

      if (trialSessionEntity.isCalendared) {
        trialSessionEntity.removeCaseFromCalendar({
          disposition: 'Status was changed to Closed',
          docketNumber: caseEntity.docketNumber,
        });
      } else {
        trialSessionEntity.deleteCaseFromCalendar({
          docketNumber: caseEntity.docketNumber,
        });
      }

      await applicationContext.getPersistenceGateway().updateTrialSession({
        applicationContext,
        trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
      });
    }
  };
