import {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_STANDALONE_REMOTE,
} from '../../../test/mockTrial';
import { SESSION_STATUS_GROUPS } from '../EntityConstants';
import { TrialSession } from './TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession entity', () => {
  describe('removeCaseFromCalendar', () => {
    it('should set case on calendar to removedFromTrial with removedFromTrialDate and disposition', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_INPERSON,
          caseOrder: [],
        },
        {
          applicationContext,
        },
      );
      trialSession.addCaseToCalendar({ docketNumber: '123-45' });
      trialSession.addCaseToCalendar({ docketNumber: '234-45' });
      trialSession.addCaseToCalendar({ docketNumber: '456-45' });
      expect(trialSession.caseOrder!.length).toEqual(3);

      trialSession.removeCaseFromCalendar({
        disposition: 'because',
        docketNumber: '123-45',
      });

      expect(trialSession.caseOrder!.length).toEqual(3);
      expect(trialSession.caseOrder![0]).toMatchObject({
        disposition: 'because',
        docketNumber: '123-45',
        removedFromTrial: true,
      });
      expect(trialSession.caseOrder![0].removedFromTrialDate).toBeDefined();
      expect(trialSession.caseOrder![1]).not.toHaveProperty('removedFromTrial');
      expect(trialSession.caseOrder![2]).not.toHaveProperty('removedFromTrial');
    });

    it('should not modify case calendar if docketNumber is not in caseOrder', () => {
      const trialSession = new TrialSession(
        {
          ...MOCK_TRIAL_INPERSON,
          caseOrder: [],
        },
        {
          applicationContext,
        },
      );
      trialSession.addCaseToCalendar({ docketNumber: '123-45' });
      trialSession.addCaseToCalendar({ docketNumber: '234-45' });
      trialSession.addCaseToCalendar({ docketNumber: '456-45' });
      expect(trialSession.caseOrder!.length).toEqual(3);

      trialSession.removeCaseFromCalendar({
        disposition: 'because',
        docketNumber: 'abc-de',
      });

      expect(trialSession.caseOrder!.length).toEqual(3);
      expect(trialSession.caseOrder![0]).not.toHaveProperty('removedFromTrial');
      expect(trialSession.caseOrder![1]).not.toHaveProperty('removedFromTrial');
      expect(trialSession.caseOrder![2]).not.toHaveProperty('removedFromTrial');
    });
  });

  it('should set the sessionStatus to closed when all cases on the session are removed', () => {
    const trialSession = new TrialSession(
      {
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [],
      },
      {
        applicationContext,
      },
    );
    trialSession.addCaseToCalendar({ docketNumber: '123-45' });
    expect(trialSession.caseOrder!.length).toEqual(1);

    trialSession.removeCaseFromCalendar({
      disposition: 'because',
      docketNumber: '123-45',
    });

    expect(trialSession.caseOrder!.length).toEqual(1);
    expect(trialSession.caseOrder![0]).toHaveProperty('removedFromTrial');
    expect(trialSession.sessionStatus).toEqual(SESSION_STATUS_GROUPS.closed);
  });

  it('should keep the status as open when the session is standalone remote, even after removing all cases', () => {
    const trialSession = new TrialSession(
      {
        ...MOCK_TRIAL_STANDALONE_REMOTE,
        caseOrder: [],
      },
      {
        applicationContext,
      },
    );
    trialSession.addCaseToCalendar({ docketNumber: '123-45' });
    expect(trialSession.caseOrder!.length).toEqual(1);

    trialSession.removeCaseFromCalendar({
      disposition: 'because',
      docketNumber: '123-45',
    });

    expect(trialSession.caseOrder!.length).toEqual(1);
    expect(trialSession.caseOrder![0]).toHaveProperty('removedFromTrial');
    expect(trialSession.sessionStatus).toEqual(SESSION_STATUS_GROUPS.open);
  });
});
