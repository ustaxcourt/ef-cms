const {
  updateTrialSessionInteractor,
} = require('./updateTrialSessionInteractor');
const { Case } = require('../../entities/cases/Case');
const { createISODateString } = require('../../utilities/DateHandler');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, AL',
};

describe('updateTrialSessionInteractor', () => {
  let applicationContext;

  beforeEach(() => {
    applicationContext = {
      environment: { stage: 'local' },
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUtilities: () => ({
        createISODateString,
      }),
    };
  });

  it('throws error if user is unauthorized', async () => {
    applicationContext = {
      ...applicationContext,
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => ({
        getTrialSessionById: () => {},
        updateTrialSession: () => {},
      }),
    };
    await expect(
      updateTrialSessionInteractor({
        applicationContext,
        trialSession: MOCK_TRIAL,
      }),
    ).rejects.toThrow();
  });

  it('throws an error if the trial session start date has passed', async () => {
    applicationContext = {
      ...applicationContext,
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
          startDate: '2019-12-01T00:00:00.000Z',
        }),
        updateTrialSession: () => {},
      }),
    };

    let error;

    try {
      await updateTrialSessionInteractor({
        applicationContext,
        trialSession: MOCK_TRIAL,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('throws an exception when it fails to update a trial session', async () => {
    applicationContext = {
      ...applicationContext,
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        getTrialSessionById: () => MOCK_TRIAL,
        updateTrialSession: () => {
          throw new Error('yup');
        },
      }),
    };

    let error;

    try {
      await updateTrialSessionInteractor({
        applicationContext,
        trialSession: MOCK_TRIAL,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('updates a trial session successfully', async () => {
    applicationContext = {
      ...applicationContext,
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        getTrialSessionById: () => MOCK_TRIAL,
        updateTrialSession: () => MOCK_TRIAL,
      }),
    };

    let error;

    try {
      await updateTrialSessionInteractor({
        applicationContext,
        trialSession: MOCK_TRIAL,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
  });

  it('creates a trial session working copy successfully if a judge is set on the updated trial session and a judge was not set on the old session', async () => {
    const trialSessionWithJudge = {
      ...MOCK_TRIAL,
      judge: { userId: 'c7d90c05-f6cd-442c-a168-202db587f16f' },
    };
    const createTrialSessionWorkingCopyMock = jest.fn();

    applicationContext = {
      ...applicationContext,
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSessionWorkingCopy: createTrialSessionWorkingCopyMock,
        getTrialSessionById: () => MOCK_TRIAL,
        updateTrialSession: () => trialSessionWithJudge,
      }),
    };

    let error;

    try {
      await updateTrialSessionInteractor({
        applicationContext,
        trialSession: trialSessionWithJudge,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(createTrialSessionWorkingCopyMock).toHaveBeenCalled();
  });

  it('creates a trial session working copy successfully if a judge is set on the updated trial session and it is a different judge than was on the old session', async () => {
    const trialSessionWithJudge = {
      ...MOCK_TRIAL,
      judge: { userId: 'c7d90c05-f6cd-442c-a168-202db587f16f' },
    };
    const createTrialSessionWorkingCopyMock = jest.fn();

    applicationContext = {
      ...applicationContext,
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSessionWorkingCopy: createTrialSessionWorkingCopyMock,
        getTrialSessionById: () => trialSessionWithJudge,
        updateTrialSession: () => ({
          ...trialSessionWithJudge,
          judge: { userId: '8a509fd8-d870-497b-a0fb-139e8b905710' },
        }),
      }),
    };

    let error;

    try {
      await updateTrialSessionInteractor({
        applicationContext,
        trialSession: {
          ...trialSessionWithJudge,
          judge: { userId: '8a509fd8-d870-497b-a0fb-139e8b905710' },
        },
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(createTrialSessionWorkingCopyMock).toHaveBeenCalled();
  });

  it('updates calendared case with new trial session info', async () => {
    const calendaredTrialSession = {
      ...MOCK_TRIAL,
      caseOrder: [{ caseId: 'cff9429c-6ce7-469f-addc-4eb3591fc9fc' }],
    };
    const updateCaseMock = jest.fn();
    const mockCalendaredCase = new Case(
      { ...MOCK_CASE, caseId: 'cff9429c-6ce7-469f-addc-4eb3591fc9fc' },
      { applicationContext },
    );
    mockCalendaredCase.setAsCalendared(MOCK_TRIAL);

    applicationContext = {
      ...applicationContext,
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSessionWorkingCopy: () => {},
        getCaseByCaseId: () => mockCalendaredCase.toRawObject(),
        getTrialSessionById: () => calendaredTrialSession,
        updateCase: updateCaseMock,
        updateTrialSession: () => calendaredTrialSession,
      }),
    };

    let error;

    try {
      await updateTrialSessionInteractor({
        applicationContext,
        trialSession: {
          ...calendaredTrialSession,
          startDate: '2025-12-02T00:00:00.000Z',
        },
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(updateCaseMock).toHaveBeenCalled();
    expect(updateCaseMock.mock.calls[0][0].caseToUpdate).toMatchObject({
      trialDate: '2025-12-02T00:00:00.000Z',
    });
  });
});
