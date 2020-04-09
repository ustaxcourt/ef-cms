const { stripInternalKeys } = require('./stripInternalKeys');

describe('stripInternalKeys', () => {
  it('strips internal keys from an array of items', () => {
    const items = [
      {
        gsi1pk: 'trial-session|123',
        mayorOf: 'Flavortown',
        name: 'Guy Fieri',
        pk: 'case-123',
        sk: 'item-123',
      },
      {
        gsi1pk: 'trial-session|321',
        name: 'Guy Fieri, Jr.',
        pk: 'case-321',
        sk: 'item-321',
        title: 'Sauce Boss',
      },
    ];

    const result = stripInternalKeys(items);

    expect(result).toEqual([
      {
        mayorOf: 'Flavortown',
        name: 'Guy Fieri',
      },
      {
        name: 'Guy Fieri, Jr.',
        title: 'Sauce Boss',
      },
    ]);
  });

  it('strips internal keys from one item', () => {
    const item = {
      gsi1pk: 'trial-session|321',
      name: 'Guy Fieri, Jr.',
      pk: 'case-321',
      sk: 'item-321',
      title: 'Sauce Boss',
    };

    const result = stripInternalKeys(item);

    expect(result).toEqual({
      name: 'Guy Fieri, Jr.',
      title: 'Sauce Boss',
    });
  });

  it('returns null if no valid type is passed (object, or array)', () => {
    let result = stripInternalKeys(false);
    expect(result).toEqual(null);

    result = stripInternalKeys(null);
    expect(result).toEqual(null);
  });
});
