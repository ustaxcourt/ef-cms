const fs = require('fs');
const path = require('path');
const {
  appendPaperServiceAddressPageToPdf,
} = require('../../useCaseHelper/service/appendPaperServiceAddressPageToPdf');
const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('./setNoticesForCalendaredTrialSessionInteractor');
const { Document } = require('../../entities/Document');
const { formatDateString, formatNow } = require('../../utilities/DateHandler');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

const findNoticeOfTrial = caseRecord => {
  return caseRecord.documents.find(
    document => document.documentType === Document.NOTICE_OF_TRIAL.documentType,
  );
};

const findStandingPretrialDocument = caseRecord => {
  return caseRecord.documents.find(
    document =>
      document.documentType ===
        Document.STANDING_PRETRIAL_NOTICE.documentType ||
      document.documentType === Document.STANDING_PRETRIAL_ORDER.documentType,
  );
};

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');

const testPdfDocBytes = () => {
  // sample.pdf is a 1 page document
  return fs.readFileSync(testAssetsPath + 'sample.pdf');
};

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
};

const testPdfDoc = testPdfDocBytes();

let applicationContext;
let calendaredCases;
let generateNoticeOfTrialIssuedInteractorMock = jest.fn();
let generateStandingPretrialNoticeInteractorMock = jest.fn();
let generateStandingPretrialOrderInteractorMock = jest.fn();
let generatePaperServiceAddressPagePdfMock = jest
  .fn()
  .mockResolvedValue(testPdfDoc);
let saveDocumentFromLambdaMock = jest.fn();
let updateTrialSessionMock = jest.fn();
let sendServedPartiesEmailsMock = jest.fn();
let trialSession;

