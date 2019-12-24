import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { scanBatchPreviewerHelper as scanBatchPreviewerHelperComputed } from './scanBatchPreviewerHelper';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  batches: [],
};

const scanBatchPreviewerHelper = withAppContextDecorator(
  scanBatchPreviewerHelperComputed,
  applicationContext,
);

applicationContext.getCurrentUser = () => ({ role: User.ROLES.practitioner });

describe('scanBatchPreviewerHelper', () => {
  beforeEach(() => {
    state.form = {};
  });

  describe('scannerSourceDisplayName', () => {
    it('returns correct values when no scanner is selected', () => {
      let testState = { ...state };

      const result = runCompute(scanBatchPreviewerHelper, {
        state: testState,
      });
      expect(result.scannerSourceDisplayName).toEqual('None');
    });

    it('returns correct values when a scanner is selected and is using single sided', () => {
      let testState = {
        ...state,
        scanner: {
          duplexEnabled: false,
          scannerSourceName: 'Some Scanner 247',
        },
      };

      const result = runCompute(scanBatchPreviewerHelper, {
        state: testState,
      });
      expect(result.scannerSourceDisplayName).toEqual(
        'Some Scanner 247 (Single sided)',
      );
    });

    it('returns correct values when a scanner is selected and is using double sided', () => {
      let testState = {
        ...state,
        scanner: { duplexEnabled: true, scannerSourceName: 'Some Scanner 247' },
      };

      const result = runCompute(scanBatchPreviewerHelper, {
        state: testState,
      });
      expect(result.scannerSourceDisplayName).toEqual(
        'Some Scanner 247 (Double sided)',
      );
    });
  });
});
