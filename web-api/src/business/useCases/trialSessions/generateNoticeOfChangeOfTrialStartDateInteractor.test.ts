import '@web-api/persistence/postgres/cases/mocks.jest';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta as getCaseCaptionMetaMock } from '@shared/business/utilities/getCaseCaptionMeta';
import { getFeatureFlagValues as getFeatureFlagValuesMock } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import { MOCK_CASE } from '@shared/test/mockCase';
import { clerkOfCourtUser } from '@shared/test/mockUsers';
import { generateNoticeOfChangeOfTrialStartDateInteractor } from '@web-api/business/useCases/trialSessions/generateNoticeOfChangeOfTrialStartDateInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { CLERK_OF_THE_COURT_CONFIGURATION } from '@shared/business/entities/EntityConstants';

jest.mock('@shared/business/utilities/getCaseCaptionMeta', () => ({
  getCaseCaptionMeta: jest.fn(),
}));

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const getCaseCaptionMeta = getCaseCaptionMetaMock as jest.Mock;
const getFeatureFlagValues = getFeatureFlagValuesMock as jest.Mock;

describe('generateNoticeOfChangeOfTrialStartDateInteractor', () => {
  const caseCaptionExtensionMock = 'Petitioner';
  const caseTitleMock = 'Test Petitioner';
  const clerkOfTheCourtRecordMock = {
    name: clerkOfCourtUser.name,
    title: 'Clerk of the Court',
  };
  const arrayBufferMock = 'arrayBufferMock';

  beforeEach(() => {
    getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    getCaseCaptionMeta.mockReturnValue({
      caseCaptionExtension: caseCaptionExtensionMock,
      caseTitle: caseTitleMock,
    });
    getFeatureFlagValues.mockReturnValue([
      { value: { current: clerkOfTheCourtRecordMock } },
    ]);

    applicationContext
      .getDocumentGenerators()
      .noticeOfChangeOfTrialStartDate.mockReturnValue(arrayBufferMock);
  });

  it('should call the generate pdf method with the correct parameters', async () => {
    const results = await generateNoticeOfChangeOfTrialStartDateInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        previousTrialSession: MOCK_TRIAL_INPERSON,
        updatedTrialSession: MOCK_TRIAL_INPERSON,
      },
    );

    expect(results).toEqual(arrayBufferMock);

    const getCaseByDocketNumberCalls = getCaseByDocketNumber.mock.calls;
    expect(getCaseByDocketNumberCalls.length).toEqual(1);
    expect(getCaseByDocketNumberCalls[0][0].docketNumber).toEqual(
      MOCK_CASE.docketNumber,
    );

    const getCaseCaptionMetaCalls = getCaseCaptionMeta.mock.calls;
    expect(getCaseCaptionMetaCalls.length).toEqual(1);
    expect(getCaseCaptionMetaCalls[0][0]).toEqual(MOCK_CASE);

    const getFeatureFlagValuesCalls = getFeatureFlagValues.mock.calls;
    expect(getFeatureFlagValuesCalls.length).toEqual(1);
    expect(getFeatureFlagValuesCalls[0][0]).toEqual([
      CLERK_OF_THE_COURT_CONFIGURATION,
    ]);

    const noticeOfChangeOfTrialStartDateCalls =
      applicationContext.getDocumentGenerators().noticeOfChangeOfTrialStartDate
        .mock.calls;

    expect(noticeOfChangeOfTrialStartDateCalls.length).toEqual(1);
    expect(noticeOfChangeOfTrialStartDateCalls[0][0].data).toEqual({
      caseCaptionExtension: caseCaptionExtensionMock,
      caseTitle: caseTitleMock,
      docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix,
      previousTrialSession: MOCK_TRIAL_INPERSON,
      updatedTrialSession: MOCK_TRIAL_INPERSON,
      clerkOfTheCourtRecord: clerkOfTheCourtRecordMock,
    });
  });
});
