import { Scan } from '../../../../shared/src/business/entities/Scan';
import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { scanBatchPreviewerHelper as scanBatchPreviewerHelperComputed } from './scanBatchPreviewerHelper';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  scanner: {
    batches: [],
  },
};

const { SCAN_MODES } = Scan;

const scanBatchPreviewerHelper = withAppContextDecorator(
  scanBatchPreviewerHelperComputed,
  applicationContext,
);

applicationContext.getCurrentUser = () => ({
  role: User.ROLES.privatePractitioner,
});
applicationContext.getConstants = () => ({ SCAN_MODES });

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

    it('returns correct values when a scanner is selected and is using the feeder, which is by default single sided', () => {
      let testState = {
        ...state,
        scanner: {
          scanMode: SCAN_MODES.FEEDER,
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
        scanner: {
          scanMode: SCAN_MODES.DUPLEX,
          scannerSourceName: 'Some Scanner 247',
        },
      };

      const result = runCompute(scanBatchPreviewerHelper, {
        state: testState,
      });
      expect(result.scannerSourceDisplayName).toEqual(
        'Some Scanner 247 (Double sided)',
      );
    });

    it('returns correct values when a scanner is selected and is using flatbed', () => {
      let testState = {
        ...state,
        scanner: { scanMode: 'flatbed', scannerSourceName: 'Some Scanner 247' },
      };

      const result = runCompute(scanBatchPreviewerHelper, {
        state: testState,
      });
      expect(result.scannerSourceDisplayName).toEqual(
        'Some Scanner 247 (Flatbed)',
      );
    });
  });
});
