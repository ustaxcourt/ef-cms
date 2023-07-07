import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSessionFactory } from '../trialSessions/TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('removeFromHearing', () => {
  it('removes the hearing from the case', () => {
    const trialSessionHearing = TrialSessionFactory(
      MOCK_TRIAL_INPERSON,
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
    caseToUpdate.removeFromHearing(trialSessionHearing.trialSessionId);

    expect(caseToUpdate.hearings).toEqual([]);
  });
});
