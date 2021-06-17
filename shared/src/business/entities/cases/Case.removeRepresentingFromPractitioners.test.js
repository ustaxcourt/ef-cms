const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');

describe('removeRepresentingFromPractitioners', () => {
  it('does not remove a practitioner if not found in the associated case privatePractioners array', () => {
    const caseToVerify = new Case(
      {
        privatePractitioners: [
          {
            representing: ['123', 'abc'],
          },
          {
            representing: ['ggg', '123'],
          },
        ],
      },
      {
        applicationContext,
      },
    );

    caseToVerify.removeRepresentingFromPractitioners('123');
    expect(caseToVerify.privatePractitioners[0]).toMatchObject({
      representing: ['abc'],
    });
    expect(caseToVerify.privatePractitioners[1]).toMatchObject({
      representing: ['ggg'],
    });
  });
});
