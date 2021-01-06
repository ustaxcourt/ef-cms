const { formatDateString, FORMATS } = require('../../utilities/DateHandler');
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

  const formattedStartDate = formatDateString(
    trialSession.startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  let [hour, min] = trialSession.startTime.split(':');
  let startTimeExtension = 'am';

  if (+hour > 12) {
    startTimeExtension = 'pm';
    hour = +hour - 12;
  }

  const formattedStartTime = `${hour}:${min} ${startTimeExtension}`;

  const trialInfo = {
    address1: trialSession.address1,
    address2: trialSession.address2,
    city: trialSession.city,
    courthouseName: trialSession.courthouseName,
    formattedStartDate,
    formattedStartTime,
    joinPhoneNumber: trialSession.joinPhoneNumber,
    judge: trialSession.judge.name,
    meetingId: trialSession.meetingId,
    password: trialSession.password,
    postalCode: trialSession.postalCode,
    startDate: trialSession.startDate,
    state: trialSession.state,
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
