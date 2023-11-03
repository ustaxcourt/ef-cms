import { FORMATS, formatDateString } from '../../utilities/DateHandler';
import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import { SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
import { ThirtyDayNoticeOfTrialRequiredInfo } from '../../utilities/pdfGenerator/documentTemplates/ThirtyDayNoticeOfTrial';
import { applicationContext } from '../../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { docketClerkUser, petitionsClerkUser } from '../../../test/mockUsers';
import { serveThirtyDayNoticeInteractor } from './serveThirtyDayNoticeInteractor';
import { testPdfDoc } from '../../test/getFakeFile';

describe('serveThirtyDayNoticeInteractor', () => {
  let trialSession: RawTrialSession;

  beforeEach(() => {
    trialSession = {
      ...MOCK_TRIAL_INPERSON,
      caseOrder: [{ docketNumber: '101-31' }, { docketNumber: '103-20' }],
    };

    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    applicationContext.getUtilities().formatNow.mockReturnValue('02/23/2023');

    applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mockResolvedValue(null);
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
    const mockFileId = '66bac560-1b85-4e64-9316-3f4d2b17f7bc';

    let mockCase: RawCase;

    beforeEach(() => {
      mockCase = cloneDeep(MOCK_CASE);

      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockResolvedValue(trialSession);

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockResolvedValue(mockCase);

      applicationContext
        .getUseCaseHelpers()
        .saveFileAndGenerateUrl.mockResolvedValue({
          fileId: mockFileId,
          url: mockPdfUrl,
        });
    });

    // 30 Day Notice of Trial (NOTT) is served ONLY to pro-se petitioners because this notice helps inform pro-se petitioners when their trial is occurring, it does
    // not apply to practitioners representing petitioners who are already familiar with court procedure.
    it('should generate a 30 day notice of trial (NOTT) for any case in a trial session with at least 1 pro-se petitioner, serving to only the pro-se petitioners', async () => {
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

      await serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId: trialSession.trialSessionId!,
      });

      const expectedThirtyDayNoticeInfo: ThirtyDayNoticeOfTrialRequiredInfo = {
        caseCaptionExtension: expect.anything(),
        caseTitle: expect.anything(),
        dateServed: '02/23/2023',
        docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix!,
        judgeName: trialSession.judge!.name,
        proceedingType: trialSession.proceedingType,
        scopeType: trialSession.sessionScope,
        trialDate: trialSession.startDate,
        trialLocation: {
          address1: trialSession.address1!,
          address2: trialSession.address2!,
          cityState: trialSession.trialLocation,
          courthouseName: trialSession.courthouseName!,
          postalCode: trialSession.postalCode!,
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
        additionalDocketEntryInfo: {
          date: expect.anything(),
          trialLocation: expect.anything(),
        },
        caseEntity: expect.anything(),
        documentInfo: {
          documentTitle: `30 Day Notice of Trial on ${formatDateString(
            trialSession.startDate,
            FORMATS.MMDDYYYY_DASHED,
          )} at ${trialSession.trialLocation}`,
          documentType: '30-Day Notice of Trial',
          eventCode: 'NOTT',
        },
        newPdfDoc: expect.anything(),
        noticePdf: expect.anything(),
        onlyProSePetitioners: true,
        user: petitionsClerkUser,
      });
    });

    it('should notify the user after processing each case in the trial session', async () => {
      const expectedNotificationOrder = [
        'paper_service_started',
        'paper_service_updated',
        'paper_service_updated',
        'thirty_day_notice_paper_service_complete',
      ];

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

      await serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId: trialSession.trialSessionId!,
      });

      expect(
        applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
      ).toHaveBeenCalledWith({
        applicationContext: expect.anything(),
        file: expect.anything(),
        fileNamePrefix: 'paper-service-pdf/',
      });
      expect(
        applicationContext.getPersistenceGateway().updateTrialSession,
      ).toHaveBeenCalledWith({
        applicationContext: expect.anything(),
        trialSessionToUpdate: expect.objectContaining({
          paperServicePdfs: [
            {
              fileId: mockFileId,
              title: expect.stringContaining('30 Day Notice of Trial on'),
            },
          ],
        }),
      });
      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).toHaveBeenCalledWith({
        applicationContext: expect.anything(),
        message: {
          action: 'thirty_day_notice_paper_service_complete',
          fileId: mockFileId,
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

    it('should append the clinic letter to the NOTT when the party on the case is not represented and trial location provides a clinic letter', async () => {
      applicationContext
        .getPersistenceGateway()
        .isFileExists.mockResolvedValue(true);
      applicationContext
        .getPersistenceGateway()
        .getDocument.mockResolvedValue(testPdfDoc);

      await serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId: trialSession.trialSessionId!,
      });

      expect(
        applicationContext.getUtilities().combineTwoPdfs,
      ).toHaveBeenCalled();
    });

    it('should not append the clinic letter to the NOTT when the party on the case is not represented and trial location does not provide a clinic letter', async () => {
      applicationContext
        .getPersistenceGateway()
        .isFileExists.mockResolvedValue(false);
      applicationContext
        .getPersistenceGateway()
        .getDocument.mockResolvedValue(testPdfDoc);

      await serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId: trialSession.trialSessionId!,
      });

      expect(
        applicationContext.getUtilities().combineTwoPdfs,
      ).not.toHaveBeenCalled();
    });

    it('should ONLY generate a 30 day notice of trial (NOTT) for cases in the trial session that have NOT been removed from trial', async () => {
      const caseWithProSePetitionerRemovedFromTrial = cloneDeep(mockCase);
      caseWithProSePetitionerRemovedFromTrial.docketNumber = '100-78';
      caseWithProSePetitionerRemovedFromTrial.docketNumberWithSuffix = '100-78';

      const caseWithProSePetitioner = cloneDeep(mockCase);
      caseWithProSePetitioner.privatePractitioners = [];

      const caseWithProSePetitioner2 = cloneDeep(mockCase);
      caseWithProSePetitioner2.docketNumber = '732-34';
      caseWithProSePetitioner2.docketNumberWithSuffix = '732-34';
      caseWithProSePetitioner2.privatePractitioners = [];

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockResolvedValueOnce(caseWithProSePetitioner)
        .mockResolvedValueOnce(caseWithProSePetitioner2);

      trialSession.caseOrder = [
        {
          docketNumber: caseWithProSePetitioner.docketNumber,
          removedFromTrial: false,
        },
        {
          disposition: 'Status was changed to Closed',
          docketNumber: caseWithProSePetitionerRemovedFromTrial.docketNumber,
          removedFromTrial: true,
          removedFromTrialDate: '2100-12-01T00:00:00.000Z',
        },
        {
          docketNumber: caseWithProSePetitioner2.docketNumber,
          removedFromTrial: undefined, // Has not been explicitly removed from trial
        },
      ];

      await serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId: trialSession.trialSessionId!,
      });

      expect(
        applicationContext.getDocumentGenerators().thirtyDayNoticeOfTrial,
      ).toHaveBeenCalledTimes(2);
      expect(
        applicationContext.getDocumentGenerators().thirtyDayNoticeOfTrial.mock
          .calls[0][0].data.docketNumberWithSuffix,
      ).toEqual(caseWithProSePetitioner.docketNumberWithSuffix);
      expect(
        applicationContext.getDocumentGenerators().thirtyDayNoticeOfTrial.mock
          .calls[1][0].data.docketNumberWithSuffix,
      ).toEqual(caseWithProSePetitioner2.docketNumberWithSuffix);
    });
  });
});
