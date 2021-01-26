const { prepareDateFromString } = require('../utilities/DateHandler');
const { UserCase } = require('./UserCase');

const validUserCase = {
  caseCaption: 'Guy Fieri, Petitioner',
  createdAt: prepareDateFromString().toISOString(),
  docketNumber: '104-21',
  docketNumberWithSuffix: '104-20W',
  leadDocketNumber: '101-21',
};

describe('UserCase', () => {
  it('fails validation if required fields are non-existent', () => {
    expect(new UserCase({}).isValid()).toBeFalsy();
  });

  it('passes validation if required fields exist', () => {
    expect(new UserCase(validUserCase).isValid()).toBeTruthy();
  });
});

exports.validUserCase = validUserCase;
