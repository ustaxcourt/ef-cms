import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/featureFlag/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateNoticeOfChangeToInPersonProceeding } from './generateNoticeOfChangeToInPersonProceeding';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

describe('generateNoticeOfChangeToInPersonProceeding', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
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

    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    applicationContext
      .getPersistenceGateway()
      .getConfigurationItemValue.mockResolvedValue({
        name: 'James Bond',
        title: 'Clerk of the Court (Interim)',
      });

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
      nameOfClerk: 'James Bond',
      titleOfClerk: 'Clerk of the Court (Interim)',
      trialInfo: mockTrialSessionInformation,
    });
  });
});
