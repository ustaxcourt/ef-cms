import { getAdditionalOrderTextArrayFormGroupErrors } from './getAdditionalOrderTextArrayFormGroupErrors';

describe('getAdditionalOrderTextArrayFormGroupErrors', () => {
  it('returns both array-level and indexed Joi validation messages', () => {
    const messages = getAdditionalOrderTextArrayFormGroupErrors(
      {
        additionalOrderTextArray: 'Array level error',
        'additionalOrderTextArray-0': 'First clause error',
        'additionalOrderTextArray-2': 'Third clause error',
      },
      3,
    );

    expect(messages).toEqual([
      'Array level error',
      'First clause error',
      'Third clause error',
    ]);
  });

  it('returns empty array when there are no matching messages', () => {
    expect(getAdditionalOrderTextArrayFormGroupErrors({}, 2)).toEqual([]);
  });

  it('ignores indexed keys outside clauseCount', () => {
    const messages = getAdditionalOrderTextArrayFormGroupErrors(
      {
        'additionalOrderTextArray-5': 'Should not appear',
      },
      2,
    );

    expect(messages).toEqual([]);
  });
});
