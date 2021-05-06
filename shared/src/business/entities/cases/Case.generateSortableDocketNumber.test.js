const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('generateSortableDocketNumber', () => {
  it('returns undefined if there is no docketNumber property on the case data', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        docketNumber: null,
      },
      {
        applicationContext,
      },
    );
    expect(myCase.generateSortableDocketNumber()).toEqual(undefined);
  });

  it('returns a sortable docket number from the case docketNumber property', () => {
    let myCase = new Case(
      {
        ...MOCK_CASE,
        docketNumber: '105-19',
      },
      {
        applicationContext,
      },
    );
    expect(myCase.generateSortableDocketNumber()).toEqual(19000105);

    myCase = new Case(
      {
        ...MOCK_CASE,
        docketNumber: '2635-19',
      },
      {
        applicationContext,
      },
    );
    expect(myCase.generateSortableDocketNumber()).toEqual(19002635);

    myCase = new Case(
      {
        ...MOCK_CASE,
        docketNumber: '112635-19',
      },
      {
        applicationContext,
      },
    );
    expect(myCase.generateSortableDocketNumber()).toEqual(19112635);
  });
});
