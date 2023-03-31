import { PARTIES_CODES, ROLES } from './EntityConstants';
import { getServedPartiesCode } from './DocketEntry';

describe('getServedPartiesCode', () => {
  it('returns undefined if servedParties is undefined', () => {
    const servedPartiesCode = getServedPartiesCode();
    expect(servedPartiesCode).toBeUndefined();
  });

  it('returns undefined if servedParties is an empty array', () => {
    const servedPartiesCode = getServedPartiesCode([]);
    expect(servedPartiesCode).toBeUndefined();
  });

  it('returns the servedParties code for respondent if the only party in the given servedParties array has the irsSuperUser role', () => {
    const servedPartiesCode = getServedPartiesCode([
      {
        role: ROLES.irsSuperuser,
      },
    ]);
    expect(servedPartiesCode).toEqual(PARTIES_CODES.RESPONDENT);
  });

  it('returns the servedParties code for both if the only party in the given servedParties array does not have the irsSuperUser role', () => {
    const servedPartiesCode = getServedPartiesCode([
      {
        role: ROLES.petitioner,
      },
    ]);
    expect(servedPartiesCode).toEqual(PARTIES_CODES.BOTH);
  });

  it('returns the servedParties code for both if the given servedParties array contains multiple servedParties', () => {
    const servedPartiesCode = getServedPartiesCode([
      {
        role: ROLES.irsSuperuser,
      },
      {
        role: ROLES.petitioner,
      },
    ]);
    expect(servedPartiesCode).toEqual(PARTIES_CODES.BOTH);
  });
});
