const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateNoticeOfChangeToInPersonProceeding,
} = require('./generateNoticeOfChangeToInPersonProceeding');
const { MOCK_TRIAL_INPERSON } = require('../../../test/mockTrial');

describe('generateNoticeOfChangeToInPersonProceeding', () => {
  beforeEach(() => {});

  it('should call the document generator to generate the NOIP', async () => {
    const mockDocketNumber = '101-32';
    const mockTrialSessionInformation = {
      ...MOCK_TRIAL_INPERSON,
      chambersPhoneNumber: '203-456-9888',
      courthouseName: 'A Court Of Law',
    };

    await generateNoticeOfChangeToInPersonProceeding(applicationContext, {
      docketNumber: mockDocketNumber,
      trialSessionInformation: mockTrialSessionInformation,
    });

    expect(
      applicationContext.getUseCases().getDocumentGenerators()
        .noticeOfChangeToInPersonProceeding.mock.calls[0][0].data,
    ).toMatchObject({
      caseCaptionExtension: '',
      caseTitle: '',
      docketNumber: mockDocketNumber,
      docketNumberWithSuffix: '',
      trialInfo: mockTrialSessionInformation,
    });
  });
});
