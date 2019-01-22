const { getDocketNumberSuffix } = require('./getDocketNumberSuffix');

describe('getDocketNumberSuffix', () => {
  it('returns W for Whistleblower caseType', () => {
    const suffix = getDocketNumberSuffix({
      docketNumber: '101-18',
      caseType: 'Whistleblower',
      procedureType: 'small',
    });

    expect(suffix).toEqual('W');
  });

  it('returns P for Passport caseType', () => {
    const suffix = getDocketNumberSuffix({
      docketNumber: '101-18',
      caseType: 'Passport',
      procedureType: 'small',
    });

    expect(suffix).toEqual('P');
  });

  it('returns X for "Exempt Organization" caseType', () => {
    const suffix = getDocketNumberSuffix({
      docketNumber: '101-18',
      caseType: 'Exempt Organization',
      procedureType: 'small',
    });

    expect(suffix).toEqual('X');
  });

  it('returns R for "Retirement Plan" caseType', () => {
    const suffix = getDocketNumberSuffix({
      docketNumber: '101-18',
      caseType: 'Retirement Plan',
      procedureType: 'small',
    });

    expect(suffix).toEqual('R');
  });

  it('returns SL for "Lien/Levy" caseType and "small" for procedureType', () => {
    const suffix = getDocketNumberSuffix({
      docketNumber: '101-18',
      caseType: 'CDP (Lien/Levy)',
      procedureType: 'small',
    });

    expect(suffix).toEqual('SL');
  });

  it('returns L for "Lien/Levy" caseType and "regular" for procedureType', () => {
    const suffix = getDocketNumberSuffix({
      docketNumber: '101-18',
      caseType: 'CDP (Lien/Levy)',
      procedureType: 'regular',
    });

    expect(suffix).toEqual('L');
  });

  it('returns S for all others with "small" for procedureType', () => {
    const suffix = getDocketNumberSuffix({
      docketNumber: '101-18',
      caseType: 'Something New',
      procedureType: 'small',
    });

    expect(suffix).toEqual('S');
  });

  it('returns null for other instance', () => {
    const suffix = getDocketNumberSuffix({
      docketNumber: '101-18',
      caseType: 'Something New',
      procedureType: 'regular',
    });

    expect(suffix).toEqual(null);
  });
});
