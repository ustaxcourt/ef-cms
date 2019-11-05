import { addCaseToTrialSessionInteractor } from './addCaseToTrialSessionInteractor';
const { Case } = require('../../entities/cases/Case');
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

describe('addCaseToTrialSessionInteractor', () => {
  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    let error;
    try {
      await addCaseToTrialSessionInteractor({
        applicationContext: {
          getCurrentUser: () => ({
            role: User.ROLES.petitioner,
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
            role: User.ROLES.petitionsClerk,
            userId: '8675309b-18d0-43ec-bafb-654e83405411',
          }),
          getPersistenceGateway: () => ({
            deleteCaseTrialSortMappingRecords: () => null,
            getCaseByCaseId: () => ({
              ...MOCK_CASE,
              status: 'Calendared',
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
            role: User.ROLES.petitionsClerk,
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
          role: User.ROLES.petitionsClerk,
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
          updateCase: obj => obj.caseToUpdate,
          updateTrialSession: () => null,
        }),
        getUniqueId: () => '8675309b-18d0-43ec-bafb-654e83405411',
      },
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
    });

    expect(latestCase).toMatchObject({
      associatedJudge: Case.CHIEF_JUDGE,
      status: 'Calendared',
      trialDate: '2025-12-01T00:00:00.000Z',
      trialLocation: 'Birmingham, AL',
      trialSessionId: '8675309b-18d0-43ec-bafb-654e83405411',
      trialTime: '10:00',
    });
  });
});
