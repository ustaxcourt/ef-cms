import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSessionFactory } from './TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('isCaseAlreadyCalendared', () => {
    it('should return true when a case is already part of the trial session', () => {
      const trialSession = TrialSessionFactory(
        {
          ...MOCK_TRIAL_INPERSON,
          caseOrder: [{ docketNumber: '123-45' }],
        },
        applicationContext,
      );

      expect(
        trialSession.isCaseAlreadyCalendared({ docketNumber: '123-45' }),
      ).toBeTruthy();
    });

    it('should return false when a case is not already part of the trial session', () => {
      const trialSession = TrialSessionFactory(
        {
          ...MOCK_TRIAL_INPERSON,
          caseOrder: [{ docketNumber: 'abc-de' }],
        },
        applicationContext,
      );

      expect(
        trialSession.isCaseAlreadyCalendared({ docketNumber: '123-45' }),
      ).toBeFalsy();
    });

    it('should return false even for cases that have been manually removed', () => {
      const trialSession = TrialSessionFactory(
        {
          ...MOCK_TRIAL_INPERSON,
          caseOrder: [{ docketNumber: 'abc-de', removedFromTrial: true }],
        },
        applicationContext,
      );

      expect(
        trialSession.isCaseAlreadyCalendared({ docketNumber: '123-45' }),
      ).toBeFalsy();
    });
  });
});
