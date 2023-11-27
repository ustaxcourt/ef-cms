import {
  DOCKET_NUMBER_SUFFIXES,
  PROCEDURE_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateNoticeOfChangeOfTrialJudgeInteractor } from './generateNoticeOfChangeOfTrialJudgeInteractor';

describe('generateNoticeOfChangeOfTrialJudgeInteractor', () => {
  const formattedPhoneNumber = '123-456-7890';

  const mockTrialSessionInformation = {
    caseProcedureType: PROCEDURE_TYPES.SMALL,
    chambersPhoneNumber: '1234567890',
    priorJudgeTitleWithFullName: 'Special Trial Judge Judifer Judy',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    startDate: '2019-08-25T05:00:00.000Z',
    trialLocation: 'Mobile, Alabama',
    updatedJudgeTitleWithFullName: 'Chief Judge Lady Macbeth',
  } as any;

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => ({
        ...mockTrialSessionInformation,
        judge: { name: 'Test Judge' },
      }));

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        if (docketNumber === '123-45') {
          return {
            caseCaption: 'Test Case Caption',
            docketNumber: '123-45',
            docketNumberWithSuffix: '123-45',
          };
        } else {
          return {
            caseCaption: 'Test Case Caption',
            docketNumber: '234-56',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
            docketNumberWithSuffix: '234-56S',
          };
        }
      });

    applicationContext
      .getPersistenceGateway()
      .getConfigurationItemValue.mockResolvedValue({
        name: 'James Bond',
        title: 'Clerk of the Court (Interim)',
      });

    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockImplementation(
        ({ contentHtml }) => contentHtml,
      );
  });

  it('should generate a template with the case and formatted trial information and call the pdf generator', async () => {
    await generateNoticeOfChangeOfTrialJudgeInteractor(applicationContext, {
      docketNumber: '123-45',
      trialSessionInformation: mockTrialSessionInformation,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfChangeOfTrialJudge.mock
        .calls[0][0],
    ).toMatchObject({
      data: {
        caseCaptionExtension: '',
        caseTitle: 'Test Case Caption',
        docketNumberWithSuffix: '123-45',
        trialInfo: {
          ...mockTrialSessionInformation,
          chambersPhoneNumber: formattedPhoneNumber,
          formattedStartDate: 'Sunday, August 25, 2019',
        },
      },
    });
  });

  it('should set trialLocationAndProceedingType to "standalone remote" when the trial session scope is "Standalone Remote"', async () => {
    await generateNoticeOfChangeOfTrialJudgeInteractor(applicationContext, {
      docketNumber: '234-56',
      trialSessionInformation: {
        ...mockTrialSessionInformation,
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfChangeOfTrialJudge.mock
        .calls[0][0],
    ).toMatchObject({
      data: {
        trialInfo: {
          trialLocationAndProceedingType: 'standalone remote',
        },
      },
    });
  });

  it('should set trialLocationAndProceedingType to "Mobile, Alabama, Remote" when the trial session scope is "Location Based" and proceeding type is "Remote"', async () => {
    await generateNoticeOfChangeOfTrialJudgeInteractor(applicationContext, {
      docketNumber: '234-56',
      trialSessionInformation: {
        ...mockTrialSessionInformation,
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfChangeOfTrialJudge.mock
        .calls[0][0],
    ).toMatchObject({
      data: {
        trialInfo: {
          trialLocationAndProceedingType: 'Mobile, Alabama, Remote',
        },
      },
    });
  });

  it('should set trialLocationAndProceedingType to "Mobile, Alabama, In Person" when the trial session scope is "Location Based" and proceeding type is "In Person"', async () => {
    await generateNoticeOfChangeOfTrialJudgeInteractor(applicationContext, {
      docketNumber: '234-56',
      trialSessionInformation: {
        ...mockTrialSessionInformation,
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfChangeOfTrialJudge.mock
        .calls[0][0],
    ).toMatchObject({
      data: {
        trialInfo: {
          trialLocationAndProceedingType: 'Mobile, Alabama, In Person',
        },
      },
    });
  });

  it('should set the name and title of the clerk when calling the pdf generator', async () => {
    await generateNoticeOfChangeOfTrialJudgeInteractor(applicationContext, {
      docketNumber: '123-45',
      trialSessionInformation: mockTrialSessionInformation,
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfChangeOfTrialJudge.mock
        .calls[0][0],
    ).toMatchObject({
      data: {
        nameOfClerk: 'James Bond',
        titleOfClerk: 'Clerk of the Court (Interim)',
      },
    });
  });
});
