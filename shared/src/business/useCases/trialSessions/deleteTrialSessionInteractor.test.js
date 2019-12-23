const {
  deleteTrialSessionInteractor,
} = require('./deleteTrialSessionInteractor');
const { User } = require('../../entities/User');

const { MOCK_CASE } = require('../../../test/mockCase');

const MOCK_TRIAL = {
  caseOrder: [{ caseId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb' }],
  judge: {
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  },
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2001-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, AL',
  trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
};

describe('deleteTrialSessionInteractor', () => {
  let applicationContext;

  it('throws error if user is unauthorized', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => ({}),
    };
    await expect(
      deleteTrialSessionInteractor({
        applicationContext,
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an exception when it fails to find a trial session', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        getTrialSessionById: () => null,
      }),
    };

    await expect(
      deleteTrialSessionInteractor({
        applicationContext,
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('trial session not found');
  });

  it('throws error when trial session start date is past now', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        getTrialSessionById: () => ({
          ...MOCK_TRIAL,
        }),
      }),
      getUtilities: () => ({
        createISODateString: () => '2050-12-01T00:00:00.000Z',
      }),
    };

    await expect(
      deleteTrialSessionInteractor({
        applicationContext,
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Trial session cannot be updated after its start date');
  });

  it('deletes the trial session and invokes expected persistence methods', async () => {
    const deleteTrialSessionWorkingCopySpy = jest.fn();
    const deleteTrialSessionSpy = jest.fn();
    const updateCaseSpy = jest.fn();
    const createCaseTrialSortMappingRecordsSpy = jest.fn();

    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createCaseTrialSortMappingRecords: createCaseTrialSortMappingRecordsSpy,
        deleteTrialSession: deleteTrialSessionSpy,
        deleteTrialSessionWorkingCopy: deleteTrialSessionWorkingCopySpy,
        getCaseByCaseId: () => MOCK_CASE,
        getTrialSessionById: () => ({
          ...MOCK_TRIAL,
          startDate: '2100-12-01T00:00:00.000Z',
        }),
        updateCase: updateCaseSpy,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUtilities: () => ({
        createISODateString: () => '2050-12-01T00:00:00.000Z',
      }),
    };

    await deleteTrialSessionInteractor({
      applicationContext,
      trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(deleteTrialSessionWorkingCopySpy).toBeCalled();
    expect(deleteTrialSessionSpy).toBeCalled();
    expect(createCaseTrialSortMappingRecordsSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
  });
});
