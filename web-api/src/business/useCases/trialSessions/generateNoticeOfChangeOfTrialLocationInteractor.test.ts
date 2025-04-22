import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateNoticeOfChangeOfTrialLocationInteractor } from '@web-api/business/useCases/trialSessions/generateNoticeOfChangeOfTrialLocationInteractor';

describe('generateNoticeOfChangeOfTrialLocationInteractor', () => {
  const TEST_DOCKET_NUMBER = 'TEST_DOCKET_NUMBER';
  const MOCKED_CASE = {
    caseCaption:
      'Virginia Vincent, Deceased, Virginia Vincent, Surviving Spouse, Petitioner',
    docketNumber: TEST_DOCKET_NUMBER,
  } as RawCase;

  const MOCK_ARRAY_BUFFER = 'MOCK_ARRAY_BUFFER';

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCKED_CASE);

    applicationContext
      .getDocumentGenerators()
      .noticeOfChangeOfTrialLocation.mockReturnValue(MOCK_ARRAY_BUFFER);
  });

  it('should call the generatePDF method with correct params', async () => {
    const PREVIOUS_TRIAL_SESSION = {
      trialSessionId: 'PREVIOUS',
    } as RawTrialSession;
    const UPDATED_TRIAL_SESSION = {
      trialSessionId: 'UPDATED',
    } as RawTrialSession;

    const results = await generateNoticeOfChangeOfTrialLocationInteractor(
      applicationContext,
      {
        docketNumber: TEST_DOCKET_NUMBER,
        previousTrialSession: PREVIOUS_TRIAL_SESSION,
        updatedTrialSession: UPDATED_TRIAL_SESSION,
      },
    );

    expect(results).toEqual(MOCK_ARRAY_BUFFER);

    const getCaseByDocketNumberCalls =
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls;
    expect(getCaseByDocketNumberCalls.length).toEqual(1);
    expect(getCaseByDocketNumberCalls[0][0].docketNumber).toEqual(
      TEST_DOCKET_NUMBER,
    );

    const noticeOfChangeOfTrialLocationCalls =
      applicationContext.getDocumentGenerators().noticeOfChangeOfTrialLocation
        .mock.calls;
    expect(noticeOfChangeOfTrialLocationCalls.length).toEqual(1);
    expect(noticeOfChangeOfTrialLocationCalls[0][0].data).toEqual({
      caseCaptionExtension: 'Petitioner',
      caseTitle:
        'Virginia Vincent, Deceased, Virginia Vincent, Surviving Spouse',
      docketNumberWithSuffix: undefined,
      previousTrialSession: PREVIOUS_TRIAL_SESSION,
      updatedTrialSession: UPDATED_TRIAL_SESSION,
    });
  });
});
