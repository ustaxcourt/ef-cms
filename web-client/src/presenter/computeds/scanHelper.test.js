import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { scanHelper as scanHelperComputed } from './scanHelper';
import { withAppContextDecorator } from '../../../src/withAppContext';

const scanHelper = withAppContextDecorator(
  scanHelperComputed,
  applicationContext,
);

describe('scanHelper', () => {
  it('sets hasScanFeature to `true` for `petitionsclerk` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitionsClerk,
    });
    const result = runCompute(scanHelper, {
      state: {},
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `true` for `docketclerk` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.docketClerk,
    });
    const result = runCompute(scanHelper, {
      state: {},
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `true` for `adc` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.adc,
    });
    const result = runCompute(scanHelper, {
      state: {},
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `false` for `petitioner` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });
    const result = runCompute(scanHelper, {
      state: {},
    });
    expect(result.hasScanFeature).toBeFalsy();
  });

  it('sets hasScanFeature to `false` for `practitioner` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.privatePractitioner,
    });
    const result = runCompute(scanHelper, {
      state: {},
    });
    expect(result.hasScanFeature).toBeFalsy();
  });

  it('sets hasScanFeature to `false` for `respondent` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
    });
    const result = runCompute(scanHelper, {
      state: {},
    });
    expect(result.hasScanFeature).toBeFalsy();
  });

  it('shows the scanner source selection modal', () => {
    const result = runCompute(scanHelper, {
      state: {
        modal: {
          showModal: 'SelectScannerSourceModal',
        },
      },
    });
    expect(result.showScannerSourceModal).toBeTruthy();
  });

  it('gets the scanner sources from state', () => {
    const mockSources = ['Test Source 1', 'Test Source 2'];
    const result = runCompute(scanHelper, {
      state: {
        scanner: {
          sources: mockSources,
        },
      },
    });
    expect(result.sources.length).toEqual(2);
  });

  it('sets applicationForWaiverOfFilingFeeFileCompleted if document is on form', () => {
    const result = runCompute(scanHelper, {
      state: {
        form: {
          applicationForWaiverOfFilingFeeFile: null,
        },
      },
    });
    expect(result.applicationForWaiverOfFilingFeeFileCompleted).toBeFalsy();

    const result2 = runCompute(scanHelper, {
      state: {
        form: {
          applicationForWaiverOfFilingFeeFile: {},
        },
      },
    });
    expect(result2.applicationForWaiverOfFilingFeeFileCompleted).toBeTruthy();
  });
});
