import { Scan } from '../../../shared/src/business/entities/Scan';
import getScanModeLabel from './getScanModeLabel';

describe('getScanModeLabel', () => {
  const applicationContext = {
    getConstants: () => ({
      SCAN_MODES: Scan.SCAN_MODES,
    }),
  };
  it('Returns Single Sided when the scan mode is feeder', () => {
    expect(getScanModeLabel(applicationContext, 'feeder')).toEqual(
      'Single sided',
    );
  });

  it('Returns Flatbed when the scan mode is flatbed', () => {
    expect(getScanModeLabel(applicationContext, 'flatbed')).toEqual('Flatbed');
  });

  it('Returns Double Sided when the scan mode is duplex', () => {
    expect(getScanModeLabel(applicationContext, 'duplex')).toEqual(
      'Double sided',
    );
  });
});
