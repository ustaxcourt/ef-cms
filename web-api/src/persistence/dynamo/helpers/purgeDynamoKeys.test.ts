import { purgeDynamoKeys } from './purgeDynamoKeys';

describe('purgeDynamoKeys', () => {
  it('removes top-level dynamo bookkeeping keys', () => {
    const input = {
      gsi1pk: 'gsi1',
      gsi2pk: 'gsi2',
      name: 'Alice',
      pk: 'a',
      sk: 'b',
      ttl: 1234,
    };

    const result = purgeDynamoKeys<typeof input, typeof input>(input);

    expect(result).toEqual({ name: 'Alice' });
  });

  it('recursively purges dynamo keys from nested objects', () => {
    const input = {
      nested: {
        name: 'Bob',
        pk: 'nested-pk',
      },
      pk: 'outer',
    };

    const result = purgeDynamoKeys<typeof input, typeof input>(input);

    expect(result).toEqual({ nested: { name: 'Bob' } });
  });

  it('leaves unrelated primitive properties untouched', () => {
    const input = { flag: true, score: 42, value: 'hello' };

    const result = purgeDynamoKeys<typeof input, typeof input>(input);

    expect(result).toEqual(input);
  });
});
