import { applicationContext } from '../../test/createTestApplicationContext';
import { setForHearingInteractor } from './setForHearingInteractor';
const {
  MOCK_CASE,
  MOCK_CASE_WITH_TRIAL_SESSION,
} = require('../../../test/mockCase');
const {
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');

describe('setForHearingInteractor', () => {
  let mockCurrentUser;
  let mockTrialSession;
  let mockCase;

  const MOCK_TRIAL = {
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionType: 'Regular',
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  beforeEach(() => {
    mockCurrentUser = {
      role: ROLES.docketClerk,
      userId: '8675309b-18d0-43ec-bafb-654e83405411',
    };

    mockTrialSession = MOCK_TRIAL;

    mockCase = MOCK_CASE;

    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => mockTrialSession);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    mockCurrentUser = {
      role: ROLES.petitioner,
      userId: '8675309b-18d0-43ec-bafb-654e83405411',
    };

    await expect(
      setForHearingInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an error if the case is not calendared', async () => {
    mockCase = {
      ...MOCK_CASE_WITH_TRIAL_SESSION,
    };

    await expect(
      setForHearingInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        isHearing: true,
        trialSessionId: MOCK_CASE_WITH_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow('That Hearing is already assigned to the Case');
  });

  it('successfully adds the trial session hearing', async () => {
    mockCase = {
      ...MOCK_CASE_WITH_TRIAL_SESSION,
    };

    applicationContext.getUniqueId.mockReturnValue(
      '8675309b-18d0-43ec-bafb-654e83405411',
    );

    await setForHearingInteractor(applicationContext, {
      docketNumber: mockCase.docketNumber,
      isHearing: true,
      trialSessionId: '8675309b-18d0-43ec-bafb-654e83405412',
    });

    expect(
      applicationContext.getPersistenceGateway().addCaseToHearing,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().addCaseToHearing.mock
        .calls[0][0],
    ).toEqual(
      expect.objectContaining({
        applicationContext: expect.anything(),
        docketNumber: mockCase.docketNumber,
        trialSession: expect.objectContaining({
          trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
        }),
      }),
    );
  });

  it('successfully adds the trial session hearing with calendarNotes', async () => {
    mockCase = {
      ...MOCK_CASE_WITH_TRIAL_SESSION,
    };

    applicationContext.getUniqueId.mockReturnValue(
      '8675309b-18d0-43ec-bafb-654e83405411',
    );

    await setForHearingInteractor(applicationContext, {
      calendarNotes: 'this is a calendarNote',
      docketNumber: mockCase.docketNumber,
      isHearing: true,
      trialSessionId: '8675309b-18d0-43ec-bafb-654e83405412',
    });

    expect(
      applicationContext.getPersistenceGateway().addCaseToHearing,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().addCaseToHearing.mock
        .calls[0][0],
    ).toEqual(
      expect.objectContaining({
        applicationContext: expect.anything(),
        docketNumber: mockCase.docketNumber,
        trialSession: expect.objectContaining({
          caseOrder: expect.arrayContaining([
            expect.objectContaining({
              calendarNotes: 'this is a calendarNote',
              docketNumber: mockCase.docketNumber,
            }),
          ]),
          trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
        }),
      }),
    );
  });
});
