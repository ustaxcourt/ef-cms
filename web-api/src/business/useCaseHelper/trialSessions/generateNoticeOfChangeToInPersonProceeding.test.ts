import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  generateNoticeOfChangeToInPersonProceeding,
  GenerateNoticeOfChangeToInPersonTrialInfo,
} from './generateNoticeOfChangeToInPersonProceeding';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getUsersInSections as getUsersInSectionMock } from '@web-api/persistence/postgres/users/getUsersInSections';

const getUsersInSection = getUsersInSectionMock as jest.Mock;

describe('generateNoticeOfChangeToInPersonProceeding', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const mockTrialSessionInformation: GenerateNoticeOfChangeToInPersonTrialInfo =
    {
      address1: MOCK_TRIAL_INPERSON.address1!,
      address2: MOCK_TRIAL_INPERSON.address2!,
      city: MOCK_TRIAL_INPERSON.city!,
      state: MOCK_TRIAL_INPERSON.state!,
      zip: MOCK_TRIAL_INPERSON.postalCode!,
      trialLocation: MOCK_TRIAL_INPERSON.trialLocation!,
      startDate: MOCK_TRIAL_INPERSON.startDate!,
      startTime: MOCK_TRIAL_INPERSON.startTime!,
      chambersPhoneNumber: '203-456-9888',
      courthouseName: 'A Court Of Law',
      judgeName: 'Batman',
    };

  const mockJudge = {
    judgeTitle: 'Judge',
    name: 'Batman',
  };

  it('should call the document generator to generate the NOIP', async () => {
    getUsersInSection.mockReturnValue([mockJudge]);

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
