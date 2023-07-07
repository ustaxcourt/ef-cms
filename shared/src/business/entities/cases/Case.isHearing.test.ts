import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_STANDALONE_REMOTE } from '../../../test/mockTrial';
import { TrialSessionFactory } from '../trialSessions/TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('isHearing', () => {
  it('checks if the given trialSessionId is a hearing (true)', () => {
    const trialSessionHearing = TrialSessionFactory(
      MOCK_TRIAL_STANDALONE_REMOTE,
      applicationContext,
    );
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        hearings: [trialSessionHearing],
      },
      {
        applicationContext,
      },
    );

    expect(caseToUpdate.isHearing(trialSessionHearing.trialSessionId)).toEqual(
      true,
    );
  });

  it('checks if the given trialSessionId is a hearing (false)', () => {
    const trialSessionHearing = TrialSessionFactory(
      MOCK_TRIAL_STANDALONE_REMOTE,
      applicationContext,
    );
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );
    caseToUpdate.setAsCalendared(trialSessionHearing);

    expect(caseToUpdate.isHearing(trialSessionHearing.trialSessionId)).toEqual(
      false,
    );
  });
});
