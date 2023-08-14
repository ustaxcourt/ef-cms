import { Case } from '../../entities/cases/Case';
import { MOCK_CASE } from '../../../test/mockCase';
import {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_REMOTE,
} from '../../../test/mockTrial';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { petitionsClerkUser } from '../../../test/mockUsers';
import { setNoticeOfChangeToRemoteProceeding } from './setNoticeOfChangeToRemoteProceeding';

describe('setNoticeOfChangeToRemoteProceeding', () => {
  const mockNoticePdf = 'Blah blah blah';
  const mockNewPdf = 'This is some other newer stuff';

  const mockOpenCase = new Case(
    {
      ...MOCK_CASE,
      trialDate: '2019-03-01T21:42:29.073Z',
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
    },
    { applicationContext },
  );

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .generateNoticeOfChangeToRemoteProceedingInteractor.mockReturnValue(
        mockNoticePdf,
      );
  });

  it('should generate and serve a NORP when the proceeding type changes from in person to remote and the case status is not closed', async () => {
    await setNoticeOfChangeToRemoteProceeding(applicationContext, {
      caseEntity: mockOpenCase,
      newPdfDoc: mockNewPdf,
      newTrialSessionEntity: MOCK_TRIAL_REMOTE,
      user: petitionsClerkUser,
    });

    expect(
      applicationContext.getUseCases()
        .generateNoticeOfChangeToRemoteProceedingInteractor.mock.calls[0][1],
    ).toMatchObject({
      docketNumber: mockOpenCase.docketNumber,
      trialSessionInformation: {
        chambersPhoneNumber: '1111111',
        joinPhoneNumber: '0987654321',
        judgeName: 'Chief Judge',
        meetingId: '1234567890',
        password: 'abcdefg',
        startDate: '2025-12-01T00:00:00.000Z',
        startTime: undefined,
        trialLocation: 'Birmingham, Alabama',
      },
    });
    expect(
      applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry
        .mock.calls[0][1],
    ).toMatchObject({
      caseEntity: mockOpenCase,
      documentInfo:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToRemoteProceeding,
      newPdfDoc: mockNewPdf,
      noticePdf: mockNoticePdf,
      user: petitionsClerkUser,
    });
  });
});
