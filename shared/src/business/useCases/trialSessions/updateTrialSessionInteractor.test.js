const faker = require('faker');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  ROLES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  updateTrialSessionInteractor,
} = require('./updateTrialSessionInteractor');
const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

describe('updateTrialSessionInteractor', () => {
  let mockTrialsById;
  let user;

  const MOCK_TRIAL = {
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionType: 'Regular',
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  const MOCK_TRIAL_ID_1 = '8a3ed061-bdc6-44f0-baec-7e2c007c51bb';
  const MOCK_TRIAL_ID_2 = '84949ffd-9aed-4595-b6af-ff91ea01112b';
  const MOCK_TRIAL_ID_3 = '76cfdfee-795a-4056-a383-8622e5d527d1';
  const MOCK_TRIAL_ID_4 = '195bd58c-e81e-44b5-90e2-b9f0a39575d6';
  const MOCK_TRIAL_ID_5 = '5674b900-517d-4ffc-81c0-140302c10010';
  const MOCK_TRIAL_ID_6 = 'd0293e71-155d-4cdd-9f3d-b21a72b64e51';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
      });
    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
      });
  });

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
        caseOrder: [{ docketNumber: '123-45' }],
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
      updateTrialSessionInteractor(applicationContext, {
        trialSession: MOCK_TRIAL,
      }),
    ).rejects.toThrow();
  });

  it('throws an error if the trial session start date has passed', async () => {
    await expect(
      updateTrialSessionInteractor(applicationContext, {
        trialSession: mockTrialsById[MOCK_TRIAL_ID_1],
      }),
    ).rejects.toThrow();
  });

  it('throws an exception when it fails to update a trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockImplementation(() => {
        throw new Error('Error!');
      });

    await expect(
      updateTrialSessionInteractor(applicationContext, {
        trialSession: MOCK_TRIAL,
      }),
    ).rejects.toThrow();
  });

  it('updates a trial session successfully', async () => {
    await updateTrialSessionInteractor(applicationContext, {
      trialSession: mockTrialsById[MOCK_TRIAL_ID_2],
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('creates a trial session working copy successfully if a judge is set on the updated trial session and a judge was not set on the old session', async () => {
    const trialSessionWithJudge = {
      ...mockTrialsById[MOCK_TRIAL_ID_2],
      judge: {
        name: 'Judge Goodman',
        userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      },
    };

    await updateTrialSessionInteractor(applicationContext, {
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
      judge: {
        name: 'Judge North',
        userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      }, // different judge id
    };

    await updateTrialSessionInteractor(applicationContext, {
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
      trialClerk: {
        name: 'Clerk McIntosh',
        userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      },
    };

    await updateTrialSessionInteractor(applicationContext, {
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
      trialClerk: {
        name: 'Clerk Magni',
        userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      }, // different trial clerk id
    };

    await updateTrialSessionInteractor(applicationContext, {
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

  it('should update the hearing mapping with new trial session info when a hearing trialSessionId matches the case.trialSessionId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...MOCK_CASE,
        docketNumber: '123-45',
        hearings: [mockTrialsById[MOCK_TRIAL_ID_4]],
        trialDate: '2045-12-01T00:00:00.000Z',
      });

    const calendaredTrialSession = {
      ...mockTrialsById[MOCK_TRIAL_ID_4],
      judge: { name: 'Shoeless Joe Jackson', userId: faker.datatype.uuid() },
    };

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: calendaredTrialSession,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCaseHearing.mock
        .calls[0][0],
    ).toMatchObject({
      applicationContext,
      docketNumber: '123-45',
      hearingToUpdate: calendaredTrialSession,
    });
  });

  it('should update the calendared case with new trial session info when the trialSessionId matches the case.trialSessionId', async () => {
    const mockCalendaredCase = new Case(
      {
        ...MOCK_CASE,
        docketNumber: '123-45',
        trialDate: '2045-12-01T00:00:00.000Z',
        trialSessionId: MOCK_TRIAL_ID_4,
      },
      { applicationContext },
    );
    const calendaredTrialSession = {
      ...mockTrialsById[MOCK_TRIAL_ID_4],
      startDate: '2025-12-02T00:00:00.000Z',
    };
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCalendaredCase.toRawObject());
    mockCalendaredCase.updateTrialSessionInformation(MOCK_TRIAL);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...calendaredTrialSession,
        startDate: '2025-12-02T00:00:00.000Z',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      trialDate: '2025-12-02T00:00:00.000Z',
    });
  });

  it('updates editable fields', async () => {
    const updatedFields = {
      address1: '123 Main St',
      address2: 'Apt 234',
      chambersPhoneNumber: '111111',
      city: 'Somewhere',
      courtReporter: 'Someone Reporter',
      courthouseName: 'The Courthouse',
      irsCalendarAdministrator: 'Admin',
      joinPhoneNumber: '22222',
      judge: {
        name: 'Judge Buch',
        userId: '96bf390d-7418-41a3-b411-f1d8d89fb3d8',
      },
      maxCases: 1,
      meetingId: '333333',
      notes: 'some notes',
      password: '444444',
      postalCode: '12345',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: SESSION_TYPES.motionHearing,
      startDate: '2025-12-02T00:00:00.000Z',
      startTime: '10:00',
      state: 'TN',
      swingSession: true,
      swingSessionId: '70fa4d58-0ade-4e22-95e2-a98322f999b5',
      term: 'Spring',
      termYear: '2021',
      trialClerk: {
        name: 'The Clerk',
        userId: '200d96ac-7edc-407d-a3a7-a3e7db78b881',
      },
      trialLocation: 'Boise, Idaho',
    };

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...mockTrialsById[MOCK_TRIAL_ID_6],
        ...updatedFields,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...mockTrialsById[MOCK_TRIAL_ID_6],
      ...updatedFields,
    });
  });

  it('should not update the calendared case with new trial session info when the trialSessionId does NOT match the case.trialSessionId', async () => {
    const calendaredTrialSession = {
      ...mockTrialsById[MOCK_TRIAL_ID_4],
      startDate: '2025-12-02T00:00:00.000Z',
    };
    const mockCalendaredCase = new Case(
      {
        ...MOCK_CASE,
        docketNumber: '123-45',
        hearings: [calendaredTrialSession],
        trialSessionId: MOCK_TRIAL_ID_3,
      },
      { applicationContext },
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCalendaredCase.toRawObject());
    mockCalendaredCase.updateTrialSessionInformation(MOCK_TRIAL);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...calendaredTrialSession,
        startDate: '2025-12-02T00:00:00.000Z',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it('does not update non-editable fields', async () => {
    await updateTrialSessionInteractor(applicationContext, {
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
