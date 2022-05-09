const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  PROCEDURE_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  generateNoticeOfChangeOfTrialJudgeInteractor,
} = require('./generateNoticeOfChangeOfTrialJudgeInteractor');

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
  };

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

  it('should append the docket number suffix if present on the caseDetail', async () => {
    await generateNoticeOfChangeOfTrialJudgeInteractor(applicationContext, {
      docketNumber: '234-56',
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
        docketNumberWithSuffix: '234-56S',
      },
    });
  });
});
