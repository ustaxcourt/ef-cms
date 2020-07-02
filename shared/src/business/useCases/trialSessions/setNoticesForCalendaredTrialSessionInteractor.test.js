const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  NOTICE_OF_TRIAL,
  STANDING_PRETRIAL_NOTICE,
  STANDING_PRETRIAL_ORDER,
} = require('../../entities/EntityConstants');
const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('./setNoticesForCalendaredTrialSessionInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { PARTY_TYPES, ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

const findNoticeOfTrial = caseRecord => {
  return caseRecord.documents.find(
    document => document.documentType === NOTICE_OF_TRIAL.documentType,
  );
};

const findStandingPretrialDocument = caseRecord => {
  return caseRecord.documents.find(
    document =>
      document.documentType === STANDING_PRETRIAL_NOTICE.documentType ||
      document.documentType === STANDING_PRETRIAL_ORDER.documentType,
  );
};

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const MOCK_TRIAL = {
  maxCases: 100,
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
  beforeEach(() => {
    const case0 = {
      // should get electronic service
      ...MOCK_CASE,
      caseId: '000aa3f7-e2e3-43e6-885d-4ce341588000',
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
      caseId: '111aa3f7-e2e3-43e6-885d-4ce341588111',
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
          if (caseRecord.caseId === caseToUpdate.caseId) {
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
      .generateStandingPretrialNoticeInteractor.mockReturnValue(fakeData);
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
      await setNoticesForCalendaredTrialSessionInteractor({
        applicationContext,
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

    const result = await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateNoticeOfTrialIssuedInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('Should generate a Notice of Trial for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
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

  it('Should set the noticeOfTrialDate field on each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(calendaredCases[0]).toHaveProperty('noticeOfTrialDate');
    expect(calendaredCases[1]).toHaveProperty('noticeOfTrialDate');
  });

  it('Should create a docket entry for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const findNoticeOfTrialDocketEntry = caseRecord => {
      return caseRecord.docketRecord.find(
        entry => entry.description === NOTICE_OF_TRIAL.documentType,
      );
    };

    expect(findNoticeOfTrialDocketEntry(calendaredCases[0])).toBeTruthy();
    expect(findNoticeOfTrialDocketEntry(calendaredCases[1])).toBeTruthy();
  });

  it('Should set the status of the Notice of Trial as served for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
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
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
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
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
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
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
  });

  it('Should set the noticeIssuedDate on the trial session and then call updateTrialSession', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(trialSession.noticeIssuedDate).toBeTruthy();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('Should NOT overwrite the noticeIssuedDate on the trial session NOR call updateTrialSession if a caseId is set', async () => {
    const oldDate = '2019-12-01T00:00:00.000Z';
    trialSession.noticeIssuedDate = oldDate;

    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      caseId: '111aa3f7-e2e3-43e6-885d-4ce341588111',
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(trialSession.noticeIssuedDate).toEqual(oldDate); // Should not be updated
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).not.toHaveBeenCalled();
  });

  it('Should only generate a Notice of Trial for a single case if a caseId is set', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      caseId: '111aa3f7-e2e3-43e6-885d-4ce341588111',
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

  it('Should only set the notice for a single case if a caseId is set', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      caseId: '000aa3f7-e2e3-43e6-885d-4ce341588000',
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(calendaredCases[0]).toHaveProperty('noticeOfTrialDate');
    expect(calendaredCases[1]).not.toHaveProperty('noticeOfTrialDate');
  });

  it('Should only create a docket entry for a single case if a caseId is set', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      caseId: '111aa3f7-e2e3-43e6-885d-4ce341588111',
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const findNoticeOfTrialDocketEntry = caseRecord => {
      return caseRecord.docketRecord.find(
        entry => entry.description === NOTICE_OF_TRIAL.documentType,
      );
    };

    expect(findNoticeOfTrialDocketEntry(calendaredCases[0])).toBeFalsy();
    expect(findNoticeOfTrialDocketEntry(calendaredCases[1])).toBeTruthy();
  });

  it('Should set the status of the Notice of Trial as served for a single case if a caseId is set', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      caseId: '111aa3f7-e2e3-43e6-885d-4ce341588111',
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

  it('Should generate a Standing Pretrial Order for REGULAR cases', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      caseId: '000aa3f7-e2e3-43e6-885d-4ce341588000', // MOCK_CASE with procedureType: 'Regular'
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateStandingPretrialOrderInteractor,
    ).toHaveBeenCalled();
  });

  it('Should generate a Standing Pretrial Notice for SMALL cases', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      caseId: '111aa3f7-e2e3-43e6-885d-4ce341588111', // MOCK_CASE with procedureType: 'Small'
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getUseCases().generateStandingPretrialNoticeInteractor,
    ).toHaveBeenCalled();
  });

  it('Should set the status of the Standing Pretrial Document as served for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
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
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
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
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
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
