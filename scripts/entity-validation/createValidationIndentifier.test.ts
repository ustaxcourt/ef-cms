import { createValidationIdentifier } from './createValidationIdentifier';

describe('stringEverything', () => {
  it('should stringify all types of input correctly', () => {
    const input = {
      string: 'test',
      number: 42,
      boolean: true,
      array: [1, 'two', false],
      object: { key: 'value' },
      func: function () {
        return 'hello';
      },
      symbol: Symbol('sym'),
      undefinedValue: undefined,
    };

    const result = createValidationIdentifier(input);
    expect(result).toBeDefined();
    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('createValidationIdentifier', () => {
  it('should return the same hash for the same input', () => {
    const schema1 = { a: 1, b: 'test' };
    const schema2 = { a: 1, b: 'test' };

    const hash1 = createValidationIdentifier(schema1);
    const hash2 = createValidationIdentifier(schema2);

    expect(hash1).toBe(hash2);
  });

  it('should return different hashes for different inputs', () => {
    const schema1 = { a: 1, b: 'test' };
    const schema2 = { a: 2, b: 'test' };

    const hash1 = createValidationIdentifier(schema1);
    const hash2 = createValidationIdentifier(schema2);

    expect(hash1).not.toBe(hash2);
  });

  it('should handle joi schemas correctly', () => {
    const joi = require('joi');
    const schema1 = joi.object({
      name: joi.string().required(),
      age: joi.number().integer(),
    });

    const schema2 = joi.object({
      name: joi.string().required(),
      age: joi.number().integer(),
    });

    const hash1 = createValidationIdentifier(schema1);
    const hash2 = createValidationIdentifier(schema2);

    expect(hash1).toBe(hash2);
  });

  it('should handle function schemas correctly', () => {
    const func1 = function () {
      return 'test';
    };

    const hash1 = createValidationIdentifier(func1);
    const hash2 = createValidationIdentifier(func1);

    expect(hash1).toBe(hash2);
  });

  it('should handle empty input', () => {
    const hash1 = createValidationIdentifier({});
    const hash2 = createValidationIdentifier({});

    expect(hash1).toBe(hash2);
  });
});
