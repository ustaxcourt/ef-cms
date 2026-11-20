import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
jest.mock('@web-api/persistence/postgres/users/getUsersInSections');
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateNoticeOfAssignmentOfJudgeInteractor } from './generateNoticeOfAssignmentOfJudgeInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getFeatureFlagValues as getFeatureFlagValuesMock } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getUsersInSections as getUsersInSectionsMock } from '@web-api/persistence/postgres/users/getUsersInSections';

describe('generateNoticeOfAssignmentOfJudgeInteractor', () => {
  const TRIAL_SESSION_ID = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';
  const REPORTING_TRIAL_SESSION = {
    chambersPhoneNumber: '2025210810',
    judge: { name: 'Buch' },
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.reporting,
    startDate: '2026-05-18T04:00:00.000Z',
    trialLocation: 'San Diego, California',
  } as RawTrialSession;

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getFeatureFlagValues = jest.mocked(getFeatureFlagValuesMock);
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const getUsersInSections = jest.mocked(getUsersInSectionsMock);

  const getGeneratorData = () =>
    applicationContext.getDocumentGenerators().noticeOfAssignmentOfJudge.mock
      .calls[0][0].data;

  beforeEach(() => {
    getFeatureFlagValues.mockResolvedValue([
      {
        name: 'clerk-of-court-configuration',
        value: {
          current: {
            name: 'Charles G. Jeane',
            title: 'Clerk of the Court',
          },
        },
      },
    ]);

    getCaseByDocketNumber.mockResolvedValue({
      caseCaption: 'Raquelito C. Placido, Petitioner',
      docketNumber: '8715-23',
      docketNumberWithSuffix: '8715-23',
    });

    getTrialSessionById.mockResolvedValue(REPORTING_TRIAL_SESSION);

    getUsersInSections.mockResolvedValue([
      {
        judgeFullName: 'Ronald L. Buch',
        judgeTitle: 'Judge',
        name: 'Buch',
      } as DbUser,
    ]);
  });

  it('should throw a not found error when the trial session does not exist', async () => {
    getTrialSessionById.mockResolvedValue(undefined);

    await expect(
      generateNoticeOfAssignmentOfJudgeInteractor(applicationContext, {
        docketNumber: '8715-23',
        trialSessionId: TRIAL_SESSION_ID,
      }),
    ).rejects.toThrow(`Trial session ${TRIAL_SESSION_ID} was not found.`);

    expect(
      applicationContext.getDocumentGenerators().noticeOfAssignmentOfJudge,
    ).not.toHaveBeenCalled();
  });

  it('should look up the trial session and case by the ids provided', async () => {
    await generateNoticeOfAssignmentOfJudgeInteractor(applicationContext, {
      docketNumber: '8715-23',
      trialSessionId: TRIAL_SESSION_ID,
    });

    expect(getTrialSessionById).toHaveBeenCalledWith({
      trialSessionId: TRIAL_SESSION_ID,
    });
    expect(getCaseByDocketNumber).toHaveBeenCalledWith({
      docketNumber: '8715-23',
    });
  });

  it('should call the Notice of Assignment of Judge document generator with the judge full name, chambers phone number, and clerk of the court', async () => {
    await generateNoticeOfAssignmentOfJudgeInteractor(applicationContext, {
      docketNumber: '8715-23',
      trialSessionId: TRIAL_SESSION_ID,
    });

    expect(getGeneratorData()).toEqual({
      caseCaptionExtension: 'Petitioner',
      caseTitle: 'Raquelito C. Placido',
      chambersPhoneNumber: '(202) 521-0810',
      docketNumberWithSuffix: '8715-23',
      judgeTitleWithFullName: 'Judge Ronald L. Buch',
      nameOfClerk: 'Charles G. Jeane',
      titleOfClerk: 'Clerk of the Court',
    });
  });

  it('should not send a chambers phone number when the trial session does not have one', async () => {
    getTrialSessionById.mockResolvedValue({
      ...REPORTING_TRIAL_SESSION,
      chambersPhoneNumber: undefined,
    });

    await generateNoticeOfAssignmentOfJudgeInteractor(applicationContext, {
      docketNumber: '8715-23',
      trialSessionId: TRIAL_SESSION_ID,
    });

    expect(getGeneratorData().chambersPhoneNumber).toBeUndefined();
  });

  it('should reject when the judge assigned to the trial session cannot be found', async () => {
    getUsersInSections.mockResolvedValue([]);

    await expect(
      generateNoticeOfAssignmentOfJudgeInteractor(applicationContext, {
        docketNumber: '8715-23',
        trialSessionId: TRIAL_SESSION_ID,
      }),
    ).rejects.toThrow('Judge Buch was not found');
  });

  it('should return the pdf created by the document generator', async () => {
    const generatedPdf = new Uint8Array([1, 2, 3]);
    applicationContext
      .getDocumentGenerators()
      .noticeOfAssignmentOfJudge.mockResolvedValue(generatedPdf);

    const result = await generateNoticeOfAssignmentOfJudgeInteractor(
      applicationContext,
      {
        docketNumber: '8715-23',
        trialSessionId: TRIAL_SESSION_ID,
      },
    );

    expect(result).toBe(generatedPdf);
  });
});
