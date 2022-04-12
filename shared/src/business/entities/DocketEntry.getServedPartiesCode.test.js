const { getServedPartiesCode } = require('./DocketEntry');
const { ROLES, SERVED_PARTIES_CODES } = require('./EntityConstants');

describe('getServedPartiesCode', () => {
  it('returns an empty string if servedParties is undefined', () => {
    const servedPartiesCode = getServedPartiesCode();
    expect(servedPartiesCode).toEqual('');
  });

  it('returns an empty string if servedParties is an empty array', () => {
    const servedPartiesCode = getServedPartiesCode([]);
    expect(servedPartiesCode).toEqual('');
  });

  it('returns the servedParties code for respondent if the only party in the given servedParties array has the irsSuperUser role', () => {
    const servedPartiesCode = getServedPartiesCode([
      {
        role: ROLES.irsSuperuser,
      },
    ]);
    expect(servedPartiesCode).toEqual(SERVED_PARTIES_CODES.RESPONDENT);
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
    expect(servedPartiesCode).toEqual(SERVED_PARTIES_CODES.BOTH);
  });

  it('returns the servedParties code of P if no irsSuperuser is present in the servedPartiesCode', () => {
    const servedPartiesCode = getServedPartiesCode([
      {
        name: 'suzy',
      },
    ]);
    expect(servedPartiesCode).toEqual(SERVED_PARTIES_CODES.PETITIONER);
  });

  it('returns the servedParties code of B if a irsSuperuser is present in the servedPartiesCode with other parties', () => {
    const servedPartiesCode = getServedPartiesCode([
      {
        name: 'john',
      },
      {
        name: 'bob',
      },
      {
        role: ROLES.irsSuperuser,
      },
    ]);
    expect(servedPartiesCode).toEqual(SERVED_PARTIES_CODES.BOTH);
  });
});
