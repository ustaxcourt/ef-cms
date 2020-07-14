const { CASE_TYPES_MAP } = require('../entities/EntityConstants');
const { getDocketNumberSuffix } = require('./getDocketNumberSuffix');

describe('getDocketNumberSuffix', () => {
  it('returns W for Whistleblower caseType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: CASE_TYPES_MAP.whistleblower,
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual('W');
  });

  it('returns P for Passport caseType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: 'Passport',
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual('P');
  });

  it('returns X for "Exempt Organization" caseType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: CASE_TYPES_MAP.djExemptOrg,
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual('X');
  });

  it('returns R for "Retirement Plan" caseType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: CASE_TYPES_MAP.djRetirementPlan,
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual('R');
  });

  it('returns SL for "Lien/Levy" caseType and "small" for procedureType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: CASE_TYPES_MAP.cdp,
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual('SL');
  });

  it('returns L for "Lien/Levy" caseType and "regular" for procedureType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: CASE_TYPES_MAP.cdp,
      docketNumber: '101-18',
      procedureType: 'Regular',
    });

    expect(suffix).toEqual('L');
  });

  it('returns S for all others with "small" for procedureType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: 'Something New',
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual('S');
  });

  it('returns null for other instance', () => {
    const suffix = getDocketNumberSuffix({
      caseType: 'Something New',
      docketNumber: '101-18',
      procedureType: 'Regular',
    });

    expect(suffix).toEqual(null);
  });
});
