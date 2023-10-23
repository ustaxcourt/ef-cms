import { MOCK_CASE } from '../../../test/mockCase';
import {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_REMOTE,
} from '../../../test/mockTrial';
import {
  ROLES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../entities/EntityConstants';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { updateTrialSessionInteractor } from './updateTrialSessionInteractor';

describe('updateTrialSessionInteractor', () => {
  const mockUser = new User({
    name: 'Docket Clerk',
    role: ROLES.docketClerk,
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  });

  beforeAll(() => {
    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue({
        fileId: 'fef6cbf1-8589-46f9-a52e-285a21cac9b3',
        url: 'www.example.com',
      });
  });

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(mockUser);
    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockImplementation(trial => trial.trialSession);
  });

  it('should throw an error when user not unauthorized to update a trial session', async () => {
    const unauthedUser = new User({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext.getCurrentUser.mockReturnValue(unauthedUser);

    await expect(
      updateTrialSessionInteractor(applicationContext, {
        trialSession: MOCK_TRIAL_REMOTE,
      }),
    ).rejects.toThrow();
  });

  it('should throw an error when the trial session start date is in the past', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...MOCK_TRIAL_REMOTE,
        startDate: '1776-12-01',
      });

    await expect(
      updateTrialSessionInteractor(applicationContext, {
        trialSession: { ...MOCK_TRIAL_REMOTE, startDate: '1776-12-01' },
      }),
    ).rejects.toThrow('Trial session cannot be updated after its start date');
  });

  it('should throw an error when an error occurs while persisting the update to the trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockImplementation(() => {
        throw new Error('Error!');
      });

    await expect(
      updateTrialSessionInteractor(applicationContext, {
        trialSession: MOCK_TRIAL_REMOTE,
      }),
    ).rejects.toThrow();
  });

  it('should make a call to persistence to update the trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_INPERSON);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: MOCK_TRIAL_INPERSON,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('should NOT create a trial session working copy when the current trial session and the updated trial session do NOT have a judge assigned', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...MOCK_TRIAL_INPERSON,
        judge: undefined,
      });

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL_INPERSON,
        judge: undefined,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).not.toHaveBeenCalled();
  });

  it('should create a trial session working copy when the updated trial session has a judge assigned and a judge was not set on the old trial session', async () => {
    const mockTrialSessionWithJudge = {
      ...MOCK_TRIAL_INPERSON,
      judge: {
        name: 'Judge Dredd',
        userId: 'c6d57a35-0605-47bc-ab30-8903f047a379',
      },
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(mockTrialSessionWithJudge);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL_INPERSON,
        judge: {
          name: 'Judge Judy Judifer',
          userId: '65b74937-3edb-4220-b1e1-fdf7c9ace813',
        },
      },
    });

    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy
        .mock.calls[0][0].trialSessionWorkingCopy,
    ).toMatchObject({
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      userId: '65b74937-3edb-4220-b1e1-fdf7c9ace813',
    });
  });

  it('should create a trial session working copy when the updated trial session has judge assigned and they are a different judge than was on the old trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...MOCK_TRIAL_INPERSON,
        judge: {
          name: 'Judge South',
          userId: '7c062db4-ea1e-4a51-a615-9ef8d6499ed7',
        },
      });

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL_INPERSON,
        judge: {
          name: 'Judge North',
          userId: 'c7d90c05-f6cd-442c-a168-202db587f16f', // different judge id
        },
      },
    });

    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy
        .mock.calls[0][0].trialSessionWorkingCopy,
    ).toMatchObject({
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should create a trial session working copy when the updated trial session has a trial clerk assigned and a trial clerk was not set on the old trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...MOCK_TRIAL_INPERSON,
        trialClerk: undefined,
      });

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL_INPERSON,
        trialClerk: {
          name: 'Clerk McIntosh',
          userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
        },
      },
    });

    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy
        .mock.calls[0][0].trialSessionWorkingCopy,
    ).toMatchObject({
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should create a trial session working copy when the updated trial session has a trial clerk assigned and it is a different trial clerk than was on the old trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...MOCK_TRIAL_INPERSON,
        trialClerk: {
          name: 'Clerk Tom Haberford',
          userId: 'a2d6531c-93fb-432b-a71d-5ea11f953963',
        },
      });

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL_INPERSON,
        trialClerk: {
          name: 'Clerk Magni',
          userId: 'c7d90c05-f6cd-442c-a168-202db587f16f', // different trial clerk id
        },
      },
    });

    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy
        .mock.calls[0][0].trialSessionWorkingCopy,
    ).toMatchObject({
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should update the hearing associated with the updated trial session when a hearing trialSessionId matches the case.trialSessionId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        hearings: [MOCK_TRIAL_INPERSON],
      });

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_INPERSON);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: MOCK_TRIAL_INPERSON,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCaseHearing.mock
        .calls[0][0],
    ).toMatchObject({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      hearingToUpdate: MOCK_TRIAL_INPERSON,
    });
  });

  it('should update the calendared case with new trial session information when the trialSessionId matches the case.trialSessionId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        trialDate: MOCK_TRIAL_INPERSON.startDate,
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      });

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_INPERSON);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: MOCK_TRIAL_INPERSON,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      trialDate: MOCK_TRIAL_INPERSON.startDate,
    });
  });

  it('should update the fields that are editable on the trial session', async () => {
    const updatedFields = {
      address1: '123 Main St',
      address2: 'Apt 234',
      chambersPhoneNumber: '111111',
      city: 'Somewhere',
      courtReporter: 'Someone Reporter',
      courthouseName: 'The Courthouse',
      estimatedEndDate: '2025-12-03T00:00:00.000Z',
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

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_INPERSON);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL_INPERSON,
        ...updatedFields,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_INPERSON,
      ...updatedFields,
    });
  });

  it('should update the trial session when an alternateTrialClerkName is added and no trial clerk', async () => {
    const updatedFields = {
      alternateTrialClerkName: 'Incredible Hulk',
    };

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_INPERSON);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL_INPERSON,
        ...updatedFields,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_INPERSON,
      ...updatedFields,
    });
  });

  it('should NOT update fields that are NOT editable on the trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...MOCK_TRIAL_INPERSON,
        isCalendared: false,
      });

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL_INPERSON,
        isCalendared: true,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate.isCalendared,
    ).toEqual(false);
  });

  it('should NOT update the calendared case with new trial session info when the trialSessionId does NOT match the case.trialSessionId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        trialSessionId: '49990fd4-296e-4340-97e9-c66b6f25b6ab',
      });

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_INPERSON);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: MOCK_TRIAL_INPERSON,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it('should NOT retrieve any cases from persistence when the trial session does not have any cases assigned', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [],
      });

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: MOCK_TRIAL_INPERSON,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should NOT retrieve the case from persistence when it has been removed from the trial session', async () => {
    const mockCaseRemovedFromTrialDocketNumber = '321-56';

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_INPERSON);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [
          {
            docketNumber: mockCaseRemovedFromTrialDocketNumber,
            removedFromTrial: true,
          },
        ],
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalledWith({
      applicationContext,
      docketNumber: mockCaseRemovedFromTrialDocketNumber,
    });
  });

  it('should associate swing trial sessions when the current trial session has a swing session', async () => {
    const mockSwingSessionId = '06419775-e726-4c3b-a7e0-193d379fa39d';

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL_INPERSON,
        swingSession: true,
        swingSessionId: mockSwingSessionId,
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().associateSwingTrialSessions,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().associateSwingTrialSessions.mock
        .calls[0][1].swingSessionId,
    ).toEqual(mockSwingSessionId);
  });
});
