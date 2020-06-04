const { prepareDateFromString } = require('../utilities/DateHandler');
const { UserCase } = require('./UserCase');

describe('UserCase', () => {
  it('fails validation if required fields are non-existent', () => {
    expect(new UserCase({}).isValid()).toBeFalsy();
  });

  it('passes validation if required fields exist', () => {
    expect(
      new UserCase({
        caseCaption: 'Guy Fieri, Petitioner',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        createdAt: prepareDateFromString().toISOString(),
        docketNumber: '104-21',
        docketNumberWithSuffix: '104-20W',
        leadCaseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }).isValid(),
    ).toBeTruthy();
  });
});
