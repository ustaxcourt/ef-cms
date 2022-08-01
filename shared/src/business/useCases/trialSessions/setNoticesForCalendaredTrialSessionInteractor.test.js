const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('./setNoticesForCalendaredTrialSessionInteractor');
const {
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const { MOCK_TRIAL_REGULAR } = require('../../../test/mockTrial');
const { PARTY_TYPES, ROLES } = require('../../entities/EntityConstants');
const { testPdfDoc } = require('../../test/getFakeFile');
const { User } = require('../../entities/User');

describe('setNoticesForCalendaredTrialSessionInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockResolvedValue([
        {
          docketNumber: '101-20',
        },
        {
          docketNumber: '102-20',
        },
        {
          docketNumber: '103-20',
        },
      ]);
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: PARTY_TYPES.petitioner,
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue({
        ...MOCK_TRIAL_REGULAR,
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      });
    applicationContext.getNotificationGateway().sendNotificationToUser =
      jest.fn();
    applicationContext
      .getPersistenceGateway()
      .getJobStatus.mockResolvedValueOnce({
        unfinishedCases: 0,
      })
      .mockResolvedValueOnce({
        unfinishedCases: 1,
      });
    applicationContext
      .getUseCaseHelpers()
      .savePaperServicePdf.mockResolvedValue({
        url: 'http://example.com',
      });
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(true);

    applicationContext
      .getPersistenceGateway()
      .getDocument.mockResolvedValue(testPdfDoc);

    jest.spyOn(global, 'setInterval').mockImplementation(async cb => {
      await cb();
      await cb();
    });
  });

  it('should return an unauthorized error if the user does not have the TRIAL_SESSIONS permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: PARTY_TYPES.petitioner,
        role: ROLES.petitioner,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    let error;

    try {
      await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('should do nothing and send a notification to the user when setting a calendar with no cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockResolvedValue([]);

    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        message: {
          action: 'notice_generation_complete',
          hasPaper: false,
        },
      }),
    );
  });

  it('should send 3 events when 3 cases are calendared on the session and a complete notification is sent back to the user when they all finish processing', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getMessageGateway().sendSetTrialSessionCalendarEvent,
    ).toHaveBeenCalledTimes(3);
    const { pdfUrl } =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message;
    expect(pdfUrl).toBe('http://example.com');
    applicationContext
      .getUseCaseHelpers()
      .savePaperServicePdf.mockResolvedValue({
        url: null,
      });

    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const pdfUrlNull =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[1][0].message.pdfUrl;
    expect(pdfUrlNull).toBe(null);
  });

  it('should generate an empty pdf if no calendared cases PDF documents exist', async () => {
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(false);

    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUtilities().copyPagesAndAppendToTargetPdf,
    ).not.toHaveBeenCalled();

    const pdfDoc =
      applicationContext.getUseCaseHelpers().savePaperServicePdf.mock
        .calls[0][0].document;
    expect(pdfDoc.getPages().length).toBe(0);
  });

  it('should generate a pdf if calendared cases PDF documents exist', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledTimes(3);
    expect(
      applicationContext.getUtilities().copyPagesAndAppendToTargetPdf,
    ).toHaveBeenCalledTimes(3);

    const pdfDoc =
      applicationContext.getUseCaseHelpers().savePaperServicePdf.mock
        .calls[0][0].document;
    expect(pdfDoc.getPages().length).toBe(3);
  });
});
