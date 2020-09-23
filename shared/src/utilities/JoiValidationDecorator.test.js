const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { JoiValidationConstants } = require('./JoiValidationConstants');

/**
 * fake entity constructor
 *
 * @param {object} raw raw entity
 */
function MockEntity1(raw) {
  Object.assign(this, raw);
}

MockEntity1.validationName = 'MockEntity1';

MockEntity1.errorToMessageMap = {
  favoriteNumber: 'Tell me your favorite number.',
  name: 'Name is definitely a required field.',
};

joiValidationDecorator(
  MockEntity1,
  joi.object().keys({
    favoriteNumber: joi.number().required(),
    hasNickname: joi.boolean().required(),
    name: JoiValidationConstants.STRING.required(),
  }),
  MockEntity1.errorToMessageMap,
);

const MockEntity2 = function (raw) {
  Object.assign(this, raw);
};

const MockEntity2Schema = joi.object().keys({
  arry1: joi
    .array()
    .items(joi.object().keys({ foo: JoiValidationConstants.STRING.required() }))
    .required(),
  arry2: joi.array().items(JoiValidationConstants.STRING).optional(),
  favoriteNumber: joi.number().required(),
  hasNickname: joi.boolean().required(),
  name: JoiValidationConstants.STRING.required(),
  obj1: joi
    .object()
    .keys({ foo: JoiValidationConstants.STRING.required() })
    .required(),
  reallyMessyNestedThing: joi
    .alternatives()
    .try(
      joi.object().keys({ never: JoiValidationConstants.STRING.required() }),
      joi
        .object()
        .keys({ happening: JoiValidationConstants.STRING.required() }),
    )
    .optional(),
});

joiValidationDecorator(MockEntity2, MockEntity2Schema, {
  arry1: 'That is required',
  foo: 'lend me some sugar',
});

const MockEntity3 = function (raw) {
  this.anotherItem = raw.anotherItem;
  this.mockEntity2 = new MockEntity2(raw.mockEntity2);
};

const MockEntity3Schema = joi.object().keys({
  anotherItem: JoiValidationConstants.STRING.required(),
});

joiValidationDecorator(MockEntity3, MockEntity3Schema, {});

const MockCase = function (raw) {
  this.docketNumber = raw.docketNumber;
  this.somethingId = raw.somethingId;
  this.title = raw.title;
};

const MockCaseSchema = joi.object().keys({
  docketNumber: JoiValidationConstants.STRING.required(),
  somethingId: JoiValidationConstants.STRING.required(),
  title: JoiValidationConstants.STRING.required(),
});

joiValidationDecorator(MockCase, MockCaseSchema, {
  anotherItem: 'Another item is required',
});

