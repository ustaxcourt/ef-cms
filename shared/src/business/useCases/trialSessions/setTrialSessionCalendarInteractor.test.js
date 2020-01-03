const sinon = require('sinon');
const {
  setTrialSessionCalendarInteractor,
} = require('./setTrialSessionCalendarInteractor');
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

let generateNoticeOfTrialIssuedInteractorMock;
let saveDocumentMock;

describe('setTrialSessionCalendarInteractor', () => {
  let applicationContext;

  beforeEach(() => {
    generateNoticeOfTrialIssuedInteractorMock = jest.fn();
    saveDocumentMock = jest.fn();
  });

  it('throws an exception when there is a permissions issue', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Petitioner',
          role: User.ROLES.petitioner,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        deleteCaseTrialSortMappingRecords: () => {},
        getEligibleCasesForTrialSession: () => [MOCK_CASE],
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

    let error;

    try {
      await setTrialSessionCalendarInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('should set a trial session to "calendared"', async () => {
    let updateTrialSession = sinon.spy();
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
            caseId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
            docketNumber: '102-19',
          },
        ],
        getEligibleCasesForTrialSession: () => [MOCK_CASE],
        getTrialSessionById: () => MOCK_TRIAL,
        saveDocument: saveDocumentMock,
        updateCase: () => {},
        updateTrialSession,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCases: () => ({
        generateNoticeOfTrialIssuedInteractor: generateNoticeOfTrialIssuedInteractorMock,
      }),
    };

    let error;

    try {
      await setTrialSessionCalendarInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }
    expect(updateTrialSession.called).toEqual(true);
    expect(error).toBeUndefined();
  });

  it('should generate a Notice of Trial and add it to the case', async () => {
    let calendaredCase = {
      ...MOCK_CASE,
      caseId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
      docketNumber: '102-19',
    };

    let eligibleCase = { ...MOCK_CASE };

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
        getCalendaredCasesForTrialSession: () => [calendaredCase],
        getEligibleCasesForTrialSession: () => [eligibleCase],
        getTrialSessionById: () => MOCK_TRIAL,
        saveDocument: saveDocumentMock,
        updateCase: () => {},
        updateTrialSession: jest.fn(),
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCases: () => ({
        generateNoticeOfTrialIssuedInteractor: generateNoticeOfTrialIssuedInteractorMock,
      }),
    };

    await setTrialSessionCalendarInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(generateNoticeOfTrialIssuedInteractorMock).toHaveBeenCalled();
    expect(saveDocumentMock).toHaveBeenCalled();
  });
});
