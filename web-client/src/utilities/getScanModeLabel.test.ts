import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getScanModeLabel } from './getScanModeLabel';

describe('getScanModeLabel', () => {
  const { SCAN_MODE_LABELS, SCAN_MODES } = applicationContext.getConstants();

  it('Returns Single Sided when the scan mode is feeder', () => {
    expect(getScanModeLabel(applicationContext, SCAN_MODES.FEEDER)).toEqual(
      SCAN_MODE_LABELS.FEEDER,
    );
  });

  it('Returns Flatbed when the scan mode is flatbed', () => {
    expect(getScanModeLabel(applicationContext, SCAN_MODES.FLATBED)).toEqual(
      SCAN_MODE_LABELS.FLATBED,
    );
  });

  it('Returns Double Sided when the scan mode is duplex', () => {
    expect(getScanModeLabel(applicationContext, SCAN_MODES.DUPLEX)).toEqual(
      SCAN_MODE_LABELS.DUPLEX,
    );
  });
});
