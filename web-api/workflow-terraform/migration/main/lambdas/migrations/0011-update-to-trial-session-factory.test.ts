import { MOCK_TRIAL_INPERSON } from '../../../../../../shared/src/test/mockTrial';
import { SESSION_STATUS_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';
import { migrateItems } from './0011-update-to-trial-session-factory';

describe('Update to trial session migration script', () => {
  it('should only migrate items that are "trial session"', () => {
    const items = [
      {
        ...MOCK_TRIAL_INPERSON,
        entityName: 'TrialSession',
        pk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
        sessionStatus: SESSION_STATUS_TYPES.open,
        sk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
      },
      {
        entityName: 'Case',
        pk: 'case|8224c84e-981c-462d-9a59-08ceff8e229c',
        sk: 'case|8224c84e-981c-462d-9a59-08ceff8e229c',
      },
      {
        ...MOCK_TRIAL_INPERSON,
        entityName: 'TrialSession',
        pk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
        sessionStatus: SESSION_STATUS_TYPES.closed,
        sk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
      },
      {
        ...MOCK_TRIAL_INPERSON,
        entityName: 'TrialSession',
        pk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
        sessionStatus: SESSION_STATUS_TYPES.new,
        sk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
      },
    ];

    const migratedItems = migrateItems(items);

    expect(migratedItems).toMatchObject([
      {
        entityName: 'OpenTrialSession',
        pk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
        sessionStatus: SESSION_STATUS_TYPES.open,
        sk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
      },
      {
        entityName: 'Case',
        pk: 'case|8224c84e-981c-462d-9a59-08ceff8e229c',
        sk: 'case|8224c84e-981c-462d-9a59-08ceff8e229c',
      },
      {
        entityName: 'ClosedTrialSession',
        pk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
        sessionStatus: SESSION_STATUS_TYPES.closed,
        sk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
      },
      {
        entityName: 'NewTrialSession',
        pk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
        sessionStatus: SESSION_STATUS_TYPES.new,
        sk: 'trial-session|47eb66e6-3370-4e78-a13e-028e109be17e',
      },
    ]);
  });
});
