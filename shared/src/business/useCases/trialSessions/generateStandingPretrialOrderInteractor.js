const {
  formatDateString,
  formatNow,
  FORMATS,
} = require('../../utilities/DateHandler');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');

/**
 * generateStandingPretrialOrderInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateStandingPretrialOrderInteractor = async ({
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

  const { startDate } = trialSession;
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const formattedStartDateWithDayOfWeek = formatDateString(
    startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  const formattedStartDate = formatDateString(
    startDate,
    FORMATS.MONTH_DAY_YEAR,
  );

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

  const formattedJudgeName = `${foundJudge.judgeTitle} ${foundJudge.name}`;

  // TODO - extract into utility function as part of DOD for 7443
  let [hour, min] = trialSession.startTime.split(':');
  let startTimeExtension = 'am';

  if (+hour > 12) {
    startTimeExtension = 'pm';
    hour = +hour - 12;
  }

  const formattedStartTime = `${hour}:${min} ${startTimeExtension}`;

  const formattedServedDate = formatNow(FORMATS.MMDDYY);

  const pdfData = await applicationContext
    .getDocumentGenerators()
    .standingPretrialOrder({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
        trialInfo: {
          ...trialSession,
          formattedJudgeName,
          formattedServedDate,
          formattedStartDate,
          formattedStartDateWithDayOfWeek,
          formattedStartTime,
        },
      },
    });

  return await applicationContext.getUseCaseHelpers().addServedStampToDocument({
    applicationContext,
    pdfData,
  });
};
