const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateNoticeOfChangeToInPersonProceeding,
} = require('./generateNoticeOfChangeToInPersonProceeding');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_TRIAL_INPERSON } = require('../../../test/mockTrial');

describe('generateNoticeOfChangeToInPersonProceeding', () => {
  const mockTrialSessionInformation = {
    ...MOCK_TRIAL_INPERSON,
    chambersPhoneNumber: '203-456-9888',
    courthouseName: 'A Court Of Law',
    judgeName: 'Batman',
  };

  const mockJudge = {
    judgeTitle: 'Judge',
    name: 'Batman',
  };

  it('should call the document generator to generate the NOIP', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue([mockJudge]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await generateNoticeOfChangeToInPersonProceeding(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionInformation: mockTrialSessionInformation,
    });

    expect(
      applicationContext.getDocumentGenerators()
        .noticeOfChangeToInPersonProceeding.mock.calls[0][0].data,
    ).toMatchObject({
      caseCaptionExtension: 'Petitioner',
      caseTitle: 'Test Petitioner',
      docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix,
      trialInfo: mockTrialSessionInformation,
    });
  });
});
