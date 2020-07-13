const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateTrialSessionInteractor,
} = require('./updateTrialSessionInteractor');
const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
};

let mockTrialsById;
let user;

describe('updateTrialSessionInteractor', () => {
  const MOCK_TRIAL_ID_1 = '8a3ed061-bdc6-44f0-baec-7e2c007c51bb';
  const MOCK_TRIAL_ID_2 = '84949ffd-9aed-4595-b6af-ff91ea01112b';
  const MOCK_TRIAL_ID_3 = '76cfdfee-795a-4056-a383-8622e5d527d1';
  const MOCK_TRIAL_ID_4 = '195bd58c-e81e-44b5-90e2-b9f0a39575d6';
  const MOCK_TRIAL_ID_5 = '5674b900-517d-4ffc-81c0-140302c10010';
  const MOCK_TRIAL_ID_6 = 'd0293e71-155d-4cdd-9f3d-b21a72b64e51';

  beforeEach(() => {
    mockTrialsById = {
      [MOCK_TRIAL_ID_1]: {
        ...MOCK_TRIAL,
        startDate: '2019-12-01T00:00:00.000Z',
        trialSessionId: MOCK_TRIAL_ID_1,
      },
      [MOCK_TRIAL_ID_2]: {
        ...MOCK_TRIAL,
        trialSessionId: MOCK_TRIAL_ID_2,
      },
      [MOCK_TRIAL_ID_3]: {
        ...MOCK_TRIAL,
        judge: { userId: 'd7d90c05-f6cd-442c-a168-202db587f16f' },
        trialSessionId: MOCK_TRIAL_ID_3,
      },
      [MOCK_TRIAL_ID_4]: {
        ...MOCK_TRIAL,
        caseOrder: [{ caseId: 'cff9429c-6ce7-469f-addc-4eb3591fc9fc' }],
        trialSessionId: MOCK_TRIAL_ID_4,
      },
      [MOCK_TRIAL_ID_5]: {
        ...MOCK_TRIAL,
        judge: { userId: 'd7d90c05-f6cd-442c-a168-202db587f16f' },
        trialSessionId: MOCK_TRIAL_ID_5,
      },
      [MOCK_TRIAL_ID_6]: {
        ...MOCK_TRIAL,
        isCalendared: false,
        judge: { userId: 'd7d90c05-f6cd-442c-a168-202db587f16f' },
        trialSessionId: MOCK_TRIAL_ID_6,
      },
    };

    applicationContext.environment.stage = 'local';

    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockImplementation(() => user);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(
        ({ trialSessionId }) => mockTrialsById[trialSessionId],
      );

    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockImplementation(trial => trial.trialSession);
  });

  it('throws error if user is unauthorized', async () => {
    user = new User({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      updateTrialSessionInteractor({
        applicationContext,
        trialSession: MOCK_TRIAL,
      }),
    ).rejects.toThrow();
  });

  it('throws an error if the trial session start date has passed', async () => {
    let error;

    try {
      await updateTrialSessionInteractor({
        applicationContext,
        trialSession: mockTrialsById[MOCK_TRIAL_ID_1],
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('throws an exception when it fails to update a trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockImplementation(() => {
        throw new Error('Error!');
      });

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
    await updateTrialSessionInteractor({
      applicationContext,
      trialSession: mockTrialsById[MOCK_TRIAL_ID_2],
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('creates a trial session working copy successfully if a judge is set on the updated trial session and a judge was not set on the old session', async () => {
    const trialSessionWithJudge = {
      ...mockTrialsById[MOCK_TRIAL_ID_2],
      judge: { userId: 'c7d90c05-f6cd-442c-a168-202db587f16f' },
    };

    await updateTrialSessionInteractor({
      applicationContext,
      trialSession: trialSessionWithJudge,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
  });

  it('creates a trial session working copy successfully if a judge is set on the updated trial session and it is a different judge than was on the old session', async () => {
    const trialSessionWithJudge = {
      ...mockTrialsById[MOCK_TRIAL_ID_3],
      judge: { userId: 'c7d90c05-f6cd-442c-a168-202db587f16f' }, // different judge id
    };

    await updateTrialSessionInteractor({
      applicationContext,
      trialSession: trialSessionWithJudge,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
  });

  it('creates a trial session working copy successfully if a trial clerk is set on the updated trial session and a trial clerk was not set on the old session', async () => {
    const trialSessionWithTrialClerk = {
      ...mockTrialsById[MOCK_TRIAL_ID_2],
      trialClerk: { userId: 'c7d90c05-f6cd-442c-a168-202db587f16f' },
    };

    await updateTrialSessionInteractor({
      applicationContext,
      trialSession: trialSessionWithTrialClerk,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy
        .mock.calls[0][0].trialSessionWorkingCopy.userId,
    ).toEqual('c7d90c05-f6cd-442c-a168-202db587f16f');
  });

  it('creates a trial session working copy successfully if a trial clerk is set on the updated trial session and it is a different trial clerk than was on the old session', async () => {
    const trialSessionWithTrialClerk = {
      ...mockTrialsById[MOCK_TRIAL_ID_5],
      trialClerk: { userId: 'c7d90c05-f6cd-442c-a168-202db587f16f' }, // different trial clerk id
    };

    await updateTrialSessionInteractor({
      applicationContext,
      trialSession: trialSessionWithTrialClerk,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy
        .mock.calls[0][0].trialSessionWorkingCopy.userId,
    ).toEqual('c7d90c05-f6cd-442c-a168-202db587f16f');
  });

  it('updates calendared case with new trial session info', async () => {
    const persistenceGateway = applicationContext.getPersistenceGateway();
    applicationContext.getPersistenceGateway = () => ({
      ...persistenceGateway,
      getCaseByCaseId: () => mockCalendaredCase.toRawObject(),
      updateCase: updateCaseMock,
    });

    const calendaredTrialSession = {
      ...mockTrialsById[MOCK_TRIAL_ID_4],
      startDate: '2025-12-02T00:00:00.000Z',
    };

    const updateCaseMock = jest.fn();
    const mockCalendaredCase = new Case(
      { ...MOCK_CASE, caseId: 'cff9429c-6ce7-469f-addc-4eb3591fc9fc' },
      { applicationContext },
    );

    mockCalendaredCase.setAsCalendared(MOCK_TRIAL);

    await updateTrialSessionInteractor({
      applicationContext,
      trialSession: {
        ...calendaredTrialSession,
        startDate: '2025-12-02T00:00:00.000Z',
      },
    });

    expect(updateCaseMock).toHaveBeenCalled();
    expect(updateCaseMock.mock.calls[0][0].caseToUpdate).toMatchObject({
      trialDate: '2025-12-02T00:00:00.000Z',
    });
  });

  it('does not update non-editable fields', async () => {
    await updateTrialSessionInteractor({
      applicationContext,
      trialSession: {
        ...mockTrialsById[MOCK_TRIAL_ID_6],
        isCalendared: true,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate.isCalendared,
    ).toEqual(false);
  });
});
