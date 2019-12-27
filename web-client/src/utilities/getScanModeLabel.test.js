import getScanModeLabel from './getScanModeLabel';

describe('getScanModeLabel', () => {
  it('Returns Single Sided when the scan mode is feeder', () => {
    expect(getScanModeLabel('feeder')).toEqual('Single Sided');
  });

  it('Returns Flatbed when the scan mode is flatbed', () => {
    expect(getScanModeLabel('flatbed')).toEqual('Flatbed');
  });

  it('Returns Double Sided when the scan mode is duplex', () => {
    expect(getScanModeLabel('duplex')).toEqual('Double Sided');
  });
});
