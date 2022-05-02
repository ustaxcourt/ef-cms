const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('./setNoticesForCalendaredTrialSessionInteractor');
const {
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

const findStandingPretrialDocketEntry = caseRecord => {
  return caseRecord.docketEntries.find(
    doc =>
      doc.documentType ===
        SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
          .documentType ||
      doc.documentType ===
        SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.documentType,
  );
};

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
  contactPrimary: {
    ...MOCK_CASE.contactPrimary,
    email: 'petitioner@example.com',
  },
  docketNumber: '102-20',
  procedureType: 'Regular',
};
const case1 = {
  // should get paper service
  ...MOCK_CASE,
  contactPrimary: {
    ...MOCK_CASE.contactPrimary,
  },
  docketNumber: '103-20',
  isPaper: true,
  mailingDate: 'testing',
  procedureType: 'Small',
};

describe('(setNoticesForCalendaredTrialSessionInteractor) standingPretrialOrder', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(user);
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockImplementation(
        () => calendaredCases,
      );
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => trialSession);
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

  it('Should generate a signed Standing Pretrial Order for REGULAR cases', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      docketNumber: '102-20', // MOCK_CASE with procedureType: 'Regular'
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateStandingPretrialOrderInteractor,
    ).toHaveBeenCalled();
    expect(findStandingPretrialDocketEntry(calendaredCases[0])).toMatchObject({
      attachments: false,
      eventCode:
        SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode,
      signedByUserId: MOCK_TRIAL.judge.userId,
      signedJudgeName: MOCK_TRIAL.judge.name,
    });
  });

  it('Should generate a Standing Pretrial Order for Small Case for SMALL cases', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      docketNumber: '103-20', // MOCK_CASE with procedureType: 'Small'
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases()
        .generateStandingPretrialOrderForSmallCaseInteractor,
    ).toHaveBeenCalled();
    expect(findStandingPretrialDocketEntry(calendaredCases[1]).eventCode).toBe(
      SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
        .eventCode,
    );
  });

  it('Should set the status of the Standing Pretrial Document as served for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateNoticeOfTrialIssuedInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
    expect(
      findStandingPretrialDocketEntry(calendaredCases[0]).servedAt,
    ).toBeDefined();
    expect(
      findStandingPretrialDocketEntry(calendaredCases[1]).servedAt,
    ).toBeDefined();
  });

  it('Should set the servedAt field for the Standing Pretrial Document for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateNoticeOfTrialIssuedInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
    expect(
      findStandingPretrialDocketEntry(calendaredCases[0]).servedAt,
    ).toBeTruthy();
    expect(
      findStandingPretrialDocketEntry(calendaredCases[1]).servedAt,
    ).toBeTruthy();
  });

  it('Should set the servedParties field for the Standing Pretrial Document for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateNoticeOfTrialIssuedInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
    expect(
      findStandingPretrialDocketEntry(calendaredCases[0]).servedParties.length,
    ).toBeGreaterThan(0);
    expect(
      findStandingPretrialDocketEntry(calendaredCases[1]).servedParties.length,
    ).toBeGreaterThan(0);
  });
});
