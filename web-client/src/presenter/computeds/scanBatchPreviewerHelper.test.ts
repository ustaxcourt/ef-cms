import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { scanBatchPreviewerHelper as scanBatchPreviewerHelperComputed } from './scanBatchPreviewerHelper';
import { withAppContextDecorator } from '../../withAppContext';

describe('scanBatchPreviewerHelper', () => {
  const state = {
    form: undefined as any,
    scanner: {
      batches: [],
    },
  };
  const { SCAN_MODES } = applicationContext.getConstants();

  const scanBatchPreviewerHelper = withAppContextDecorator(
    scanBatchPreviewerHelperComputed,
    applicationContext,
  );

  applicationContext.getCurrentUser = () => ({
    role: applicationContext.getConstants().ROLES.privatePractitioner,
  });

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
        scanner: {
          scanMode: SCAN_MODES.FLATBED,
          scannerSourceName: 'Some Scanner 247',
        },
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
