const fs = require('fs');
const path = require('path');
import { formatNow } from '../../utilities/DateHandler';
const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('./setNoticesForCalendaredTrialSessionInteractor');
const { Document } = require('../../entities/Document');
const { User } = require('../../entities/User');

const { MOCK_CASE } = require('../../../test/mockCase');

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
  trialLocation: 'Birmingham, AL',
};

let applicationContext;
let calendaredCases;
let generateNoticeOfTrialIssuedInteractorMock;
let generatePaperServiceAddressPagePdfMock;
let saveDocumentMock;
let sendBulkTemplatedEmailMock;
let testPdfDoc;

describe('setNoticesForCalendaredTrialSessionInteractor', () => {
  beforeEach(() => {
    testPdfDoc = testPdfDocBytes();

    generateNoticeOfTrialIssuedInteractorMock = jest.fn();
    saveDocumentMock = jest.fn();
    sendBulkTemplatedEmailMock = jest.fn();

    generatePaperServiceAddressPagePdfMock = jest
      .fn()
      .mockResolvedValue(testPdfDoc);

    const case0 = {
      // should get electronic service
      ...MOCK_CASE,
      caseId: '000aa3f7-e2e3-43e6-885d-4ce341588000',
      contactPrimary: {
        ...MOCK_CASE.contactPrimary,
        email: 'petitioner@example.com',
      },
      docketNumber: '102-20',
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
    };

    calendaredCases = [case0, case1];

    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getDispatchers: () => ({
        sendBulkTemplatedEmail: sendBulkTemplatedEmailMock,
      }),
      getPersistenceGateway: () => ({
        deleteCaseTrialSortMappingRecords: () => {},
        getCalendaredCasesForTrialSession: () => calendaredCases,
        getTrialSessionById: () => MOCK_TRIAL,
        saveDocument: saveDocumentMock,
        updateCase: ({ caseToUpdate }) => {
          calendaredCases.some((caseRecord, index) => {
            if (caseRecord.caseId === caseToUpdate.caseId) {
              calendaredCases[index] = caseToUpdate;
              return true;
            }
          });
        },
        updateTrialSession: () => {},
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCaseHelpers: () => ({
        generatePaperServiceAddressPagePdf: generatePaperServiceAddressPagePdfMock,
      }),
      getUseCases: () => ({
        generateNoticeOfTrialIssuedInteractor: () => {
          generateNoticeOfTrialIssuedInteractorMock();
          return fakeFile;
        },
      }),
      getUtilities: () => ({
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

  it('Should generate a Notice of Trial for each case', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(generateNoticeOfTrialIssuedInteractorMock).toHaveBeenCalled();
    expect(saveDocumentMock).toHaveBeenCalled();

    const findNoticeOfTrial = caseRecord => {
      return caseRecord.documents.find(
        document =>
          document.documentType === Document.NOTICE_OF_TRIAL.documentType,
      );
    };

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

  it('Should dispatch a service email for parties receiving electronic service', async () => {
    await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(sendBulkTemplatedEmailMock).toHaveBeenCalled();
  });

  it('Should return data with paper service documents to be printed if there are parties that receive paper service', async () => {
    const result = await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(result).toBeDefined();
  });
});
