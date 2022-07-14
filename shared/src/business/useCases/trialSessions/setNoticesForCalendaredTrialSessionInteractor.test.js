const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('./setNoticesForCalendaredTrialSessionInteractor');
const {
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const { getFakeFile } = require('../../test/getFakeFile');
const { MOCK_CASE } = require('../../../test/mockCase');
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
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(user);
    applicationContext
      .getNotificationGateway()
      .sendNotificationToUser.mockReturnValue(null);
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockImplementation(
        () => calendaredCases,
      );
    applicationContext
      .getPersistenceGateway()
      .deleteCaseTrialSortMappingRecords.mockReturnValue(calendaredCases);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue('http://example.com');
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => trialSession);
    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockImplementation(({ trialSessionToUpdate }) => {
        trialSession = trialSessionToUpdate;
      });
    applicationContext.getPersistenceGateway().getJobStatus.mockResolvedValue({
      unfinishedCases: 0,
    });
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) => {
        calendaredCases.some((caseRecord, index) => {
          if (caseRecord.docketNumber === caseToUpdate.docketNumber) {
            calendaredCases[index] = caseToUpdate;
            return true;
          }
        });
      });

    jest.spyOn(global, 'setInterval').mockImplementation(cb => cb());

    applicationContext
      .getUseCases()
      .generateNoticeOfTrialIssuedInteractor.mockReturnValue(testPdfDoc);
    applicationContext
      .getUseCases()
      .generateStandingPretrialOrderForSmallCaseInteractor.mockReturnValue(
        testPdfDoc,
      );
    applicationContext
      .getUseCases()
      .generateStandingPretrialOrderInteractor.mockReturnValue(testPdfDoc);
    applicationContext
      .getUseCaseHelpers()
      .savePaperServicePdf.mockReturnValue(serviceInfo);
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockResolvedValue(fakeClinicLetter);
  });

  beforeEach(() => {
    calendaredCases = [case0, case1];
    trialSession = { ...MOCK_TRIAL };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(case0)
      .mockReturnValueOnce(case0)
      .mockReturnValueOnce(case1)
      .mockReturnValueOnce(case1);
  });

  it('Should return an unauthorized error if the user does not have the TRIAL_SESSIONS permission', async () => {
    const mockUser = new User({
      name: PARTY_TYPES.petitioner,
      role: ROLES.petitioner, // Petitioners do not have the TRIAL_SESSIONS role, per authorizationClientService.js
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getCurrentUser.mockReturnValueOnce(mockUser);
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

  it('Should return immediately if there are no calendared cases to be set', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValueOnce([]); // returning no cases

    const result = await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    );

    expect(
      applicationContext.getUseCases().generateNoticeOfTrialIssuedInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('Should create a docket entry for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(applicationContext.invokeLambda).toHaveBeenCalledTimes(2);
  });
});
