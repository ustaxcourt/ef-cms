const { formatDateString, FORMATS } = require('../../utilities/DateHandler');
const { formatPhoneNumber } = require('../../utilities/formatPhoneNumber');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { TRIAL_SESSION_SCOPE_TYPES } = require('../../entities/EntityConstants');
/**
 * generateNoticeOfChangeOfTrialJudgeInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionInformation the trial session information
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateNoticeOfChangeOfTrialJudgeInteractor = async (
  applicationContext,
  { docketNumber, trialSessionInformation },
) => {
  const formattedStartDate = formatDateString(
    trialSessionInformation.startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  let trialLocationAndProceedingType = `${trialSessionInformation.trialLocation}, ${trialSessionInformation.proceedingType}`;
  if (
    trialSessionInformation.sessionScope ===
    TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
  ) {
    trialLocationAndProceedingType = 'standalone remote';
  }

  const trialInfo = {
    ...trialSessionInformation,
    chambersPhoneNumber: formatPhoneNumber(
      trialSessionInformation.chambersPhoneNumber,
    ),
    formattedStartDate,
    trialLocationAndProceedingType,
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
    .noticeOfChangeOfTrialJudge({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        trialInfo,
      },
    });
};
