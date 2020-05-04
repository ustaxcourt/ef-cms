const {
  validateDocketRecordInteractor,
} = require('./validateDocketRecordInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketRecord } = require('../entities/DocketRecord');

describe('validateDocketRecordInteractor', () => {
  it('returns the expected errors object on an empty docket record', () => {
    const errors = validateDocketRecordInteractor({
      applicationContext,
      docketRecord: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(DocketRecord.VALIDATION_ERROR_MESSAGES),
    );
  });

  it('returns null when there are no errors', () => {
    const result = validateDocketRecordInteractor({
      applicationContext,
      docketRecord: {
        description: 'Test Description',
        eventCode: 'O',
        filingDate: '2020-01-01',
        index: '1',
      },
    });

    expect(result).toEqual(null);
  });
});
