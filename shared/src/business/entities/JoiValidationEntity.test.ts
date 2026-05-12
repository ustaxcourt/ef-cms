import joi from 'joi';

import { JoiValidationEntity } from './JoiValidationEntity';

class ChildEntity extends JoiValidationEntity {
  public label?: string;

  constructor(raw: { label?: string }) {
    super('ChildEntity');
    this.label = raw.label;
  }

  getValidationRules(): any {
    return {
      label: joi.string().required(),
    };
  }
}

class ParentEntity extends JoiValidationEntity {
  public choice?: string | number;
  public child?: ChildEntity;
  public children?: ChildEntity[];
  public name?: string;

  constructor(raw: {
    choice?: string | number;
    child?: ChildEntity;
    children?: ChildEntity[];
    name?: string;
  }) {
    super('ParentEntity');
    this.choice = raw.choice;
    this.child = raw.child;
    this.children = raw.children;
    this.name = raw.name;
  }

  getValidationRules(): any {
    return {
      choice: joi.alternatives().try(joi.string(), joi.number()).required(),
      name: joi.string().required(),
    };
  }
}

class SchemaEntity extends JoiValidationEntity {
  public value?: string;

  constructor(raw: { value?: string }) {
    super('SchemaEntity');
    this.value = raw.value;
  }

  getValidationRules(): any {
    return joi.object({
      value: joi.string().required(),
    });
  }
}

class CollectionEntity extends JoiValidationEntity {
  public prefix: string;
  public value?: string;

  constructor(raw: { value?: string }, prefix: string) {
    super('CollectionEntity');
    this.prefix = prefix;
    this.value = raw.value;
  }

  getValidationRules(): any {
    return {
      value: joi.string().required(),
    };
  }
}

class FormattingOnlyEntity extends JoiValidationEntity {
  public child?: ChildEntity;
  public children?: ChildEntity[];

  constructor(raw: { child?: ChildEntity; children?: ChildEntity[] }) {
    super('FormattingOnlyEntity');
    this.child = raw.child;
    this.children = raw.children;
  }

  getValidationRules(): any {
    return {};
  }

  getValidationErrors(): Record<string, string> {
    return {
      choice: '"choice" does not match any of the allowed types',
    };
  }
}

class IntegerKeyErrorEntity extends JoiValidationEntity {
  constructor() {
    super('IntegerKeyErrorEntity');
  }

  getValidationRules(): any {
    return {
      validate: () => ({
        error: {
          details: [
            {
              context: {
                key: 0,
                label: '0',
              },
              message: 'index error',
              path: [0],
            },
          ],
        },
      }),
    };
  }
}

class MixedValidationErrorEntity extends JoiValidationEntity {
  constructor() {
    super('MixedValidationErrorEntity');
  }

  getValidationRules(): any {
    return {};
  }

  getFormattedValidationErrors(): Record<string, any> {
    return {
      stringError: '"stringError" is required',
    };
  }

  getValidationErrors(): Record<string, any> {
    return {
      objectError: { reason: 'bad-input' },
      stringError: '"stringError" is required',
    };
  }
}

describe('JoiValidationEntity', () => {
  it('returns formatted nested validation errors and removes unhelpful alternatives messages', () => {
    const entity = new FormattingOnlyEntity({
      child: new ChildEntity({}),
      children: [new ChildEntity({}), new ChildEntity({ label: 'ok' })],
    });

    const errors = entity.getFormattedValidationErrors();

    expect(errors).toEqual({
      child: { label: '"label" is required' },
      children: [{ index: 0, label: '"label" is required' }],
    });
    expect(errors?.choice).toBeUndefined();
  });

  it('returns null validation errors for valid entities', () => {
    const entity = new SchemaEntity({ value: 'valid' });

    expect(entity.getValidationErrors()).toBeNull();
    expect(entity.getFormattedValidationErrors()).toBeNull();
    expect(entity.isValid()).toBe(true);
  });

  it('formats integer-key validation errors using the detail context label', () => {
    const entity = new IntegerKeyErrorEntity();

    expect(entity.getValidationErrors()).toEqual({
      0: 'index error',
    });
  });

  it('throws with transformed messages on validate and can log using validateWithLogging', () => {
    const loggerError = jest.fn();
    const entity = new ParentEntity({
      child: new ChildEntity({}),
      choice: 'ok',
    });

    expect(() =>
      entity.validateWithLogging({
        logger: { error: loggerError },
      }),
    ).toThrow(
      'The ParentEntity entity was invalid. {"name":"\'name\' is required"}',
    );

    expect(loggerError).toHaveBeenCalledWith(
      '*** Entity with error: ***',
      entity,
    );
  });

  it('sets and preserves isValidated on raw object conversion methods', () => {
    const entity = new ParentEntity({
      child: new ChildEntity({ label: 'nested' }),
      children: [new ChildEntity({ label: 'array-value' })],
      choice: 'ok',
      name: 'main',
    }).validate();

    const rawFromValidate = entity.toRawObject();
    const rawFromJoi = entity.toRawObjectFromJoi();

    expect(rawFromValidate).toEqual({
      child: { entityName: 'ChildEntity', label: 'nested' },
      children: [{ entityName: 'ChildEntity', label: 'array-value' }],
      choice: 'ok',
      entityName: 'ParentEntity',
      name: 'main',
    });
    expect(rawFromJoi).toEqual(rawFromValidate);
    expect(
      Object.getOwnPropertyDescriptor(rawFromValidate, 'isValidated')?.value,
    ).toBe(true);
  });

  it('validateForMigration throws on invalid entities and logs the entity before throwing', () => {
    const logSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    const entity = new SchemaEntity({});

    expect(() => entity.validateForMigration()).toThrow(
      'The SchemaEntity entity was invalid. ["\'value\' is required"]',
    );
    expect(logSpy).toHaveBeenCalledWith('Error, entity is invalid: ', entity);

    logSpy.mockRestore();
  });

  it('validateForMigration sets isValidated when the entity is valid', () => {
    const entity = new SchemaEntity({ value: 'migration-valid' });

    const validated = entity.validateForMigration();

    expect(validated).toBe(entity);
    expect(Object.getOwnPropertyDescriptor(entity, 'isValidated')?.value).toBe(
      true,
    );
  });

  it('preserves non-string validation error values in validate stringify transform', () => {
    const entity = new MixedValidationErrorEntity();

    expect(() => entity.validate()).toThrow(
      'The MixedValidationErrorEntity entity was invalid. {"objectError":{"reason":"bad-input"},"stringError":"\'stringError\' is required"}',
    );
  });

  it('validateRawCollection validates all entities with constructor rest args and returns raw objects', () => {
    const result = CollectionEntity.validateRawCollection(
      [{ value: 'one' }, { value: 'two' }],
      'prefix-value',
    );

    expect(result).toEqual([
      {
        entityName: 'CollectionEntity',
        prefix: 'prefix-value',
        value: 'one',
      },
      {
        entityName: 'CollectionEntity',
        prefix: 'prefix-value',
        value: 'two',
      },
    ]);
  });

  it('validateRawCollection defaults to an empty array when no collection is passed', () => {
    const result = CollectionEntity.validateRawCollection(undefined, 'unused');

    expect(result).toEqual([]);
  });
});
