import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { setNoticeOfChangeOfTrialLocation } from '@web-api/business/useCaseHelper/trialSessions/setNoticeOfChangeOfTrialLocation';

describe('setNoticeOfChangeOfTrialLocation', () => {
  const noticePdfMock = 'TEST_NOTICE_PDF';
  const TEST_USER = { email: 'TEST_EMAIL@example.com' } as AuthUser;
  const TEST_CASE_ENTITY = { docketNumber: 'TEST_DOCKET_NUMBER' };

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .generateNoticeOfChangeOfTrialLocationInteractor.mockReturnValue(
        noticePdfMock,
      );

    applicationContext
      .getUseCaseHelpers()
      .createAndServeNoticeDocketEntry.mockReturnValue('');
  });

  it('should call method with correct params', async () => {
    await setNoticeOfChangeOfTrialLocation(
      applicationContext,
      {
        caseEntity: TEST_CASE_ENTITY as any,
        newPdfDoc: 'TEST_newPdfDoc' as any,
        newTrialSessionEntity: 'TEST_newTrialSessionEntity' as any,
        previousTrialSession: 'TEST_previousTrialSession' as any,
      },
      TEST_USER,
    );

    const generateNoticeOfChangeOfLocationCalls =
      applicationContext.getUseCases()
        .generateNoticeOfChangeOfTrialLocationInteractor.mock.calls;

    expect(generateNoticeOfChangeOfLocationCalls.length).toEqual(1);
    expect(generateNoticeOfChangeOfLocationCalls[0][1]).toEqual({
      docketNumber: 'TEST_DOCKET_NUMBER',
      previousTrialSession: 'TEST_previousTrialSession',
      updatedTrialSession: 'TEST_newTrialSessionEntity',
    });

    const createAndServeNoticeDocketEntryCalls =
      applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry
        .mock.calls;

    expect(createAndServeNoticeDocketEntryCalls.length).toEqual(1);
    expect(createAndServeNoticeDocketEntryCalls[0][1]).toEqual({
      caseEntity: TEST_CASE_ENTITY,
      documentInfo:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialLocation,
      newPdfDoc: 'TEST_newPdfDoc',
      noticePdf: noticePdfMock,
    });
    expect(createAndServeNoticeDocketEntryCalls[0][2]).toEqual(TEST_USER);
  });
});
