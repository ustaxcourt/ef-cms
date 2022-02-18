const {
  createISODateString,
  formatDateString,
  FORMATS,
} = require('../../utilities/DateHandler');
const {
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { getJudgeWithTitle } = require('../../utilities/getJudgeWithTitle');

/**
 * generateNoticeOfChangeToRemoteProceedingInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateNoticeOfChangeToRemoteProceedingInteractor = async (
  applicationContext,
  { trialSessionId },
) => {
  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const formattedStartDate = formatDateString(
    trialSession.startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  const trialStartTimeIso = createISODateString(
    trialSession.startTime,
    'HH:mm',
  );
  const formattedStartTime = formatDateString(trialStartTimeIso, FORMATS.TIME);

  const judgeWithTitle = await getJudgeWithTitle({
    applicationContext,
    judgeUserName: trialSession.judge.name,
  });

  const trialInfo = {
    formattedJudge: judgeWithTitle,
    formattedStartDate,
    formattedStartTime,
    ...trialSession,
  };

  // const openCasesDocketNumbers = //loop through each docket number in teh caseOrder array and save its docket number
  //get each case by docket number
  //get docket number with suffix and case caption for each case
  //call our document generator for each case

  // const filteredOpenCases = openUserCases.filter(
  //   ({ status }) => status !== CASE_STATUS_TYPES.closed,
  // );

  // const caseDetail = await applicationContext
  //   .getPersistenceGateway()
  //   .getCaseByDocketNumber({
  //     applicationContext,
  //     docketNumber,
  //   });

  // const { docketNumberWithSuffix } = caseDetail;
  // const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  return await applicationContext
    .getDocumentGenerators()
    .noticeOfChangeToRemoteProceeding({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        trialInfo,
      },
    });
};
