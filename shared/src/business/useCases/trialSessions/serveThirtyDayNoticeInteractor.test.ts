import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import { ThirtyDayNoticeOfTrialRequiredInfo } from '../../utilities/pdfGenerator/documentTemplates/ThirtyDayNoticeOfTrial';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser, petitionsClerkUser } from '../../../test/mockUsers';
import { serveThirtyDayNoticeInteractor } from './serveThirtyDayNoticeInteractor';

describe('serveThirtyDayNoticeInteractor', () => {
  let trialSession: RawTrialSession;

  beforeEach(() => {
    trialSession = {
      ...MOCK_TRIAL_INPERSON,
      caseOrder: [{ docketNumber: '101-31' }, { docketNumber: '103-20' }],
    };

    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);
  });

  it('should throw an unauthorized error when the user is not authorized to serve 30 day notices', async () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    await expect(
      serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId: trialSession.trialSessionId!,
      }),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('should throw an invalid request error when no trial session id is provided', async () => {
    await expect(
      serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId: undefined as any,
      }),
    ).rejects.toThrow(new InvalidRequest('No trial Session Id provided'));
  });

  it('should serve a NOTT 30 day notice on each case in a trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(trialSession);

    await serveThirtyDayNoticeInteractor(applicationContext, {
      trialSessionId: trialSession.trialSessionId!,
    });

    const expectedThirtyDayNoticeInfo: ThirtyDayNoticeOfTrialRequiredInfo = {
      caseCaptionExtension: expect.anything(),
      caseTitle: expect.anything(),
      docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix,
      judgeName: trialSession.judge!.name,
      proceedingType: trialSession.proceedingType,
      scopeType: trialSession.sessionScope,
      trialDate: trialSession.startDate,
      trialLocation: {
        address1: trialSession.address1!,
        address2: trialSession.address2!,
        city: trialSession.city!,
        courthouseName: trialSession.courthouseName!,
        postalCode: trialSession.postalCode!,
        state: trialSession.state!,
      },
    };
    expect(
      applicationContext.getDocumentGenerators().thirtyDayNoticeOfTrial,
    ).toHaveBeenCalledTimes(trialSession.caseOrder!.length);
    expect(
      applicationContext.getDocumentGenerators().thirtyDayNoticeOfTrial,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      data: expectedThirtyDayNoticeInfo,
    });
    expect(
      applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry,
    ).toHaveBeenCalledTimes(trialSession.caseOrder!.length);
    expect(
      applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry,
    ).toHaveBeenCalledWith(expect.anything(), {
      caseEntity: expect.anything(),
      documentInfo: {
        documentTitle: '30 Day Notice of Trial on [Date] at [Place]',
        documentType: '30-Day Notice of Trial',
        eventCode: 'NOTT',
      },
      newPdfDoc: expect.anything(),
      noticePdf: expect.anything(),
      userId: docketClerkUser.userId,
    });
  });
});
