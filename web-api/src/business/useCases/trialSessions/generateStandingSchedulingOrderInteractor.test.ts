import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
jest.mock('@web-api/persistence/postgres/users/getUsersInSections');
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateStandingSchedulingOrderInteractor } from './generateStandingSchedulingOrderInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getUsersInSections as getUsersInSectionsMock } from '@web-api/persistence/postgres/users/getUsersInSections';

describe('generateStandingSchedulingOrderInteractor', () => {
  const TRIAL_SESSION_ID = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';
  const REPORTING_TRIAL_SESSION = {
    chambersPhoneNumber: '2025210810',
    judge: { name: 'Buch' },
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.reporting,
    startDate: '2026-05-18T04:00:00.000Z',
    trialLocation: 'San Diego, California',
  } as RawTrialSession;

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const getUsersInSections = jest.mocked(getUsersInSectionsMock);

  const getGeneratorData = () =>
    applicationContext.getDocumentGenerators().standingSchedulingOrder.mock
      .calls[0][0].data;

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue({
      caseCaption: 'Ryan Strehorn, Petitioner',
      docketNumber: '1700-25',
      docketNumberWithSuffix: '1700-25L',
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
      generateStandingSchedulingOrderInteractor(applicationContext, {
        docketNumber: '1700-25',
        trialSessionId: TRIAL_SESSION_ID,
      }),
    ).rejects.toThrow(`Trial session ${TRIAL_SESSION_ID} was not found.`);

    expect(
      applicationContext.getDocumentGenerators().standingSchedulingOrder,
    ).not.toHaveBeenCalled();
  });

  it('should look up the trial session and case by the ids provided', async () => {
    await generateStandingSchedulingOrderInteractor(applicationContext, {
      docketNumber: '1700-25',
      trialSessionId: TRIAL_SESSION_ID,
    });

    expect(getTrialSessionById).toHaveBeenCalledWith({
      trialSessionId: TRIAL_SESSION_ID,
    });
    expect(getCaseByDocketNumber).toHaveBeenCalledWith({
      docketNumber: '1700-25',
    });
  });

  it('should call the Standing Scheduling Order document generator with the case caption and formatted due date information', async () => {
    await generateStandingSchedulingOrderInteractor(applicationContext, {
      docketNumber: '1700-25',
      trialSessionId: TRIAL_SESSION_ID,
    });

    expect(getGeneratorData()).toEqual({
      caseCaptionExtension: 'Petitioner',
      caseTitle: 'Ryan Strehorn',
      docketNumberWithSuffix: '1700-25L',
      trialInfo: {
        chambersPhoneNumber: '(202) 521-0810',
        formattedDueDate: 'May 18, 2026',
        formattedDueDateWithDayOfWeek: 'Monday, May 18, 2026',
        formattedJudgeName: 'Judge Buch',
        formattedServedDate: expect.stringMatching(/^\d{2}\/\d{2}\/\d{2}$/),
        trialLocation: 'San Diego, California',
      },
    });
  });

  it('should send empty strings for the chambers phone number and trial location when the trial session does not have them', async () => {
    getTrialSessionById.mockResolvedValue({
      ...REPORTING_TRIAL_SESSION,
      chambersPhoneNumber: undefined,
      trialLocation: undefined,
    });

    await generateStandingSchedulingOrderInteractor(applicationContext, {
      docketNumber: '1700-25',
      trialSessionId: TRIAL_SESSION_ID,
    });

    expect(getGeneratorData().trialInfo).toMatchObject({
      chambersPhoneNumber: '',
      trialLocation: '',
    });
  });

  it('should reject when the judge assigned to the trial session cannot be found', async () => {
    getUsersInSections.mockResolvedValue([]);

    await expect(
      generateStandingSchedulingOrderInteractor(applicationContext, {
        docketNumber: '1700-25',
        trialSessionId: TRIAL_SESSION_ID,
      }),
    ).rejects.toThrow('Judge Buch was not found');
  });

  it('should add a served stamp to the generated document and return the stamped pdf', async () => {
    const generatedPdf = new Uint8Array([1, 2, 3]);
    const stampedPdf = new Uint8Array([4, 5, 6]);
    applicationContext
      .getDocumentGenerators()
      .standingSchedulingOrder.mockResolvedValue(generatedPdf);
    applicationContext
      .getUseCaseHelpers()
      .addServedStampToDocument.mockResolvedValue(stampedPdf);

    const result = await generateStandingSchedulingOrderInteractor(
      applicationContext,
      {
        docketNumber: '1700-25',
        trialSessionId: TRIAL_SESSION_ID,
      },
    );

    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument,
    ).toHaveBeenCalledWith({
      applicationContext,
      pdfData: generatedPdf,
    });
    expect(result).toBe(stampedPdf);
  });
});
