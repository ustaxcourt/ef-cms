const {
  createISODateString,
  formatDateString,
  FORMATS,
} = require('../../utilities/DateHandler');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { getJudgeWithTitle } = require('../../utilities/getJudgeWithTitle');

/**
 * generateNoticeOfTrialIssuedInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateNoticeOfTrialIssuedInteractor = async (
  applicationContext,
  { docketNumber, trialSessionId },
) => {
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

  const formattedStartDate = formatDateString(
    trialSession.startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  const trialStartTimeIso = createISODateString(
    trialSession.startTime,
    'HH:mm',
  );
  const formattedStartTime = formatDateString(trialStartTimeIso, 'hh:mm A');

  const judgeWithTitle = await getJudgeWithTitle({
    applicationContext,
    judgeUserName: trialSession.judge.name,
  });

  const trialInfo = {
    formattedJudge: judgeWithTitle,
    formattedStartDate,
    formattedStartTime,
    joinPhoneNumber: trialSession.joinPhoneNumber,
    meetingId: trialSession.meetingId,
    password: trialSession.password,
    trialLocation: trialSession.trialLocation,
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