describe('setNoticesForCalendaredTrialSessionInteractor', () => {
  beforeEach(() => {
    jest.clearAllMocks();

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

    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getNotificationGateway: () => ({
        sendNotificationToUser: () => null,
      }),
      getPersistenceGateway: () => ({
        deleteCaseTrialSortMappingRecords: () => {},
        getCalendaredCasesForTrialSession: () => calendaredCases,
        getDownloadPolicyUrl: () => 'http://example.com',
        getTrialSessionById: () => trialSession,
        saveDocumentFromLambda: saveDocumentFromLambdaMock,
        updateCase: ({ caseToUpdate }) => {
          calendaredCases.some((caseRecord, index) => {
            if (caseRecord.caseId === caseToUpdate.caseId) {
              calendaredCases[index] = caseToUpdate;
              return true;
            }
          });
        },
        updateTrialSession: ({ trialSessionToUpdate }) => {
          updateTrialSessionMock();
          trialSession = trialSessionToUpdate;
        },
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCaseHelpers: () => ({
        appendPaperServiceAddressPageToPdf,
        generatePaperServiceAddressPagePdf: generatePaperServiceAddressPagePdfMock,
        sendServedPartiesEmails: sendServedPartiesEmailsMock,
      }),
      getUseCases: () => ({
        generateNoticeOfTrialIssuedInteractor: () => {
          generateNoticeOfTrialIssuedInteractorMock();
          return fakeFile;
        },
        generateStandingPretrialNoticeInteractor: () => {
          generateStandingPretrialNoticeInteractorMock();
          return fakeFile;
        },
        generateStandingPretrialOrderInteractor: () => {
          generateStandingPretrialOrderInteractorMock();
          return fakeFile;
        },
      }),
      getUtilities: () => ({
        formatDateString,
        formatNow,
      }),
    };
  });

  it('Should return an unauthorized error if the user does not have the TRIAL_SESSIONS permission', async () => {
    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'Petitioner',
        role: User.ROLES.petitioner, // Petitioners do not have the TRIAL_SESSIONS role, per authorizationClientService.js
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };

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
    applicationContext.getPersistenceGateway = () => ({
      getCalendaredCasesForTrialSession: () => [], // returning no cases
    });

    const result = await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(generateNoticeOfTrialIssuedInteractorMock).not.toHaveBeenCalled();
    expect(saveDocumentFromLambdaMock).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('Should generate a Notice of Trial for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(generateNoticeOfTrialIssuedInteractorMock).toHaveBeenCalled();
    expect(saveDocumentFromLambdaMock).toHaveBeenCalled();

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
        entry => entry.description === Document.NOTICE_OF_TRIAL.documentType,
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

    expect(generateNoticeOfTrialIssuedInteractorMock).toHaveBeenCalled();
    expect(saveDocumentFromLambdaMock).toHaveBeenCalled();

    expect(findNoticeOfTrial(calendaredCases[0]).status).toEqual('served');
    expect(findNoticeOfTrial(calendaredCases[1]).status).toEqual('served');
  });

  it('Should set the servedAt field for the Notice of Trial for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(generateNoticeOfTrialIssuedInteractorMock).toHaveBeenCalled();
    expect(saveDocumentFromLambdaMock).toHaveBeenCalled();

    expect(findNoticeOfTrial(calendaredCases[0]).servedAt).toBeTruthy();
    expect(findNoticeOfTrial(calendaredCases[1]).servedAt).toBeTruthy();
  });

  it('Should set the servedParties field for the Notice of Trial for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(generateNoticeOfTrialIssuedInteractorMock).toHaveBeenCalled();
    expect(saveDocumentFromLambdaMock).toHaveBeenCalled();

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

    expect(sendServedPartiesEmailsMock).toHaveBeenCalled();
  });

  it('Should set the noticeIssuedDate on the trial session and then call updateTrialSession', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(trialSession.noticeIssuedDate).toBeTruthy();
    expect(updateTrialSessionMock).toHaveBeenCalled();
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
    expect(updateTrialSessionMock).not.toHaveBeenCalled();
  });

  it('Should only generate a Notice of Trial for a single case if a caseId is set', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      caseId: '111aa3f7-e2e3-43e6-885d-4ce341588111',
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(generateNoticeOfTrialIssuedInteractorMock).toHaveBeenCalled();
    expect(saveDocumentFromLambdaMock).toHaveBeenCalled();

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
        entry => entry.description === Document.NOTICE_OF_TRIAL.documentType,
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

    expect(generateNoticeOfTrialIssuedInteractorMock).toHaveBeenCalled();
    expect(saveDocumentFromLambdaMock).toHaveBeenCalled();

    expect(findNoticeOfTrial(calendaredCases[0])).toBeFalsy(); // Document should not exist on this case
    expect(findNoticeOfTrial(calendaredCases[1]).status).toEqual('served');
  });

  it('Should generate a Standing Pretrial Order for REGULAR cases', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      caseId: '000aa3f7-e2e3-43e6-885d-4ce341588000', // MOCK_CASE with procedureType: 'Regular'
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(generateStandingPretrialOrderInteractorMock).toHaveBeenCalled();
  });

  it('Should generate a Standing Pretrial Notice for SMALL cases', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      caseId: '111aa3f7-e2e3-43e6-885d-4ce341588111', // MOCK_CASE with procedureType: 'Small'
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(generateStandingPretrialNoticeInteractorMock).toHaveBeenCalled();
  });

  it('Should set the status of the Standing Pretrial Document as served for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(generateNoticeOfTrialIssuedInteractorMock).toHaveBeenCalled();
    expect(saveDocumentFromLambdaMock).toHaveBeenCalled();

    expect(findStandingPretrialDocument(calendaredCases[0]).status).toEqual(
      'served',
    );
    expect(findStandingPretrialDocument(calendaredCases[1]).status).toEqual(
      'served',
    );
  });

  it('Should set the servedAt field for the Standing Pretrial Document for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(generateNoticeOfTrialIssuedInteractorMock).toHaveBeenCalled();
    expect(saveDocumentFromLambdaMock).toHaveBeenCalled();

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

    expect(generateNoticeOfTrialIssuedInteractorMock).toHaveBeenCalled();
    expect(saveDocumentFromLambdaMock).toHaveBeenCalled();

    expect(
      findStandingPretrialDocument(calendaredCases[0]).servedParties.length,
    ).toBeGreaterThan(0);
    expect(
      findStandingPretrialDocument(calendaredCases[1]).servedParties.length,
    ).toBeGreaterThan(0);
  });
});
