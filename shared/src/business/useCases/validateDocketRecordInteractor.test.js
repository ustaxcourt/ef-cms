const {
  validateDocketRecordInteractor,
} = require('./validateDocketRecordInteractor');
const { DocketRecord } = require('../entities/DocketRecord');

describe('validateDocketRecordInteractor', () => {
  it('returns the expected errors object on an empty docket record', () => {
    const errors = validateDocketRecordInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          DocketRecord,
        }),
      },
      docketRecord: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(DocketRecord.VALIDATION_ERROR_MESSAGES),
    );
  });
});
