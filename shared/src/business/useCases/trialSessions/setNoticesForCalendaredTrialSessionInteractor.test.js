const {
  applicationContext,
  fakeData,
} = require('../../test/createTestApplicationContext');
const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('./setNoticesForCalendaredTrialSessionInteractor');
const {
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');
const { PARTY_TYPES, ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

const findNoticeOfTrial = caseRecord => {
  return caseRecord.docketEntries.find(
    doc =>
      doc.documentType ===
      SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.documentType,
  );
};

const findStandingPretrialDocument = caseRecord => {
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

let user;
let calendaredCases;
let trialSession;

describe('setNoticesForCalendaredTrialSessionInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });
  beforeEach(() => {
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

    calendaredCases = [case0, case1];

    trialSession = { ...MOCK_TRIAL };

    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockImplementation(() => user);

    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue(calendaredCases);

    applicationContext
      .getNotificationGateway()
      .sendNotificationToUser.mockReturnValue(null);

    applicationContext
      .getPersistenceGateway()
      .deleteCaseTrialSortMappingRecords.mockReturnValue({});

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
      .generateNoticeOfTrialIssuedInteractor.mockReturnValue(fakeData);
    applicationContext
      .getUseCases()
      .generateStandingPretrialOrderForSmallCaseInteractor.mockReturnValue(
        fakeData,
      );
    applicationContext
      .getUseCases()
      .generateStandingPretrialOrderInteractor.mockReturnValue(fakeData);
  });

  it('Should return an unauthorized error if the user does not have the TRIAL_SESSIONS permission', async () => {
    user = new User({
      name: PARTY_TYPES.petitioner,
      role: ROLES.petitioner, // Petitioners do not have the TRIAL_SESSIONS role, per authorizationClientService.js
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

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
      .getCalendaredCasesForTrialSession.mockReturnValue([]); // returning no cases

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

  it('Should generate a Notice of Trial for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateNoticeOfTrialIssuedInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();

    expect(findNoticeOfTrial(calendaredCases[0])).toBeTruthy();
    expect(findNoticeOfTrial(calendaredCases[1])).toBeTruthy();
  });

  it('Should include the signedAt field on the Notice of Trial document', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(findNoticeOfTrial(calendaredCases[0]).signedAt).toBeTruthy();
    expect(findNoticeOfTrial(calendaredCases[1]).signedAt).toBeTruthy();
  });

  it('Should set the noticeOfTrialDate field on each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(calendaredCases[0]).toHaveProperty('noticeOfTrialDate');
    expect(calendaredCases[1]).toHaveProperty('noticeOfTrialDate');
  });

  it('Should create a docket entry for each case', async () => {
    const mockNumberOfPages = 999;
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(mockNumberOfPages);

    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const findNoticeOfTrialDocketEntry = caseRecord => {
      return caseRecord.docketEntries.find(
        entry =>
          entry.documentType ===
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.documentType,
      );
    };

    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalled();

    expect(findNoticeOfTrialDocketEntry(calendaredCases[0])).toMatchObject({
      date: '2025-12-01T00:00:00.000Z',
      index: expect.anything(),
      isFileAttached: true,
      isOnDocketRecord: true,
      numberOfPages: 999,
      trialLocation: 'Birmingham, Alabama',
    });
    expect(findNoticeOfTrialDocketEntry(calendaredCases[1])).toMatchObject({
      date: '2025-12-01T00:00:00.000Z',
      index: expect.anything(),
      isFileAttached: true,
      isOnDocketRecord: true,
      numberOfPages: 999,
      trialLocation: 'Birmingham, Alabama',
    });
  });

  it('Should set the status of the Notice of Trial as served for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateNoticeOfTrialIssuedInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();

    expect(findNoticeOfTrial(calendaredCases[0]).servedAt).toBeDefined();
    expect(findNoticeOfTrial(calendaredCases[1]).servedAt).toBeDefined();
  });

  it('Should set the servedAt field for the Notice of Trial for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateNoticeOfTrialIssuedInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();

    expect(findNoticeOfTrial(calendaredCases[0]).servedAt).toBeTruthy();
    expect(findNoticeOfTrial(calendaredCases[1]).servedAt).toBeTruthy();
  });

  it('Should set the servedParties field for the Notice of Trial for each case', async () => {
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
      findNoticeOfTrial(calendaredCases[0]).servedParties.length,
    ).toBeGreaterThan(0);
    expect(
      findNoticeOfTrial(calendaredCases[1]).servedParties.length,
    ).toBeGreaterThan(0);
  });

  it('Should dispatch a service email for parties receiving electronic service', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
  });

  it('Should set the noticeIssuedDate on the trial session and then call updateTrialSession', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(trialSession.noticeIssuedDate).toBeTruthy();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('Should NOT overwrite the noticeIssuedDate on the trial session NOR call updateTrialSession if a docketNumber is set', async () => {
    const oldDate = '2019-12-01T00:00:00.000Z';
    trialSession.noticeIssuedDate = oldDate;

    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      docketNumber: '102-20',
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(trialSession.noticeIssuedDate).toEqual(oldDate); // Should not be updated
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).not.toHaveBeenCalled();
  });

  it('Should only generate a Notice of Trial for a single case if a docketNumber is set', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      docketNumber: '103-20',
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateNoticeOfTrialIssuedInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();

    expect(findNoticeOfTrial(calendaredCases[0])).toBeFalsy();
    expect(findNoticeOfTrial(calendaredCases[1])).toBeTruthy();
  });

  it('Should only set the notice for a single case if a docketNumber is set', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      docketNumber: '102-20',
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(calendaredCases[0]).toHaveProperty('noticeOfTrialDate');
    expect(calendaredCases[1]).not.toHaveProperty('noticeOfTrialDate');
  });

  it('Should only create a docket entry for a single case if a docketNumber is set', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      docketNumber: '103-20',
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const findNoticeOfTrialDocketEntry = caseRecord => {
      return caseRecord.docketEntries.find(
        entry =>
          entry.documentType ===
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.documentType,
      );
    };

    expect(findNoticeOfTrialDocketEntry(calendaredCases[0])).toBeFalsy();
    expect(findNoticeOfTrialDocketEntry(calendaredCases[1])).toBeTruthy();
  });

  it('Should set the status of the Notice of Trial as served for a single case if a docketNumber is set', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      docketNumber: '103-20',
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateNoticeOfTrialIssuedInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();

    expect(findNoticeOfTrial(calendaredCases[0])).toBeFalsy(); // Document should not exist on this case
    expect(findNoticeOfTrial(calendaredCases[1]).servedAt).toBeDefined();
  });

  it('Should generate a signed Standing Pretrial Order for REGULAR cases', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      docketNumber: '102-20', // MOCK_CASE with procedureType: 'Regular'
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateStandingPretrialOrderInteractor,
    ).toHaveBeenCalled();
    expect(findStandingPretrialDocument(calendaredCases[0])).toMatchObject({
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
    expect(findStandingPretrialDocument(calendaredCases[1]).eventCode).toBe(
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
      findStandingPretrialDocument(calendaredCases[0]).servedAt,
    ).toBeDefined();
    expect(
      findStandingPretrialDocument(calendaredCases[1]).servedAt,
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
      findStandingPretrialDocument(calendaredCases[0]).servedAt,
    ).toBeTruthy();
    expect(
      findStandingPretrialDocument(calendaredCases[1]).servedAt,
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
      findStandingPretrialDocument(calendaredCases[0]).servedParties.length,
    ).toBeGreaterThan(0);
    expect(
      findStandingPretrialDocument(calendaredCases[1]).servedParties.length,
    ).toBeGreaterThan(0);
  });
});
