import { Case } from '@shared/business/entities/cases/Case';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockCaseServicesSupervisorUser } from '@shared/test/mockAuthUsers';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { setNoticeOfChangeOfTrialStartDate } from '@web-api/business/useCaseHelper/trialSessions/setNoticeOfChangeOfTrialStartDate';

describe('setNoticeOfChangeOfTrialStartDate', () => {
  const newPdfMock = 'empty pdf';
  const noticePdfMock = 'notice of change of trial date';
  const mockUser = mockCaseServicesSupervisorUser;
  const mockCase = new Case(MOCK_CASE, { authorizedUser: mockUser });
  const mockPreviousTrialSession = MOCK_TRIAL_INPERSON;
  const mockNewTrialSessionEntity = new TrialSession(MOCK_TRIAL_INPERSON);

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .generateNoticeOfChangeOfTrialStartDateInteractor.mockReturnValue(
        noticePdfMock,
      );

    applicationContext
      .getUseCaseHelpers()
      .createAndServeNoticeDocketEntry.mockReturnValue('');
  });

  it('should call methods with correct params', async () => {
    await setNoticeOfChangeOfTrialStartDate(
      applicationContext,
      {
        caseEntity: mockCase,
        newPdfDoc: newPdfMock,
        newTrialSessionEntity: mockNewTrialSessionEntity,
        previousTrialSession: mockPreviousTrialSession,
      },
      mockUser,
    );

    const generateNoticeOfChangeOfTrialStartDateInteractorCalls =
      applicationContext.getUseCases()
        .generateNoticeOfChangeOfTrialStartDateInteractor.mock.calls;

    expect(
      generateNoticeOfChangeOfTrialStartDateInteractorCalls.length,
    ).toEqual(1);
    expect(generateNoticeOfChangeOfTrialStartDateInteractorCalls[0][1]).toEqual(
      {
        docketNumber: MOCK_CASE.docketNumber,
        previousTrialSession: mockPreviousTrialSession,
        updatedTrialSession: mockNewTrialSessionEntity,
      },
    );

    const createAndServeNoticeDocketEntryCalls =
      applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry
        .mock.calls;

    expect(createAndServeNoticeDocketEntryCalls.length).toEqual(1);
    expect(createAndServeNoticeDocketEntryCalls[0][1]).toEqual({
      caseEntity: mockCase,
      documentInfo:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialStartDate,
      newPdfDoc: newPdfMock,
      noticePdf: noticePdfMock,
    });
    expect(createAndServeNoticeDocketEntryCalls[0][2]).toEqual(mockUser);
  });
});
