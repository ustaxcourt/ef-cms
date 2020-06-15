import { SCAN_MODES } from '../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { getScanModeLabel } from './getScanModeLabel';

describe('getScanModeLabel', () => {
  it('Returns Single Sided when the scan mode is feeder', () => {
    expect(getScanModeLabel(applicationContext, SCAN_MODES.FEEDER)).toEqual(
      'Single sided',
    );
  });

  it('Returns Flatbed when the scan mode is flatbed', () => {
    expect(getScanModeLabel(applicationContext, SCAN_MODES.FLATBED)).toEqual(
      'Flatbed',
    );
  });

  it('Returns Double Sided when the scan mode is duplex', () => {
    expect(getScanModeLabel(applicationContext, SCAN_MODES.DUPLEX)).toEqual(
      'Double sided',
    );
  });
});
