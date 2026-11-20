import { NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { formatTrialNoticePhoneNumber } from '@shared/business/utilities/formatPhoneNumber';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getClerkOfTheCourtInfo } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue';
import { getJudgeWithTitle } from '@web-api/business/utilities/getJudgeWithTitle';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

export const generateNoticeOfAssignmentOfJudgeInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    trialSessionId,
  }: { docketNumber: string; trialSessionId: string },
): Promise<Uint8Array> => {
  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const caseDetail = await getCaseByDocketNumber({
    docketNumber,
  });

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const judgeTitleWithFullName = await getJudgeWithTitle({
    judgeUserName: trialSession.judge?.name,
    useFullName: true,
  });

  const { name, title } = await getClerkOfTheCourtInfo();

  return await applicationContext
    .getDocumentGenerators()
    .noticeOfAssignmentOfJudge({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        chambersPhoneNumber: formatTrialNoticePhoneNumber(
          trialSession.chambersPhoneNumber,
        ),
        docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
        judgeTitleWithFullName,
        nameOfClerk: name,
        titleOfClerk: title,
      },
    });
};
