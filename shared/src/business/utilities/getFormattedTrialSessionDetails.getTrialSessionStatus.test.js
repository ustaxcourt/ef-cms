import {
  SESSION_STATUS_GROUPS,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { getTrialSessionStatus } from './getFormattedTrialSessionDetails';

describe('formattedTrialSessionDetails', () => {
  describe('getTrialSessionStatus', () => {
    it('returns `Closed` when all trial session cases are inactive / removed from trial and sessionScope is locationBased', () => {
      const session = {
        caseOrder: [
          { docketNumber: '123-19', removedFromTrial: true },
          { docketNumber: '234-19', removedFromTrial: true },
        ],
      };

      const results = getTrialSessionStatus({ applicationContext, session });

      expect(results).toEqual(SESSION_STATUS_GROUPS.closed);
    });

    it('should not return `Closed` when all trial session cases are inactive / removed from trial and sessionScope is standaloneRemote', () => {
      const session = {
        caseOrder: [
          { docketNumber: '123-19', removedFromTrial: true },
          { docketNumber: '234-19', removedFromTrial: true },
        ],
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      };

      const results = getTrialSessionStatus({ applicationContext, session });

      expect(results).not.toEqual(SESSION_STATUS_GROUPS.closed);
    });

    it('returns `Open` when a trial session is calendared and does not meet conditions for `Closed` status', () => {
      const session = {
        caseOrder: [
          { docketNumber: '123-19' },
          { docketNumber: '234-19', removedFromTrial: true },
        ],
        isCalendared: true,
      };

      const results = getTrialSessionStatus({ applicationContext, session });

      expect(results).toEqual(SESSION_STATUS_GROUPS.open);
    });

    it('returns `New` when a trial session is calendared and does not meet conditions for `Closed` status', () => {
      const session = {
        caseOrder: [
          { docketNumber: '123-19' },
          { docketNumber: '234-19', removedFromTrial: true },
        ],
        isCalendared: false,
      };

      const results = getTrialSessionStatus({ applicationContext, session });

      expect(results).toEqual(SESSION_STATUS_GROUPS.new);
    });
  });
});
