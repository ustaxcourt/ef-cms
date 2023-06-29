import {
  CASE_TYPES_MAP,
  DOCKET_NUMBER_SUFFIXES,
} from '../entities/EntityConstants';
import { getDocketNumberSuffix } from './getDocketNumberSuffix';

describe('getDocketNumberSuffix', () => {
  it('returns W for Whistleblower caseType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: CASE_TYPES_MAP.whistleblower,
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual(DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER);
  });

  it('returns P for Passport caseType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: 'Passport',
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual(DOCKET_NUMBER_SUFFIXES.PASSPORT);
  });

  it('returns X for "Exempt Organization" caseType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: CASE_TYPES_MAP.djExemptOrg,
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual(
      DOCKET_NUMBER_SUFFIXES.DECLARATORY_JUDGEMENTS_FOR_EXEMPT_ORGS,
    );
  });

  it('returns D for "Disclosure" caseType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: CASE_TYPES_MAP.disclosure,
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual(DOCKET_NUMBER_SUFFIXES.DISCLOSURE);
  });

  it('returns R for "Retirement Plan" caseType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: CASE_TYPES_MAP.djRetirementPlan,
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual(
      DOCKET_NUMBER_SUFFIXES.DECLARATORY_JUDGEMENTS_FOR_RETIREMENT_PLAN_REVOCATION,
    );
  });

  it('returns SL for "Lien/Levy" caseType and "small" for procedureType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: CASE_TYPES_MAP.cdp,
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual(DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY);
  });

  it('returns L for "Lien/Levy" caseType and "regular" for procedureType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: CASE_TYPES_MAP.cdp,
      docketNumber: '101-18',
      procedureType: 'Regular',
    });

    expect(suffix).toEqual(DOCKET_NUMBER_SUFFIXES.LIEN_LEVY);
  });

  it('returns S for all others with "small" for procedureType', () => {
    const suffix = getDocketNumberSuffix({
      caseType: 'Something New',
      docketNumber: '101-18',
      procedureType: 'Small',
    });

    expect(suffix).toEqual(DOCKET_NUMBER_SUFFIXES.SMALL);
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
