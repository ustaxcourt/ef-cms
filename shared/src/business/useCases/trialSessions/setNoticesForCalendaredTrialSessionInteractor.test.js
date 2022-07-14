const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  copyPagesFromPdf,
  setNoticesForCalendaredTrialSessionInteractor,
} = require('./setNoticesForCalendaredTrialSessionInteractor');
const {
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const { fakeData, getFakeFile } = require('../../test/getFakeFile');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_TRIAL_REGULAR } = require('../../../test/mockTrial');
const { PARTY_TYPES, ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

const MOCK_TRIAL = {
  judge: {
    name: 'Judge Mary Kate and Ashley',
    userId: '410e4ade-6ad5-4fc4-8741-3f8352c72a0c',
  },
  maxCases: 100,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
};
const serviceInfo = {
  docketEntryId: '',
  hasPaper: false,
  url: 'www.example.com',
};

const user = new User({
  name: 'Docket Clerk',
  role: ROLES.docketClerk,
  userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
});
let calendaredCases;
let trialSession;
const case0 = {
  // should get electronic service
  ...MOCK_CASE,
  docketNumber: '102-20',
  procedureType: 'Regular',
};
const case1 = {
  // should get paper service
  ...MOCK_CASE,
  docketNumber: '103-20',
  isPaper: true,
  mailingDate: 'testing',
  procedureType: 'Small',
};

const fakeClinicLetter = getFakeFile(true, true);

describe('setNoticesForCalendaredTrialSessionInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: PARTY_TYPES.petitioner,
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
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
    // const copyPagesFromPdfMock = jest.mock(copyPagesFromPdf);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue({
        ...MOCK_TRIAL_REGULAR,
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      });
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
    applicationContext.getPersistenceGateway().getJobStatus.mockResolvedValue({
      unfinishedCases: 0,
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
    jest.spyOn(global, 'setInterval').mockImplementation(cb => cb());

    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValueOnce(false);

    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(applicationContext.invokeLambda).toHaveBeenCalledTimes(3);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledTimes(1);
    // expect(copyPagesFromPdfMock).toHaveBeenCalled();
  });

  it.skip('should not generate a pdf if the file does not exist in s3', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue({
        ...MOCK_TRIAL_REGULAR,
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      });
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
    applicationContext.getPersistenceGateway().getJobStatus.mockResolvedValue({
      unfinishedCases: 0,
    });
    applicationContext
      .getUseCaseHelpers()
      .savePaperServicePdf.mockResolvedValue({
        url: 'http://example.com',
      });
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(false);

    applicationContext
      .getPersistenceGateway()
      .getDocument.mockResolvedValue(fakeData);
    jest.spyOn(global, 'setInterval').mockImplementation(cb => cb());

    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getPersistenceGateway().isFileExists,
    ).toHaveBeenCalledTimes(3);

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();
  });
});
