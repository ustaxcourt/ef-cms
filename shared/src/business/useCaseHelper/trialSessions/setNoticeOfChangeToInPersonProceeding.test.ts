import { Case } from '../../entities/cases/Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getFakeFile } from '../../test/getFakeFile';
import { petitionsClerkUser } from '../../../test/mockUsers';
import { setNoticeOfChangeToInPersonProceeding } from './setNoticeOfChangeToInPersonProceeding';

describe('setNoticeOfChangeToInPersonProceeding', () => {
  const mockTrialSessionId = '76a5b1c8-1eed-44b6-932a-967af060597a';

  const mockInPersonCalendaredTrialSession = {
    ...MOCK_TRIAL_INPERSON,
    isCalendared: true,
    trialSessionId: mockTrialSessionId,
  };

  const mockOpenCase = new Case(
    {
      ...MOCK_CASE,
      trialDate: '2019-03-01T21:42:29.073Z',
      trialSessionId: mockTrialSessionId,
    },
    { applicationContext },
  );

  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .generateNoticeOfChangeToInPersonProceeding.mockReturnValue(getFakeFile);
  });

  it('should make a call to generate the NOIP pdf', async () => {
    await setNoticeOfChangeToInPersonProceeding(applicationContext, {
      caseEntity: mockOpenCase,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: mockInPersonCalendaredTrialSession,
      user: petitionsClerkUser,
    });

    expect(
      applicationContext.getUseCaseHelpers()
        .generateNoticeOfChangeToInPersonProceeding.mock.calls[0][1],
    ).toMatchObject({
      docketNumber: mockOpenCase.docketNumber,
      trialSessionInformation: {
        address1: mockInPersonCalendaredTrialSession.address1,
        address2: mockInPersonCalendaredTrialSession.address2,
        chambersPhoneNumber:
          mockInPersonCalendaredTrialSession.chambersPhoneNumber,
        city: mockInPersonCalendaredTrialSession.city,
        courthouseName: mockInPersonCalendaredTrialSession.courthouseName,
        judgeName: mockInPersonCalendaredTrialSession.judge!.name,
        startDate: mockInPersonCalendaredTrialSession.startDate,
        startTime: mockInPersonCalendaredTrialSession.startTime,
        state: mockInPersonCalendaredTrialSession.state,
        trialLocation: mockInPersonCalendaredTrialSession.trialLocation,
        zip: mockInPersonCalendaredTrialSession.postalCode,
      },
    });
  });

  it('should make a call to create and serve the NOIP docket entry on the case', async () => {
    await setNoticeOfChangeToInPersonProceeding(applicationContext, {
      caseEntity: mockOpenCase,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: mockInPersonCalendaredTrialSession,
      user: petitionsClerkUser,
    });

    expect(
      applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry
        .mock.calls[0][1],
    ).toMatchObject({
      additionalDocketEntryInfo: {
        date: mockInPersonCalendaredTrialSession.startDate,
        signedAt: expect.anything(),
        trialLocation: mockInPersonCalendaredTrialSession.trialLocation,
      },
      caseEntity: mockOpenCase,
      documentInfo:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToInPersonProceeding,
      newPdfDoc: getFakeFile,
      noticePdf: getFakeFile,
      user: petitionsClerkUser,
    });
  });
});
