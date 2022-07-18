const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('./setNoticesForCalendaredTrialSessionInteractor');
const {
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const { copyPagesFromPdf } = require('../../utilities/copyPagesFromPdf');
const { fakeData } = require('../../test/getFakeFile');
const { MOCK_TRIAL_REGULAR } = require('../../../test/mockTrial');
const { PARTY_TYPES, ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

jest.mock('../../utilities/copyPagesFromPdf');

describe('setNoticesForCalendaredTrialSessionInteractor', () => {
  beforeEach(() => {
    copyPagesFromPdf.mockResolvedValue(null);
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
      .getDocument.mockResolvedValue(fakeData);

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
    ).toHaveBeenCalled();
    expect(applicationContext.invokeLambda).not.toHaveBeenCalled();
  });

  it('should invoke the worker lambda 3 times when 3 cases are calendared on the session and a complete notification is sent back to the user when they all finish processing', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(applicationContext.invokeLambda).toHaveBeenCalledTimes(3);
    expect(copyPagesFromPdf).toHaveBeenCalledTimes(3);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledTimes(1);
  });

  it('should generate a empty pdf if all cases were electronic', async () => {
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(false);

    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(copyPagesFromPdf).not.toHaveBeenCalled();

    const pdfDoc =
      applicationContext.getUseCaseHelpers().savePaperServicePdf.mock
        .calls[0][0].document;
    expect(pdfDoc.getPages().length).toBe(0);
  });

  it('should log any errors when trying to invoke the worker lambda', async () => {
    applicationContext.invokeLambda.mockImplementation((params, cb) => {
      cb(new Error('lambda could not be invoked'));
    });

    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(applicationContext.logger.error).toHaveBeenCalledTimes(3);
  });
});
