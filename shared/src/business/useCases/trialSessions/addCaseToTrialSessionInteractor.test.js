import { addCaseToTrialSessionInteractor } from './addCaseToTrialSessionInteractor';
import { applicationContext } from '../../test/createTestApplicationContext';
const {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  ROLES,
} = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('addCaseToTrialSessionInteractor', () => {
  let mockCurrentUser;
  let mockTrialSession;
  let mockCase;

  const MOCK_TRIAL = {
    maxCases: 100,
    sessionType: 'Regular',
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  beforeEach(() => {
    mockCurrentUser = {
      role: ROLES.petitionsClerk,
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
      addCaseToTrialSessionInteractor({
        applicationContext,
        docketNumber: mockCase.docketNumber,
        trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an error if the case is already calendared', async () => {
    mockCase = {
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.calendared,
    };

    await expect(
      addCaseToTrialSessionInteractor({
        applicationContext,
        docketNumber: mockCase.docketNumber,
        trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
      }),
    ).rejects.toThrow('The case is already calendared');
  });

  it('throws an error if the case is already part of the trial session', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL,
      caseOrder: [{ docketNumber: MOCK_CASE.docketNumber }],
      isCalendared: true,
    };

    await expect(
      addCaseToTrialSessionInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
      }),
    ).rejects.toThrow('The case is already part of this trial session.');
  });

  it('returns the expected case with new trial session info', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL,
      caseOrder: [{ docketNumber: '123-45' }],
      isCalendared: true,
    };
    applicationContext.getUniqueId.mockReturnValue(
      '8675309b-18d0-43ec-bafb-654e83405411',
    );

    const latestCase = await addCaseToTrialSessionInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
    });

    expect(latestCase).toMatchObject({
      associatedJudge: CHIEF_JUDGE,
      status: CASE_STATUS_TYPES.calendared,
      trialDate: '2025-12-01T00:00:00.000Z',
      trialLocation: 'Birmingham, Alabama',
      trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
      trialTime: '10:00',
    });
  });

  it('sets work items to high priority if the trial session is calendared', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL,
      caseOrder: [{ docketNumber: '123-45' }],
      isCalendared: true,
    };

    await addCaseToTrialSessionInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
    });

    expect(
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems.mock
        .calls[0][0],
    ).toMatchObject({
      highPriority: true,
      trialDate: '2025-12-01T00:00:00.000Z',
    });
  });
});
