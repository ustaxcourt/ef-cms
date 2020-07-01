const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');

/**
 * generateNoticeOfTrialIssuedInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateNoticeOfTrialIssuedInteractor = async ({
  applicationContext,
  docketNumber,
  trialSessionId,
}) => {
  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const { docketNumberWithSuffix } = caseDetail;
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const trialInfo = {
    address1: trialSession.address1,
    address2: trialSession.address2,
    city: trialSession.city,
    courthouseName: trialSession.courthouseName,
    judge: trialSession.judge.name,
    postalCode: trialSession.postalCode,
    startDate: trialSession.startDate,
    startTime: trialSession.startTime,
    state: trialSession.state,
  };

  return await applicationContext.getDocumentGenerators().noticeOfTrialIssued({
    applicationContext,
    data: {
      caseCaptionExtension,
      caseTitle,
      docketNumberWithSuffix,
      trialInfo,
    },
  });
};
