const {
  setNoticesForCalendaredTrialSessionInteractor,
} = require('./setNoticesForCalendaredTrialSessionInteractor');
const { Document } = require('../../entities/Document');
const { User } = require('../../entities/User');

const { MOCK_CASE } = require('../../../test/mockCase');

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, AL',
};

let applicationContext;
let generateNoticeOfTrialIssuedInteractorMock;
let saveDocumentMock;

describe('setNoticesForCalendaredTrialSessionInteractor', () => {
  beforeEach(() => {
    generateNoticeOfTrialIssuedInteractorMock = jest.fn();
    saveDocumentMock = jest.fn();

    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        deleteCaseTrialSortMappingRecords: () => {},
        getCalendaredCasesForTrialSession: () => [
          {
            ...MOCK_CASE,
            caseId: '000aa3f7-e2e3-43e6-885d-4ce341588000',
            docketNumber: '102-20',
          },
          {
            ...MOCK_CASE,
            caseId: '111aa3f7-e2e3-43e6-885d-4ce341588111',
            docketNumber: '103-20',
          },
        ],
        getTrialSessionById: () => MOCK_TRIAL,
        saveDocument: saveDocumentMock,
        updateCase: () => {},
        updateTrialSession: () => {},
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCases: () => ({
        generateNoticeOfTrialIssuedInteractor: generateNoticeOfTrialIssuedInteractorMock,
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
    const result = await setNoticesForCalendaredTrialSessionInteractor({
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

    expect(findNoticeOfTrial(result[0])).toBeTruthy();
    expect(findNoticeOfTrial(result[1])).toBeTruthy();
  });

  it('Should set the noticeOfTrialDate field on each case', async () => {
    const result = await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(result[0]).toHaveProperty('noticeOfTrialDate');
    expect(result[1]).toHaveProperty('noticeOfTrialDate');
  });

  it('Should create a docket entry for each case', async () => {
    const result = await setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const findNoticeOfTrialDocketEntry = caseRecord => {
      return caseRecord.docketRecord.find(
        entry => entry.description === Document.NOTICE_OF_TRIAL.documentType,
      );
    };

    expect(findNoticeOfTrialDocketEntry(result[0])).toBeTruthy();
    expect(findNoticeOfTrialDocketEntry(result[1])).toBeTruthy();
  });
});