describe('Joi Validation Decorator', () => {
  describe('validation errors with arrays', () => {
    it('returns validation errors', () => {
      const mock1Properties = {
        favoriteNumber: 7,
        hasNickname: false,
        name: 'name',
      };
      const validNested = new MockEntity1(mock1Properties);
      const obj = new MockEntity2({
        arry1: [{ baz: validNested, foo: 'bar' }, {}],
        name: 'Name',
        optionalThing: validNested,
      });
      expect(obj.isValid()).toBe(false);
      const errors = obj.getFormattedValidationErrors();
      expect(Object.keys(errors).length).not.toBe(0);
      const rawEntity = validNested.toRawObject();
      expect(rawEntity).toEqual(mock1Properties);
    });

    it('returns default validation error for field without formatted string in errorToMessageMap', () => {
      const invalidEntity = new MockEntity1({
        favoriteNumber: 7,
        name: 'name',
      });
      expect(invalidEntity.isValid()).toBe(false);
      const errors = invalidEntity.getFormattedValidationErrors();
      const joiGeneratedMessageNotFromErrorToMessageMap = errors.hasNickname;
      expect(joiGeneratedMessageNotFromErrorToMessageMap).toBeDefined();
    });

    it('should correctly validate nested entities', () => {
      const invalidEntity = new MockEntity3({
        anotherItem: 'this is another item',
      });
      const errors = invalidEntity.getFormattedValidationErrors();
      expect(errors).toEqual({
        mockEntity2: {
          arry1: 'That is required',
          favoriteNumber: '"favoriteNumber" is required',
          hasNickname: '"hasNickname" is required',
          name: '"name" is required',
          obj1: '"obj1" is required',
        },
      });
      expect(invalidEntity.isValid()).toBe(false);
    });

    it('should correctly return strings as items in an array of strings', () => {
      const obj = new MockEntity2({
        arry1: [{ baz: 'foz', foo: 'bar' }],
        arry2: ['one', 'two'],
        favoriteNumber: 13,
        hasNickname: false,
        name: 'Name',
        obj1: { foo: 'bar' },
      });

      expect(obj.isValid()).toBe(true);
      const rawEntity = obj.toRawObject();
      expect(rawEntity.arry2[0]).toEqual('one');
      expect(rawEntity.arry2[1]).toEqual('two');
    });

    it('should ignore formatted error messages for joi alternatives', () => {
      const obj = new MockEntity2({
        arry1: [{ baz: 'foz', foo: 'bar' }],
        arry2: ['one', 'two'],
        favoriteNumber: 13,
        hasNickname: false,
        name: 'Name',
        obj1: { foo: 'bar' },
        reallyMessyNestedThing: { will: 'not match' },
      });
      expect(obj.getFormattedValidationErrors()).toBe(null);
    });
  });

  it('should have access to the schema', () => {
    const obj = new MockEntity2({});
    expect(obj.getSchema()).toEqual(MockEntity2Schema);
  });

  it('should throw a detailed "InvalidEntityError" when `validate` fails including all keys ending in `Id`, `docketNumber` if it exists, and key/value pairs that failed validation', () => {
    const obj1 = new MockCase({
      docketNumber: '123-20',
      title: 'some title',
    });
    let error;
    try {
      obj1.validate();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message).toContain("'somethingId' is required");
    expect(error.message).toContain('"somethingId":"<undefined>"');
    expect(error.message).toContain('"docketNumber":"123-20"');
  });

  it('should have access to the schema without instantiating the entity', () => {
    expect(MockEntity2.getSchema()).toEqual(MockEntity2Schema);
  });

  it('should validate a raw collection', () => {
    const obj1 = new MockEntity1({
      favoriteNumber: 1,
      hasNickname: true,
      name: 'One',
    });
    const obj2 = new MockEntity1({
      favoriteNumber: 2,
      hasNickname: false,
      name: 'Two',
    });

    expect(MockEntity1.validateRawCollection([obj1, obj2], {})).toEqual([
      { favoriteNumber: 1, hasNickname: true, name: 'One' },
      { favoriteNumber: 2, hasNickname: false, name: 'Two' },
    ]);
  });

  it('should catch errors when validating a raw collection', () => {
    const obj1 = new MockEntity1({
      favoriteNumber: 1,
      hasNickname: true,
      name: 'One',
    });
    const obj2 = new MockEntity1({
      favoriteNumber: 2,
      hasNickname: false,
      name: 'Two',
    });

    obj1.favoriteNumber = 'one';

    let error;

    try {
      MockEntity1.validateRawCollection([obj1, obj2], {});
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.message).toContain('The MockEntity1 entity was invalid');
  });

  it('should return an empty array when calling validateRawCollection with an empty collection', () => {
    expect(MockEntity1.validateRawCollection([], {})).toEqual([]);
  });
});

describe('validEntityConstructor', () => {
  it('successfully creates a new factory function which invokes the original\'s "init" function and trims all string assignments', () => {
    /**
     * A factory function
     */
    function HelloFactory(rawHello) {
      this.hello = true;
      this.helloMessage = rawHello.helloMessage;
      this.audience = '   The whole world   ';
    }
    /**
     * all assignments upon construction should be done within 'init'
     */
    HelloFactory.prototype.init = function init(rawHello) {
      this.helloMessage = rawHello.helloMessage;
      this.yeehaws = rawHello.yeehaws;
    };
    const ValidHello = validEntityDecorator(HelloFactory);
    const sayHello = new ValidHello({
      helloMessage: "  What's up, dawg?   ",
      yeehaws: 4,
    });
    sayHello.title = '    Sir    ';
    expect(sayHello.hello).toBe(true);
    expect(sayHello.title).toBe('Sir');
    expect(sayHello.yeehaws).toBe(4);
    expect(sayHello.audience).toBe('   The whole world   '); // not set in `init` and not subject to string trimming proxy
    expect(sayHello.helloMessage).toBe("What's up, dawg?");
  });
});
