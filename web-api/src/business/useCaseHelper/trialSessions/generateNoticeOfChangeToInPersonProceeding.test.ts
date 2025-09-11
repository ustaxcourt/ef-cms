import '@web-api/persistence/postgres/cases/mocks.jest';
jest.mock('@web-api/persistence/postgres/users/getUsersInSections');
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  generateNoticeOfChangeToInPersonProceeding,
  GenerateNoticeOfChangeToInPersonTrialInfo,
} from './generateNoticeOfChangeToInPersonProceeding';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getFeatureFlagValues as getFeatureFlagValuesMock } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import { getUsersInSections as getUsersInSectionsMock } from '@web-api/persistence/postgres/users/getUsersInSections';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

const getFeatureFlagValues = getFeatureFlagValuesMock as jest.Mock;
getFeatureFlagValues.mockResolvedValue([
  {
    name: 'clerk-of-court-configuration',
    value: {
      current: {
        name: 'James Bond',
        title: 'Clerk of the Court (Interim)',
      },
    },
  },
]);

describe('generateNoticeOfChangeToInPersonProceeding', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getUsersInSections = jest.mocked(getUsersInSectionsMock);
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
    getUsersInSections.mockResolvedValue([mockJudge as DbUser]);

    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

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
