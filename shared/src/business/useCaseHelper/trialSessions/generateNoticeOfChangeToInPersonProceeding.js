const {
  createISODateString,
  formatDateString,
  FORMATS,
} = require('../../utilities/DateHandler');
const { formatPhoneNumber } = require('../../utilities/formatPhoneNumber');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { getJudgeWithTitle } = require('../../utilities/getJudgeWithTitle');

/**
 * generateNoticeOfChangeToInPersonProceeding
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionInformation the trial session information
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateNoticeOfChangeToInPersonProceeding = async (
  applicationContext,
  { docketNumber, trialSessionInformation },
) => {
  const formattedStartDate = formatDateString(
    trialSessionInformation.startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  const trialStartTimeIso = createISODateString(
    trialSessionInformation.startTime,
    'HH:mm',
  );
  const formattedStartTime = formatDateString(trialStartTimeIso, FORMATS.TIME);

  const judgeWithTitle = await getJudgeWithTitle({
    applicationContext,
    judgeUserName: trialSessionInformation.judgeName,
  });

  const trialInfo = {
    ...trialSessionInformation,
    chambersPhoneNumber: formatPhoneNumber(
      trialSessionInformation.chambersPhoneNumber,
    ),
    formattedJudge: judgeWithTitle,
    formattedStartDate,
    formattedStartTime,
    joinPhoneNumber: formatPhoneNumber(trialSessionInformation.joinPhoneNumber),
  };

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const { docketNumberWithSuffix } = caseDetail;
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  return await applicationContext
    .getDocumentGenerators()
    .noticeOfChangeToInPersonProceeding({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        trialInfo,
      },
    });
};
