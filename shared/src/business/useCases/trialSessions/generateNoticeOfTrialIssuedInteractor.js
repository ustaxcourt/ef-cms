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

  // TODO - extract into utility function as part of DOD for 7443
  let [hour, min] = trialSession.startTime.split(':');
  let startTimeExtension = 'am';

  if (+hour > 12) {
    startTimeExtension = 'pm';
    hour = +hour - 12;
  }

  const formattedStartTime = `${hour}:${min} ${startTimeExtension}`;

  // TODO - extract into utility function as part of DOD for 7443
  // fetch judges
  const judges = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section: 'judge',
    });

  // find associated judge
  const foundJudge = judges.find(
    _judge => _judge.name === trialSession.judge.name,
  );

  if (!foundJudge) {
    throw new Error(`Judge ${trialSession.judge.name} was not found`);
  }

  const judgeWithTitle = `${foundJudge.judgeTitle} ${foundJudge.name}`;

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
