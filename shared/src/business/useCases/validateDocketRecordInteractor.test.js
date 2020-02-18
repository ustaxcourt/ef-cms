const {
  validateDocketRecordInteractor,
} = require('./validateDocketRecordInteractor');
const { DocketRecord } = require('../entities/DocketRecord');
const { MOCK_USERS } = require('../../test/mockUsers');

describe('validateDocketRecordInteractor', () => {
  it('returns the expected errors object on an empty docket record', () => {
    const errors = validateDocketRecordInteractor({
      applicationContext: {
        getCurrentUser: () =>
          MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
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

  it('returns null when there are no errors', () => {
    const result = validateDocketRecordInteractor({
      applicationContext: {
        getCurrentUser: () =>
          MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
        getEntityConstructors: () => ({
          DocketRecord,
        }),
      },
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
