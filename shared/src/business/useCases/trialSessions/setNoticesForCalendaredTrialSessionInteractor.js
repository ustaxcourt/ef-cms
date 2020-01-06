const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * Generates notices for all calendared cases for the given trialSessionId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {string} providers.trialSessionId the trial session id
 * @returns {Promise} the promises for the updateCase calls
 */
exports.setNoticesForCalendaredTrialSessionInteractor = async ({
  applicationContext,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const calendaredCases = applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  /**
   * generates a notice of trial session and adds to the case
   *
   * @param {object} caseRecord the case data
   * @returns {object} the raw case object
   */
  const setNoticeForCase = async caseRecord => {
    const caseEntity = new Case(caseRecord, { applicationContext });

    const noticeOfTrialIssued = await applicationContext
      .getUseCases()
      .generateNoticeOfTrialIssuedInteractor({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
        trialSessionId: trialSessionEntity.trialSessionId,
      });

    // TODO: Add cover sheet

    const newDocumentId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocument({
      applicationContext,
      document: noticeOfTrialIssued,
      documentId: newDocumentId,
    });

    const documentTitle = `Notice of Trial on ${trialSession.startDate} at ${trialSession.startTime}`;

    const noticeDocument = new Document(
      {
        caseId: caseEntity.caseId,
        documentId: newDocumentId,
        documentTitle,
        documentType: Document.NOTICE_OF_TRIAL.documentType,
        eventCode: Document.NOTICE_OF_TRIAL.eventCode,
        filedBy: user.name,
        processingStatus: 'complete',
        userId: user.userId,
      },
      { applicationContext },
    );

    caseEntity.addDocument(noticeDocument);
    caseEntity.setNoticeOfTrialDate();

    return caseEntity.toRawObject();
    // TODO: Set for service
  };

  return await Promise.all([...calendaredCases.map(setNoticeForCase)]);
};
