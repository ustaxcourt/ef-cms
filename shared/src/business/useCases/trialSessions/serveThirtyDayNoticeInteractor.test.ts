import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import { SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
import { ThirtyDayNoticeOfTrialRequiredInfo } from '../../utilities/pdfGenerator/documentTemplates/ThirtyDayNoticeOfTrial';
import { applicationContext } from '../../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
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

  describe('Happy Path', () => {
    const mockPdfUrl = 'www.blahdeebloop.com';

    let mockCase: RawCase;

    beforeEach(() => {
      applicationContext
        .getUseCaseHelpers()
        .saveFileAndGenerateUrl.mockResolvedValue({
          fileId: '',
          url: mockPdfUrl,
        });

      mockCase = cloneDeep(MOCK_CASE);
    });

    it('should serve a 30 day notice of trial(NOTT) on any case in a trial session with at least 1 pro se petitioner', async () => {
      const caseWithRepresentedPetitioner = cloneDeep(mockCase);
      caseWithRepresentedPetitioner.privatePractitioners = [
        {
          representing: [
            caseWithRepresentedPetitioner.petitioners[0].contactId,
          ],
        },
      ];
      const caseWithProSePetitioner = cloneDeep(mockCase);
      caseWithProSePetitioner.privatePractitioners = [];
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockResolvedValueOnce(
          caseWithRepresentedPetitioner,
        )
        .mockResolvedValueOnce(caseWithProSePetitioner);
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
      ).toHaveBeenCalledTimes(1);
      expect(
        applicationContext.getDocumentGenerators().thirtyDayNoticeOfTrial,
      ).toHaveBeenCalledWith({
        applicationContext: expect.anything(),
        data: expectedThirtyDayNoticeInfo,
      });
      expect(
        applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry,
      ).toHaveBeenCalledTimes(1);
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
        userId: petitionsClerkUser.userId,
      });
    });

    it('should notify the user after processing each case in the trial session', async () => {
      const expectedNotificationOrder = [
        'paper_service_started',
        'paper_service_updated',
        'paper_service_updated',
        'thirty_day_notice_paper_service_complete',
      ];
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockResolvedValue(mockCase);
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockResolvedValue(trialSession);

      await serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId: trialSession.trialSessionId!,
      });

      const actualNotificationOrder = applicationContext
        .getNotificationGateway()
        .sendNotificationToUser.mock.calls.map(
          mockCall => mockCall[0].message.action,
        );
      expect(actualNotificationOrder).toEqual(expectedNotificationOrder);
    });

    it('should generate a paper service PDF when at least one of the parties on a case in the trial session has requested paper service', async () => {
      mockCase.petitioners = [
        {
          ...mockCase.petitioners[0],
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      ];
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockResolvedValue(mockCase);
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockResolvedValue(trialSession);

      await serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId: trialSession.trialSessionId!,
      });

      expect(
        applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
      ).toHaveBeenCalledWith({
        applicationContext: expect.anything(),
        file: expect.anything(),
        useTempBucket: true,
      });
      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).toHaveBeenCalledWith({
        applicationContext: expect.anything(),
        message: {
          action: 'thirty_day_notice_paper_service_complete',
          hasPaper: true,
          pdfUrl: mockPdfUrl,
        },
        userId: petitionsClerkUser.userId,
      });
    });

    it('should not generate a paper service pdf when all cases in the trial session have parties with electronic or no service preference', async () => {
      mockCase.privatePractitioners = [];
      mockCase.irsPractitioners = [];
      mockCase.petitioners = [
        {
          ...mockCase.petitioners[0],
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
      ];
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockResolvedValue(mockCase);
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockResolvedValue(trialSession);

      await serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId: trialSession.trialSessionId!,
      });

      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).toHaveBeenCalledWith({
        applicationContext: expect.anything(),
        message: {
          action: 'thirty_day_notice_paper_service_complete',
          pdfUrl: undefined,
        },
        userId: petitionsClerkUser.userId,
      });
    });
  });
});
