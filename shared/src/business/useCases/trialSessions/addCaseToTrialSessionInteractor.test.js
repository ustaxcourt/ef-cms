import { addCaseToTrialSessionInteractor } from './addCaseToTrialSessionInteractor';
const {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  ROLES,
} = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
};

describe('addCaseToTrialSessionInteractor', () => {
  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    let error;
    try {
      await addCaseToTrialSessionInteractor({
        applicationContext: {
          getCurrentUser: () => ({
            role: ROLES.petitioner,
            userId: '8675309b-18d0-43ec-bafb-654e83405411',
          }),
          getPersistenceGateway: () => ({
            deleteCaseTrialSortMappingRecords: () => null,
            getCaseByCaseId: () => MOCK_CASE,
            updateCase: obj => obj.caseToUpdate,
            updateTrialSession: () => null,
          }),
        },
        caseId: '8675309b-18d0-43ec-bafb-654e83405411',
        trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
      });
    } catch (e) {
      error = e;
    }

    expect(error.message).toEqual('Unauthorized');
  });

  it('throws an error if the case is already calendared', async () => {
    let error;
    try {
      await addCaseToTrialSessionInteractor({
        applicationContext: {
          getCurrentUser: () => ({
            role: ROLES.petitionsClerk,
            userId: '8675309b-18d0-43ec-bafb-654e83405411',
          }),
          getPersistenceGateway: () => ({
            deleteCaseTrialSortMappingRecords: () => null,
            getCaseByCaseId: () => ({
              ...MOCK_CASE,
              status: CASE_STATUS_TYPES.calendared,
            }),
            getTrialSessionById: () => MOCK_TRIAL,
            updateCase: obj => obj.caseToUpdate,
            updateTrialSession: () => null,
          }),
          getUniqueId: () => '8675309b-18d0-43ec-bafb-654e83405411',
        },
        caseId: '8675309b-18d0-43ec-bafb-654e83405411',
        trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
      });
    } catch (e) {
      error = e;
    }
    expect(error.message).toEqual('The case is already calendared');
  });

  it('throws an error if the case is already part of the trial session', async () => {
    let error;
    try {
      await addCaseToTrialSessionInteractor({
        applicationContext: {
          getCurrentUser: () => ({
            role: ROLES.petitionsClerk,
            userId: '8675309b-18d0-43ec-bafb-654e83405411',
          }),
          getPersistenceGateway: () => ({
            deleteCaseTrialSortMappingRecords: () => null,
            getCaseByCaseId: () => MOCK_CASE,
            getTrialSessionById: () => ({
              ...MOCK_TRIAL,
              caseOrder: [{ caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' }],
              isCalendared: true,
            }),
            updateCase: obj => obj.caseToUpdate,
            updateTrialSession: () => null,
          }),
          getUniqueId: () => '8675309b-18d0-43ec-bafb-654e83405411',
        },
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
      });
    } catch (e) {
      error = e;
    }

    expect(error.message).toEqual(
      'The case is already part of this trial session.',
    );
  });

  it('returns the expected case with new trial session info', async () => {
    const latestCase = await addCaseToTrialSessionInteractor({
      applicationContext: {
        getCurrentUser: () => ({
          role: ROLES.petitionsClerk,
          userId: '8675309b-18d0-43ec-bafb-654e83405411',
        }),
        getPersistenceGateway: () => ({
          deleteCaseTrialSortMappingRecords: () => null,
          getCaseByCaseId: () => MOCK_CASE,
          getTrialSessionById: () => ({
            ...MOCK_TRIAL,
            caseOrder: [{ caseId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb' }],
            isCalendared: true,
          }),
          setPriorityOnAllWorkItems: () => null,
          updateCase: obj => obj.caseToUpdate,
          updateTrialSession: () => null,
        }),
        getUniqueId: () => '8675309b-18d0-43ec-bafb-654e83405411',
      },
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    const setPriorityOnAllWorkItemsSpy = jest.fn();

    await addCaseToTrialSessionInteractor({
      applicationContext: {
        getCurrentUser: () => ({
          role: ROLES.petitionsClerk,
          userId: '8675309b-18d0-43ec-bafb-654e83405411',
        }),
        getPersistenceGateway: () => ({
          deleteCaseTrialSortMappingRecords: () => null,
          getCaseByCaseId: () => MOCK_CASE,
          getTrialSessionById: () => ({
            ...MOCK_TRIAL,
            caseOrder: [{ caseId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb' }],
            isCalendared: true,
          }),
          setPriorityOnAllWorkItems: setPriorityOnAllWorkItemsSpy,
          updateCase: obj => obj.caseToUpdate,
          updateTrialSession: () => null,
        }),
        getUniqueId: () => '8675309b-18d0-43ec-bafb-654e83405411',
      },
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
    });

    expect(setPriorityOnAllWorkItemsSpy).toBeCalled();
    expect(setPriorityOnAllWorkItemsSpy.mock.calls[0][0]).toMatchObject({
      highPriority: true,
      trialDate: '2025-12-01T00:00:00.000Z',
    });
  });
});
