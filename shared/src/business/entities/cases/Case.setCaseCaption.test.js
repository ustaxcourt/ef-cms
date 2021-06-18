const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('setCaseCaption', () => {
  it('should set the case caption and update the case title', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseCaption('A whole new caption');

    expect(updatedCase.caseCaption).toEqual('A whole new caption');
  });
});
