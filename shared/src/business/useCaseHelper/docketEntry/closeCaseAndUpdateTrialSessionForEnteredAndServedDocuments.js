const {
  CASE_DISMISSAL_ORDER_TYPES,
  CASE_STATUS_TYPES,
} = require('../../entities/EntityConstants');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');

exports.closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments = async ({
  applicationContext,
  caseEntity,
  eventCode,
}) => {
  let closedStatus = CASE_STATUS_TYPES.closed;

  if (CASE_DISMISSAL_ORDER_TYPES.includes(eventCode)) {
    closedStatus = CASE_STATUS_TYPES.closedDismissed;
  }

  caseEntity.closeCase({ closedStatus });

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
